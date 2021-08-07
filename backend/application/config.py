import json
from json.decoder import JSONDecodeError
from marshmallow import Schema, fields
import os
import logging
from marshmallow.decorators import post_load, pre_load

from marshmallow.exceptions import MarshmallowError

logger = logging.getLogger(__name__)


class AppSchema(Schema):
    port = fields.Integer(missing=lambda: os.environ.get('PORT', 5000))
    name = fields.Str(missing=lambda: "FLASK_APP")


class AppConfigSchema(Schema):
    secret = fields.Str(required=True)
    jwt_secret_key = fields.Str(required=True)
    jwt_access_token_expires: fields.Field = fields.Integer()
    jwt_cookie_secure: fields.Field = fields.Boolean()
    jwt_cookie_csrf_protect: fields.Field = fields.Boolean()
    jwt_token_location: fields.Field = fields.List(fields.Str(), required=True)
    jwt_refresh_token_expires: fields.Field = fields.Integer()
    jwt_csrf_in_cookies: fields.Field = fields.Boolean()
    jwt_refresh_cookie_path: fields.Field = fields.Str()
    jwt_access_cookie_path: fields.Field = fields.Str()
    @pre_load
    def defaults(self, in_data, **kwargs):
        in_data['jwt_access_token_expires'] = in_data['jwt_access_token_expires'] if in_data['jwt_access_token_expires'] is not None else 900
        in_data['jwt_cookie_secure'] = in_data['jwt_cookie_secure'] if in_data['jwt_cookie_secure'] is not None else True
        in_data['jwt_cookie_csrf_protect'] = in_data['jwt_cookie_csrf_protect'] if in_data['jwt_cookie_csrf_protect'] is not None else True
        return in_data


class DatabaseSchema(Schema):
    uri: fields.Field = fields.Str(required=True)
    credentials_file: fields.Field = fields.Str()

class SMTPSchema(Schema):
    host: fields.Field = fields.Str(required=True)
    port: fields.Field = fields.Integer(required=True)
    user: fields.Field = fields.Str(required=True)
    password: fields.Field = fields.Str(required=True)
    addr: fields.Field = fields.Str(required=True)

class LogsSchema(Schema):
    path: fields.Field = fields.Str(required=True)


class ConfigSchema(Schema):
    app: fields.Field = fields.Nested(AppSchema, required=True)
    app_config: fields.Field = fields.Nested(AppConfigSchema, required=True)
    database: fields.Field = fields.Nested(DatabaseSchema, required=True)
    logs: fields.Field = fields.Nested(LogsSchema, required=True)
    smtp: fields.Field = fields.Nested(SMTPSchema, required=True) 

class Config():
    """Class for loading config. Implemented as singleton.
    Once loaded cannot be loaded again.

    """
    config = {}
    loaded = False

    @classmethod
    def load_config(cls, app):
        """Loads config from ./config.json. 

        Args:
            app (flask.Flask): Every instance that has open_resource methods returning file-like object. Preferable flask.Flask.

        Raises:
            Exception: When trying to load twice.
            ValueError: When configuration file is incorrect or empty.

        """
        if cls.loaded:
            raise Exception("load_config cannot be called twice.")

        # opens with flask function that resolves paths relativly to app file
        with app.open_resource("./config.json") as config_file:
            logger.info('Opened config.json.')

            try:
                v_loaded = json.load(config_file)
            except JSONDecodeError as e:
                logger.exception("Corrupted json in config.")
                raise ValueError(
                    f"Configuration file is incorrect json.")

            logger.debug(v_loaded)
            if v_loaded is None:
                logger.error("Config file is probably empty.")
                raise ValueError(
                    f"Configuration file is empty.")

        cschema = ConfigSchema()

        try:
            cls.config = cschema.load(v_loaded)
        except MarshmallowError as e:
            logger.exception("Object doesn't suit marshalling process.")
            raise e

        cls.loaded = True

    @classmethod
    def get_real_db_uri(cls):

        credentials_file = cls.config.get(
            'database', {}).get(
            'credentials_file'
        )
        uri = cls.config.get('database', {}).get('uri')
        logger.debug(f"credental_file: '{credentials_file}'")

        if credentials_file is None:
            return uri

        try:
            with open(credentials_file, 'r') as fi:
                credentials = json.load(fi)

        except json.JSONDecodeError as e:
            raise ValueError(
                f"File '{credentials_file}' doesn't contain valid json with username or password.")

        keys = ['username', 'password']

        for k in keys:
            val = credentials.get(k, None)
            if val is not None:
                uri = uri.replace("{"+k+"}", val)
        return uri

    @classmethod
    def init_app(self, app):
        for key, val in self.config['app_config'].items():
            app.config[key.upper()] = val
