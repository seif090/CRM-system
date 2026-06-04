from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..core.base import Base


class JobPosting(Base):
    __tablename__ = "job_postings"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    department = Column(String(100))
    description = Column(Text)
    requirements = Column(Text)
    status = Column(String(20), default="open")
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Applicant(Base):
    __tablename__ = "applicants"
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("job_postings.id"))
    name = Column(String(200), nullable=False)
    email = Column(String(200))
    phone = Column(String(50))
    resume_url = Column(String(500))
    status = Column(String(20), default="new")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Interview(Base):
    __tablename__ = "interviews"
    id = Column(Integer, primary_key=True, index=True)
    applicant_id = Column(Integer, ForeignKey("applicants.id"))
    interviewer = Column(String(200))
    scheduled_at = Column(DateTime(timezone=True))
    status = Column(String(20), default="scheduled")
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
