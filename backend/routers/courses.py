from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, Body, Request, Header, Query
from models import SessionLocal, User, Course, Group, Student, StudentGroup, StudentCourse
from io import BytesIO
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from starlette.concurrency import run_in_threadpool
import pandas as pd
from schemas import StudentCreate
from models import get_db

router = APIRouter();


async def get_students_in_course_helper(courseID: str = Query(...), db: Session = Depends(get_db)):
    #Get student ids 
    student_course_rows = db.query(StudentCourse).filter(StudentCourse.course_id == courseID).all()
    student_ids = [row.student_id for row in student_course_rows]
    students = db.query(Student).filter(Student.id.in_(student_ids)).all()
    return students
#get students enrolled in this course
@router.get("/course/students")
async def get_students_in_course(courseID: str = Query(...), db: Session = Depends(get_db)):
    
    return get_students_in_course_helper(courseID, db);




