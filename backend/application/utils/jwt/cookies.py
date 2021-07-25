from flask_jwt_extended import decode_token



def set_access_time_cookie(response, jwt_token):
    """Sets access_time cookie into response
    
    Args:
        response (flask.Response): Response.
        jwt_token (str): Encoded jwt token.
    """

    cookie_name = 'access_time'
    decoded = decode_token(jwt_token)
    unix = decoded.get('exp', 0)
    unix_bytes = str(unix).encode('utf-8')
    
    if unix is None : raise ValueError("JWT does not include 'exp' key.")

    response.set_cookie(cookie_name,unix_bytes, expires=unix)