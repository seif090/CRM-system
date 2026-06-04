from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class CalendarEventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    event_type: str = "meeting"
    start_time: datetime
    end_time: Optional[datetime] = None
    all_day: int = 0
    customer_id: Optional[int] = None
    related_to: Optional[str] = None
    related_id: Optional[int] = None
    color: str = "#1976d2"


class CalendarEventResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    event_type: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    all_day: int
    customer_id: Optional[int] = None
    related_to: Optional[str] = None
    related_id: Optional[int] = None
    created_by: int
    color: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
