from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.pipeline import PipelineStage, Deal
from ..models.user import User
from ..schemas.pipeline import (
    PipelineStageCreate, PipelineStageResponse,
    DealCreate, DealUpdate, DealResponse,
)

router = APIRouter(prefix="/api/pipeline", tags=["Sales Pipeline"])


@router.get("/stages", response_model=List[PipelineStageResponse])
async def list_stages(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(PipelineStage).order_by(PipelineStage.order))
    return result.scalars().all()


@router.post("/stages", response_model=PipelineStageResponse)
async def create_stage(
    data: PipelineStageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stage = PipelineStage(**data.model_dump())
    db.add(stage)
    await db.commit()
    await db.refresh(stage)
    return stage


@router.get("/deals", response_model=List[DealResponse])
async def list_deals(
    stage_id: int = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Deal)
    if stage_id:
        query = query.where(Deal.stage_id == stage_id)
    query = query.order_by(Deal.id.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/deals", response_model=DealResponse)
async def create_deal(
    data: DealCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deal = Deal(**data.model_dump(), created_by=current_user.id)
    db.add(deal)
    await db.commit()
    await db.refresh(deal)
    return deal


@router.put("/deals/{deal_id}", response_model=DealResponse)
async def update_deal(
    deal_id: int,
    data: DealUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Deal).where(Deal.id == deal_id))
    deal = result.scalar_one_or_none()
    if not deal:
        raise HTTPException(404, "Deal not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(deal, k, v)
    await db.commit()
    await db.refresh(deal)
    return deal


@router.delete("/deals/{deal_id}")
async def delete_deal(
    deal_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Deal).where(Deal.id == deal_id))
    deal = result.scalar_one_or_none()
    if not deal:
        raise HTTPException(404, "Deal not found")
    await db.delete(deal)
    await db.commit()
    return {"status": "ok"}
