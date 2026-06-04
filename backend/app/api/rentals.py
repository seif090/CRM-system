from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.rentals import RentalItem, RentalOrder, RentalContract
from ..models.user import User
from ..schemas.rentals import RentalItemCreate, RentalItemResponse, RentalOrderCreate, RentalOrderResponse, RentalContractResponse

router = APIRouter(prefix="/api/rentals", tags=["Rentals"])


@router.get("/items", response_model=List[RentalItemResponse])
async def list_items(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(RentalItem).order_by(RentalItem.id.desc()))
    return result.scalars().all()


@router.post("/items", response_model=RentalItemResponse)
async def create_item(data: RentalItemCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = RentalItem(**data.model_dump())
    db.add(item); await db.commit(); await db.refresh(item)
    return item


@router.get("/orders", response_model=List[RentalOrderResponse])
async def list_orders(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(RentalOrder).order_by(RentalOrder.id.desc()))
    return result.scalars().all()


@router.post("/orders", response_model=RentalOrderResponse)
async def create_order(data: RentalOrderCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = RentalOrder(**data.model_dump())
    db.add(order); await db.commit(); await db.refresh(order)
    return order


@router.put("/orders/{oid}/status")
async def update_order_status(oid: int, status: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(RentalOrder).where(RentalOrder.id == oid))
    order = result.scalar_one_or_none()
    if not order: raise HTTPException(404)
    order.status = status; await db.commit()
    return {"status": "ok"}


@router.get("/contracts", response_model=List[RentalContractResponse])
async def list_contracts(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(RentalContract).order_by(RentalContract.id.desc()))
    return result.scalars().all()
