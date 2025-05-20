import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from flask_cors import CORS
from flask_restful import Api, Resource

load_dotenv()
app = Flask(__name__)

#database configuration
app.config['SQLALCHEMY_DATABASE_URI'] =os.environ.get("DATABASE_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
app.json.compact =False

db= SQLAlchemy(app)

migrate = Migrate(app, db)

api=Api(app)

@app.route("/")
def index():
  return"This is my Sc-search Api"


if __name__== "__main__":
  app.run(debug=True)
