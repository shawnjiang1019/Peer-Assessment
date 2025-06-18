from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, Body, Request, Header, Query
from models import SessionLocal, User, Course, Group, Student, StudentGroup, StudentCourse
from io import BytesIO
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from starlette.concurrency import run_in_threadpool
import pandas as pd
from schemas import StudentCreate

router = APIRouter();



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/verifyemail")
async def verifyEmail(email: str = Query(...), db: Session = Depends(get_db)):
    allowed_email = db.query(Student).filter(Student.email == email).first();
    if not allowed_email:
        raise HTTPException(status_code=400, detail="Email not authorized")
    return {"allowed": True}

@router.get("/courses")
async def getCourses(request: Request,  db: Session = Depends(get_db)):
    instructor_id = request.headers.get("instructorID")
    courses = courses = db.query(Course).filter(Course.lecturer_id == instructor_id).all()
    return courses;


@router.post("/csv", response_model=StudentCreate)
async def saveCSV(
    file: UploadFile = File(..., description="CSV file containing student data"),
    courseID: int = Header(..., alias="cid", description="Course ID"),
    coursecode: str = Header(..., alias="coursecode", description="Course code"),
    db: Session = Depends(get_db)
):
    contents = await file.read()
    file_stream = BytesIO(contents)
    df = await run_in_threadpool(pd.read_csv, file_stream)
    df = df.astype(object).where(pd.notnull(df), None)

    required_columns = ["ID", "Email", "First Name", "Last Name", "UTORid", "Group Number", "Student Number"]
    missing = [col for col in required_columns if col not in df.columns]
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {', '.join(missing)}"
        )
    
    created_count = 0
    try:
        # Pre-cache groups to minimize database queries
        group_cache = {}
        
        for i in range(len(df.index)):
            # 1. Create student if not exists
            student_data = {
                "id": df["ID"][i],
                "email": df["Email"][i],
                "name": f"{df['First Name'][i]} {df['Last Name'][i]}",
                "student_id": df["Student Number"][i],
                "utorid": df["UTORid"][i],
                "firstname": df["First Name"][i],
                "lastname": df["Last Name"][i]
            }
            
            student = db.query(Student).filter_by(id=student_data["id"]).first()
            if not student:
                student = Student(**student_data)
                db.add(student)
                db.flush()  # Assign ID without committing transaction
            else:
                # Update existing student if needed
                for key, value in student_data.items():
                    setattr(student, key, value)

            # 2. Create enrollment
            enrollment = db.query(StudentCourse).filter_by(
                student_id=student.id,  # Use student.id NOT student.student_id
                course_id=courseID
            ).first()
            
            if not enrollment:
                enrollment = StudentCourse(
                    student_id=student.id,  # Correct foreign key reference
                    course_id=courseID
                )
                db.add(enrollment)

            # 3. Find or create group
            group_key = (coursecode, df["Group Number"][i], courseID)
            if group_key in group_cache:
                group = group_cache[group_key]
            else:
                group = db.query(Group).filter_by(
                    courseCode=coursecode,
                    groupNumber=df["Group Number"][i],
                    courseID=courseID
                ).first()
                
                if not group:
                    group = Group(
                        courseCode=coursecode,
                        groupNumber=df["Group Number"][i],
                        courseID=courseID
                    )
                    db.add(group)
                    db.flush()  # Generate group ID without commit
                
                group_cache[group_key] = group

            # 4. Create student-group association
            student_group = db.query(StudentGroup).filter_by(
                student_id=student.id,
                group_id=group.id
            ).first()
            
            if not student_group:
                student_group = StudentGroup(
                    student_id=student.id,
                    group_id=group.id
                )
                db.add(student_group)
            
            created_count += 1

        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail=f"Database integrity error: {str(e)}"
        )
    except (KeyError, TypeError) as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Invalid row data: {str(e)}"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error processing CSV: {str(e)}"
        )
        
    return {
        "status": "success",
        "filename": file.filename,
        "created_count": created_count,
        "total_rows": len(df)
    }