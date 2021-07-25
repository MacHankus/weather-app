from flask import g, Response
from resources.models import statistics_model
from datetime import datetime as dtdt
from functools import wraps
from flask_restx import Resource
from datetime import timezone
import json

def put_object_into_response(response, key, obj):
    """Puts given object under provided key into Response"""
    if isinstance(response, tuple):
        if len(response) == 3:
            data, code, headers  = response
            data[key] = obj
            return data,code, headers
        if len(response) == 2:
            data, code  = response
            print(data)
            data[key] = obj
            return data,code, {}
        if len(response) == 1:
            data = response
            data[key] = obj
            return data
    elif isinstance(response, dict):
        data = response
        data[key] = obj
        return data
    elif isinstance(response, Response):
        data = json.loads(response.get_data())
        data[key] = obj
        response.data = json.dumps(data)
        return response
    else:
        print("Warning! Unrecognize object returned.")
        return response

class ResourceAdditional(Resource):
    """Class which extends Resource from flask-restx.

    Adding statistics to all responses.
    
    """

    def __init__(self,*args,**kwargs):
        super().__init__(*args,**kwargs)
        METHODS = ['GET','POST','HEAD','PUT','DELETE','CONNECT','OPTIONS','TRACE','PATCH']
        for attr in dir(self):
            # Decorate every method in METHODS
            if callable(getattr(self,attr)) and attr.upper() in METHODS:
                setattr(self,attr,self.statistics(getattr(self,attr)))

    @classmethod
    def statistics(self,func):
        @wraps(func)
        def wrapper(*args,**kwargs):
            format = '%Y-%m-%dT%H:%M:%S.%fZ'
            start_date = dtdt.now(tz=timezone.utc)
            returned = func(*args,**kwargs)
            end_date = dtdt.now(tz=timezone.utc)
            stats = {
                'start_date':start_date.strftime(format),
                'end_date':end_date.strftime(format),
                'duration':(end_date - start_date).microseconds,
                'duration_unit':'microseconds'
            }
            return put_object_into_response(returned, 'stats', stats)
        return wrapper
