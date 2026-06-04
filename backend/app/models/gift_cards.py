from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..core.base import Base


class GiftCard(Base):
    __tablename__ = "gift_cards"
    id = Column(Integer, primary_key=True, index=True)
    card_number = Column(String(100), nullable=False, unique=True)
    initial_balance = Column(Float, default=0)
    current_balance = Column(Float, default=0)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    issue_date = Column(DateTime(timezone=True))
    expiry_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(20), default="active")


class GiftCardTransaction(Base):
    __tablename__ = "gift_card_transactions"
    id = Column(Integer, primary_key=True, index=True)
    gift_card_id = Column(Integer, ForeignKey("gift_cards.id"))
    amount = Column(Float, default=0)
    type = Column(String(20))
    reference_id = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
