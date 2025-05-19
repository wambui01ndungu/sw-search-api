import os
from flask import Flask
from flask_sqlAlchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import Datetime

app = Flask(__name__)
migrate = Migrate(app, db)
db.init_app(app)

@app.route("/")
def index():
  return"Sc Api"


