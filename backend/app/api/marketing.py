from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.marketing import Campaign, MarketingLead, EmailCampaign
from ..models.user import User
from ..schemas.marketing import CampaignCreate, CampaignResponse, MarketingLeadCreate, MarketingLeadResponse

router = APIRouter(prefix="/api/marketing", tags=["Marketing"])


@router.get("/campaigns", response_model=List[CampaignResponse])
async def list_campaigns(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Campaign).order_by(Campaign.id.desc()))
    return result.scalars().all()


@router.post("/campaigns", response_model=CampaignResponse)
async def create_campaign(data: CampaignCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    camp = Campaign(**data.model_dump(), created_by=current_user.id)
    db.add(camp); await db.commit(); await db.refresh(camp)
    return camp


@router.get("/leads", response_model=List[MarketingLeadResponse])
async def list_leads(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(MarketingLead).order_by(MarketingLead.id.desc()))
    return result.scalars().all()


@router.post("/leads", response_model=MarketingLeadResponse)
async def create_lead(data: MarketingLeadCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    lead = MarketingLead(**data.model_dump())
    db.add(lead); await db.commit(); await db.refresh(lead)
    return lead


@router.put("/leads/{lid}/score")
async def update_lead_score(lid: int, score: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(MarketingLead).where(MarketingLead.id == lid))
    lead = result.scalar_one_or_none()
    if not lead: raise HTTPException(404)
    lead.score = score; await db.commit()
    return {"status": "ok"}
