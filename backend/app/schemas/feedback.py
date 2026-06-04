from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class FeedbackFormCreate(BaseModel):
    title: str
    description: Optional[str] = None
    questions: Optional[str] = None


class FeedbackFormResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    questions: Optional[str] = None
    is_active: int
    created_by: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FeedbackResponseCreate(BaseModel):
    form_id: int
    customer_id: Optional[int] = None
    response_data: Optional[str] = None
    rating: int = 5
    notes: Optional[str] = None


class FeedbackResponseOut(BaseModel):
    id: int
    form_id: int
    customer_id: Optional[int] = None
    response_data: Optional[str] = None
    rating: int
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
