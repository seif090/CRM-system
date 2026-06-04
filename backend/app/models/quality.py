from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..core.base import Base


class QualityChecklist(Base):
    __tablename__ = "quality_checklists"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    items = Column(Text)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class QualityInspection(Base):
    __tablename__ = "quality_inspections"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    checklist_id = Column(Integer, ForeignKey("quality_checklists.id"))
    inspector = Column(String(200))
    result = Column(String(20), default="pending")
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class NonConformance(Base):
    __tablename__ = "non_conformance"
    id = Column(Integer, primary_key=True, index=True)
    inspection_id = Column(Integer, ForeignKey("quality_inspections.id"))
    description = Column(Text)
    severity = Column(String(20), default="minor")
    status = Column(String(20), default="open")
    corrective_action = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
