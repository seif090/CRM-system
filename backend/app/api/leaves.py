from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import date
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.leave import LeaveType, LeaveRequest
from ..models.employee import Employee
from ..models.user import User
from ..schemas.leave import LeaveTypeCreate, LeaveTypeResponse, LeaveRequestCreate, LeaveRequestResponse

router = APIRouter(prefix="/api/leaves", tags=["Leaves"])


@router.get("/types", response_model=List[LeaveTypeResponse])
async def list_leave_types(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(LeaveType))
    return result.scalars().all()


@router.post("/types", response_model=LeaveTypeResponse)
async def create_leave_type(
    data: LeaveTypeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lt = LeaveType(**data.model_dump())
    db.add(lt)
    await db.commit()
    await db.refresh(lt)
    return lt


@router.get("/", response_model=List[LeaveRequestResponse])
async def list_leave_requests(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(LeaveRequest).order_by(LeaveRequest.id.desc()))
    return result.scalars().all()


@router.post("/", response_model=LeaveRequestResponse)
async def create_leave_request(
    data: LeaveRequestCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    emp_result = await db.execute(select(Employee).where(Employee.id == data.employee_id))
    employee = emp_result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    leave_type_name = None
    if data.leave_type_id:
        lt_result = await db.execute(select(LeaveType).where(LeaveType.id == data.leave_type_id))
        lt = lt_result.scalar_one_or_none()
        leave_type_name = lt.name if lt else None

    total_days = (data.end_date - data.start_date).days + 1

    req = LeaveRequest(
        employee_id=data.employee_id,
        leave_type_id=data.leave_type_id,
        leave_type_name=leave_type_name,
        start_date=data.start_date,
        end_date=data.end_date,
        total_days=total_days,
        reason=data.reason,
    )
    db.add(req)
    await db.commit()
    await db.refresh(req)
    return req


@router.put("/{request_id}/status")
async def approve_leave(
    request_id: int,
    status: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(LeaveRequest).where(LeaveRequest.id == request_id))
    req = result.scalar_one_or_none()
    if not req:
        raise HTTPException(status_code=404, detail="Leave request not found")
    req.status = status
    req.approved_by = current_user.id
    await db.commit()
    return {"status": "ok"}
