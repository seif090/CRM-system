from sqlalchemy import Column, Integer, String, Float, Text, DateTime, func
from ..core.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    sku = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    category_id = Column(Integer, nullable=True)
    unit_price = Column(Integer, nullable=False)
    cost_price = Column(Integer, nullable=True)
    quantity_in_stock = Column(Integer, default=0)
    min_stock_level = Column(Integer, default=0)
    unit = Column(String(50), default="piece")
    barcode = Column(String(255), nullable=True)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
