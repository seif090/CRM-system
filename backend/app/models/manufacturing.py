from sqlalchemy import Column, Integer, String, Text, DateTime, func, ForeignKey, Float
from ..core.database import Base


class BillOfMaterial(Base):
    __tablename__ = "bill_of_materials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Float, default=1)
    notes = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class BOMItem(Base):
    __tablename__ = "bom_items"

    id = Column(Integer, primary_key=True, index=True)
    bom_id = Column(Integer, ForeignKey("bill_of_materials.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Float, nullable=False)
    unit_cost = Column(Float, default=0)


class ProductionOrder(Base):
    __tablename__ = "production_orders"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(100), nullable=False)
    bom_id = Column(Integer, ForeignKey("bill_of_materials.id"), nullable=False)
    quantity = Column(Float, nullable=False)
    status = Column(String(50), default="draft")
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
