from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from ..core.base import Base


class ReviewCycle(Base):
    __tablename__ = "review_cycles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    status = Column(String(20), default="planned")
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    cycle_id = Column(Integer, ForeignKey("review_cycles.id"))
    employee_id = Column(Integer, ForeignKey("employees.id"))
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer, default=0)
    comments = Column(Text)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PerformanceGoal(Base):
    __tablename__ = "performance_goals"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    title = Column(String(200), nullable=False)
    description = Column(Text)
    target_date = Column(DateTime(timezone=True))
    status = Column(String(20), default="active")
    progress = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ReviewFeedback(Base):
    __tablename__ = "review_feedback"
    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"))
    feedback_giver_id = Column(Integer, ForeignKey("users.id"))
    feedback = Column(Text)
    rating = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
