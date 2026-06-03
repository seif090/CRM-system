from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class AccountCreate(BaseModel):
    name: str
    code: str
    account_type: str
    parent_id: Optional[int] = None


class AccountResponse(BaseModel):
    id: int
    name: str
    code: str
    account_type: str
    parent_id: Optional[int] = None
    balance: int

    class Config:
        from_attributes = True
