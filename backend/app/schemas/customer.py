from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CustomerCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None
    company: Optional[str] = None
    notes: Optional[str] = None


class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    company: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class CustomerResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str] = None
    whatsapp_opt_in: int
    address: Optional[str] = None
    company: Optional[str] = None
    notes: Optional[str] = None
    total_purchases: int
    total_spent: int
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
