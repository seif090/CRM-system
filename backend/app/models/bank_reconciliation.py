from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from ..core.base import Base


class BankStatement(Base):
    __tablename__ = "bank_statements"
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"))
    statement_date = Column(DateTime(timezone=True))
    ending_balance = Column(Float, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class StatementLine(Base):
    __tablename__ = "statement_lines"
    id = Column(Integer, primary_key=True, index=True)
    statement_id = Column(Integer, ForeignKey("bank_statements.id"))
    date = Column(DateTime(timezone=True))
    description = Column(String(500))
    reference = Column(String(100))
    amount = Column(Float, default=0)
    reconciled = Column(Integer, default=0)


class Reconciliation(Base):
    __tablename__ = "reconciliations"
    id = Column(Integer, primary_key=True, index=True)
    statement_id = Column(Integer, ForeignKey("bank_statements.id"))
    matched_transactions = Column(Integer, default=0)
    difference = Column(Float, default=0)
    status = Column(String(20), default="draft")
    reconciled_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
