from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.memberships import MembershipPlan, Member, MembershipVisit
from ..models.user import User
from ..schemas.memberships import MembershipPlanCreate, MembershipPlanResponse, MemberCreate, MemberResponse, MembershipVisitResponse

router = APIRouter(prefix="/api/memberships", tags=["Memberships"])


@router.get("/plans", response_model=List[MembershipPlanResponse])
async def list_plans(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(MembershipPlan).order_by(MembershipPlan.price))
    return result.scalars().all()


@router.post("/plans", response_model=MembershipPlanResponse)
async def create_plan(data: MembershipPlanCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    plan = MembershipPlan(**data.model_dump())
    db.add(plan); await db.commit(); await db.refresh(plan)
    return plan


@router.get("/members", response_model=List[MemberResponse])
async def list_members(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Member).order_by(Member.id.desc()))
    return result.scalars().all()


@router.post("/members", response_model=MemberResponse)
async def create_member(data: MemberCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    member = Member(**data.model_dump())
    db.add(member); await db.commit(); await db.refresh(member)
    return member


@router.get("/visits", response_model=List[MembershipVisitResponse])
async def list_visits(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(MembershipVisit).order_by(MembershipVisit.id.desc()))
    return result.scalars().all()
