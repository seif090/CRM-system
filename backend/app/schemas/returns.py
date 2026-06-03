from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ReturnItemCreate(BaseModel):
    product_id: Optional[int] = None
    product_name: str
    quantity: int
    unit_price: int


class SalesReturnCreate(BaseModel):
    sale_id: Optional[int] = None
    customer_id: Optional[int] = None
    customer_name: Optional[str] = None
    reason: Optional[str] = None
    items: List[ReturnItemCreate]


class SalesReturnResponse(BaseModel):
    id: int
    return_number: str
    sale_id: Optional[int] = None
    customer_name: Optional[str] = None
    total_amount: int
    reason: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
