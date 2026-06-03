from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DeliveryPersonCreate(BaseModel):
    name: str
    phone: str
    vehicle_type: Optional[str] = None


class DeliveryPersonResponse(BaseModel):
    id: int
    name: str
    phone: str
    vehicle_type: Optional[str] = None
    is_active: int

    class Config:
        from_attributes = True


class DeliveryCreate(BaseModel):
    sale_id: Optional[int] = None
    customer_id: Optional[int] = None
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_address: Optional[str] = None
    delivery_person_id: Optional[int] = None
    estimated_date: Optional[datetime] = None
    notes: Optional[str] = None


class DeliveryResponse(BaseModel):
    id: int
    sale_id: Optional[int] = None
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_address: Optional[str] = None
    delivery_person_id: Optional[int] = None
    status: str
    estimated_date: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
