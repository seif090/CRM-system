from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class KnowledgeCategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    icon: str = "article"


class KnowledgeCategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    icon: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class KnowledgeArticleCreate(BaseModel):
    title: str
    content: str
    category_id: Optional[int] = None
    tags: Optional[str] = None
    is_published: int = 1


class KnowledgeArticleResponse(BaseModel):
    id: int
    title: str
    content: str
    category_id: Optional[int] = None
    tags: Optional[str] = None
    is_published: int
    views: int
    created_by: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
