from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..core.base import Base


class ServiceRequest(Base):
    __tablename__ = "service_requests"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    title = Column(String(200), nullable=False)
    description = Column(Text)
    priority = Column(String(20), default="medium")
    status = Column(String(20), default="open")
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class WorkOrder(Base):
    __tablename__ = "work_orders"
    id = Column(Integer, primary_key=True, index=True)
    service_request_id = Column(Integer, ForeignKey("service_requests.id"))
    description = Column(Text)
    scheduled_date = Column(DateTime(timezone=True))
    completed_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(20), default="pending")
    technician_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ServiceSchedule(Base):
    __tablename__ = "service_schedules"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    service_type = Column(String(100))
    frequency = Column(String(50))
    start_date = Column(DateTime(timezone=True))
    next_date = Column(DateTime(timezone=True))
    status = Column(String(20), default="active")
