from flask_restx import Namespace

auth_namespace = Namespace(
    "Auth", description='JWT mechanism for auth.', path="/auth")

user_namespace = Namespace(
    "User", description='User resource.', path="/users")
