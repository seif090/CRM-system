from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BankStatementCreate(BaseModel):
    account_id: int
    statement_date: datetime
    ending_balance: float = 0


class BankStatementResponse(BaseModel):
    id: int
    account_id: int
    statement_date: Optional[datetime] = None
    ending_balance: float
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class StatementLineResponse(BaseModel):
    id: int
    statement_id: int
    date: Optional[datetime] = None
    description: Optional[str] = None
    reference: Optional[str] = None
    amount: float
    reconciled: int

    class Config: from_attributes = True


class ReconciliationResponse(BaseModel):
    id: int
    statement_id: int
    matched_transactions: int
    difference: float
    status: str
    reconciled_by: int
    created_at: Optional[datetime] = None

    class Config: from_attributes = True
