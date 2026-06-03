from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    name: str
    sku: str
    description: Optional[str] = None
    category_id: Optional[int] = None
    unit_price: int
    cost_price: Optional[int] = None
    quantity_in_stock: int = 0
    min_stock_level: int = 0
    unit: str = "piece"
    barcode: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    unit_price: Optional[int] = None
    cost_price: Optional[int] = None
    quantity_in_stock: Optional[int] = None
    min_stock_level: Optional[int] = None
    unit: Optional[str] = None
    barcode: Optional[str] = None
    is_active: Optional[int] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    description: Optional[str] = None
    category_id: Optional[int] = None
    unit_price: int
    cost_price: Optional[int] = None
    quantity_in_stock: int
    min_stock_level: int
    unit: str
    barcode: Optional[str] = None
    is_active: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
