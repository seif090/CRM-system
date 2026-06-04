from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SubscriptionPlanCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    billing_cycle: str = "monthly"
    max_users: int = 5
    max_storage: int = 100
    features: Optional[str] = None


class SubscriptionPlanResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    billing_cycle: str
    max_users: int
    max_storage: int
    features: Optional[str] = None
    is_active: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CustomerSubscriptionCreate(BaseModel):
    customer_id: int
    plan_id: int
    start_date: datetime
    end_date: Optional[datetime] = None
    auto_renew: int = 1
    payment_method: Optional[str] = None
    notes: Optional[str] = None


class CustomerSubscriptionResponse(BaseModel):
    id: int
    customer_id: int
    plan_id: int
    status: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    auto_renew: int
    payment_method: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
