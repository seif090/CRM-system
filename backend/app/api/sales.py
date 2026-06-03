from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from datetime import datetime, date
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.sale import Sale, SaleItem
from ..models.product import Product
from ..models.customer import Customer
from ..models.user import User
from ..schemas.sale import SaleCreate, SaleResponse, SaleItemResponse

router = APIRouter(prefix="/api/sales", tags=["Sales"])


@router.get("/", response_model=List[SaleResponse])
async def list_sales(
    search: Optional[str] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Sale)
    if search:
        query = query.where(
            Sale.invoice_number.ilike(f"%{search}%") |
            Sale.customer_name.ilike(f"%{search}%") |
            Sale.customer_phone.ilike(f"%{search}%")
        )
    if from_date:
        query = query.where(Sale.created_at >= from_date)
    if to_date:
        query = query.where(Sale.created_at <= to_date)
    query = query.offset(skip).limit(limit).order_by(Sale.id.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{sale_id}", response_model=SaleResponse)
async def get_sale(
    sale_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Sale).where(Sale.id == sale_id))
    sale = result.scalar_one_or_none()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    items_result = await db.execute(select(SaleItem).where(SaleItem.sale_id == sale_id))
    sale.items = items_result.scalars().all()
    return sale


@router.post("/", response_model=SaleResponse)
async def create_sale(
    data: SaleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = datetime.now()
    invoice_number = f"INV-{today.strftime('%Y%m%d%H%M%S')}-{current_user.id}"

    total_amount = sum(item.quantity * item.unit_price for item in data.items)
    tax_amount = (total_amount * data.tax) // 100
    grand_total = total_amount - data.discount + tax_amount
    due_amount = grand_total - data.paid_amount

    payment_status = "paid" if due_amount <= 0 else "partial" if data.paid_amount > 0 else "pending"

    sale = Sale(
        invoice_number=invoice_number,
        customer_id=data.customer_id,
        customer_name=data.customer_name,
        customer_phone=data.customer_phone,
        total_amount=total_amount,
        discount=data.discount,
        tax=data.tax,
        grand_total=grand_total,
        paid_amount=data.paid_amount,
        due_amount=due_amount,
        payment_status=payment_status,
        payment_method=data.payment_method,
        notes=data.notes,
        created_by=current_user.id,
    )

    db.add(sale)
    await db.flush()

    for item in data.items:
        sale_item = SaleItem(
            sale_id=sale.id,
            product_id=item.product_id,
            product_name=item.product_name,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.quantity * item.unit_price,
        )
        db.add(sale_item)

        if item.product_id:
            prod_result = await db.execute(select(Product).where(Product.id == item.product_id))
            product = prod_result.scalar_one_or_none()
            if product:
                product.quantity_in_stock -= item.quantity

    if data.customer_id:
        cust_result = await db.execute(select(Customer).where(Customer.id == data.customer_id))
        customer = cust_result.scalar_one_or_none()
        if customer:
            customer.total_purchases += 1
            customer.total_spent += grand_total

    await db.commit()
    await db.refresh(sale)

    items_result = await db.execute(select(SaleItem).where(SaleItem.sale_id == sale.id))
    sale.items = items_result.scalars().all()
    return sale
