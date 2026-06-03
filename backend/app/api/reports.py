from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from datetime import datetime, timedelta, date
from typing import Optional
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.sale import Sale
from ..models.purchase import Purchase
from ..models.expense import Expense
from ..models.product import Product
from ..models.user import User

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("/sales")
async def sales_report(
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    group_by: str = "day",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not from_date:
        from_date = date.today() - timedelta(days=30)
    if not to_date:
        to_date = date.today()

    result = await db.execute(
        select(Sale.created_at, Sale.grand_total)
        .where(Sale.created_at >= from_date, Sale.created_at <= to_date + timedelta(days=1))
        .order_by(Sale.created_at)
    )
    rows = result.all()

    total_revenue = sum(r.grand_total for r in rows)
    total_invoices = len(rows)

    daily = {}
    for r in rows:
        day_key = r.created_at.strftime("%Y-%m-%d") if r.created_at else "unknown"
        daily[day_key] = daily.get(day_key, 0) + r.grand_total

    return {
        "total_revenue": total_revenue,
        "total_invoices": total_invoices,
        "average_order": total_revenue / total_invoices if total_invoices else 0,
        "daily_data": [{"date": k, "revenue": v} for k, v in sorted(daily.items())],
    }


@router.get("/summary")
async def full_report(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = date.today()
    first_of_month = today.replace(day=1)

    sales_res = await db.execute(
        select(func.coalesce(func.sum(Sale.grand_total), 0))
        .where(Sale.created_at >= first_of_month)
    )
    monthly_sales = sales_res.scalar() or 0

    sales_count_res = await db.execute(select(func.count(Sale.id)))
    total_sales = sales_count_res.scalar() or 0

    expense_res = await db.execute(
        select(func.coalesce(func.sum(Expense.amount), 0))
        .where(Expense.created_at >= first_of_month)
    )
    monthly_expenses = expense_res.scalar() or 0

    product_count_res = await db.execute(select(func.count(Product.id)))
    total_products = product_count_res.scalar() or 0

    low_stock_res = await db.execute(
        select(func.count(Product.id)).where(Product.quantity_in_stock <= Product.min_stock_level)
    )

    profit = monthly_sales - monthly_expenses

    return {
        "monthly_sales": monthly_sales,
        "monthly_expenses": monthly_expenses,
        "monthly_profit": profit,
        "total_sales": total_sales,
        "total_products": total_products,
        "low_stock": low_stock_res.scalar() or 0,
    }
