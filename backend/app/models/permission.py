from sqlalchemy import Column, Integer, String, Text, DateTime, func
from ..core.database import Base


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    permissions = Column(Text, nullable=True)
    is_system = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
