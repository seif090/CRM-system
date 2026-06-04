from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.quality import QualityChecklist, QualityInspection, NonConformance
from ..models.user import User
from ..schemas.quality import QualityChecklistCreate, QualityChecklistResponse, QualityInspectionCreate, QualityInspectionResponse, NonConformanceResponse

router = APIRouter(prefix="/api/quality", tags=["Quality Control"])


@router.get("/checklists", response_model=List[QualityChecklistResponse])
async def list_checklists(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(QualityChecklist).order_by(QualityChecklist.id.desc()))
    return result.scalars().all()


@router.post("/checklists", response_model=QualityChecklistResponse)
async def create_checklist(data: QualityChecklistCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = QualityChecklist(**data.model_dump(), created_by=current_user.id)
    db.add(item); await db.commit(); await db.refresh(item)
    return item


@router.get("/inspections", response_model=List[QualityInspectionResponse])
async def list_inspections(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(QualityInspection).order_by(QualityInspection.id.desc()))
    return result.scalars().all()


@router.post("/inspections", response_model=QualityInspectionResponse)
async def create_inspection(data: QualityInspectionCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    insp = QualityInspection(**data.model_dump())
    db.add(insp); await db.commit(); await db.refresh(insp)
    return insp


@router.get("/non-conformance", response_model=List[NonConformanceResponse])
async def list_nonconformance(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(NonConformance).order_by(NonConformance.id.desc()))
    return result.scalars().all()
