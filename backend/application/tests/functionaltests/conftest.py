import pytest 
from app import app
from database.init_db import init, drop

@pytest.fixture 
def app_client():
    with app.test_client() as client:
        with app.app_context():
            drop()
            init()
        yield client

