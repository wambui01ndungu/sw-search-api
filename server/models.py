#models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime 
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.dialects.postgresql import JSON


from extensions import bcrypt, db

class User(db.Model,SerializerMixin):
    __tablename__='users'

    id =db.Column(db.Integer, primary_key=True)
    firstname =db.Column(db.String(50), nullable=False)
    surname =db.Column(db.String(50), nullable=False)
    email =db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    #set password
    serialize_rules =('-password_hash',)
    def set_password(self, raw_password):
        self.password_hash = bcrypt.generate_password_hash( raw_password).decode('utf8')


    #check password
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)


       

class SearchCache(db.Model, SerializerMixin):
    __tablename__='search_cache'

    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default = datetime.utcnow)
    search_term = db.Column(db.String, nullable=False)
    results = db.Column(JSON, nullable=False)
    user_id= db.Column(db.Integer, db.ForeignKey('users.id'))
    user =db.relationship("User", backref="searches")
  


