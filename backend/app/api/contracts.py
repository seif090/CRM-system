from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.contract import Contract
from ..models.user import User
from ..schemas.contract import ContractCreate, ContractResponse

router = APIRouter(prefix="/api/contracts", tags=["Contracts"])


@router.get("/", response_model=List[ContractResponse])
async def list_contracts(
    status: Optional[str] = None,
    contract_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Contract)
    if status:
        query = query.where(Contract.status == status)
    if contract_type:
        query = query.where(Contract.contract_type == contract_type)
    query = query.order_by(Contract.id.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=ContractResponse)
async def create_contract(
    data: ContractCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = Contract(**data.model_dump(), created_by=current_user.id)
    db.add(contract)
    await db.commit()
    await db.refresh(contract)
    return contract


@router.put("/{contract_id}", response_model=ContractResponse)
async def update_contract(
    contract_id: int,
    data: ContractCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Contract).where(Contract.id == contract_id))
    contract = result.scalar_one_or_none()
    if not contract:
        raise HTTPException(404, "Contract not found")
    for k, v in data.model_dump().items():
        setattr(contract, k, v)
    await db.commit()
    await db.refresh(contract)
    return contract


@router.delete("/{contract_id}")
async def delete_contract(
    contract_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Contract).where(Contract.id == contract_id))
    contract = result.scalar_one_or_none()
    if not contract:
        raise HTTPException(404, "Contract not found")
    await db.delete(contract)
    await db.commit()
    return {"status": "ok"}
