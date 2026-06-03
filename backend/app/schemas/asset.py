from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class AssetCategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None


class AssetCategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class AssetCreate(BaseModel):
    name: str
    category_id: Optional[int] = None
    code: str
    purchase_price: int = 0
    current_value: Optional[int] = None
    purchase_date: Optional[date] = None
    location: Optional[str] = None
    notes: Optional[str] = None


class AssetResponse(BaseModel):
    id: int
    name: str
    category_id: Optional[int] = None
    code: str
    purchase_price: int
    current_value: int
    purchase_date: Optional[date] = None
    location: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AssetMaintenanceCreate(BaseModel):
    asset_id: int
    description: str
    cost: int = 0
    maintenance_date: date
    next_maintenance_date: Optional[date] = None
    vendor: Optional[str] = None
