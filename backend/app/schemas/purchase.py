from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SupplierCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    company: Optional[str] = None


class SupplierResponse(BaseModel):
    id: int
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    company: Optional[str] = None

    class Config:
        from_attributes = True


class PurchaseItemCreate(BaseModel):
    product_id: Optional[int] = None
    product_name: str
    quantity: int
    unit_price: int


class PurchaseCreate(BaseModel):
    supplier_id: Optional[int] = None
    supplier_name: Optional[str] = None
    items: List[PurchaseItemCreate]
    paid_amount: int = 0
    notes: Optional[str] = None


class PurchaseItemResponse(BaseModel):
    id: int
    product_name: str
    quantity: int
    unit_price: int
    total_price: int

    class Config:
        from_attributes = True


class PurchaseResponse(BaseModel):
    id: int
    reference_number: str
    supplier_id: Optional[int] = None
    supplier_name: Optional[str] = None
    total_amount: int
    paid_amount: int
    due_amount: int
    payment_status: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    items: Optional[List[PurchaseItemResponse]] = None

    class Config:
        from_attributes = True
