from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.batch_serial import BatchNumber, SerialNumber, InventoryTracking
from ..models.user import User
from ..schemas.batch_serial import BatchNumberCreate, BatchNumberResponse, SerialNumberResponse, InventoryTrackingResponse

router = APIRouter(prefix="/api/batch-serial", tags=["Batch & Serial"])


@router.get("/batches", response_model=List[BatchNumberResponse])
async def list_batches(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(BatchNumber).order_by(BatchNumber.id.desc()))
    return result.scalars().all()


@router.post("/batches", response_model=BatchNumberResponse)
async def create_batch(data: BatchNumberCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    b = BatchNumber(**data.model_dump())
    db.add(b); await db.commit(); await db.refresh(b)
    return b


@router.get("/serials", response_model=List[SerialNumberResponse])
async def list_serials(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(SerialNumber).order_by(SerialNumber.id.desc()))
    return result.scalars().all()


@router.post("/serials")
async def create_serial(product_id: int, serial_number: str, batch_id: int = None,
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    s = SerialNumber(product_id=product_id, serial_number=serial_number, batch_id=batch_id)
    db.add(s); await db.commit()
    return {"status": "ok"}


@router.get("/tracking", response_model=List[InventoryTrackingResponse])
async def list_tracking(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(InventoryTracking).order_by(InventoryTracking.id.desc()))
    return result.scalars().all()
