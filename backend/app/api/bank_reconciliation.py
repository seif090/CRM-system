from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.bank_reconciliation import BankStatement, StatementLine, Reconciliation
from ..models.user import User
from ..schemas.bank_reconciliation import BankStatementCreate, BankStatementResponse, StatementLineResponse, ReconciliationResponse

router = APIRouter(prefix="/api/bank-rec", tags=["Bank Reconciliation"])


@router.get("/statements", response_model=List[BankStatementResponse])
async def list_statements(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(BankStatement).order_by(BankStatement.id.desc()))
    return result.scalars().all()


@router.post("/statements", response_model=BankStatementResponse)
async def create_statement(data: BankStatementCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = BankStatement(**data.model_dump())
    db.add(stmt); await db.commit(); await db.refresh(stmt)
    return stmt


@router.get("/reconciliations", response_model=List[ReconciliationResponse])
async def list_reconciliations(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Reconciliation).order_by(Reconciliation.id.desc()))
    return result.scalars().all()


@router.post("/reconciliations", response_model=ReconciliationResponse)
async def create_reconciliation(statement_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    rec = Reconciliation(statement_id=statement_id, reconciled_by=current_user.id)
    db.add(rec); await db.commit(); await db.refresh(rec)
    return rec
