from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class QualityChecklistCreate(BaseModel):
    name: str
    items: Optional[str] = None


class QualityChecklistResponse(BaseModel):
    id: int
    name: str
    items: Optional[str] = None
    created_by: int
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class QualityInspectionCreate(BaseModel):
    product_id: int
    checklist_id: int
    inspector: str
    notes: Optional[str] = None


class QualityInspectionResponse(BaseModel):
    id: int
    product_id: int
    checklist_id: int
    inspector: str
    result: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class NonConformanceResponse(BaseModel):
    id: int
    inspection_id: int
    description: Optional[str] = None
    severity: str
    status: str
    corrective_action: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config: from_attributes = True
