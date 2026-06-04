from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.feedback import FeedbackForm, FeedbackResponse
from ..models.user import User
from ..schemas.feedback import (
    FeedbackFormCreate, FeedbackFormResponse,
    FeedbackResponseCreate, FeedbackResponseOut,
)

router = APIRouter(prefix="/api/feedback", tags=["Feedback"])


@router.get("/forms", response_model=List[FeedbackFormResponse])
async def list_forms(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(FeedbackForm).order_by(FeedbackForm.id.desc()))
    return result.scalars().all()


@router.post("/forms", response_model=FeedbackFormResponse)
async def create_form(
    data: FeedbackFormCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    form = FeedbackForm(**data.model_dump(), created_by=current_user.id)
    db.add(form)
    await db.commit()
    await db.refresh(form)
    return form


@router.get("/responses", response_model=List[FeedbackResponseOut])
async def list_responses(
    form_id: int = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(FeedbackResponse)
    if form_id:
        query = query.where(FeedbackResponse.form_id == form_id)
    query = query.order_by(FeedbackResponse.id.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/responses", response_model=FeedbackResponseOut)
async def submit_response(
    data: FeedbackResponseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resp = FeedbackResponse(**data.model_dump())
    db.add(resp)
    await db.commit()
    await db.refresh(resp)
    return resp
