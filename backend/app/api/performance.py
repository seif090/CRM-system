from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.performance import ReviewCycle, Review, PerformanceGoal
from ..models.user import User
from ..schemas.performance import ReviewCycleCreate, ReviewCycleResponse, ReviewCreate, ReviewResponse, GoalCreate, GoalResponse

router = APIRouter(prefix="/api/performance", tags=["Performance"])


@router.get("/cycles", response_model=List[ReviewCycleResponse])
async def list_cycles(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(ReviewCycle).order_by(ReviewCycle.id.desc()))
    return result.scalars().all()


@router.post("/cycles", response_model=ReviewCycleResponse)
async def create_cycle(data: ReviewCycleCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    cycle = ReviewCycle(**data.model_dump(), created_by=current_user.id)
    db.add(cycle); await db.commit(); await db.refresh(cycle)
    return cycle


@router.get("/reviews", response_model=List[ReviewResponse])
async def list_reviews(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Review).order_by(Review.id.desc()))
    return result.scalars().all()


@router.post("/reviews", response_model=ReviewResponse)
async def create_review(data: ReviewCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    rev = Review(**data.model_dump(), reviewer_id=current_user.id)
    db.add(rev); await db.commit(); await db.refresh(rev)
    return rev


@router.get("/goals", response_model=List[GoalResponse])
async def list_goals(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(PerformanceGoal).order_by(PerformanceGoal.id.desc()))
    return result.scalars().all()


@router.post("/goals", response_model=GoalResponse)
async def create_goal(data: GoalCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = PerformanceGoal(**data.model_dump())
    db.add(goal); await db.commit(); await db.refresh(goal)
    return goal


@router.put("/goals/{gid}/progress")
async def update_goal_progress(gid: int, progress: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(PerformanceGoal).where(PerformanceGoal.id == gid))
    goal = result.scalar_one_or_none()
    if not goal: raise HTTPException(404)
    goal.progress = progress
    if progress >= 100: goal.status = "completed"
    await db.commit()
    return {"status": "ok"}
