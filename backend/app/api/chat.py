from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.chat import ChatRoom, ChatRoomMember, ChatMessage
from ..models.user import User
from ..schemas.chat import ChatRoomCreate, ChatRoomResponse, ChatMessageCreate, ChatMessageResponse

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.get("/rooms", response_model=List[ChatRoomResponse])
async def list_rooms(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(ChatRoom).join(ChatRoomMember).where(ChatRoomMember.user_id == current_user.id)
        .order_by(ChatRoom.id.desc())
    )
    return result.scalars().all()


@router.post("/rooms", response_model=ChatRoomResponse)
async def create_room(
    data: ChatRoomCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = ChatRoom(
        name=data.name or f"Chat {current_user.id}",
        is_group=1 if len(data.member_ids) > 1 else 0,
        created_by=current_user.id,
    )
    db.add(room)
    await db.flush()
    all_members = list(set(data.member_ids + [current_user.id]))
    for uid in all_members:
        db.add(ChatRoomMember(room_id=room.id, user_id=uid))
    await db.commit()
    await db.refresh(room)
    return room


@router.get("/rooms/{room_id}/messages", response_model=List[ChatMessageResponse])
async def list_messages(
    room_id: int,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(ChatMessage).where(ChatMessage.room_id == room_id)
        .order_by(ChatMessage.id.desc()).offset(skip).limit(limit)
    )
    msgs = result.scalars().all()
    msgs.reverse()
    return msgs


@router.post("/messages", response_model=ChatMessageResponse)
async def send_message(
    data: ChatMessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    msg = ChatMessage(room_id=data.room_id, sender_id=current_user.id,
                      message=data.message, message_type=data.message_type)
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg
