from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    notification_type: str
    is_read: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class NotificationTemplateCreate(BaseModel):
    name: str
    title_template: str
    message_template: str
    notification_type: str = "info"
    channel: str = "in_app"
