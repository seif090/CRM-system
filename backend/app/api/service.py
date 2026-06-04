from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.service import ServiceRequest, WorkOrder, ServiceSchedule
from ..models.user import User
from ..schemas.service import ServiceRequestCreate, ServiceRequestResponse, WorkOrderCreate, WorkOrderResponse, ServiceScheduleResponse

router = APIRouter(prefix="/api/service", tags=["Service"])


@router.get("/requests", response_model=List[ServiceRequestResponse])
async def list_requests(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(ServiceRequest).order_by(ServiceRequest.id.desc()))
    return result.scalars().all()


@router.post("/requests", response_model=ServiceRequestResponse)
async def create_request(data: ServiceRequestCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    sr = ServiceRequest(**data.model_dump(), assigned_to=current_user.id)
    db.add(sr); await db.commit(); await db.refresh(sr)
    return sr


@router.get("/work-orders", response_model=List[WorkOrderResponse])
async def list_work_orders(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(WorkOrder).order_by(WorkOrder.id.desc()))
    return result.scalars().all()


@router.post("/work-orders", response_model=WorkOrderResponse)
async def create_work_order(data: WorkOrderCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    wo = WorkOrder(**data.model_dump())
    db.add(wo); await db.commit(); await db.refresh(wo)
    return wo


@router.put("/work-orders/{wid}/status")
async def update_work_order_status(wid: int, status: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(WorkOrder).where(WorkOrder.id == wid))
    wo = result.scalar_one_or_none()
    if not wo: raise HTTPException(404)
    wo.status = status
    if status == "completed": wo.completed_date = __import__('datetime').datetime.now()
    await db.commit()
    return {"status": "ok"}


@router.get("/schedules", response_model=List[ServiceScheduleResponse])
async def list_schedules(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(ServiceSchedule).order_by(ServiceSchedule.id.desc()))
    return result.scalars().all()
