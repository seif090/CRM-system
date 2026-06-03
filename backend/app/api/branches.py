from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.branch import Branch
from ..models.user import User
from ..schemas.branch import BranchCreate, BranchResponse

router = APIRouter(prefix="/api/branches", tags=["Branches"])


@router.get("/", response_model=List[BranchResponse])
async def list_branches(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Branch))
    return result.scalars().all()


@router.post("/", response_model=BranchResponse)
async def create_branch(
    data: BranchCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    branch = Branch(**data.model_dump())
    db.add(branch)
    await db.commit()
    await db.refresh(branch)
    return branch
