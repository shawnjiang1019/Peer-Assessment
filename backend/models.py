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

#User (instructor) object
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    courses = relationship("Course", back_populates="lecturer")

#course object
class Course(Base):
    __tablename__ = "courses"
    code = Column(String, primary_key=True, index=False)
    session = Column(String)
    lecturer_id = Column(Integer, ForeignKey("users.id"))
    lecturer = relationship("User", back_populates="courses")


#student object
class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=False)
    email = Column(String)
    name = Column(String)
    groups = relationship("StudentGroup", back_populates="student")



class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True, index=True)
    courseCode = Column(String, ForeignKey("courses.code"))
    students = relationship("StudentGroup", back_populates="group")



#Student and course relation table
class StudentCourse(Base):
    __tablename__ = "enrolledin"
    id = Column(Integer, primary_key=True, index=False)
    student_id = Column(Integer, ForeignKey("students.id"))
    courseCode = Column(String, ForeignKey("courses.code"))

#Student and group relation table, keeps track of which students in which groups
class StudentGroup(Base):
    __tablename__ = "student_group"
    student_id = Column(Integer, ForeignKey("students.id"), primary_key=True)
    group_id = Column(Integer, ForeignKey("groups.id"), primary_key=True)
    student = relationship("Student", back_populates="groups")
    group = relationship("Group", back_populates="students")



