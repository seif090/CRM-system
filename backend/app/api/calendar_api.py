from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.calendar_events import CalendarEvent
from ..models.user import User
from ..schemas.calendar_events import CalendarEventCreate, CalendarEventResponse

router = APIRouter(prefix="/api/calendar", tags=["Calendar"])


@router.get("/", response_model=List[CalendarEventResponse])
async def list_events(
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(CalendarEvent)
    if from_date:
        query = query.where(CalendarEvent.start_time >= from_date)
    if to_date:
        query = query.where(CalendarEvent.start_time <= to_date)
    query = query.order_by(CalendarEvent.start_time.asc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=CalendarEventResponse)
async def create_event(
    data: CalendarEventCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = CalendarEvent(**data.model_dump(), created_by=current_user.id)
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event


@router.put("/{event_id}", response_model=CalendarEventResponse)
async def update_event(
    event_id: int,
    data: CalendarEventCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(CalendarEvent).where(CalendarEvent.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(404, "Event not found")
    for k, v in data.model_dump().items():
        setattr(event, k, v)
    await db.commit()
    await db.refresh(event)
    return event


@router.delete("/{event_id}")
async def delete_event(
    event_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(CalendarEvent).where(CalendarEvent.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(404, "Event not found")
    await db.delete(event)
    await db.commit()
    return {"status": "ok"}
