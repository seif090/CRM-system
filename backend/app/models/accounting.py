from sqlalchemy import Column, Integer, String, Float, Text, DateTime, func, ForeignKey
from ..core.database import Base


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    account_type = Column(String(50), nullable=False)
    parent_id = Column(Integer, nullable=True)
    balance = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    total_debit = Column(Integer, nullable=False)
    total_credit = Column(Integer, nullable=False)
    entry_date = Column(DateTime(timezone=True), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class JournalLine(Base):
    __tablename__ = "journal_lines"

    id = Column(Integer, primary_key=True, index=True)
    journal_entry_id = Column(Integer, ForeignKey("journal_entries.id"), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    debit = Column(Integer, default=0)
    credit = Column(Integer, default=0)
    description = Column(Text, nullable=True)
