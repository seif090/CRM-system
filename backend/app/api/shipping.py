from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.shipping import Delivery, DeliveryPerson
from ..models.user import User
from ..schemas.shipping import DeliveryCreate, DeliveryResponse, DeliveryPersonCreate, DeliveryPersonResponse

router = APIRouter(prefix="/api/shipping", tags=["Shipping"])


@router.get("/persons", response_model=List[DeliveryPersonResponse])
async def list_delivery_persons(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(DeliveryPerson))
    return result.scalars().all()


@router.post("/persons", response_model=DeliveryPersonResponse)
async def create_delivery_person(
    data: DeliveryPersonCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    person = DeliveryPerson(**data.model_dump())
    db.add(person)
    await db.commit()
    await db.refresh(person)
    return person


@router.get("/", response_model=List[DeliveryResponse])
async def list_deliveries(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Delivery).order_by(Delivery.id.desc()))
    return result.scalars().all()


@router.post("/", response_model=DeliveryResponse)
async def create_delivery(
    data: DeliveryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    delivery = Delivery(**data.model_dump())
    db.add(delivery)
    await db.commit()
    await db.refresh(delivery)
    return delivery


@router.put("/{delivery_id}/status")
async def update_delivery_status(
    delivery_id: int,
    status: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Delivery).where(Delivery.id == delivery_id))
    delivery = result.scalar_one_or_none()
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found")
    delivery.status = status
    await db.commit()
    return {"status": "ok"}
