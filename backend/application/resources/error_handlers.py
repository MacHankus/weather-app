from resources.exceptions import CustomException
from resources.namespaces import auth_namespace  
from resources.exceptions import BadCredentials
from flask import jsonify
from jwt.api_jwt import ExpiredSignatureError

@auth_namespace.errorhandler(CustomException)
def asdf(err):
    return err.get_response()

@auth_namespace.errorhandler(ExpiredSignatureError)
def asdf(err):
    bad = BadCredentials("Token has expired.", details=["Firstly please authenticate with correct credentials before refresh."])
    return bad.get_response()
