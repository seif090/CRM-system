from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.payment import PaymentGateway, PaymentTransaction
from ..models.user import User
from ..schemas.payment import PaymentGatewayCreate, PaymentGatewayResponse, PaymentTransactionResponse

router = APIRouter(prefix="/api/payments", tags=["Payments"])


@router.get("/gateways", response_model=List[PaymentGatewayResponse])
async def list_gateways(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(PaymentGateway))
    return result.scalars().all()


@router.post("/gateways", response_model=PaymentGatewayResponse)
async def create_gateway(
    data: PaymentGatewayCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    gateway = PaymentGateway(**data.model_dump())
    db.add(gateway)
    await db.commit()
    await db.refresh(gateway)
    return gateway


@router.get("/transactions", response_model=List[PaymentTransactionResponse])
async def list_transactions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(PaymentTransaction).order_by(PaymentTransaction.id.desc()))
    return result.scalars().all()
