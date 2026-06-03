from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class RoleCreate(BaseModel):
    name: str
    description: Optional[str] = None
    permissions: Optional[str] = None


class RoleResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    permissions: Optional[str] = None
    is_system: int

    class Config:
        from_attributes = True
