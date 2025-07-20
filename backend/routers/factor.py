from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from models import SessionLocal, User, Course, Group, Student, StudentGroup, StudentCourse, StudentSurvey, StudentAdjustmentFactor, FinishedSurvey
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from models import get_db
from routers.groups import StudentSurveyBase
import pandas as pd


router = APIRouter()

class StudentAdjFactor(BaseModel):
    name: str
    courseCode: str 
    utorid: str
    courseid: int
    groupNumber: int
    factorWithSelf: float
    factorWithoutSelf: float
    

async def get_factors(courseID: int, db: Session = Depends(get_db)):
    factordata = db.query(StudentAdjustmentFactor).filter(
        StudentAdjustmentFactor.courseid == courseID,
    ).all()
    return factordata

@router.get('/fetchFactors')
async def fetch_factors(courseID: int, db: Session = Depends(get_db)):
    factordata = await get_factors(courseID=courseID, db=db)
    return factordata

@router.get('/makeCSV')
async def make_CSV(courseID: int, db: Session = Depends(get_db)):
    factordata = await get_factors(courseID=courseID, db=db)
    data_dicts = [obj.__dict__ for obj in factordata]
    for d in data_dicts:
        d.pop('_sa_instance_state', None)
    df = pd.DataFrame(data_dicts)
    
    csv_data = df.to_csv(index=False)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=students.csv"}
    )


async def get_denominator(groupID: int, courseID: int, studentID: int, includeSelf: bool, db: Session = Depends(get_db)):
    data = await get_data(groupID=groupID, courseID=courseID, db=db)
    if not includeSelf:
        data = [
            d for d in data 
            if not (d.evaluator_id == studentID and d.evaluatee_id == studentID)
        ]
        
    num_instances = len(data)
    if num_instances == 0:
        print("did not fill out yet")
        return None

    
    total = 0
    for instance in data:
        total = total + instance.answer  # Changed from instance.get("answer")
    denominator = total / num_instances

    return denominator

async def calculateFactor(groupID: int, courseID: int, studentID: int, denominator: int, includeSelf: bool, db: Session = Depends(get_db)):
    if denominator == 0:
        return None
    data = await get_data(groupID=groupID, courseID=courseID, db=db)
    student_instances = [d for d in data if d.evaluatee_id == studentID]  # Changed from d.get("evaluatee_id")
    
    if not includeSelf:
        student_instances = [
            d for d in student_instances 
            if not (d.evaluator_id == studentID and d.evaluatee_id == studentID)
        ]
    
    num_instances = len(student_instances)



    total = 0
    if num_instances == 0:
        return 0
    for instance in student_instances:
        total = total + instance.answer  # Changed from instance.get("answer")
    numerator = total / num_instances
    factor = numerator / denominator
    return factor

async def get_data(groupID: int, courseID: int, db: Session = Depends(get_db)):
    instances = db.query(StudentSurvey).filter(
        StudentSurvey.course_id == courseID,
        StudentSurvey.group_id == groupID
    ).all()
    
    # Don't raise exception for empty results - let caller handle it
    return instances
@router.post("/refreshFactors")
async def refreshFactors(courseID: int, db: Session = Depends(get_db)):
    try:
        groups: List[Group] = db.query(Group).filter(Group.courseID == courseID).all()
        finished: List[FinishedSurvey] = db.query(FinishedSurvey).all()
        finishedGroups = [f.groupID for f in finished]
        
        processed_groups = []
        skipped_groups = []
        error_groups = []
        
        for group in groups:
            if group.id not in finishedGroups:
                try:
                    # Check if the group has any survey responses before processing
                    survey_data = await get_data(groupID=group.id, courseID=courseID, db=db)
                    
                    if not survey_data:
                        # Skip groups with no survey responses and mark as skipped
                        skipped_groups.append({
                            "groupID": group.id,
                            "reason": "No survey responses found"
                        })
                        print(f"Skipped group {group.id} - no survey responses")
                        continue
                    
                    # Process the group
                    result = await addMultiple(
                        groupID=group.id, 
                        courseID=courseID, 
                        courseCode="STAC67", 
                        db=db
                    )
                    
                    # Mark group as finished only if processing was successful
                    finished_survey = FinishedSurvey(groupID=group.id)
                    db.add(finished_survey)
                    
                    processed_groups.append({
                        "groupID": group.id,
                        "result": result
                    })
                    print(f"Successfully processed group {group.id}")
                    
                except HTTPException as he:
                    # Handle specific HTTP exceptions (like no survey data)
                    error_groups.append({
                        "groupID": group.id,
                        "error": he.detail,
                        "status_code": he.status_code
                    })
                    print(f"HTTP error processing group {group.id}: {he.detail}")
                    continue
                    
                except Exception as e:
                    # Handle other unexpected errors
                    error_groups.append({
                        "groupID": group.id,
                        "error": str(e),
                        "status_code": 500
                    })
                    print(f"Unexpected error processing group {group.id}: {str(e)}")
                    continue
        
        # Commit only if we have successfully processed groups
        if processed_groups:
            db.commit()
            print(f"Committed changes for {len(processed_groups)} groups")
        
        # Build response
        response = {
            "total_groups": len(groups),
            "already_finished": len([g for g in groups if g.id in finishedGroups]),
            "processed_successfully": len(processed_groups),
            "skipped_no_data": len(skipped_groups),
            "errors": len(error_groups)
        }
        
        if processed_groups:
            response["processed_groups"] = processed_groups
            response["message"] = f"Successfully processed {len(processed_groups)} groups"
        
        if skipped_groups:
            response["skipped_groups"] = skipped_groups
            if not processed_groups:
                response["message"] = f"Skipped {len(skipped_groups)} groups with no survey data"
            else:
                response["message"] += f", skipped {len(skipped_groups)} groups with no data"
        
        if error_groups:
            response["error_groups"] = error_groups
            if not processed_groups and not skipped_groups:
                response["message"] = f"Failed to process {len(error_groups)} groups due to errors"
            else:
                response["message"] += f", {len(error_groups)} groups had errors"
        
        if not processed_groups and not skipped_groups and not error_groups:
            response["message"] = "No unfinished groups found to process"
        
        return response
            
    except Exception as e:
        db.rollback()
        print(f"Critical error in refreshFactors: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Critical error refreshing factors: {str(e)}")


async def getStudentsInGroup(groupID: int, db: Session):
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



async def getGroup(groupID: int, db: Session):
    group: Group = db.query(Group).filter(Group.id == groupID).first()
    return group.groupNumber
    

@router.post("/addmultiple/")
async def addMultiple(groupID: int, courseID: int, courseCode: str, db: Session = Depends(get_db)):
    try:
        print(f"Starting addMultiple with groupID: {groupID}, courseID: {courseID}")
        groupNumber: int = await getGroup(groupID=groupID, db=db)
        # Get students in the group
        students: list[Student] = await getStudentsInGroup(groupID=groupID, db=db)
        print(f"Found {len(students)} students")
        
        if not students:
            raise HTTPException(status_code=404, detail="No students found in this group")
        
        # Check if there are any survey responses at all
        survey_data = await get_data(groupID=groupID, courseID=courseID, db=db)
        if not survey_data:
            raise HTTPException(status_code=400, detail="No survey responses found for this group. Students must complete evaluations first.")
        
        results = []
        skipped_students = []
        
        for student in students:
            print(f"Processing student: {student.name} (ID: {student.student_id})")
            
            try:
                # Calculate denominator without self-evaluation
                denominatorw = await get_denominator(
                    groupID=groupID, 
                    courseID=courseID, 
                    studentID=student.id,
                    includeSelf=True, 
                    db=db
                )
                
                factorw = await calculateFactor(
                    groupID=groupID, 
                    courseID=courseID, 
                    studentID=student.id,
                    denominator=denominatorw,
                    includeSelf=True, 
                    db=db
                )
                
                denominatorwo = await get_denominator(
                    groupID=groupID, 
                    courseID=courseID, 
                    studentID=student.id,
                    includeSelf=False, 
                    db=db
                )
                
                factorwo = await calculateFactor(
                    groupID=groupID, 
                    courseID=courseID, 
                    studentID=student.id,
                    denominator=denominatorwo,
                    includeSelf=False, 
                    db=db
                )
                
                # Check if we got valid factors
                if factorwo is None and factorw is None:
                    print(f"Skipping {student.name} - insufficient evaluation data")
                    skipped_students.append({
                        "student_id": student.student_id,
                        "name": student.name,
                        "reason": "Insufficient evaluation data"
                    })
                    continue
                
                # Create Pydantic model
                data: StudentAdjFactor = StudentAdjFactor(
                    name=student.name,
                    courseCode=courseCode,
                    utorid=student.utorid,
                    groupNumber=groupNumber,
                    courseid=courseID,
                    factorWithoutSelf=factorwo,
                    factorWithSelf=factorw
                )
                
                # Create database instance
                db_instance = StudentAdjustmentFactor(**data.model_dump())
                db.add(db_instance)
                print(f"Added {student.name} to database session")
                
                results.append({
                    "student_id": student.student_id,
                    "name": student.name,
                    "factorWithSelf": factorw,
                    "factorWithoutSelf": factorwo
                })
                
            except Exception as e:
                print(f"Error processing student {student.name}: {str(e)}")
                skipped_students.append({
                    "student_id": student.student_id,
                    "name": student.name,
                    "reason": str(e)
                })
                continue
        
        # Only commit if we have successful results
        if results:
            db.commit()
            print("Successfully committed all changes")
        else:
            db.rollback()
            raise HTTPException(status_code=400, detail="No students could be processed. All students may be missing evaluation data.")
        
        response = {
            "message": f"Successfully processed {len(results)} students",
            "results": results
        }
        
        if skipped_students:
            response["skipped_students"] = skipped_students
            response["message"] += f", skipped {len(skipped_students)} students"
        
        return response
        
    except HTTPException as he:
        print(f"HTTP Exception: {he.detail}")
        db.rollback()
        raise
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing students: {str(e)}")




@router.post('/addData/')
async def addSingleStudentData(groupID: int, courseID: int, courseCode: str, studentID: int, db: Session = Depends(get_db)):
    try:
        print(f"Processing single student data for studentID: {studentID}")
        
        # Check if there are any survey responses at all
        survey_data = await get_data(groupID=groupID, courseID=courseID, db=db)
        if not survey_data:
            raise HTTPException(status_code=400, detail="No survey responses found for this group. Students must complete evaluations first.")
        
        # Calculate factors
        denominatorw = await get_denominator(
            groupID=groupID, 
            courseID=courseID, 
            studentID=studentID,
            includeSelf=True, 
            db=db
        )
        
        factorw = await calculateFactor(
            groupID=groupID, 
            courseID=courseID, 
            studentID=studentID,
            denominator=denominatorw,
            includeSelf=True, 
            db=db
        )
        
        denominatorwo = await get_denominator(
            groupID=groupID, 
            courseID=courseID, 
            studentID=studentID,
            includeSelf=False, 
            db=db
        )
        
        factorwo = await calculateFactor(
            groupID=groupID, 
            courseID=courseID, 
            studentID=studentID,
            denominator=denominatorwo,
            includeSelf=False, 
            db=db
        )
        
        # Check if we got valid factors
        if factorwo is None or factorw is None:
            raise HTTPException(status_code=400, detail="Insufficient evaluation data for this student. Student may not have been evaluated by peers.")
        
        # Get student info
        student_row: Student = db.query(Student).filter(Student.id == studentID).first()
        if not student_row:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Create data model
        data: StudentAdjFactor = StudentAdjFactor(
            name=student_row.name,
            courseCode=courseCode,
            utorid=student_row.utorid,
            groupNumber=groupID,
            courseid=courseID,
            factorWithoutSelf=factorwo,
            factorWithSelf=factorw
        )
        
        # Save to database
        db_instance = StudentAdjustmentFactor(**data.model_dump())
        db.add(db_instance)
        db.commit()
        db.refresh(db_instance)
        
        return {
            "message": "Factor added to database successfully",
            "data": {
                "student_id": studentID,
                "name": student_row.name,
                "factorWithSelf": factorw,
                "factorWithoutSelf": factorwo
            }
        }
        
    except HTTPException as he:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing student data: {str(e)}")