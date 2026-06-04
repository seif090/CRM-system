from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class PipelineStageCreate(BaseModel):
    name: str
    order: int = 0
    color: str = "#1976d2"


class PipelineStageResponse(BaseModel):
    id: int
    name: str
    order: int
    color: str

    class Config:
        from_attributes = True


class DealCreate(BaseModel):
    title: str
    value: int = 0
    stage_id: int
    customer_id: Optional[int] = None
    assigned_to: Optional[int] = None
    probability: int = 50
    notes: Optional[str] = None
    expected_close_date: Optional[datetime] = None


class DealUpdate(BaseModel):
    stage_id: Optional[int] = None
    value: Optional[int] = None
    probability: Optional[int] = None
    notes: Optional[str] = None


class DealResponse(BaseModel):
    id: int
    title: str
    value: int
    stage_id: int
    customer_id: Optional[int] = None
    assigned_to: Optional[int] = None
    probability: int
    notes: Optional[str] = None
    expected_close_date: Optional[datetime] = None
    created_by: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
