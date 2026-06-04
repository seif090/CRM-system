from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class TicketMessageCreate(BaseModel):
    message: str
    is_internal: int = 0


class TicketMessageResponse(BaseModel):
    id: int
    ticket_id: int
    message: str
    sender_id: int
    is_internal: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TicketCreate(BaseModel):
    subject: str
    description: Optional[str] = None
    priority: str = "medium"
    customer_id: Optional[int] = None
    assigned_to: Optional[int] = None


class TicketUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[int] = None


class TicketResponse(BaseModel):
    id: int
    subject: str
    description: Optional[str] = None
    status: str
    priority: str
    customer_id: Optional[int] = None
    assigned_to: Optional[int] = None
    created_by: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
