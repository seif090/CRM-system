from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MembershipPlanCreate(BaseModel):
    name: str
    price: float = 0
    duration_days: int = 30
    benefits: Optional[str] = None
    max_visits: int = 0


class MembershipPlanResponse(BaseModel):
    id: int
    name: str
    price: float
    duration_days: int
    benefits: Optional[str] = None
    max_visits: int
    is_active: int

    class Config: from_attributes = True


class MemberCreate(BaseModel):
    customer_id: int
    plan_id: int
    start_date: datetime
    end_date: Optional[datetime] = None
    auto_renew: int = 1


class MemberResponse(BaseModel):
    id: int
    customer_id: int
    plan_id: int
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: str
    auto_renew: int

    class Config: from_attributes = True


class MembershipVisitResponse(BaseModel):
    id: int
    member_id: int
    visit_date: Optional[datetime] = None
    notes: Optional[str] = None

    class Config: from_attributes = True
