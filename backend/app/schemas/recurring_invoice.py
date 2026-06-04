from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RecurringInvoiceCreate(BaseModel):
    customer_id: int
    template_data: Optional[str] = None
    frequency: str = "monthly"
    interval_value: int = 1
    start_date: datetime
    end_date: Optional[datetime] = None


class RecurringInvoiceResponse(BaseModel):
    id: int
    customer_id: int
    template_data: Optional[str] = None
    frequency: str
    interval_value: int
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    next_date: Optional[datetime] = None
    status: str
    created_by: int
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class GeneratedInvoiceResponse(BaseModel):
    id: int
    recurring_id: int
    invoice_id: int
    generated_date: Optional[datetime] = None
    status: str

    class Config: from_attributes = True
