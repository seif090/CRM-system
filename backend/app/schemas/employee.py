from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date


class EmployeeCreate(BaseModel):
    employee_code: str
    full_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    position: Optional[str] = None
    department: Optional[str] = None
    salary: Optional[int] = None
    hire_date: Optional[date] = None
    address: Optional[str] = None


class EmployeeResponse(BaseModel):
    id: int
    employee_code: str
    full_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    position: Optional[str] = None
    department: Optional[str] = None
    salary: Optional[int] = None
    hire_date: Optional[date] = None
    address: Optional[str] = None
    status: str

    class Config:
        from_attributes = True
