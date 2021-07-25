from utils.validators.exceptions import BaseValidationException
from werkzeug.exceptions import HTTPException
from abc import ABC, abstractmethod
from http import HTTPStatus


class CustomException(ABC, HTTPException, Exception):
    """Custom Exception that force some attributes."""

    def __init__(self, message=None, code=None, details=[], headers={}):
        self.code, self.description, self.details, self.headers = code or self.code, message or self.description, details or self.details, headers or self.headers

    @property
    @abstractmethod
    def details(self):
        pass

    @property
    @abstractmethod
    def description(self):
        pass

    @property
    @abstractmethod
    def code(self):
        pass

    @property
    @abstractmethod
    def headers(self):
        pass

    success = False

    @abstractmethod
    def get_response(self):
        resp = {"message": self.description,
                "code": self.code, "details": self.details}
        return resp, self.code, self.headers


class BadCredentials(CustomException):
    code = HTTPStatus.UNAUTHORIZED
    description = "Missing or invalid credentials."
    details = ["Provide correct credentials."]
    headers = {
        'Content-Type': 'application/json',
        'WWW-Authenticate': 'Provide correct credentials.'
    }

    def get_response(self):
        resp = {"success": self.success, "message": self.description,
                "code": self.code, "details": self.details}
        return resp, self.code, self.headers


class BadDataProvided(BaseValidationException, CustomException):
    code = HTTPStatus.BAD_REQUEST
    description = "Incorrect data provided."
    details = []
    headers = {'Content-Type': 'application/json'}

    def get_response(self):
        resp = {"message": self.description,
                "code": self.code, "details": self.details}
        return resp, self.code, self.headers
