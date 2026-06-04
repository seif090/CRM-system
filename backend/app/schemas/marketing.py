from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CampaignCreate(BaseModel):
    name: str
    type: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: float = 0


class CampaignResponse(BaseModel):
    id: int
    name: str
    type: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: float
    spent: float
    status: str
    created_by: int
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class MarketingLeadCreate(BaseModel):
    campaign_id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None


class MarketingLeadResponse(BaseModel):
    id: int
    campaign_id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None
    score: int
    status: str
    assigned_to: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config: from_attributes = True
