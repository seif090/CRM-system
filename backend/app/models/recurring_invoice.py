from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from ..core.base import Base


class RecurringInvoice(Base):
    __tablename__ = "recurring_invoices"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    template_data = Column(Text)
    frequency = Column(String(50))
    interval_value = Column(Integer, default=1)
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True), nullable=True)
    next_date = Column(DateTime(timezone=True))
    status = Column(String(20), default="active")
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class GeneratedInvoice(Base):
    __tablename__ = "generated_invoices"
    id = Column(Integer, primary_key=True, index=True)
    recurring_id = Column(Integer, ForeignKey("recurring_invoices.id"))
    invoice_id = Column(Integer, ForeignKey("sales.id"))
    generated_date = Column(DateTime(timezone=True))
    status = Column(String(20), default="generated")
