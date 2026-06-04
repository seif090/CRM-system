from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class BOMCreate(BaseModel):
    name: str
    product_id: int
    quantity: float = 1
    notes: Optional[str] = None


class BOMItemCreate(BaseModel):
    product_id: int
    quantity: float
    unit_cost: float = 0


class BOMResponse(BaseModel):
    id: int
    name: str
    product_id: int
    quantity: float
    notes: Optional[str] = None
    created_by: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProductionOrderCreate(BaseModel):
    bom_id: int
    quantity: float
    status: str = "draft"
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    notes: Optional[str] = None


class ProductionOrderResponse(BaseModel):
    id: int
    reference: str
    bom_id: int
    quantity: float
    status: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    notes: Optional[str] = None
    created_by: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
