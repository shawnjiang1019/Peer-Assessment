# Endpoint to create user in PostgreSQL
from fastapi import APIRouter, Depends, HTTPException, Body
from models import SessionLocal, User, Course, Group, Student, StudentGroup, StudentCourse, get_db
from sqlalchemy.orm import Session


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/studentid")
async def getStudentID(email: str, db: Session = Depends(get_db)):
    #get based on the same email
    student = db.query(Student).filter(Student.email == email).first()
    return student.id

@router.post("")
async def create_user(payload: dict = Body(...), db: Session = Depends(get_db)):
    auth0_id = payload["sub"]
    
    # Check if user exists
    user = db.query(User).filter(User.auth0_id == auth0_id).first()
    if user:
        return user
    
    # Create new user
    new_user = User(
        auth0_id=auth0_id, 
        email=payload["email"],
        name=payload.get("name", "")
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/by-auth0/{auth0_sub}")
async def getUserByAuth0(auth0_sub: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.auth0_id == auth0_sub).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "auth0_sub": user.auth0_id,
        "role": user.role
    }

