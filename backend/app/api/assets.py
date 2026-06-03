from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.asset import AssetCategory, Asset, AssetMaintenance
from ..models.user import User
from ..schemas.asset import AssetCategoryCreate, AssetCategoryResponse, AssetCreate, AssetResponse, AssetMaintenanceCreate

router = APIRouter(prefix="/api/assets", tags=["Assets"])


@router.get("/categories", response_model=List[AssetCategoryResponse])
async def list_categories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(AssetCategory))
    return result.scalars().all()


@router.post("/categories", response_model=AssetCategoryResponse)
async def create_category(
    data: AssetCategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cat = AssetCategory(**data.model_dump())
    db.add(cat)
    await db.commit()
    await db.refresh(cat)
    return cat


@router.get("/", response_model=List[AssetResponse])
async def list_assets(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Asset).order_by(Asset.id.desc()))
    return result.scalars().all()


@router.post("/", response_model=AssetResponse)
async def create_asset(
    data: AssetCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    asset = Asset(**data.model_dump())
    if not asset.current_value:
        asset.current_value = asset.purchase_price
    db.add(asset)
    await db.commit()
    await db.refresh(asset)
    return asset


@router.post("/maintenance")
async def add_maintenance(
    data: AssetMaintenanceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    mtn = AssetMaintenance(**data.model_dump())
    db.add(mtn)
    await db.commit()
    await db.refresh(mtn)
    return mtn
