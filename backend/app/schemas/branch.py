from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BranchCreate(BaseModel):
    name: str
    code: str
    address: Optional[str] = None
    phone: Optional[str] = None
    manager: Optional[str] = None


class BranchResponse(BaseModel):
    id: int
    name: str
    code: str
    address: Optional[str] = None
    phone: Optional[str] = None
    manager: Optional[str] = None
    is_active: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
