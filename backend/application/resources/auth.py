from flask.helpers import make_response
from flask_jwt_extended.utils import get_jwt_identity
from flask_jwt_extended.view_decorators import jwt_required
from flask import request, abort, jsonify
from resources.resource import ResourceAdditional
from resources.exceptions import BadCredentials
from resources.models import credentials_model
from resources.namespaces import auth_namespace as ns
from flask_jwt_extended import create_access_token, set_access_cookies, create_refresh_token, set_refresh_cookies, get_csrf_token
from database.connection import Session
import database.models as dbmodels
from utils.jwt.cookies import set_access_time_cookie

ns.add_model(credentials_model.name, credentials_model)


@ns.route(
    "/login"
)
class LoginResource(ResourceAdditional):
    @ns.doc(responses={
            200: 'Success',
            401: 'Authorization failed due to missing or invalid credentials.'
            })
    @ns.expect(credentials_model, 200)
    def post(self):
        args = request.get_json()
        print(args)
        username, password = args.get('username'), args.get('password')

        if username and not password:
            raise BadCredentials(
                details=["Provide password."])
        elif not username and password:
            raise BadCredentials(
                details=["Provide username."])
        elif not username and not password:
            raise BadCredentials(
                details=["Provide username.", "Provide password."])

        session = Session()

        user = session.query(dbmodels.User).filter(dbmodels.User.username == username).first()
        
        if not user:
            raise BadCredentials()

        password_correct = user.check_password(password)

        if not password_correct:
            raise BadCredentials()

        access_token = create_access_token(identity=username, fresh=True)
        refresh_token = create_refresh_token(identity=username)

        response = jsonify(
            {"success": True, "message": "Succesfully authenticated.", "code":200, "access_token":access_token})

        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        set_access_time_cookie(response, access_token)

        return response


@ns.route(
    "/signin"
)
class SignInResource(ResourceAdditional):
    def post(self):
        return {}, 200



@ns.route(
    "/refresh"
)
class RefreshResource(ResourceAdditional):
    @ns.header("X-CSRF-TOKEN","Token collected from /login after success request.")
    @jwt_required(refresh=True)
    def post(self):
        identity = get_jwt_identity()
        access_token = create_access_token(identity=identity, fresh=False)
        response = jsonify(
            {"success": True, "message": "Token succesfully refreshed."})
        set_access_cookies(response, access_token)
        return response
