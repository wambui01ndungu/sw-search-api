#utils.py

import jwt as pyjwt
from flask_jwt_extended.utils import decode_token
from functools import wraps
from models import SearchCache
from flask import request, jsonify,current_app
from werkzeug.exceptions import Unauthorized as NoAuthorizationError
import logging
import traceback


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def error_response(error_code, message, status_code=400):
    return {
        "error": error_code,
        "message": message
    }, status_code
    

def log_internal_error(error, context=""):
    logger.error(f"[{context}] {str(error)}")
    logger.error(traceback.format_exc())


def decode_token_with_multiple_keys(jwt_keys):
    def _decoder(encoded_token, csrf_value=None):
        for key in jwt_keys:
            try:
                return decode_token(encoded_token, csrf_value=csrf_value, secret=key)
            except Exception:
                continue
        raise NoAuthorizationError("JWT decode failed. Token invalid or expired.")
    return _decoder


def decode_jwt_with_rotation(token, keys):
    for key in keys:
        if not key:
            continue
        try:
            decoded = pyjwt.decode(token, key, algorithms=["HS256"])
            return decoded
        except pyjwt.InvalidTokenError:
            continue
    raise pyjwt.InvalidTokenError("Invalid token for all keys")


def jwt_required_rotated(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token =request.cookies.get("access_token_cookie")
        if not token:
            return  error_response({"missing_token", "token is missing"}),401
        try:
            keys =current_app.config["JWT_SECRET_KEYS"]
            decode_jwt_with_rotation(token, keys)
            return fn(*args, **kwargs)
        except Exception as e:
            log_internal_error(e,"jwt_required_rotated")
            return error_response("Invalid_token", "invalid or expired token",401)
    return wrapper
   

