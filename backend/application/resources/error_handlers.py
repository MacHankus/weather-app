from resources.namespaces import auth_namespace  
from resources.exceptions import BadCredentials
from flask import jsonify


@auth_namespace.errorhandler(BadCredentials)
def asdf(err):
    return err.get_response()