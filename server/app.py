import os
import jwt
from flask_cors import CORS
from dotenv import load_dotenv
from flask import Flask, jsonify, request, session
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
import traceback

import requests
from flask_restful import Api, Resource
from models import db, User, SearchCache

from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required

load_dotenv()
app = Flask(__name__)

#enable cors for front end
CORS(app, resources ={r"/.*":{"origins":"http://localhost:3000"}}, supports_credentials=True)


#database configuration
app.config['SQLALCHEMY_DATABASE_URI'] =os.environ.get("DATABASE_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
app.config['JWT_SECRET_KEY']= os.environ.get('SECRET_KEY', 'dev_fallback_secret')
app.secret_key= os.environ.get('SECRET_KEY', 'dev_fallback_secret')
jwt=JWTManager(app)
app.json.compact =False


#initialize extentions
db.init_app(app)
migrate = Migrate(app, db)
api=Api(app)


@app.route("/")
def index():
  return"This is my Sc-search Api"


#authentication 
class  UserSignup(Resource):
    def post(self):
      try:
          data = request.get_json()
          print("Incoming signup data:", data)

          if not data:
              return {"message": "No data provided"}, 400

          required_fields = ['firstname', 'surname', 'email', 'password']
          if not all(field in data for field in required_fields):
              return {"message": "Missing required fields"}, 400  

          #check if user already exists
          if User.query.filter_by(email=data['email']).first():
            return{"message":" User already exist"}
          else:
            # sign up if not a user
            new_user =User(
              firstname=data['firstname'],
              surname=data['surname'],
              email=data['email'],
            )

            #hash password before saving
            new_user.set_password(data['password'])
            
            db.session.add(new_user)
            db.session.commit()
            access_token = create_access_token(identity=new_user.id)
        
            return{
                "message":"user registered sucessfully!",
                "token": access_token,
                "email":new_user.email

                },201
      except Exception as e:
          traceback.print_exc() 
          return {"error":"signup failed", "details":str(e)},500 


class UserLogin(Resource):
    def post(self):
        data= request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return {"message": "Missing email or password"}, 400
        user= User.query.filter_by(email=data['email']).first()
      


       #check if the user exists and the password is correct
        if user and user.checkpassword(data['password']):
            access_token = create_access_token(identity=user.id)

            #create a session
         

            return{
             "access_token":access_token,
             "user":{
                 "id":user.id,
                 "firstname":user.firstname,
                 "surname":user.surname,
                 'email':user.email
             }
        }
        else: 
            return {"message":"invalid credentials"}, 401
    



#memory catche structure
cache={}
CACHE_DURATION=15*60

#search endpionts
class SearchResource(Resource):
    @jwt_required()
    def get (self):
      query= request.args.get('query')
      if not query:
        return jsonify({"error":"'query' cannot be found"}),400
      current_time = datetime.now().timestamp()


      #check cache
      if query in cache:
        data,timestamp =cache[query]
        if current_time - timestamp < CACHE_DURATION:
          return jsonify({
            "source":"cache",
            "results":data}),200
        else:
          #expired
          del  cache[query]


        #fectch from SWAPI if it's expired or not cached
      try:
        response=requests.get(f"https://swapi.dev/api/people/?search={query}")
        response.raise_for_status()
        data =response.json().get("results",[])

        #cache results
        cache[query]=(data,current_time)

        return jsonify({
          "source":"swapi",    
          "results":data
        }),200
      
      except requests.RequestException as e:
          return jsonify({
            "error":"failed to feach data from SWAPI", 
             "details":str(e)}),500

#add routes to API
api.add_resource(UserSignup,'/signup')
api.add_resource(UserLogin,'/login')
api.add_resource(SearchResource,'/search')


if __name__== "__main__":
  app.run(debug=True, port =3006)
