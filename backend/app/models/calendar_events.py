from sqlalchemy import Column, Integer, String, Text, DateTime, func, ForeignKey
from ..core.database import Base


class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    event_type = Column(String(50), default="meeting")
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=True)
    all_day = Column(Integer, default=0)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    related_to = Column(String(100), nullable=True)
    related_id = Column(Integer, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    color = Column(String(50), default="#1976d2")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
