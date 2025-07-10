import pandas as pd
from ..application.cache import cache;
from .courses import get_students_in_course_helper
from models import get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, Body, Request, Header, Query
from models import SessionLocal, User, Course, Group, Student, StudentGroup, StudentCourse


async def getCSVData(courseID: int, db: Session = Depends(get_db)):
    enrolledin_key: str = f"enrolledin:{courseID}" # Key to access students enrolled in course
    result = {
        "Student Name": [],
        "Course": [],
        "UTORID": [],
        "Group Number": [],
        "AF With": [],
        "AF Without": []
    }
    #Get the group ids, then from that get students in groups then set the data, then convert to csv
    # group_key = f"course:{courseID}"
    # group_ids = cache.get(group_key)
    groups = await getGroups(courseID=courseID, db=db)

    for group in groups:
        students = await getStudents(courseID=courseID, db=db)
        student_names = [student['name'] for student in students]
        student_utorids = [student['utorid'] for student in students]
        group_numbers = [group['groupNumber']] * len(students)
        
        #get students in group


    student_ids = cache.get(enrolledin_key)

    if student_ids == None:
        cache_data = get_students_in_course_helper(courseID=courseID, db=db)
        cache.set(key=enrolledin_key, value=cache_data, ttl_seconds=600)
        student_ids = cache.get(enrolledin_key)
    
    for studentID in student_ids:
        student_key = f"student:{studentID}"
        student_data = cache.get(key=student_key)

        if student_data == None:
            pass
        result["Student Name"].append(student_data["name"])
        result["UTORID"].append(student_data["utorid"])




        
    df = pd.DataFrame(result)
    csvfile = df.to_csv('adjustmentfactors.csv', index=False) 
    return csvfile


async def getGroups(courseID: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == courseID).first()
    groups = db.query(Group).filter(Group.courseCode == course.code).all()
    return groups

async def getStudents(groupID: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(
        Group.id == groupID,
    ).first()

    if not group:
        raise HTTPException(status_code=404, detail="Group not found in this course")

    # Query StudentGroup directly with the provided groupID
    student_group_relations = db.query(StudentGroup).filter(
        StudentGroup.group_id == groupID  # Fixed filter to use the parameter
    ).all()

    # 3. Fixed list comprehension syntax
    studentIDs = [row.student_id for row in student_group_relations]

    students = db.query(Student).filter(Student.id.in_(studentIDs)).all()
    return students