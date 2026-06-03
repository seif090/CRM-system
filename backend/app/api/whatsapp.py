from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.whatsapp import WhatsAppMessage, WhatsAppTemplate
from ..models.customer import Customer
from ..models.user import User
from ..schemas.whatsapp import WhatsAppSendMessage, WhatsAppTemplateCreate, WhatsAppMessageResponse

router = APIRouter(prefix="/api/whatsapp", tags=["WhatsApp"])


@router.get("/messages", response_model=List[WhatsAppMessageResponse])
async def list_messages(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(WhatsAppMessage).offset(skip).limit(limit).order_by(WhatsAppMessage.id.desc())
    )
    return result.scalars().all()


@router.post("/send", response_model=WhatsAppMessageResponse)
async def send_message(
    data: WhatsAppSendMessage,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    customer_result = await db.execute(
        select(Customer).where(Customer.phone == data.customer_phone)
    )
    customer = customer_result.scalar_one_or_none()

    message = WhatsAppMessage(
        customer_id=customer.id if customer else None,
        customer_phone=data.customer_phone,
        direction="outgoing",
        message_type=data.message_type,
        content=data.message,
        status="sent",
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message


@router.post("/webhook", include_in_schema=False)
async def whatsapp_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    body = await request.json()
    return {"status": "received"}


@router.get("/templates", response_model=List[WhatsAppTemplateCreate])
async def list_templates(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(WhatsAppTemplate))
    return result.scalars().all()


@router.post("/templates", response_model=WhatsAppTemplateCreate)
async def create_template(
    data: WhatsAppTemplateCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    template = WhatsAppTemplate(**data.model_dump())
    db.add(template)
    await db.commit()
    await db.refresh(template)
    return template
