from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from ..core.base import Base


class MembershipPlan(Base):
    __tablename__ = "membership_plans"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    price = Column(Float, default=0)
    duration_days = Column(Integer, default=30)
    benefits = Column(Text)
    max_visits = Column(Integer, default=0)
    is_active = Column(Integer, default=1)


class Member(Base):
    __tablename__ = "members"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    plan_id = Column(Integer, ForeignKey("membership_plans.id"))
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    status = Column(String(20), default="active")
    auto_renew = Column(Integer, default=1)


class MembershipVisit(Base):
    __tablename__ = "membership_visits"
    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"))
    visit_date = Column(DateTime(timezone=True))
    notes = Column(Text)
