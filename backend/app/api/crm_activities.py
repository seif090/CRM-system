from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.crm_activities import CallLog, Meeting, CRMNote
from ..models.user import User
from ..schemas.crm_activities import CallLogCreate, CallLogResponse, MeetingCreate, MeetingResponse, CRMNoteResponse

router = APIRouter(prefix="/api/crm-activities", tags=["CRM Activities"])


@router.get("/calls", response_model=List[CallLogResponse])
async def list_calls(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(CallLog).order_by(CallLog.id.desc()))
    return result.scalars().all()


@router.post("/calls", response_model=CallLogResponse)
async def create_call(data: CallLogCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    call = CallLog(**data.model_dump(), employee_id=current_user.id)
    db.add(call); await db.commit(); await db.refresh(call)
    return call


@router.get("/meetings", response_model=List[MeetingResponse])
async def list_meetings(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Meeting).order_by(Meeting.id.desc()))
    return result.scalars().all()


@router.post("/meetings", response_model=MeetingResponse)
async def create_meeting(data: MeetingCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    mtg = Meeting(**data.model_dump(), employee_id=current_user.id)
    db.add(mtg); await db.commit(); await db.refresh(mtg)
    return mtg


@router.get("/notes", response_model=List[CRMNoteResponse])
async def list_notes(customer_id: int = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = select(CRMNote)
    if customer_id: query = query.where(CRMNote.customer_id == customer_id)
    query = query.order_by(CRMNote.id.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/notes", response_model=CRMNoteResponse)
async def create_note(customer_id: int, content: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = CRMNote(customer_id=customer_id, content=content, employee_id=current_user.id)
    db.add(note); await db.commit(); await db.refresh(note)
    return note
