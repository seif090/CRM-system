from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ServiceRequestCreate(BaseModel):
    customer_id: int
    title: str
    description: Optional[str] = None
    priority: str = "medium"


class ServiceRequestResponse(BaseModel):
    id: int
    customer_id: int
    title: str
    description: Optional[str] = None
    priority: str
    status: str
    assigned_to: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class WorkOrderCreate(BaseModel):
    service_request_id: int
    description: Optional[str] = None
    scheduled_date: datetime
    technician_id: Optional[int] = None


class WorkOrderResponse(BaseModel):
    id: int
    service_request_id: int
    description: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    completed_date: Optional[datetime] = None
    status: str
    technician_id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class ServiceScheduleResponse(BaseModel):
    id: int
    customer_id: int
    service_type: str
    frequency: str
    start_date: Optional[datetime] = None
    next_date: Optional[datetime] = None
    status: str

    class Config: from_attributes = True
