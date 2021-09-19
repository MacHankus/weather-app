from flask_restx import Model, fields

credentials_model = Model(
    "Credentials",
    {
        "username": fields.String,
        "password": fields.String
    }
)

statistics_model = Model("Statistics", {
    'start_date': fields.String,
    'end_date': fields.String,
    'duration': fields.Integer,
    'duration_unit': fields.String
})

signin_model = Model(
    "SignIn",
    {
        "username": fields.String,
        "password": fields.String,
        "email": fields.String
    }
)
signin_confrimation_model = Model(
    "SignInConfirmation",
    {
        "username": fields.String,
        "confirmation_key": fields.String
    }
)