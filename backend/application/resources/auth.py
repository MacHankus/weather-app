from marshmallow.exceptions import ValidationError
import utils.marshmallow_schemas.signin as ms_signin
from flask.helpers import make_response
from flask_jwt_extended.utils import get_jwt_identity
from flask_jwt_extended.view_decorators import jwt_required
from flask import request, abort, jsonify
from app import mailserver
from resources.resource import ResourceAdditional
from resources.exceptions import BadCredentials, MissingParameters, MissingResource, InvalidDataProvided
from resources.models import credentials_model, signin_model, signin_confrimation_model
from resources.namespaces import auth_namespace as ns
from flask_jwt_extended import create_access_token, set_access_cookies, create_refresh_token, set_refresh_cookies, get_csrf_token
from database.connection import Session
import database.models as dbmodels
from utils.jwt.cookies import set_access_time_cookie
import secrets


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

        user = session.query(dbmodels.User).filter(
            dbmodels.User.username == username).first()

        if not user:
            raise BadCredentials()

        password_correct = user.check_password(password)

        if not password_correct:
            raise BadCredentials()

        access_token = create_access_token(identity=username, fresh=True)
        refresh_token = create_refresh_token(identity=username)

        response = jsonify(
            {"success": True, "message": "Succesfully authenticated.", "code": 200})

        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        set_access_time_cookie(response, access_token)

        return response


@ns.route(
    "/signin"
)
class SignInResource(ResourceAdditional):
    @ns.doc(responses={
            200: 'Success',
            400: 'Incorrect or incomplete data provided.'
            })
    @ns.expect(signin_model)
    def post(self):
        attrs = request.get_json()
        schema = ms_signin.UserSignIn()
        print(attrs)
        try:
            user_loaded = schema.load(attrs)
        except ValidationError as e:
            predetails = []
            for key, arr in e.messages.items():
                if isinstance(arr, list):
                    for x in arr:
                        predetails.append(f"{key}: {x}")
            raise InvalidDataProvided(
                "Incorrect data for user sign in.", details=predetails)

        session = Session()
        existing_users = session.query(dbmodels.User).filter(
            (dbmodels.User.email == user_loaded['email']) | (dbmodels.User.username == user_loaded['username'])
        ).all()
        
        if existing_users:
            exists_details = []
            for eu in existing_users:
                if eu.username == user_loaded['username']:
                    exists_details.append(
                        f"Username '{user_loaded['username']}' already exists.")
                if eu.email == user_loaded['email']:
                    exists_details.append(
                        f"Email '{user_loaded['email']}' already exists.")
            if len(exists_details) > 0:
                raise InvalidDataProvided(
                    "Incorrect data for user sign in.", details=exists_details)

        confirmation_key = secrets.token_urlsafe(5)

        new_user = dbmodels.User(
            **user_loaded, confirmation_key=confirmation_key)

        session.add(new_user)

        with mailserver.connect() as mail:
            mail.send_confirmation_key(confirmation_key, new_user.email)

        session.commit()

        return {"success": True, "message": "User informations are correct. Sending email with confirmation key."}, 200

@ns.route(
    "/signin/confirm"
)
class SignInConfirmResource(ResourceAdditional):
    @ns.expect(signin_confrimation_model)
    def post(self):
        args = request.get_json()
        confirmation_key = args.get('confirmation_key')
        username = args.get('username')
        if confirmation_key is None :
            raise MissingParameters("There is no conrifmation key in body.")

        session = Session()

        user = session.query(dbmodels.User).filter(dbmodels.User.username == username).filter(dbmodels.User.confirmed != True).first()

        if user is None :
            raise MissingResource(f"User not exist.", details=[f"There is no '{username}' user with uncofirmed account."])

        if user.confirmation_key == confirmation_key:
            user.confirmed = True 
        else:
            raise InvalidDataProvided("Token is invalid.", details=[f"The token is not matching generted token for this user."])

        session.commit()

        return {
            "success": True , 
            "message": "Confirmation succeded."
        }


@ns.route(
    "/refresh"
)
class RefreshResource(ResourceAdditional):
    @ns.header("X-CSRF-TOKEN", "Token collected from /login after success request.")
    @jwt_required(refresh=True)
    def post(self):
        identity = get_jwt_identity()
        access_token = create_access_token(identity=identity, fresh=False)
        response = jsonify(
            {"success": True, "message": "Token succesfully refreshed."})
        set_access_cookies(response, access_token)
        set_access_time_cookie(response, access_token)
        return response
