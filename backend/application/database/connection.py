from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base
from config import Config
import logging 

logger = logging.getLogger(__name__)

Base = declarative_base()
logger.debug(f"Created base.")
logger.debug(f"Creating engine with uri {Config.get_real_db_uri()}.")
engine = create_engine(Config.get_real_db_uri(), echo=True)
logger.info('Created engine.')
session_factory = sessionmaker(bind=engine)
logger.info('Created session factory.')
Session = scoped_session(session_factory)
logger.info('Created Session registry.')
