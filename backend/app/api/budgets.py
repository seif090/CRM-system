from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.budget import Budget, BudgetLine
from ..models.user import User
from ..schemas.budget import BudgetCreate, BudgetResponse, BudgetLineResponse

router = APIRouter(prefix="/api/budgets", tags=["Budgets"])


@router.get("/", response_model=List[BudgetResponse])
async def list_budgets(
    fiscal_year: int = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Budget).order_by(Budget.id.desc())
    if fiscal_year:
        query = query.where(Budget.fiscal_year == fiscal_year)
    result = await db.execute(query)
    budgets = result.scalars().all()
    for b in budgets:
        lines_result = await db.execute(select(BudgetLine).where(BudgetLine.budget_id == b.id))
        b.lines = lines_result.scalars().all()
    return budgets


@router.post("/", response_model=BudgetResponse)
async def create_budget(
    data: BudgetCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total = sum(l.planned_amount for l in data.lines)
    budget = Budget(
        name=data.name,
        fiscal_year=data.fiscal_year,
        total_amount=total,
        notes=data.notes,
    )
    db.add(budget)
    await db.flush()

    for line in data.lines:
        bl = BudgetLine(
            budget_id=budget.id,
            category=line.category,
            planned_amount=line.planned_amount,
        )
        db.add(bl)

    await db.commit()
    await db.refresh(budget)

    lines_result = await db.execute(select(BudgetLine).where(BudgetLine.budget_id == budget.id))
    budget.lines = lines_result.scalars().all()
    return budget
