from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.knowledge import KnowledgeCategory, KnowledgeArticle
from ..models.user import User
from ..schemas.knowledge import (
    KnowledgeCategoryCreate, KnowledgeCategoryResponse,
    KnowledgeArticleCreate, KnowledgeArticleResponse,
)

router = APIRouter(prefix="/api/knowledge", tags=["Knowledge Base"])


@router.get("/categories", response_model=List[KnowledgeCategoryResponse])
async def list_categories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(KnowledgeCategory).order_by(KnowledgeCategory.name))
    return result.scalars().all()


@router.post("/categories", response_model=KnowledgeCategoryResponse)
async def create_category(
    data: KnowledgeCategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cat = KnowledgeCategory(**data.model_dump())
    db.add(cat)
    await db.commit()
    await db.refresh(cat)
    return cat


@router.get("/articles", response_model=List[KnowledgeArticleResponse])
async def list_articles(
    category_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(KnowledgeArticle)
    if category_id:
        query = query.where(KnowledgeArticle.category_id == category_id)
    query = query.order_by(KnowledgeArticle.id.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/articles", response_model=KnowledgeArticleResponse)
async def create_article(
    data: KnowledgeArticleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    article = KnowledgeArticle(**data.model_dump(), created_by=current_user.id)
    db.add(article)
    await db.commit()
    await db.refresh(article)
    return article


@router.get("/articles/{article_id}", response_model=KnowledgeArticleResponse)
async def get_article(
    article_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(KnowledgeArticle).where(KnowledgeArticle.id == article_id))
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(404, "Article not found")
    article.views = (article.views or 0) + 1
    await db.commit()
    await db.refresh(article)
    return article
