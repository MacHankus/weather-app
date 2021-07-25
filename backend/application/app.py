from flask import Flask
from flask_restx import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import config
import datetime as dt
from datetime import timezone
from flask_jwt_extended import set_access_cookies, create_access_token, get_jwt_identity, get_jwt
from utils.jwt.cookies import set_access_time_cookie

app = Flask(__name__)

config.Config.load_config(app)
config.Config.init_app(app)

#extensions
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
api = Api(doc="/docs")

from resources import namespaces
from resources import auth
from resources import error_handlers
from database.connection import Session



#namespaces
api.add_namespace(namespaces.auth_namespace)

#others
@app.teardown_appcontext
def session_teardown(err):
    Session.remove()

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = dt.datetime.now(timezone.utc)
        target_timestamp = dt.datetime.timestamp(now + dt.timedelta(minutes=10))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
            set_access_time_cookie(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response


api.init_app(app)