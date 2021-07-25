from dataclasses import dataclass
import pytest
import io
import config
import json 
import logging 
import os 
from importlib import reload  

logger = logging.getLogger()


def get_path_to_credential_file():
    return r"E:\Projects\weather-app\backend\application\tests\unittests\test_credentials.json"

@pytest.fixture
def app_mock():
    @dataclass
    class AppMock():
        json_dict: object
        def open_resource(self,path):
            f = io.StringIO(
                json.dumps(
                    self.json_dict
                )
            )
            return f
    return AppMock


@pytest.mark.parametrize(
    'expected, credentials, uri',
    [
        (
            {
                "app":{
                    "port":9999,
                    "name": "TEST_APP",
                },
                "app_config":{
                    "secret": "yoZoqBcC9tpa-kVVRC_o0GkhMjk5G-1LQpxGe-zePjY",
                    "jwt_secret_key": "c7cf2cf5d3079a6556a4c44ee39d2c0f894b721646def743b247574c606c",
                    "jwt_access_token_expires": 300,
                    "jwt_refresh_token_expires": 3000,
                    "jwt_cookie_secure": True,
                    "jwt_cookie_csrf_protect": True,
                    "jwt_token_location": ["cookies"],
                    "jwt_csrf_in_cookies":True,
                    "jwt_refresh_cookie_path":"/auth/refresh",
                    "jwt_access_cookie_path":"/"
                },
                "database":{
                    "uri":"postgres://{username}:{password}@localhost:5432/weather_db",
                    "credentials_file":get_path_to_credential_file()
                },
                "logs":{
                    "path":"C:\\tmp\\"
                }
            },
            {
                "username":"test_user_1",
                "password":"complex_password_123"
            },
            "postgres://test_user_1:complex_password_123@localhost:5432/weather_db"
        ),
        (
            {
                "app":{
                    "port":00000,
                    "name": "TEST_APP_THE_SECOND",
                },
                "app_config":{
                    "secret": "yoZoqBcC9tpa-kVVRC_o0GkhMjk5G-1LQpxGe-zePjY",
                    "jwt_secret_key": "c7cf2cf5d3079a6556a4c44ee39d2c0f894b721646def743b247574c606c",
                    "jwt_access_token_expires": 300,
                    "jwt_refresh_token_expires": 3000,
                    "jwt_cookie_secure": True,
                    "jwt_cookie_csrf_protect": True,
                    "jwt_token_location": ["cookies"],
                    "jwt_csrf_in_cookies":True,
                    "jwt_refresh_cookie_path":"/auth/refresh",
                    "jwt_access_cookie_path":"/"
                },
                "database":{
                    "uri":"postgres://user_without:credential_file@localhost:4321/test_db",
                },
                "logs":{
                    "path":"C:\\tmp\\logs\\"
                }
            },
            {},
            "postgres://user_without:credential_file@localhost:4321/test_db"
        )
    ]

)
def test_Config(expected, credentials, uri, app_mock):
    """Checks basic functionality of Config class.
    Tests loading config from file and getting uri with credentials

    """

    reload(config)
    #init with dict passed
    app_mock = app_mock(expected)
    try:
        #Create credentials
        with open(get_path_to_credential_file(),'w+') as cred_file :
            json.dump(credentials, cred_file)

        config.Config.load_config(app_mock)
        cf = config.Config.config

        assert cf == expected
        assert config.Config.get_real_db_uri() == uri
        assert cf['app']['port']
        assert cf['app_config']['jwt_refresh_token_expires']

    finally:    
        os.remove(get_path_to_credential_file())

        

