from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..core.database import get_db
from ..models.customer import Customer
from ..models.sale import Sale, SaleItem
from ..models.loyalty import CustomerLoyalty
from ..schemas.customer import CustomerResponse
from ..schemas.sale import SaleResponse

router = APIRouter(prefix="/api/portal", tags=["Customer Portal"])


@router.get("/customer/{phone}")
async def portal_customer_info(
    phone: str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Customer).where(Customer.phone == phone))
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.get("/customer/{phone}/invoices")
async def portal_customer_invoices(
    phone: str,
    db: AsyncSession = Depends(get_db),
):
    customer_result = await db.execute(select(Customer).where(Customer.phone == phone))
    customer = customer_result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    result = await db.execute(
        select(Sale).where(Sale.customer_id == customer.id).order_by(Sale.id.desc()).limit(20)
    )
    return result.scalars().all()


@router.get("/customer/{phone}/loyalty")
async def portal_customer_loyalty(
    phone: str,
    db: AsyncSession = Depends(get_db),
):
    customer_result = await db.execute(select(Customer).where(Customer.phone == phone))
    customer = customer_result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    result = await db.execute(select(CustomerLoyalty).where(CustomerLoyalty.customer_id == customer.id))
    loyalty = result.scalar_one_or_none()
    if not loyalty:
        return {"points": 0, "total_spent": 0}
    return loyalty
