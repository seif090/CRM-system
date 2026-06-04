from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class GiftCardCreate(BaseModel):
    card_number: str
    initial_balance: float = 0
    customer_id: Optional[int] = None
    issue_date: datetime
    expiry_date: Optional[datetime] = None


class GiftCardResponse(BaseModel):
    id: int
    card_number: str
    initial_balance: float
    current_balance: float
    customer_id: Optional[int] = None
    issue_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    status: str

    class Config: from_attributes = True


class GiftCardTransactionResponse(BaseModel):
    id: int
    gift_card_id: int
    amount: float
    type: str
    reference_id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config: from_attributes = True
