from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.product import Product, Category
from ..models.customer import Customer
from ..models.user import User
from ..schemas.product import ProductResponse
from ..schemas.customer import CustomerResponse

router = APIRouter(prefix="/api/pos", tags=["POS"])


@router.get("/products")
async def pos_products(
    search: str = None,
    category_id: int = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Product).where(Product.is_active == 1, Product.quantity_in_stock > 0)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))
    if category_id:
        query = query.where(Product.category_id == category_id)
    query = query.limit(50)
    result = await db.execute(query)
    products = result.scalars().all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "sku": p.sku,
            "unit_price": p.unit_price,
            "quantity_in_stock": p.quantity_in_stock,
            "unit": p.unit,
            "barcode": p.barcode,
        }
        for p in products
    ]


@router.get("/customers")
async def pos_customers(
    search: str = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Customer).where(Customer.status == "active")
    if search:
        query = query.where(Customer.name.ilike(f"%{search}%") | Customer.phone.ilike(f"%{search}%"))
    query = query.limit(20)
    result = await db.execute(query)
    customers = result.scalars().all()
    return [
        {"id": c.id, "name": c.name, "phone": c.phone}
        for c in customers
    ]
