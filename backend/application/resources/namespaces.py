from flask_restx import Namespace

auth_namespace = Namespace(
    "Auth", description='JWT mechanism for auth.', path="/auth")
