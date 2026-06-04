from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..core.base import Base


class PurchaseRequest(Base):
    __tablename__ = "purchase_requests"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    requestor_id = Column(Integer, ForeignKey("users.id"))
    department = Column(String(100))
    notes = Column(Text)
    status = Column(String(20), default="draft")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PurchaseRequestItem(Base):
    __tablename__ = "purchase_request_items"
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("purchase_requests.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Float, default=1)
    estimated_cost = Column(Float, default=0)
    notes = Column(Text)


class RFQ(Base):
    __tablename__ = "rfqs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    request_id = Column(Integer, ForeignKey("purchase_requests.id"), nullable=True)
    issue_date = Column(DateTime(timezone=True))
    due_date = Column(DateTime(timezone=True))
    status = Column(String(20), default="draft")
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class RFQResponse(Base):
    __tablename__ = "rfq_responses"
    id = Column(Integer, primary_key=True, index=True)
    rfq_id = Column(Integer, ForeignKey("rfqs.id"))
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    total_amount = Column(Float, default=0)
    notes = Column(Text)
    status = Column(String(20), default="pending")
