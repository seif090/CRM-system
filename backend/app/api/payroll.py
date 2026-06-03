from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import datetime
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.payroll import Payroll, Bonus, Deduction
from ..models.employee import Employee
from ..models.user import User
from ..schemas.payroll import PayrollCreate, PayrollResponse, BonusCreate, DeductionCreate

router = APIRouter(prefix="/api/payroll", tags=["Payroll"])


@router.get("/", response_model=List[PayrollResponse])
async def list_payrolls(
    month: int = None,
    year: int = None,
    employee_id: int = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Payroll).order_by(Payroll.id.desc())
    if month:
        query = query.where(Payroll.month == month)
    if year:
        query = query.where(Payroll.year == year)
    if employee_id:
        query = query.where(Payroll.employee_id == employee_id)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=PayrollResponse)
async def create_payroll(
    data: PayrollCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    emp_result = await db.execute(select(Employee).where(Employee.id == data.employee_id))
    employee = emp_result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    net = data.basic_salary + data.bonuses + data.overtime - data.deductions

    payroll = Payroll(
        employee_id=data.employee_id,
        employee_name=employee.full_name,
        month=data.month,
        year=data.year,
        basic_salary=data.basic_salary,
        bonuses=data.bonuses,
        deductions=data.deductions,
        overtime=data.overtime,
        net_salary=net,
        notes=data.notes,
    )
    db.add(payroll)
    await db.commit()
    await db.refresh(payroll)
    return payroll


@router.post("/bonuses", response_model=BonusCreate)
async def add_bonus(
    data: BonusCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bonus = Bonus(**data.model_dump())
    db.add(bonus)
    await db.commit()
    await db.refresh(bonus)
    return bonus


@router.post("/deductions", response_model=DeductionCreate)
async def add_deduction(
    data: DeductionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deduction = Deduction(**data.model_dump())
    db.add(deduction)
    await db.commit()
    await db.refresh(deduction)
    return deduction
