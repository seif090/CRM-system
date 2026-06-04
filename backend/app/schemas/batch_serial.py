from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BatchNumberCreate(BaseModel):
    product_id: int
    batch_number: str
    manufacturing_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    quantity: float = 0


class BatchNumberResponse(BaseModel):
    id: int
    product_id: int
    batch_number: str
    manufacturing_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    quantity: float
    status: str

    class Config: from_attributes = True


class SerialNumberResponse(BaseModel):
    id: int
    product_id: int
    serial_number: str
    batch_id: Optional[int] = None
    status: str
    sale_item_id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class InventoryTrackingResponse(BaseModel):
    id: int
    batch_id: Optional[int] = None
    serial_id: Optional[int] = None
    movement_type: str
    reference_id: Optional[int] = None
    quantity: float
    created_at: Optional[datetime] = None

    class Config: from_attributes = True
