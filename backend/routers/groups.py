from fastapi import APIRouter, Depends, HTTPException
from models import SessionLocal, User, Course, Group, Student, StudentGroup, StudentCourse
from sqlalchemy.orm import Session


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/getgroups/")
async def getGroups(courseID: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == courseID).first()
    groups = db.query(Group).filter(Group.courseCode == course.code).all()

    return groups


@router.get("/groups/")
async def getStudentsInGroup(groupID: int, db: Session = Depends(get_db)):
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


#later on also need to verify that the instructor is in this course as a lecturer

@router.get("/students/")
async def getStudentInfo(studentID: int, db: Session = Depends(get_db)):

    student_row = db.query(Student).filter(Student.id == studentID).first()
    
    return student_row

@router.get("/usersgroups")
async def getGroups(studentID: int, db: Session = Depends(get_db)):
    group_ids = db.query(StudentGroup.group_id).filter(
        StudentGroup.student_id == studentID
    ).all()
    group_ids = [row[0] for row in group_ids]
    return group_ids;
