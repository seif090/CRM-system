from sqlalchemy import Column, Integer, String, DateTime, func, Text
from ..core.database import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), nullable=True)
    whatsapp_opt_in = Column(Integer, default=1)
    address = Column(Text, nullable=True)
    company = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    total_purchases = Column(Integer, default=0)
    total_spent = Column(Integer, default=0)
    status = Column(String(50), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
