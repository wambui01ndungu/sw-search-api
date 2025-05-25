from flask_sqlalchemy import SQLAlchemy
from datetime import datetime 
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.dialects.postgresql import JSON
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import bcrypt
db =SQLAlchemy()

class User(db.Model,SerializerMixin):
    __tablename__='users'

    id =db.Column(db.Integer, primary_key=True)
    firstname =db.Column(db.String, nullable=False)
    surname =db.Column(db.String, nullable=False)
    email =db.Column(db.String(234), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    #set password
    def set_password(self, raw_password):
        self.password_hash = bcrypt.generate_password_hash( raw_password).decode('utf8')


    #check password
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def serialize(self):
      return{
        "id":self.id,
        "firstname":self.firstname,
        "surname":self.surname,
        "email":self.email,
        
      }
    


       

class SearchCache(db.Model, SerializerMixin):
    __tablename__='search_cache'

    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default = datetime.utcnow)
    search_term = db.Column(db.String, nullable=False)
    results = db.Column(JSON, nullable=False)
    use_id= db.Column(db.Integer, db.ForeignKey('users.id'))

    def serialize(self):
      return{
        "id":self.id,
        "timestamp":self.timestamp,
        "search_term":self.search_term,
        "results":self.results
      }


