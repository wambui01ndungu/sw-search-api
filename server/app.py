import os
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
import flask_jwt_extended as jwt_ext

from extensions import db, bcrypt
from auth import auth_bp
from search import search_bp
from utils import decode_token_with_multiple_keys, error_response, log_internal_error
from cache import  load_cache_from_db
import logging 

 
load_dotenv()
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)



def create_app():
    app = Flask(__name__)

    env = os.getenv("FLASK_ENV", "development")
    if env == "production":
        app.config.from_object('config.ProductionConfig')
    else:
        app.config.from_object('config.DevelopmentConfig')

    bcrypt.init_app(app)

    #enable cors for frontend
    CORS(app,
        supports_credentials =True,
        origins=os.environ.get("FRONTEND_URL", "http://localhost:3000").split(","),
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST",  "OPTIONS"])


    
    #JWT condig
    current_jwt_key = os.environ.get("JWT_SECRET_KEY_CURRENT", "dev_fallback_jwt")
    old_jwt_key = os.environ.get("JWT_OLD_SECRET_KEY")
    app.config['JWT_SECRET_KEYS'] = [k for k in [old_jwt_key, current_jwt_key] if k]
    

    
     # JWT Setup   
    jwt_keys = app.config['JWT_SECRET_KEYS']
    jwt_ext.decode_token = decode_token_with_multiple_keys(jwt_keys)
     
     #initialize extentions

    db.init_app(app)
    migrate = Migrate(app, db)
    jwt=JWTManager(app)
    api=Api(app)
    
    #register blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(search_bp, url_prefix="/search")


    @app.route("/")
    def index():
        return"This is my Sc-search Api"

    @app.before_request
    def handle_options_request():
        if request.method =="OPTIONS":
            return make_response("", 200)
    
    @app.errorhandler(Exception)
    def handle_exception(e):
        logger.error(f"[global] Exception type:{type(e)}, value:{e}")
        logger.error(traceback.format_exc())

        from flask import Response
        if isinstance (e, Response):
            return e
        return error_response("server_error","An internal server error occorred",500)

      
    return app






if __name__== "__main__":
    app = create_app()
    with app.app_context():
        load_cache_from_db()

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", debug=True, port=port)


