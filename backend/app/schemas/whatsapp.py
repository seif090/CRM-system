from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class WhatsAppSendMessage(BaseModel):
    customer_phone: str
    message: str
    message_type: str = "text"


class WhatsAppTemplateCreate(BaseModel):
    name: str
    category: Optional[str] = None
    content: str
    variables: Optional[str] = None


class WhatsAppMessageResponse(BaseModel):
    id: int
    customer_id: Optional[int] = None
    customer_phone: str
    direction: str
    message_type: str
    content: Optional[str] = None
    status: str
    ai_responded: int
    ai_response: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
