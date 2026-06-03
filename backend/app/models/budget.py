from sqlalchemy import Column, Integer, String, Text, DateTime, func, ForeignKey, Date
from ..core.database import Base


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    fiscal_year = Column(Integer, nullable=False)
    total_amount = Column(Integer, default=0)
    spent_amount = Column(Integer, default=0)
    status = Column(String(50), default="active")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class BudgetLine(Base):
    __tablename__ = "budget_lines"

    id = Column(Integer, primary_key=True, index=True)
    budget_id = Column(Integer, ForeignKey("budgets.id"), nullable=False)
    category = Column(String(255), nullable=False)
    planned_amount = Column(Integer, default=0)
    spent_amount = Column(Integer, default=0)
    notes = Column(Text, nullable=True)
