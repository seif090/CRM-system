from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.accounting import Account
from ..models.user import User
from ..schemas.accounting import AccountCreate, AccountResponse

router = APIRouter(prefix="/api/accounting", tags=["Accounting"])


@router.get("/accounts", response_model=List[AccountResponse])
async def list_accounts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Account).order_by(Account.code))
    return result.scalars().all()


@router.post("/accounts", response_model=AccountResponse)
async def create_account(
    data: AccountCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Account).where(Account.code == data.code))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Account code already exists")
    account = Account(**data.model_dump())
    db.add(account)
    await db.commit()
    await db.refresh(account)
    return account
