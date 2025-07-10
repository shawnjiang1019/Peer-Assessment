from fastapi import APIRouter, Depends, HTTPException
from models import SessionLocal, User, Course, Group, Student, StudentGroup, StudentCourse, StudentSurvey
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from models import get_db
from routers.groups import StudentSurveyBase
router = APIRouter()

#Helper functions


async def calculateStudentFactor(studentID: int, groupAverage: float, factor: str, studentAverage: float):
    '''
    Given the group average and student average for a 
    specified factor, calculates the adjustment factor 
    for the specified student for a certain factor
    '''
    adjfactor = studentAverage / groupAverage
    
    return {
        'studentID': studentID, 
        'adjfactor': adjfactor,
        'factor': factor
    }

async def calculateStudentAverageScore(data: List[StudentSurveyBase], factor: str):
    '''
    Calculates the average score for a single student for a single 
    factor given a list of their data points (student survey instances)
    '''
    averagescore: float = 0
    if len(data) == 0:
        return averagescore
    total: int = 0
    for datapoint in data:
        total = total + datapoint.answer

    averagescore = total / len(data)

    return averagescore

async def calculateGroupAverageScore(factor: str, data: List[StudentSurveyBase]):
    '''
    Calculates the average score for all students in a group
    given their average factors for a particular factor
    '''
    total = 0
    for datapoint in data:
        total = total + datapoint.answer
    groupAVG = total / len(data)
    return groupAVG


async def getSurveyData(courseID: int, groupID: int, db: Session = Depends(get_db)) -> List[StudentSurveyBase]:
    '''
    Get the raw survey data as student_survey rows for a given courseID
    and a given groupID, return as a list of StudentSurvey objects
    '''
    
    instances = db.query(StudentSurvey).filter(
        StudentSurvey.course_id == courseID,
        StudentSurvey.group_id == groupID
    ).all()
    if not instances:
        raise HTTPException(status_code=404, detail="No survey instances found for this group in this course")    
    return instances

async def getStudentSurveyData(courseID: int, groupID: int, studentID: int, data: List[StudentSurveyBase]) -> List[StudentSurveyBase]:
    filtered = [datapoint for datapoint in data if datapoint.evaluator_id == studentID and datapoint.group_id == groupID ]
    return filtered

@router.get('/factors')
async def findFactors(studentID: int, groupID: int, courseID: int, db: Session = Depends(get_db)):
    '''
    Get the factors for a given student in a given group for a given course
    '''
    factors = ["q1", "q2", "q3", "q4"]
    groupData: List[StudentSurveyBase] = await getSurveyData(courseID=courseID, groupID=groupID, db=db)
    studentData: List[StudentSurveyBase] = await getStudentSurveyData(courseID=courseID, groupID=groupID, studentID=studentID, data=groupData)
    factorDict = {}

    if len(groupData) == 0:
        raise HTTPException(status_code=404, detail="group data is null")    
    for factor in factors:
        groupFactorData = [datapoint for datapoint in groupData if datapoint.question_id == factor]
        if len(groupFactorData) == 0:
            raise HTTPException(status_code=404, detail="No survey instances found for this group in this course")    
        groupAvg = await calculateGroupAverageScore(factor=factor, data=groupFactorData)
        studentFactorData = [datapoint for datapoint in studentData if datapoint.question_id == factor]
        studentAvg = await calculateStudentAverageScore(factor=factor, data=studentFactorData)
        factorDict[factor] = studentAvg / groupAvg

    return factorDict
