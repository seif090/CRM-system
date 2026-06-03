from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.purchase import Supplier, Purchase, PurchaseItem
from ..models.product import Product
from ..models.user import User
from ..schemas.purchase import SupplierCreate, SupplierResponse, PurchaseCreate, PurchaseResponse

router = APIRouter(prefix="/api/purchases", tags=["Purchasing"])


@router.get("/suppliers", response_model=List[SupplierResponse])
async def list_suppliers(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Supplier))
    return result.scalars().all()


@router.post("/suppliers", response_model=SupplierResponse)
async def create_supplier(
    data: SupplierCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    supplier = Supplier(**data.model_dump())
    db.add(supplier)
    await db.commit()
    await db.refresh(supplier)
    return supplier


@router.get("/", response_model=List[PurchaseResponse])
async def list_purchases(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Purchase).offset(skip).limit(limit).order_by(Purchase.id.desc())
    )
    return result.scalars().all()


@router.get("/{purchase_id}", response_model=PurchaseResponse)
async def get_purchase(
    purchase_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Purchase).where(Purchase.id == purchase_id))
    purchase = result.scalar_one_or_none()
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    items_result = await db.execute(select(PurchaseItem).where(PurchaseItem.purchase_id == purchase_id))
    purchase.items = items_result.scalars().all()
    return purchase


@router.post("/", response_model=PurchaseResponse)
async def create_purchase(
    data: PurchaseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = datetime.now()
    reference = f"PO-{today.strftime('%Y%m%d%H%M%S')}-{current_user.id}"

    total_amount = sum(item.quantity * item.unit_price for item in data.items)
    due_amount = total_amount - data.paid_amount
    payment_status = "paid" if due_amount <= 0 else "partial" if data.paid_amount > 0 else "pending"

    purchase = Purchase(
        reference_number=reference,
        supplier_id=data.supplier_id,
        supplier_name=data.supplier_name,
        total_amount=total_amount,
        paid_amount=data.paid_amount,
        due_amount=due_amount,
        payment_status=payment_status,
        notes=data.notes,
        created_by=current_user.id,
    )
    db.add(purchase)
    await db.flush()

    for item in data.items:
        po_item = PurchaseItem(
            purchase_id=purchase.id,
            product_id=item.product_id,
            product_name=item.product_name,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.quantity * item.unit_price,
        )
        db.add(po_item)

        if item.product_id:
            prod_result = await db.execute(select(Product).where(Product.id == item.product_id))
            product = prod_result.scalar_one_or_none()
            if product:
                product.quantity_in_stock += item.quantity

    await db.commit()
    await db.refresh(purchase)

    items_result = await db.execute(select(PurchaseItem).where(PurchaseItem.purchase_id == purchase.id))
    purchase.items = items_result.scalars().all()
    return purchase
