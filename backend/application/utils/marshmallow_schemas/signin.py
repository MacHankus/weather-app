from marshmallow import Schema, fields, validate, ValidationError
import re

def usernameValidation(username):
    match = re.fullmatch("^[aA-zZ0-9]+$", username)
    if not match:
        raise ValidationError("Username should contain only numbers and letters.")

def passwordValidation(password):
    if len(password) < 8:
        raise ValidationError("Password should be longer than 7 letters.")

    match = re.fullmatch("^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$", password)
    if not match:
        raise ValidationError("Password should contain uppercase letter, number and special character.")


class UserSignIn(Schema):
    username = fields.String(required=True, validate=usernameValidation)
    password = fields.String(required=True, validate=passwordValidation)
    email = fields.Email(required=True,validate=validate.Email(error="Incorrect email."))