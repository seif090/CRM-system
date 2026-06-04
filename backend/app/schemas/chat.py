from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ChatMessageCreate(BaseModel):
    room_id: int
    message: str
    message_type: str = "text"


class ChatMessageResponse(BaseModel):
    id: int
    room_id: int
    sender_id: int
    message: str
    message_type: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ChatRoomCreate(BaseModel):
    name: Optional[str] = None
    member_ids: List[int]


class ChatRoomResponse(BaseModel):
    id: int
    name: Optional[str] = None
    is_group: int
    created_by: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
