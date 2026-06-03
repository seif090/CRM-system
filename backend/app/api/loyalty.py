from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.loyalty import LoyaltyTier, CustomerLoyalty, LoyaltyTransaction, Coupon
from ..models.customer import Customer
from ..models.user import User
from ..schemas.loyalty import LoyaltyTierCreate, LoyaltyTierResponse, CustomerLoyaltyResponse, CouponCreate, CouponResponse

router = APIRouter(prefix="/api/loyalty", tags=["Loyalty"])


@router.get("/tiers", response_model=List[LoyaltyTierResponse])
async def list_tiers(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(LoyaltyTier))
    return result.scalars().all()


@router.post("/tiers", response_model=LoyaltyTierResponse)
async def create_tier(
    data: LoyaltyTierCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tier = LoyaltyTier(**data.model_dump())
    db.add(tier)
    await db.commit()
    await db.refresh(tier)
    return tier


@router.get("/customers/{customer_id}", response_model=CustomerLoyaltyResponse)
async def get_customer_loyalty(
    customer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(CustomerLoyalty).where(CustomerLoyalty.customer_id == customer_id))
    loyalty = result.scalar_one_or_none()
    if not loyalty:
        result = await db.execute(select(Customer).where(Customer.id == customer_id))
        customer = result.scalar_one_or_none()
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        loyalty = CustomerLoyalty(customer_id=customer_id)
        db.add(loyalty)
        await db.commit()
        await db.refresh(loyalty)
    return loyalty


@router.get("/coupons", response_model=List[CouponResponse])
async def list_coupons(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Coupon).order_by(Coupon.id.desc()))
    return result.scalars().all()


@router.post("/coupons", response_model=CouponResponse)
async def create_coupon(
    data: CouponCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    coupon = Coupon(**data.model_dump())
    db.add(coupon)
    await db.commit()
    await db.refresh(coupon)
    return coupon
