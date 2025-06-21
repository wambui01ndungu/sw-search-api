#auth.py
from flask import Blueprint, request, jsonify, make_response
from flask_restful import Resource, Api
from flask_jwt_extended import create_access_token, set_access_cookies
from models import User, db
from validation import validate_signup_data
from utils import log_internal_error, error_response
from flask_jwt_extended import  create_refresh_token, jwt_required, get_jwt_identity


auth_bp =Blueprint("auth", __name__)
api =Api(auth_bp)

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    user =User.query.get(identity)
    if not user:
        return error_response("user_not_found","User not found"),404
    new_access_token = create_access_token(identity=identity)
    response_data={
        "access_token": new_access_token,
        "user": user.to_dict()
    }
    return response_data, 200

class UserSignup(Resource):
    def post(self):
        try:
            data = request.get_json()
            print("Incoming signup data:", data)

            is_valid, message = validate_signup_data(data)
            if not is_valid:
                return error_response("validation_error", message), 400

            email = data['email'].strip().lower()
            if User.query.filter_by(email=email).first():
                return error_response("user_exists", "User already exists"), 409

            new_user = User(
                firstname=data['firstname'],
                surname=data['surname'],
                email=data['email'],
            )
            new_user.set_password(data['password'])
            db.session.add(new_user)
            db.session.commit()

            access_token = create_access_token(identity=new_user.id)
            refresh_token = create_refresh_token(identity=new_user.id)

            return {
              "message": "User created",
              "access_token":access_token,
              "refresh_token":refresh_token},201

        except Exception as e:
            log_internal_error(e, "UserSignup")
            return error_response("server_error", "An internal server error occurred"), 500


class UserLogin(Resource):

    def post(self):
        try:
            data = request.get_json()
            print("Incoming login data:", data)

            if not data or 'email' not in data or 'password' not in data:
                return error_response("missing_fields", "Email or password are missing"), 400

            user = User.query.filter_by(email=data['email'].strip().lower()).first()

            if user and user.check_password(data['password']):
                access_token = create_access_token(identity=user.id)
                refresh_token = create_refresh_token(identity=user.id)

                user_data = user.to_dict()

                return {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "user": user.to_dict()
                }, 200
            else:
                return error_response("invalid_credentials", "Invalid email or password"), 401

        except Exception as e:
            log_internal_error(e, "UserLogin")
            return error_response("server_error", "An internal server error occurred"), 500


# Blueprint setup


api.add_resource(UserSignup, "/signup")
api.add_resource(UserLogin, "/login")
