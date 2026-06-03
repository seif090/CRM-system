from sqlalchemy import Column, Integer, String, Text, DateTime, func, ForeignKey, Date
from ..core.database import Base


class LoyaltyTier(Base):
    __tablename__ = "loyalty_tiers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    min_points = Column(Integer, default=0)
    discount_percent = Column(Integer, default=0)
    benefits = Column(Text, nullable=True)


class CustomerLoyalty(Base):
    __tablename__ = "customer_loyalty"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, unique=True)
    points = Column(Integer, default=0)
    tier_id = Column(Integer, ForeignKey("loyalty_tiers.id"), nullable=True)
    total_spent = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class LoyaltyTransaction(Base):
    __tablename__ = "loyalty_transactions"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    points = Column(Integer, nullable=False)
    type = Column(String(50), nullable=False)
    reference = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(100), unique=True, nullable=False)
    discount_type = Column(String(50), default="percent")
    discount_value = Column(Integer, nullable=False)
    min_purchase = Column(Integer, default=0)
    max_uses = Column(Integer, default=100)
    used_count = Column(Integer, default=0)
    is_active = Column(Integer, default=1)
    expires_at = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
