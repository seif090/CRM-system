from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date


class TimeEntryCreate(BaseModel):
    date: date
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration_minutes: int = 0
    description: Optional[str] = None
    task_id: Optional[int] = None
    project_id: Optional[int] = None
    billable: int = 1


class TimeEntryResponse(BaseModel):
    id: int
    user_id: int
    date: Optional[date] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration_minutes: int
    description: Optional[str] = None
    task_id: Optional[int] = None
    project_id: Optional[int] = None
    billable: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
