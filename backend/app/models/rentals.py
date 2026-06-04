from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from ..core.base import Base


class RentalItem(Base):
    __tablename__ = "rental_items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    sku = Column(String(100))
    daily_rate = Column(Float, default=0)
    weekly_rate = Column(Float, default=0)
    monthly_rate = Column(Float, default=0)
    quantity = Column(Integer, default=1)
    status = Column(String(20), default="available")


class RentalOrder(Base):
    __tablename__ = "rental_orders"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    item_id = Column(Integer, ForeignKey("rental_items.id"))
    quantity = Column(Integer, default=1)
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    total_amount = Column(Float, default=0)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class RentalContract(Base):
    __tablename__ = "rental_contracts"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("rental_orders.id"))
    terms = Column(Text)
    deposit_amount = Column(Float, default=0)
    signed_date = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text)
