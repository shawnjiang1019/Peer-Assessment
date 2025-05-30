from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, Body, Request, Header
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

@router.post("/csv", response_model= StudentCreate)
async def saveCSV(
    file: UploadFile = File(..., description="CSV file containing student data"),
    coursecode: str = Header(..., alias="cid", description="Course code"),
    db: Session = Depends(get_db)):
    contents = await file.read()
    file_stream = BytesIO(contents)
    df = await run_in_threadpool(pd.read_csv, file_stream)
    df = df.astype(object).where(pd.notnull(df), None)

    required_columns = ["Email", "First Name", "Last Name", "UTORid", "Group Number"]
    missing = [col for col in required_columns if col not in df.columns]
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {', '.join(missing)}"
        )
    
    created_count = 0
    for i in range(len(df.index)):
        try:
            student = Student(
                id = df["ID"][i],
                email= df["Email"][i],
                name = df["First Name"][i] + " " + df["Last Name"][i],
                student_id = df["ID"][i],
                utorid = df["UTORid"][i],
                firstname = df["First Name"][i],
                lastname = df["Last Name"][i]
            )
            db.add(student)
            
            



            created_count = created_count + 1
        except (KeyError, TypeError) as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid row data: {str(e)}"
            )
    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail=f"Duplicate email found: {str(e)}"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )
        
    return {
        "status": "success",
        "filename": file.filename,
        "created_count": created_count,
        "total_rows": len(df)
    }

    