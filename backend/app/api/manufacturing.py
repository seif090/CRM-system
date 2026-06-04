from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from datetime import datetime
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.manufacturing import BillOfMaterial, BOMItem, ProductionOrder
from ..models.user import User
from ..schemas.manufacturing import BOMCreate, BOMResponse, ProductionOrderCreate, ProductionOrderResponse

router = APIRouter(prefix="/api/manufacturing", tags=["Manufacturing"])


@router.get("/boms", response_model=List[BOMResponse])
async def list_boms(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(BillOfMaterial).order_by(BillOfMaterial.id.desc()))
    return result.scalars().all()


@router.post("/boms", response_model=BOMResponse)
async def create_bom(
    data: BOMCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bom = BillOfMaterial(**data.model_dump(), created_by=current_user.id)
    db.add(bom)
    await db.commit()
    await db.refresh(bom)
    return bom


@router.get("/orders", response_model=List[ProductionOrderResponse])
async def list_orders(
    status: str = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(ProductionOrder)
    if status:
        query = query.where(ProductionOrder.status == status)
    query = query.order_by(ProductionOrder.id.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/orders", response_model=ProductionOrderResponse)
async def create_order(
    data: ProductionOrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    max_ref = await db.execute(select(func.count(ProductionOrder.id)))
    count = max_ref.scalar() or 0
    reference = f"MO-{datetime.now().strftime('%Y%m%d')}-{count + 1:04d}"
    order = ProductionOrder(reference=reference, **data.model_dump(), created_by=current_user.id)
    db.add(order)
    await db.commit()
    await db.refresh(order)
    return order


@router.put("/orders/{order_id}/status")
async def update_order_status(
    order_id: int,
    status: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(ProductionOrder).where(ProductionOrder.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(404, "Order not found")
    order.status = status
    await db.commit()
    return {"status": "ok"}
