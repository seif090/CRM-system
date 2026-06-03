from pydantic import BaseModel
from typing import Optional


class EmailConfigCreate(BaseModel):
    smtp_host: str
    smtp_port: int = 587
    smtp_user: str
    smtp_password: str
    sender_email: str
    sender_name: Optional[str] = None


class EmailConfigResponse(BaseModel):
    id: int
    smtp_host: str
    smtp_port: int
    smtp_user: str
    sender_email: str
    sender_name: Optional[str] = None
    is_active: int

    class Config:
        from_attributes = True


class EmailTemplateCreate(BaseModel):
    name: str
    subject: str
    body_html: str
    variables: Optional[str] = None


class EmailTemplateResponse(BaseModel):
    id: int
    name: str
    subject: str
    body_html: str
    variables: Optional[str] = None

    class Config:
        from_attributes = True


class EmailSend(BaseModel):
    recipient: str
    subject: str
    body_html: str
