from app import app

def init():

    from database.connection import Session, Base, engine
    import database.models as dbmodels

    Base.metadata.create_all(engine)
    session = Session()
    test_user = dbmodels.User(username="test_user", password="qwerty", email="test@gmail.com",confirmed=True, confirmation_key ="test")
    session.add(test_user)
    session.commit()

def drop():
    from database.connection import Session, Base, engine
    import database.models as dbmodels

    Base.metadata.drop_all(engine)


if __name__ =='__main__':
    drop()
    init()