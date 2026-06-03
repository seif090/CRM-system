from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class WarehouseCreate(BaseModel):
    name: str
    location: Optional[str] = None
    manager: Optional[str] = None


class WarehouseResponse(BaseModel):
    id: int
    name: str
    location: Optional[str] = None
    manager: Optional[str] = None

    class Config:
        from_attributes = True


class StockMovementResponse(BaseModel):
    id: int
    product_name: str
    movement_type: str
    quantity: int
    reference_type: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class StockAdjustmentCreate(BaseModel):
    product_id: int
    new_quantity: int
    reason: Optional[str] = None


class StockAdjustmentResponse(BaseModel):
    id: int
    product_name: str
    old_quantity: int
    new_quantity: int
    difference: int
    reason: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
