from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class JobPostingCreate(BaseModel):
    title: str
    department: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    status: str = "open"


class JobPostingResponse(BaseModel):
    id: int
    title: str
    department: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    status: str
    created_by: int
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class ApplicantCreate(BaseModel):
    job_id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    resume_url: Optional[str] = None


class ApplicantResponse(BaseModel):
    id: int
    job_id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    resume_url: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class InterviewCreate(BaseModel):
    applicant_id: int
    interviewer: str
    scheduled_at: datetime
    notes: Optional[str] = None


class InterviewResponse(BaseModel):
    id: int
    applicant_id: int
    interviewer: str
    scheduled_at: Optional[datetime] = None
    status: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config: from_attributes = True
