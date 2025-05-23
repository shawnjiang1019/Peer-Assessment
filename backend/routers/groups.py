from fastapi import APIRouter, Depends
from models import SessionLocal, User, Course, Group
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

#later on also need to verify that the instructor is in this course as a lecturer