from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ExpenseCategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None


class ExpenseCategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class ExpenseCreate(BaseModel):
    category_id: Optional[int] = None
    amount: int
    description: Optional[str] = None
    paid_to: Optional[str] = None
    payment_method: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: int
    category_id: Optional[int] = None
    category_name: Optional[str] = None
    amount: int
    description: Optional[str] = None
    paid_to: Optional[str] = None
    payment_method: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
