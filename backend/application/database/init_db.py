from database.connection import Session, Base, engine
import database.models as dbmodels


def init():
    Base.metadata.create_all(engine)
    session = Session()
    test_user = dbmodels.User(username="test_user", password="qwerty", email="test@gmail.com")
    session.add(test_user)
    session.commit()
def drop():
    Base.metadata.drop_all(engine)