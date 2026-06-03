from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SaleItemCreate(BaseModel):
    product_id: Optional[int] = None
    product_name: str
    quantity: int
    unit_price: int


class SaleCreate(BaseModel):
    customer_id: Optional[int] = None
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    items: List[SaleItemCreate]
    discount: int = 0
    tax: int = 0
    paid_amount: int = 0
    payment_method: Optional[str] = None
    notes: Optional[str] = None


class SaleItemResponse(BaseModel):
    id: int
    product_name: str
    quantity: int
    unit_price: int
    total_price: int

    class Config:
        from_attributes = True


class SaleResponse(BaseModel):
    id: int
    invoice_number: str
    customer_id: Optional[int] = None
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    total_amount: int
    discount: int
    tax: int
    grand_total: int
    paid_amount: int
    due_amount: int
    payment_status: str
    payment_method: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    items: Optional[List[SaleItemResponse]] = None

    class Config:
        from_attributes = True
