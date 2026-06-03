from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PaymentGatewayCreate(BaseModel):
    name: str
    provider: str
    api_key: Optional[str] = None
    api_secret: Optional[str] = None


class PaymentGatewayResponse(BaseModel):
    id: int
    name: str
    provider: str
    is_active: int

    class Config:
        from_attributes = True


class PaymentTransactionResponse(BaseModel):
    id: int
    sale_id: Optional[int] = None
    amount: int
    currency: str
    status: str
    transaction_id: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
