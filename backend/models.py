from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, select, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
from sqlalchemy.dialects.postgresql import ARRAY

from dotenv import load_dotenv
import os

load_dotenv()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

DATABASE_URL = os.getenv("SUPABASE")

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "sslmode": "require",
        "sslcert": None,
        "sslkey": None,
        "sslrootcert": None,
    },
    pool_pre_ping=True,  # Helps with connection drops
    pool_recycle=3600,   # Recycle connections every hour
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

#helper to get find a user id base on the auth0_id
def get_user_id(auth0_id: str) -> int:
    with SessionLocal() as session:
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
    surveys = relationship("StudentSurvey", back_populates="course")

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
    
    # Fixed relationships - using StudentSurvey instead of Survey
    surveys_as_evaluator = relationship("StudentSurvey", foreign_keys="StudentSurvey.evaluator_id", back_populates="evaluator")
    surveys_as_evaluatee = relationship("StudentSurvey", foreign_keys="StudentSurvey.evaluatee_id", back_populates="evaluatee")

class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True, index=True)
    courseCode = Column(String)
    courseID = Column(Integer, ForeignKey("courses.id"))
    groupNumber = Column(Integer)

    students = relationship("StudentGroup", back_populates="group")
    surveys = relationship("StudentSurvey", back_populates="group")

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


class Question(Base):
    __tablename__ = "question"
    qid = Column(String, primary_key=True)
    options = Column(ARRAY(Integer))

#Student and Survey relation table, keeps track of which students have finished which surveys for which courses
class StudentSurvey(Base):
    __tablename__ = "student_survey"
    survey_response_id = Column(Integer, primary_key=True)
    evaluator_id = Column(Integer, ForeignKey("students.id"))
    evaluatee_id = Column(Integer, ForeignKey("students.id"))
    question_id = Column(String, ForeignKey("question.qid"))
    answer = Column(Integer)
    group_id = Column(Integer, ForeignKey("groups.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    course_code = Column(String)

    # Specify which FK to use for each relationship
    evaluator = relationship("Student", foreign_keys=[evaluator_id], back_populates="surveys_as_evaluator")
    evaluatee = relationship("Student", foreign_keys=[evaluatee_id], back_populates="surveys_as_evaluatee")
    group = relationship("Group", back_populates="surveys")
    course = relationship("Course", back_populates="surveys")


class StudentAdjustmentFactor(Base):
    __tablename__ = "student_adjustment_factors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    courseCode = Column(String)
    utorid = Column(String, ForeignKey("students.utorid"))
    courseid = Column(Integer, ForeignKey("courses.id"))
    groupNumber = Column(Integer)
    factorWithSelf = Column(Float)
    factorWithoutSelf = Column(Float)