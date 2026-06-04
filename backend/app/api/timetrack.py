from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from datetime import date
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.timetrack import TimeEntry
from ..models.user import User
from ..schemas.timetrack import TimeEntryCreate, TimeEntryResponse

router = APIRouter(prefix="/api/time-track", tags=["Time Tracking"])


@router.get("/", response_model=List[TimeEntryResponse])
async def list_entries(
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    user_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(TimeEntry)
    if user_id:
        query = query.where(TimeEntry.user_id == user_id)
    else:
        query = query.where(TimeEntry.user_id == current_user.id)
    if from_date:
        query = query.where(TimeEntry.date >= from_date)
    if to_date:
        query = query.where(TimeEntry.date <= to_date)
    query = query.offset(skip).limit(limit).order_by(TimeEntry.date.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=TimeEntryResponse)
async def create_entry(
    data: TimeEntryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = TimeEntry(**data.model_dump(), user_id=current_user.id)
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.get("/summary")
async def time_summary(
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(func.coalesce(func.sum(TimeEntry.duration_minutes), 0))
    query = query.where(TimeEntry.user_id == current_user.id)
    if from_date:
        query = query.where(TimeEntry.date >= from_date)
    if to_date:
        query = query.where(TimeEntry.date <= to_date)
    result = await db.execute(query)
    total = result.scalar() or 0
    return {
        "total_minutes": total,
        "total_hours": round(total / 60, 1),
    }
