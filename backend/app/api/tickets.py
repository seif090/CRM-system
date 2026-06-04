from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.ticket import Ticket, TicketMessage
from ..models.user import User
from ..schemas.ticket import (
    TicketCreate, TicketUpdate, TicketResponse,
    TicketMessageCreate, TicketMessageResponse,
)

router = APIRouter(prefix="/api/tickets", tags=["Support Tickets"])


@router.get("/", response_model=List[TicketResponse])
async def list_tickets(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Ticket)
    if status:
        query = query.where(Ticket.status == status)
    query = query.offset(skip).limit(limit).order_by(Ticket.id.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=TicketResponse)
async def create_ticket(
    data: TicketCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = Ticket(**data.model_dump(), created_by=current_user.id)
    db.add(ticket)
    await db.commit()
    await db.refresh(ticket)
    return ticket


@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket(
    ticket_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(404, "Ticket not found")
    return ticket


@router.put("/{ticket_id}", response_model=TicketResponse)
async def update_ticket(
    ticket_id: int,
    data: TicketUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(404, "Ticket not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(ticket, k, v)
    await db.commit()
    await db.refresh(ticket)
    return ticket


@router.get("/{ticket_id}/messages", response_model=List[TicketMessageResponse])
async def list_messages(
    ticket_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(TicketMessage).where(TicketMessage.ticket_id == ticket_id)
        .order_by(TicketMessage.id.asc())
    )
    return result.scalars().all()


@router.post("/{ticket_id}/messages", response_model=TicketMessageResponse)
async def add_message(
    ticket_id: int,
    data: TicketMessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    msg = TicketMessage(ticket_id=ticket_id, sender_id=current_user.id, **data.model_dump())
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg
