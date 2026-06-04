from sqlalchemy import Column, Integer, String, Text, DateTime, func, ForeignKey
from ..core.database import Base


class KnowledgeCategory(Base):
    __tablename__ = "knowledge_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), default="article")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class KnowledgeArticle(Base):
    __tablename__ = "knowledge_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    category_id = Column(Integer, ForeignKey("knowledge_categories.id"), nullable=True)
    tags = Column(String(500), nullable=True)
    is_published = Column(Integer, default=1)
    views = Column(Integer, default=0)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
