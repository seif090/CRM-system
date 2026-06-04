from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..core.base import Base


class TaxCode(Base):
    __tablename__ = "tax_codes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    rate = Column(Float, default=0)
    type = Column(String(20), default="sales")
    is_active = Column(Integer, default=1)


class TaxReturn(Base):
    __tablename__ = "tax_returns"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200))
    period_start = Column(DateTime(timezone=True))
    period_end = Column(DateTime(timezone=True))
    total_sales_tax = Column(Float, default=0)
    total_purchase_tax = Column(Float, default=0)
    net_due = Column(Float, default=0)
    status = Column(String(20), default="draft")
    filed_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
