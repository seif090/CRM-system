from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class LeaveTypeCreate(BaseModel):
    name: str
    days_allowed: int = 21
    is_paid: int = 1


class LeaveTypeResponse(BaseModel):
    id: int
    name: str
    days_allowed: int
    is_paid: int

    class Config:
        from_attributes = True


class LeaveRequestCreate(BaseModel):
    employee_id: int
    leave_type_id: Optional[int] = None
    start_date: date
    end_date: date
    reason: Optional[str] = None


class LeaveRequestResponse(BaseModel):
    id: int
    employee_id: int
    leave_type_name: Optional[str] = None
    start_date: date
    end_date: date
    total_days: int
    reason: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
