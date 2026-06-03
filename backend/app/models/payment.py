from sqlalchemy import Column, Integer, String, Text, DateTime, func, ForeignKey
from ..core.database import Base


class PaymentGateway(Base):
    __tablename__ = "payment_gateways"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    provider = Column(String(100), nullable=False)
    api_key = Column(String(500), nullable=True)
    api_secret = Column(String(500), nullable=True)
    is_active = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"), nullable=True)
    gateway_id = Column(Integer, ForeignKey("payment_gateways.id"), nullable=True)
    amount = Column(Integer, nullable=False)
    currency = Column(String(10), default="EGP")
    status = Column(String(50), default="pending")
    transaction_id = Column(String(255), nullable=True)
    payment_data = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
