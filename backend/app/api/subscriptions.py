from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.subscription import SubscriptionPlan, CustomerSubscription
from ..models.user import User
from ..schemas.subscription import (
    SubscriptionPlanCreate, SubscriptionPlanResponse,
    CustomerSubscriptionCreate, CustomerSubscriptionResponse,
)

router = APIRouter(prefix="/api/subscriptions", tags=["Subscriptions"])


@router.get("/plans", response_model=List[SubscriptionPlanResponse])
async def list_plans(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(SubscriptionPlan).order_by(SubscriptionPlan.price))
    return result.scalars().all()


@router.post("/plans", response_model=SubscriptionPlanResponse)
async def create_plan(
    data: SubscriptionPlanCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan = SubscriptionPlan(**data.model_dump())
    db.add(plan)
    await db.commit()
    await db.refresh(plan)
    return plan


@router.get("/customers", response_model=List[CustomerSubscriptionResponse])
async def list_subscriptions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(CustomerSubscription).order_by(CustomerSubscription.id.desc()))
    return result.scalars().all()


@router.post("/customers", response_model=CustomerSubscriptionResponse)
async def create_subscription(
    data: CustomerSubscriptionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sub = CustomerSubscription(**data.model_dump())
    db.add(sub)
    await db.commit()
    await db.refresh(sub)
    return sub


@router.put("/customers/{sub_id}/status")
async def update_subscription_status(
    sub_id: int,
    status: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(CustomerSubscription).where(CustomerSubscription.id == sub_id))
    sub = result.scalar_one_or_none()
    if not sub:
        raise HTTPException(404, "Subscription not found")
    sub.status = status
    await db.commit()
    return {"status": "ok"}
