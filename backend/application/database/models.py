from sqlalchemy.sql.expression import text
from sqlalchemy.sql.schema import Column
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from database.connection import Base
from sqlalchemy import BigInteger, Text, String, DateTime, Date, Integer, Boolean
from app import bcrypt
from marshmallow.validate import Email
import datetime as dt

class StandardTable():
    id = Column(BigInteger, primary_key=True)
    mod_date = Column(DateTime, default=dt.datetime.now())
    create_date = Column(DateTime, server_default=text("current_timestamp"))


class User(StandardTable, Base):
    """User model.
    Class is using marhsmallow.validate to validation.
    Raises all sqlalchemy exceptions.
    
    Raises:
        marshmallow.ValidationError: When validation fails.

    """
    __tablename__ = "user_credential"
    username = Column(String(1000), nullable=False)
    _password = Column("password", String(1000), nullable=False)
    email = Column(String(100), nullable=False)
    confirmed = Column(Boolean(), nullable=False, default=False)
    confirmation_key = Column(String(100), nullable=False)
    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, val):
        self._password = bcrypt.generate_password_hash(val).decode('utf-8')

    def check_password(self, val):
        return bcrypt.check_password_hash(self._password, val)

    @validates("email")
    def val_email(self, name, val):
        validator = Email()
        validator(val)
        return val
