from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TaxCodeCreate(BaseModel):
    name: str
    rate: float = 0
    type: str = "sales"


class TaxCodeResponse(BaseModel):
    id: int
    name: str
    rate: float
    type: str
    is_active: int

    class Config: from_attributes = True


class TaxReturnCreate(BaseModel):
    name: str
    period_start: datetime
    period_end: datetime
    total_sales_tax: float = 0
    total_purchase_tax: float = 0


class TaxReturnResponse(BaseModel):
    id: int
    name: str
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None
    total_sales_tax: float
    total_purchase_tax: float
    net_due: float
    status: str
    filed_date: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config: from_attributes = True
