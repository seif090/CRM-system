from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PurchaseRequestCreate(BaseModel):
    title: str
    requestor_id: int
    department: Optional[str] = None
    notes: Optional[str] = None


class PurchaseRequestResponse(BaseModel):
    id: int
    title: str
    requestor_id: int
    department: Optional[str] = None
    notes: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class RFQCreate(BaseModel):
    title: str
    request_id: Optional[int] = None
    issue_date: datetime
    due_date: datetime


class RFQResponse(BaseModel):
    id: int
    title: str
    request_id: Optional[int] = None
    issue_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    status: str
    created_by: int
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class RFQResponseSchema(BaseModel):
    id: int
    rfq_id: int
    supplier_id: int
    total_amount: float
    notes: Optional[str] = None
    status: str

    class Config: from_attributes = True
