from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    duration_hours: int = 1
    max_participants: int = 20


class CourseResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    duration_hours: int
    max_participants: int
    status: str
    created_by: int
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class TrainingSessionCreate(BaseModel):
    course_id: int
    instructor: str
    start_date: datetime
    end_date: Optional[datetime] = None
    location: Optional[str] = None


class TrainingSessionResponse(BaseModel):
    id: int
    course_id: int
    instructor: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    status: str

    class Config: from_attributes = True


class EnrollmentResponse(BaseModel):
    id: int
    session_id: int
    employee_id: int
    status: str
    completed_at: Optional[datetime] = None

    class Config: from_attributes = True
