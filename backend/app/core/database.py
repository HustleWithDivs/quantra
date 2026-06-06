import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environmental variables from our .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://quantra:Quantra%40123@db:5432/quantra_ops")

# Create the core SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    # pool_pre_ping checks the connection health before executing queries
    pool_pre_ping=True
)

# Establish a session factory configuration
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative database models
Base = declarative_base()

def get_db():
    """
    FastAPI dependency that yields a database session 
    and guarantees it closes after the request completes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()