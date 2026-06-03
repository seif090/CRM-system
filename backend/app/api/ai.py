from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from pydantic import BaseModel
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.ai_config import AIConfig, ConversationHistory
from ..models.customer import Customer
from ..models.user import User
from ..services.gemini import GeminiService

router = APIRouter(prefix="/api/ai", tags=["AI"])


class AIResponseRequest(BaseModel):
    customer_phone: str
    message: str


class AIConfigCreate(BaseModel):
    name: str
    prompt_template: str
    model: str = "gemini-2.0-flash"
    temperature: int = 70
    max_tokens: int = 1024


@router.post("/reply")
async def generate_ai_reply(
    data: AIResponseRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    customer_result = await db.execute(
        select(Customer).where(Customer.phone == data.customer_phone)
    )
    customer = customer_result.scalar_one_or_none()

    config_result = await db.execute(
        select(AIConfig).where(AIConfig.is_active == 1).limit(1)
    )
    config = config_result.scalar_one_or_none()

    history_result = await db.execute(
        select(ConversationHistory)
        .where(ConversationHistory.customer_phone == data.customer_phone)
        .order_by(ConversationHistory.created_at.desc())
        .limit(10)
    )
    history = history_result.scalars().all()
    history.reverse()

    prompt_template = config.prompt_template if config else "You are a helpful sales assistant for an ERP system."
    temperature = config.temperature / 100 if config else 0.7
    max_tokens = config.max_tokens if config else 1024

    gemini = GeminiService()
    reply = await gemini.generate_reply(
        customer_name=customer.name if customer else data.customer_phone,
        customer_message=data.message,
        conversation_history=[{"role": h.role, "message": h.message} for h in history],
        prompt_template=prompt_template,
        temperature=temperature,
        max_tokens=max_tokens,
    )

    ai_msg = ConversationHistory(
        customer_id=customer.id if customer else None,
        customer_phone=data.customer_phone,
        role="assistant",
        message=reply,
    )
    db.add(ai_msg)
    await db.commit()

    return {"reply": reply}


@router.post("/config", response_model=AIConfigCreate)
async def create_ai_config(
    data: AIConfigCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    config = AIConfig(
        name=data.name,
        prompt_template=data.prompt_template,
        model=data.model,
        temperature=data.temperature,
        max_tokens=data.max_tokens,
    )
    db.add(config)
    await db.commit()
    await db.refresh(config)
    return data


@router.get("/config", response_model=List[AIConfigCreate])
async def list_ai_configs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(AIConfig))
    return result.scalars().all()
