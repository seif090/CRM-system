from sqlalchemy import Column, Integer, String, Text, DateTime, func, ForeignKey, Float
from ..core.database import Base


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    contract_type = Column(String(50), default="customer")
    party_name = Column(String(255), nullable=False)
    party_phone = Column(String(50), nullable=True)
    amount = Column(Float, default=0)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=True)
    auto_renew = Column(Integer, default=0)
    status = Column(String(50), default="active")
    notes = Column(Text, nullable=True)
    file_url = Column(String(500), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
