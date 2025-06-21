import os
import sys

def get_database_uri():
    uri = os.getenv("DATABASE_URI")
    if not uri:
        print("ERROR: DATABASE_URI environment variable is not set.", file=sys.stderr)
        sys.exit(1)
    if not uri.startswith("postgresql://"):
        print("ERROR: DATABASE_URI must start with 'postgresql://'.", file=sys.stderr)
        sys.exit(1)
    return uri

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_CSRF_PROTECT = False
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "dev_fallback_flask")
    JWT_SECRET_KEYS = [
        os.getenv("JWT_OLD_SECRET_KEY"),
        os.getenv("JWT_SECRET_KEY_CURRENT", "dev_fallback_jwt")
    ]


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = get_database_uri()

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = get_database_uri()
