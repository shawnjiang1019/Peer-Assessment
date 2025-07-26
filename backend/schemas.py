from pydantic import BaseModel

class StudentCreate(BaseModel):
    status: str
    filename: str
    created_count: int
    total_rows: int