from flask_sqlalchemy import SQLAlchemy
from datetime import datetime 
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.dialects.postgresql import JSON
from werkzeug.security import generate_password_hash, chek_password_hash

db =SQLAlchemy()

class User(db.Model,SerializerMixin):
    __tablename__='users'

    id =db.Column(db.Integer, primary_key=True)
    firstname =db.Column(db.String, nullable=False)
    surname =db.Column(db.String, nullable=False)
    email =db.Column(db.String(234), unique=True, nullable=False)
    password_has =db.Column(db.String(128), nullable=False)

    #set password
    def set_password(self, raw_password):
        self.password = generate_password_hash( raw_password)


    #check password
    def check_password(self, password):
        return check_password_hash(self.password)


       

class SearchCache(db.Model, SerializerMixin):
    __tablename__='search_cache'

    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default = datetime.utcnow)
    search_term = db.Column(db.String, nullable=False)
    results = db.Column(JSON, nullable=False)


