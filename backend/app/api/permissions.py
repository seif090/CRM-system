from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.permission import Role
from ..models.user import User
from ..schemas.permission import RoleCreate, RoleResponse

router = APIRouter(prefix="/api/permissions", tags=["Permissions"])


@router.get("/roles", response_model=List[RoleResponse])
async def list_roles(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Role))
    return result.scalars().all()


@router.post("/roles", response_model=RoleResponse)
async def create_role(
    data: RoleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    role = Role(**data.model_dump())
    db.add(role)
    await db.commit()
    await db.refresh(role)
    return role


@router.get("/my")
async def get_my_permissions(
    current_user: User = Depends(get_current_user),
):
    return {
        "user_id": current_user.id,
        "role": current_user.role,
        "is_superuser": current_user.is_superuser,
    }
