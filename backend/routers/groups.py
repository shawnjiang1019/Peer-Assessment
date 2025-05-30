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

@router.get("/{courseID}")
async def getGroups(courseID: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.code == courseID).first()
    groups = db.query(Group).filter(Group.courseCode == course.code).all()

    return groups


@router.get("/groups/")
async def getStudentsInGroup(courseID: str, groupID: int, db: Session = Depends(get_db)):
    # 1. First verify the group exists in this course (recommended)
    group = db.query(Group).filter(
        Group.id == groupID,
    ).first()
    print(group)

    if not group:
        raise HTTPException(status_code=404, detail="Group not found in this course")

    # 2. Query StudentGroup directly with the provided groupID
    student_group_relations = db.query(StudentGroup).filter(
        StudentGroup.group_id == groupID  # Fixed filter to use the parameter
    ).all()

    # 3. Fixed list comprehension syntax
    studentIDs = [row.student_id for row in student_group_relations]
    return {"student_ids": studentIDs}



#later on also need to verify that the instructor is in this course as a lecturer