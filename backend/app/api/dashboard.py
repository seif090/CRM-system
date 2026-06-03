from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.sale import Sale
from ..models.purchase import Purchase
from ..models.product import Product
from ..models.customer import Customer
from ..models.employee import Employee
from ..models.user import User
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/summary")
async def get_dashboard_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total_sales_result = await db.execute(select(func.count(Sale.id)))
    total_sales = total_sales_result.scalar() or 0

    total_revenue_result = await db.execute(select(func.coalesce(func.sum(Sale.grand_total), 0)))
    total_revenue = total_revenue_result.scalar() or 0

    total_customers_result = await db.execute(select(func.count(Customer.id)))
    total_customers = total_customers_result.scalar() or 0

    total_products_result = await db.execute(select(func.count(Product.id)))
    total_products = total_products_result.scalar() or 0

    low_stock_result = await db.execute(
        select(func.count(Product.id)).where(Product.quantity_in_stock <= Product.min_stock_level)
    )
    low_stock = low_stock_result.scalar() or 0

    total_employees_result = await db.execute(select(func.count(Employee.id)))
    total_employees = total_employees_result.scalar() or 0

    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_sales_result = await db.execute(
        select(func.coalesce(func.sum(Sale.grand_total), 0)).where(Sale.created_at >= today)
    )
    today_sales = today_sales_result.scalar() or 0

    return {
        "total_sales": total_sales,
        "total_revenue": total_revenue,
        "total_customers": total_customers,
        "total_products": total_products,
        "low_stock_products": low_stock,
        "total_employees": total_employees,
        "today_sales": today_sales,
    }
