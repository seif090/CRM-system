from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class PayrollCreate(BaseModel):
    employee_id: int
    month: int
    year: int
    basic_salary: int = 0
    bonuses: int = 0
    deductions: int = 0
    overtime: int = 0
    notes: Optional[str] = None


class PayrollResponse(BaseModel):
    id: int
    employee_id: int
    employee_name: Optional[str] = None
    month: int
    year: int
    basic_salary: int
    bonuses: int
    deductions: int
    overtime: int
    net_salary: int
    payment_status: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class BonusCreate(BaseModel):
    employee_id: int
    amount: int
    reason: Optional[str] = None
    date: date


class DeductionCreate(BaseModel):
    employee_id: int
    amount: int
    reason: Optional[str] = None
    date: date
