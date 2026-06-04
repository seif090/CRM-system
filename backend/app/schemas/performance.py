from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReviewCycleCreate(BaseModel):
    name: str
    start_date: datetime
    end_date: datetime


class ReviewCycleResponse(BaseModel):
    id: int
    name: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: str
    created_by: int
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class ReviewCreate(BaseModel):
    cycle_id: int
    employee_id: int
    rating: int = 0
    comments: Optional[str] = None


class ReviewResponse(BaseModel):
    id: int
    cycle_id: int
    employee_id: int
    reviewer_id: int
    rating: int
    comments: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class GoalCreate(BaseModel):
    employee_id: int
    title: str
    description: Optional[str] = None
    target_date: Optional[datetime] = None


class GoalResponse(BaseModel):
    id: int
    employee_id: int
    title: str
    description: Optional[str] = None
    target_date: Optional[datetime] = None
    status: str
    progress: int
    created_at: Optional[datetime] = None

    class Config: from_attributes = True
