import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from flask_cors import CORS
from flask_restful import Api, Resource

from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required

load_dotenv()
app = Flask(__name__)

#database configuration
app.config['SQLALCHEMY_DATABASE_URI'] =os.environ.get("DATABASE_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
app.config['JWT_SECRET_KEY']='your-secret-key'
jwt=JWTManager(app)
app.json.compact =False

db= SQLAlchemy(app)

migrate = Migrate(app, db)

api=Api(app)

@app.route("/")
def index():
  return"This is my Sc-search Api"


#authentication 
class  UserSignup(Resource):
    def post(self):
      data = request.get_json()

      #check if user already exists
      if User.query.filter_by(email=data['email']).all():
        return{"message: User already exist"}
      else:
        # sign up if not a user
        user =User(
          firstname=data['firstname'],
          surname=data['surname'],
          email=data['email'],
          password=data.get('password','')
        )
        massage("signup sucessful!")

        #hash pasword before saving
        user.set_password(data['password'])

        db.session.add(user)
        db.session.commit()

        acess_token = create_acess_token(identity = user.id)
        return{
            "message":"user registered sucessfully!",
            "token": acess_token,
            "email":user.email

            },201


class UserLogin(Resource):
    def post(self):
      data= request.get_json()
      user= user.query.filter_by(email=data['email']).first()

      #check if the user exists and the password is correct
      if user and user.checkpassword(data['password']):
          acess_token= create_acess_token(identity=user.id)
          return{
            "acess_token":acess_token,
            "id":user_id,
            "firstname":user.firstname,
            "surname":user.surname,
            'email':user.email
            }
      else:
        return {"message":"invalid credentials"}, 401


#search endpionts
#memory catche structure
cache={}
CACHE_DURATION=15*60

class SearchResource(Resource):
    @jwt_required()
    def seacrh_character():
      query= request.args.get('query')
      if not query:
        return jsonify({"error":"'query' cannot be found"}),400
      curent_time=current.time


      #chek cache
      if query in catche:
        dat,timestamp =cache[query]
        if current_time - stamp<CACHE_DURATION:
          return jsonify({
            "source":"cache",
            "results":data}),200
        else:
          #expired
          del  catche[query]
        #fectch from SWAPI if it's expired or not cached
      try:
        response=requests.get(f"https://swapi.dev/api/people/?search={query}")
        response.raise_for_status()
        data =response.json().get("results",[])

        #cache results
        cache[query]-(data,curent_time)

        return jsonify({
          "source":"swapi",    
          "reuslts":"data"
        }),200
      
      except requests.RequestException as e:
          return jsonify({
            "error":"failed to feach data from SWAPI", 
             "details":str(e)}),500

#add routes to API
api.add_resource(UserSignup,'/signup')
api.add_resource(UserLogin,'/login')
api.add_resource(SearchResource,'/Search')


if __name__== "__main__":
  app.run(debug=True)
