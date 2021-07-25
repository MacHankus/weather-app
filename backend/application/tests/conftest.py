import pytest 
from marshmallow import Schema, fields

@pytest.fixture
def success_login_cookies_names(request):
    if request.param == 'all':
        return ('access_token_cookie', 'refresh_token_cookie', 'csrf_refresh_token', 'csrf_access_token')
    else:
        return tuple()

# @pytest.fixture
# def success_response_marshmallow_validation_object():
#     class BasicSuccessResponse(Schema):
#         message = fields.Str(required=True)
#         success = fields.Boolean(required = True )
#         code = fields.Boolean(required = True )
#     return BasicSuccessResponse