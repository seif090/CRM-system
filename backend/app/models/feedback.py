from sqlalchemy import Column, Integer, String, Text, DateTime, func, ForeignKey
from ..core.database import Base


class FeedbackForm(Base):
    __tablename__ = "feedback_forms"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    questions = Column(Text, nullable=True)
    is_active = Column(Integer, default=1)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class FeedbackResponse(Base):
    __tablename__ = "feedback_responses"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("feedback_forms.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    response_data = Column(Text, nullable=True)
    rating = Column(Integer, default=5)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
