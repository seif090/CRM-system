from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class BudgetLineCreate(BaseModel):
    category: str
    planned_amount: int = 0


class BudgetCreate(BaseModel):
    name: str
    fiscal_year: int
    lines: List[BudgetLineCreate]
    notes: Optional[str] = None


class BudgetLineResponse(BaseModel):
    id: int
    category: str
    planned_amount: int
    spent_amount: int

    class Config:
        from_attributes = True


class BudgetResponse(BaseModel):
    id: int
    name: str
    fiscal_year: int
    total_amount: int
    spent_amount: int
    status: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    lines: Optional[List[BudgetLineResponse]] = None

    class Config:
        from_attributes = True
