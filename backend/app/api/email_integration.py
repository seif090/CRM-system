from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.email_config import EmailConfig, EmailTemplate, EmailLog
from ..models.user import User
from ..schemas.email_config import EmailConfigCreate, EmailConfigResponse, EmailTemplateCreate, EmailTemplateResponse, EmailSend

router = APIRouter(prefix="/api/email", tags=["Email"])


@router.get("/config", response_model=List[EmailConfigResponse])
async def list_configs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(EmailConfig))
    return result.scalars().all()


@router.post("/config", response_model=EmailConfigResponse)
async def create_config(
    data: EmailConfigCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    config = EmailConfig(**data.model_dump())
    db.add(config)
    await db.commit()
    await db.refresh(config)
    return config


@router.get("/templates", response_model=List[EmailTemplateResponse])
async def list_templates(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(EmailTemplate))
    return result.scalars().all()


@router.post("/templates", response_model=EmailTemplateResponse)
async def create_template(
    data: EmailTemplateCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    template = EmailTemplate(**data.model_dump())
    db.add(template)
    await db.commit()
    await db.refresh(template)
    return template


@router.post("/send")
async def send_email(
    data: EmailSend,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    log = EmailLog(recipient=data.recipient, subject=data.subject, status="sent")
    db.add(log)
    await db.commit()
    return {"status": "queued", "recipient": data.recipient}


@router.get("/logs")
async def list_email_logs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(EmailLog).order_by(EmailLog.id.desc()).limit(50))
    return result.scalars().all()
