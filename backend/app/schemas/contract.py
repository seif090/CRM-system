from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ContractCreate(BaseModel):
    title: str
    contract_type: str = "customer"
    party_name: str
    party_phone: Optional[str] = None
    amount: float = 0
    start_date: datetime
    end_date: Optional[datetime] = None
    auto_renew: int = 0
    status: str = "active"
    notes: Optional[str] = None
    file_url: Optional[str] = None


class ContractResponse(BaseModel):
    id: int
    title: str
    contract_type: str
    party_name: str
    party_phone: Optional[str] = None
    amount: float
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    auto_renew: int
    status: str
    notes: Optional[str] = None
    file_url: Optional[str] = None
    created_by: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
