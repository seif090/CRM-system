from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from datetime import date
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.expense import Expense, ExpenseCategory
from ..models.user import User
from ..schemas.expense import ExpenseCreate, ExpenseResponse, ExpenseCategoryCreate, ExpenseCategoryResponse

router = APIRouter(prefix="/api/expenses", tags=["Expenses"])


@router.get("/categories", response_model=List[ExpenseCategoryResponse])
async def list_categories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(ExpenseCategory))
    return result.scalars().all()


@router.post("/categories", response_model=ExpenseCategoryResponse)
async def create_category(
    data: ExpenseCategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    category = ExpenseCategory(**data.model_dump())
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category


@router.get("/", response_model=List[ExpenseResponse])
async def list_expenses(
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    category_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Expense)
    if from_date:
        query = query.where(Expense.created_at >= from_date)
    if to_date:
        query = query.where(Expense.created_at <= to_date)
    if category_id:
        query = query.where(Expense.category_id == category_id)
    query = query.offset(skip).limit(limit).order_by(Expense.id.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=ExpenseResponse)
async def create_expense(
    data: ExpenseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    category_name = None
    if data.category_id:
        cat_result = await db.execute(select(ExpenseCategory).where(ExpenseCategory.id == data.category_id))
        category = cat_result.scalar_one_or_none()
        category_name = category.name if category else None

    expense = Expense(
        category_id=data.category_id,
        category_name=category_name,
        amount=data.amount,
        description=data.description,
        paid_to=data.paid_to,
        payment_method=data.payment_method,
        created_by=current_user.id,
    )
    db.add(expense)
    await db.commit()
    await db.refresh(expense)
    return expense


@router.get("/summary")
async def expense_summary(
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(func.coalesce(func.sum(Expense.amount), 0))
    if from_date:
        query = query.where(Expense.created_at >= from_date)
    if to_date:
        query = query.where(Expense.created_at <= to_date)
    result = await db.execute(query)
    total = result.scalar() or 0
    return {"total_expenses": total}
