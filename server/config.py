import os
import sys

def get_database_uri():
    uri = os.getenv("DATABASE_URL")
    if not uri:
        print("ERROR: DATABASE_URL environment variable is not set.", file=sys.stderr)
        sys.exit(1)
    if not uri.startswith("postgresql://"):
        print("ERROR: DATABASE_URI must start with 'postgresql://'.", file=sys.stderr)
        sys.exit(1)
    if "?sslmode=require" not in uri:
        uri += '?sslmode=require'
    return uri

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_COOKIE_SECURE = True
    JWT_COOKIE_CSRF_PROTECT =True
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "dev_fallback_flask")
    JWT_SECRET_KEYS = [k for k in[
        os.getenv("JWT_OLD_SECRET_KEY"),
        os.getenv("JWT_SECRET_KEY", "dev_fallback_jwt")
    ]if k]


class DevelopmentConfig(Config):
    DEBUG = True
    JWT_COOKIE_SECURE = False  
    JWT_COOKIE_CSRF_PROTECT = False
    SQLALCHEMY_DATABASE_URI = get_database_uri()

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = get_database_uri()
