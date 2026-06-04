from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RentalItemCreate(BaseModel):
    name: str
    sku: Optional[str] = None
    daily_rate: float = 0
    weekly_rate: float = 0
    monthly_rate: float = 0
    quantity: int = 1


class RentalItemResponse(BaseModel):
    id: int
    name: str
    sku: Optional[str] = None
    daily_rate: float
    weekly_rate: float
    monthly_rate: float
    quantity: int
    status: str

    class Config: from_attributes = True


class RentalOrderCreate(BaseModel):
    customer_id: int
    item_id: int
    quantity: int = 1
    start_date: datetime
    end_date: datetime
    total_amount: float = 0


class RentalOrderResponse(BaseModel):
    id: int
    customer_id: int
    item_id: int
    quantity: int
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    total_amount: float
    status: str
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class RentalContractResponse(BaseModel):
    id: int
    order_id: int
    terms: Optional[str] = None
    deposit_amount: float
    signed_date: Optional[datetime] = None
    notes: Optional[str] = None

    class Config: from_attributes = True
