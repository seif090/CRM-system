from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.recruitment import JobPosting, Applicant, Interview
from ..models.user import User
from ..schemas.recruitment import JobPostingCreate, JobPostingResponse, ApplicantCreate, ApplicantResponse, InterviewCreate, InterviewResponse

router = APIRouter(prefix="/api/recruitment", tags=["Recruitment"])


@router.get("/jobs", response_model=List[JobPostingResponse])
async def list_jobs(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(JobPosting).order_by(JobPosting.id.desc()))
    return result.scalars().all()


@router.post("/jobs", response_model=JobPostingResponse)
async def create_job(data: JobPostingCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = JobPosting(**data.model_dump(), created_by=current_user.id)
    db.add(job); await db.commit(); await db.refresh(job)
    return job


@router.get("/applicants", response_model=List[ApplicantResponse])
async def list_applicants(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Applicant).order_by(Applicant.id.desc()))
    return result.scalars().all()


@router.post("/applicants", response_model=ApplicantResponse)
async def create_applicant(data: ApplicantCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    app = Applicant(**data.model_dump())
    db.add(app); await db.commit(); await db.refresh(app)
    return app


@router.get("/interviews", response_model=List[InterviewResponse])
async def list_interviews(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Interview).order_by(Interview.id.desc()))
    return result.scalars().all()


@router.post("/interviews", response_model=InterviewResponse)
async def create_interview(data: InterviewCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    iv = Interview(**data.model_dump())
    db.add(iv); await db.commit(); await db.refresh(iv)
    return iv


@router.put("/applicants/{aid}/status")
async def update_applicant_status(aid: int, status: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Applicant).where(Applicant.id == aid))
    app = result.scalar_one_or_none()
    if not app: raise HTTPException(404)
    app.status = status; await db.commit()
    return {"status": "ok"}
