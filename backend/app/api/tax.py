from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.tax import TaxCode, TaxReturn
from ..models.user import User
from ..schemas.tax import TaxCodeCreate, TaxCodeResponse, TaxReturnCreate, TaxReturnResponse

router = APIRouter(prefix="/api/tax", tags=["Tax"])


@router.get("/codes", response_model=List[TaxCodeResponse])
async def list_tax_codes(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(TaxCode).order_by(TaxCode.name))
    return result.scalars().all()


@router.post("/codes", response_model=TaxCodeResponse)
async def create_tax_code(data: TaxCodeCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    code = TaxCode(**data.model_dump())
    db.add(code); await db.commit(); await db.refresh(code)
    return code


@router.get("/returns", response_model=List[TaxReturnResponse])
async def list_tax_returns(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(TaxReturn).order_by(TaxReturn.id.desc()))
    return result.scalars().all()


@router.post("/returns", response_model=TaxReturnResponse)
async def create_tax_return(data: TaxReturnCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    tr = TaxReturn(**data.model_dump())
    net = data.total_sales_tax - data.total_purchase_tax
    tr.net_due = net
    db.add(tr); await db.commit(); await db.refresh(tr)
    return tr
