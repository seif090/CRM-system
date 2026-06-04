from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import datetime, timedelta
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.recurring_invoice import RecurringInvoice, GeneratedInvoice
from ..models.user import User
from ..schemas.recurring_invoice import RecurringInvoiceCreate, RecurringInvoiceResponse, GeneratedInvoiceResponse

router = APIRouter(prefix="/api/recurring-invoices", tags=["Recurring Invoices"])


def calc_next_date(freq: str, interval: int, from_date: datetime) -> datetime:
    if freq == "daily": return from_date + timedelta(days=interval)
    if freq == "weekly": return from_date + timedelta(weeks=interval)
    if freq == "monthly": return from_date + timedelta(days=30 * interval)
    if freq == "yearly": return from_date + timedelta(days=365 * interval)
    return from_date + timedelta(days=30)


@router.get("/", response_model=List[RecurringInvoiceResponse])
async def list_recurring(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(RecurringInvoice).order_by(RecurringInvoice.id.desc()))
    return result.scalars().all()


@router.post("/", response_model=RecurringInvoiceResponse)
async def create_recurring(data: RecurringInvoiceCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    next_date = calc_next_date(data.frequency, data.interval_value, data.start_date)
    inv = RecurringInvoice(**data.model_dump(), next_date=next_date, created_by=current_user.id)
    db.add(inv); await db.commit(); await db.refresh(inv)
    return inv


@router.get("/generated", response_model=List[GeneratedInvoiceResponse])
async def list_generated(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(GeneratedInvoice).order_by(GeneratedInvoice.id.desc()))
    return result.scalars().all()


@router.post("/{rid}/generate")
async def generate_now(rid: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(RecurringInvoice).where(RecurringInvoice.id == rid))
    inv = result.scalar_one_or_none()
    if not inv: raise HTTPException(404)
    gi = GeneratedInvoice(recurring_id=rid, invoice_id=0, generated_date=datetime.now())
    db.add(gi)
    inv.next_date = calc_next_date(inv.frequency, inv.interval_value, datetime.now())
    await db.commit()
    return {"status": "ok", "message": "Invoice generated"}
