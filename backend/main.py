from fastapi import FastAPI, Security, Depends, HTTPException
from utils import VerifyToken
from routers.test import router as test_router
from routers.api import router as api_router
from routers.groups import router as group_router
from sqlalchemy.orm import Session
from models import SessionLocal, User, Course
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from dependencies import auth
from routers.users import router as user_router
from routers.courses import router as course_router
from routers.calculations import router as calc_router
from routers.factor import router as factor_router
#from routers.auth import router as auth_router

# Creates app instance
app = FastAPI()
#auth = VerifyToken()

app.include_router(api_router, prefix="/api")
app.include_router(group_router, prefix="/group")
app.include_router(user_router)
app.include_router(course_router)
app.include_router(calc_router, prefix='/calculate')
app.include_router(factor_router, prefix='/factor')
#app.include_router(auth_router, prefix="/auth")



origins = [
    "http://localhost:3000",  # frontend dev server (React, etc.)
    "http://127.0.0.1:3000",
    "http://localhost",       # optional
    "http://127.0.0.1",
    # "https://your-production-site.com"
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              # Allows these origins
    allow_credentials=True,
    allow_methods=["*"],                # Allows all HTTP methods
    allow_headers=["*"],                # Allows all headers
)

@app.get("/")
def root():
    return {"message": "FastAPI is working!"}


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic model for response
class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        orm_mode = True

class CourseResponse(BaseModel):
    code: str
    session: str
    lecturer_id: int

    class Config:
        orm_mode = True

@app.get("/users", response_model=List[UserResponse])
async def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@app.get("/courses/{userID}", response_model=List[CourseResponse])
async def get_courses(userID: int, db: Session = Depends(get_db)):
    lecturer_id = userID
    courses = db.query(Course).filter(Course.lecturer_id == lecturer_id).all()
    return courses


@app.get("/courses/{courseID}/{courseSession}", response_model=CourseResponse)  # Changed to single response
def get_single_course(
    courseID: str,
    courseSession: str,
    db: Session = Depends(get_db)
):
    # Use clearer variable names to avoid shadowing
    course_code = courseID
    session = add_space_manual(courseSession)
    
    # Get the course with eager loading if there are relationships
    course = (
        db.query(Course)
        .filter(
            Course.code == course_code,
            Course.session == session
        )
        .first()
    )
    
    if not course:
        raise HTTPException(
            status_code=404,
            detail=f"Course {courseID} for session {courseSession} not found"
        )
        
    return course


@app.get("/api/public")
def public():
    """No access token required to access this route"""

    result = {
        "status": "success",
        "msg": ("Hello from a public endpoint! You don't need to be "
                "authenticated to see this.")
    }
    return result



def add_space_manual(s):
    for i, char in enumerate(s):
        if char.isdigit() and i > 0 and s[i-1].isalpha():
            return s[:i] + " " + s[i:]
    return s

# @app.get("/api/private")
# def private(auth_result: str = Security(auth.verify)):
#     """A valid access token is required to access this route"""
#     result = {
#         "status": "success",
#         "msg": ("Hello from a private endpoint! You need to be "
#                 "authenticated to see this.")
#     }
#     return result


# @app.get("/api/private-scoped")
# def private_scoped(auth_result: str = Security(auth.verify, scopes=['read:messages'])):
#     """A valid access token and an appropriate scope are required to access
#     this route
#     """

#     return auth_result

