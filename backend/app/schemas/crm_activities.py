from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CallLogCreate(BaseModel):
    customer_id: int
    duration: int = 0
    notes: Optional[str] = None
    outcome: Optional[str] = None


class CallLogResponse(BaseModel):
    id: int
    customer_id: int
    employee_id: int
    duration: int
    notes: Optional[str] = None
    outcome: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class MeetingCreate(BaseModel):
    title: str
    customer_id: Optional[int] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    location: Optional[str] = None
    notes: Optional[str] = None


class MeetingResponse(BaseModel):
    id: int
    title: str
    customer_id: Optional[int] = None
    employee_id: int
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    status: str

    class Config: from_attributes = True


class CRMNoteResponse(BaseModel):
    id: int
    customer_id: int
    employee_id: int
    content: str
    created_at: Optional[datetime] = None

    class Config: from_attributes = True
