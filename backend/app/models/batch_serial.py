from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..core.base import Base


class BatchNumber(Base):
    __tablename__ = "batch_numbers"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    batch_number = Column(String(100), nullable=False)
    manufacturing_date = Column(DateTime(timezone=True), nullable=True)
    expiry_date = Column(DateTime(timezone=True), nullable=True)
    quantity = Column(Float, default=0)
    status = Column(String(20), default="active")


class SerialNumber(Base):
    __tablename__ = "serial_numbers"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    serial_number = Column(String(200), nullable=False, unique=True)
    batch_id = Column(Integer, ForeignKey("batch_numbers.id"), nullable=True)
    status = Column(String(20), default="available")
    sale_item_id = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class InventoryTracking(Base):
    __tablename__ = "inventory_tracking"
    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("batch_numbers.id"), nullable=True)
    serial_id = Column(Integer, ForeignKey("serial_numbers.id"), nullable=True)
    movement_type = Column(String(50))
    reference_id = Column(Integer, nullable=True)
    quantity = Column(Float, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
