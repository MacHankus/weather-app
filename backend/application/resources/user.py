from flask_restx import Resource 
from flask import make_response
from resources.namespaces import user_namespace as ns
from database.connection import Session
import database.models as dbmodels

@ns.route(
    '/email/<string:value>'
)
class UserEmail(Resource):
    def head(self,value):
        session = Session()

        user = session.query(dbmodels.User).filter(dbmodels.User.email == value).limit(1).first()
        if user :
            return None, 200

        return None, 404

@ns.route(
    '/username/<string:value>'
)
class UserUsername(Resource):
    def head(self,value):
        session = Session()
        user = session.query(dbmodels.User).filter(dbmodels.User.username == value).limit(1).first()
        if user :
            return None, 200

        return None, 404