from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import datetime
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.gift_cards import GiftCard, GiftCardTransaction
from ..models.user import User
from ..schemas.gift_cards import GiftCardCreate, GiftCardResponse, GiftCardTransactionResponse

router = APIRouter(prefix="/api/gift-cards", tags=["Gift Cards"])


@router.get("/", response_model=List[GiftCardResponse])
async def list_gift_cards(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(GiftCard).order_by(GiftCard.id.desc()))
    return result.scalars().all()


@router.post("/", response_model=GiftCardResponse)
async def create_gift_card(data: GiftCardCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    gc = GiftCard(**data.model_dump(), current_balance=data.initial_balance)
    db.add(gc); await db.commit(); await db.refresh(gc)
    return gc


@router.get("/transactions", response_model=List[GiftCardTransactionResponse])
async def list_transactions(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(GiftCardTransaction).order_by(GiftCardTransaction.id.desc()))
    return result.scalars().all()


@router.post("/{gid}/redeem")
async def redeem(gid: int, amount: float, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(GiftCard).where(GiftCard.id == gid))
    gc = result.scalar_one_or_none()
    if not gc or gc.current_balance < amount: raise HTTPException(400, "Insufficient balance")
    gc.current_balance -= amount
    txn = GiftCardTransaction(gift_card_id=gid, amount=amount, type="redeem")
    db.add(txn); await db.commit()
    return {"status": "ok", "new_balance": gc.current_balance}
