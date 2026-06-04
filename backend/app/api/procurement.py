from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.procurement import PurchaseRequest, PurchaseRequestItem, RFQ, RFQResponse
from ..models.user import User
from ..schemas.procurement import PurchaseRequestCreate, PurchaseRequestResponse, RFQCreate, RFQResponse as RFQResponseSchema

router = APIRouter(prefix="/api/procurement", tags=["Procurement"])


@router.get("/requests", response_model=List[PurchaseRequestResponse])
async def list_requests(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(PurchaseRequest).order_by(PurchaseRequest.id.desc()))
    return result.scalars().all()


@router.post("/requests", response_model=PurchaseRequestResponse)
async def create_request(data: PurchaseRequestCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    pr = PurchaseRequest(**data.model_dump())
    db.add(pr); await db.commit(); await db.refresh(pr)
    return pr


@router.put("/requests/{rid}/status")
async def update_request_status(rid: int, status: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(PurchaseRequest).where(PurchaseRequest.id == rid))
    pr = result.scalar_one_or_none()
    if not pr: raise HTTPException(404)
    pr.status = status; await db.commit()
    return {"status": "ok"}


@router.get("/rfqs", response_model=List[RFQResponseSchema])
async def list_rfqs(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(RFQ).order_by(RFQ.id.desc()))
    return result.scalars().all()


@router.post("/rfqs", response_model=RFQResponseSchema)
async def create_rfq(data: RFQCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    rfq = RFQ(**data.model_dump(), created_by=current_user.id)
    db.add(rfq); await db.commit(); await db.refresh(rfq)
    return rfq
