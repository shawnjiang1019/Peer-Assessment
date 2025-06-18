from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, select
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session


from dotenv import load_dotenv
import os

load_dotenv()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()



#helper to get find a user id base on the auth0_id
def get_user_id(auth0_id: str) -> int:
    with SessionLocal as session:
        stmt = select(User.id).where(User.auth0_id == auth0_id)
        result = session.execute(stmt).scalar()
        return result 



#User (instructor) object
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    auth0_id = Column(String, unique=True, index=True)
    role = Column(String, default="student")

    courses = relationship("Course", back_populates="lecturer")

    

#course object
class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, unique=True)
    code = Column(String, index=True)
    session = Column(String)
    lecturer_id = Column(Integer, ForeignKey("users.id"))
    lecturer = relationship("User", back_populates="courses")
    enrollments = relationship("StudentCourse", back_populates="course")



#student object
class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=False)
    student_id = Column(Integer, unique=True, index=False)
    email = Column(String)
    name = Column(String)
    firstname = Column(String)
    lastname = Column(String)
    utorid = Column(String, unique=True)

    groups = relationship("StudentGroup", back_populates="student")
    enrollments = relationship("StudentCourse", back_populates="student")




class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True, index=True)
    courseCode = Column(String)
    courseID = Column(Integer, ForeignKey("courses.id"))
    groupNumber = Column(Integer)
    students = relationship("StudentGroup", back_populates="group")



#Student and course relation table
class StudentCourse(Base):
    __tablename__ = "enrolledin"
    id = Column(Integer, primary_key=True, index=False)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))

    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

#Student and group relation table, keeps track of which students in which groups
class StudentGroup(Base):
    __tablename__ = "student_group"
    student_id = Column(Integer, ForeignKey("students.id"), primary_key=True)
    group_id = Column(Integer, ForeignKey("groups.id"), primary_key=True)
    student = relationship("Student", back_populates="groups")
    group = relationship("Group", back_populates="students")



