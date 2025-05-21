from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship


from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    courses = relationship("Course", back_populates="lecturer")

class Course(Base):
    __tablename__ = "courses"
    code = Column(String, primary_key=True, index=False)
    session = Column(String)
    lecturer_id = Column(Integer, ForeignKey("users.id"))
    lecturer = relationship("User", back_populates="courses")
