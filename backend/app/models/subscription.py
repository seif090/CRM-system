from sqlalchemy import Column, Integer, String, Text, DateTime, func, ForeignKey, Float
from ..core.database import Base


class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    billing_cycle = Column(String(50), default="monthly")
    max_users = Column(Integer, default=5)
    max_storage = Column(Integer, default=100)
    features = Column(Text, nullable=True)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CustomerSubscription(Base):
    __tablename__ = "customer_subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("subscription_plans.id"), nullable=False)
    status = Column(String(50), default="active")
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=True)
    auto_renew = Column(Integer, default=1)
    payment_method = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
