from sqlalchemy import Column, Integer, String, Text, DateTime, func
from ..core.database import Base


class AIConfig(Base):
    __tablename__ = "ai_config"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    prompt_template = Column(Text, nullable=False)
    model = Column(String(100), default="gemini-2.0-flash")
    temperature = Column(Integer, default=70)
    max_tokens = Column(Integer, default=1024)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ConversationHistory(Base):
    __tablename__ = "conversation_history"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, nullable=True)
    customer_phone = Column(String(50), nullable=False)
    role = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
