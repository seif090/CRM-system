from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.inventory import Warehouse, StockMovement, StockAdjustment
from ..models.product import Product
from ..models.user import User
from ..schemas.inventory import WarehouseCreate, WarehouseResponse, StockMovementResponse, StockAdjustmentCreate, StockAdjustmentResponse

router = APIRouter(prefix="/api/inventory", tags=["Inventory"])


@router.get("/warehouses", response_model=List[WarehouseResponse])
async def list_warehouses(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Warehouse))
    return result.scalars().all()


@router.post("/warehouses", response_model=WarehouseResponse)
async def create_warehouse(
    data: WarehouseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wh = Warehouse(**data.model_dump())
    db.add(wh)
    await db.commit()
    await db.refresh(wh)
    return wh


@router.get("/movements", response_model=List[StockMovementResponse])
async def list_movements(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(StockMovement).offset(skip).limit(limit).order_by(StockMovement.id.desc())
    )
    return result.scalars().all()


@router.post("/adjust", response_model=StockAdjustmentResponse)
async def adjust_stock(
    data: StockAdjustmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Product).where(Product.id == data.product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    old_qty = product.quantity_in_stock
    difference = data.new_quantity - old_qty

    adjustment = StockAdjustment(
        product_id=data.product_id,
        product_name=product.name,
        old_quantity=old_qty,
        new_quantity=data.new_quantity,
        difference=difference,
        reason=data.reason,
        created_by=current_user.id,
    )
    db.add(adjustment)

    movement = StockMovement(
        product_id=data.product_id,
        product_name=product.name,
        movement_type="adjustment",
        quantity=abs(difference),
        reference_type="stock_adjustment",
        notes=data.reason,
        created_by=current_user.id,
    )
    db.add(movement)

    product.quantity_in_stock = data.new_quantity
    await db.commit()
    await db.refresh(adjustment)
    return adjustment
