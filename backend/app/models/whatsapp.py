from sqlalchemy import Column, Integer, String, Text, DateTime, func, ForeignKey
from ..core.database import Base


class WhatsAppMessage(Base):
    __tablename__ = "whatsapp_messages"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    customer_phone = Column(String(50), nullable=False)
    direction = Column(String(10), nullable=False)
    message_type = Column(String(50), default="text")
    content = Column(Text, nullable=True)
    media_url = Column(String(500), nullable=True)
    status = Column(String(50), default="sent")
    ai_responded = Column(Integer, default=0)
    ai_response = Column(Text, nullable=True)
    ai_confidence = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class WhatsAppTemplate(Base):
    __tablename__ = "whatsapp_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=True)
    content = Column(Text, nullable=False)
    variables = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
