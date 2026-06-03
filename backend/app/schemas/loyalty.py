from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class LoyaltyTierCreate(BaseModel):
    name: str
    min_points: int = 0
    discount_percent: int = 0
    benefits: Optional[str] = None


class LoyaltyTierResponse(BaseModel):
    id: int
    name: str
    min_points: int
    discount_percent: int
    benefits: Optional[str] = None

    class Config:
        from_attributes = True


class CustomerLoyaltyResponse(BaseModel):
    id: int
    customer_id: int
    points: int
    tier_id: Optional[int] = None
    total_spent: int

    class Config:
        from_attributes = True


class CouponCreate(BaseModel):
    code: str
    discount_type: str = "percent"
    discount_value: int
    min_purchase: int = 0
    max_uses: int = 100
    expires_at: Optional[date] = None


class CouponResponse(BaseModel):
    id: int
    code: str
    discount_type: str
    discount_value: int
    min_purchase: int
    max_uses: int
    used_count: int
    is_active: int
    expires_at: Optional[date] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
