from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    priority: str = "medium"
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    status: str
    priority: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TaskCreate(BaseModel):
    project_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    assigned_to: Optional[int] = None
    due_date: Optional[date] = None


class TaskResponse(BaseModel):
    id: int
    project_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    assigned_to: Optional[int] = None
    due_date: Optional[date] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
