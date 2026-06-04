from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class DocumentFolderCreate(BaseModel):
    name: str
    parent_id: Optional[int] = None


class DocumentFolderResponse(BaseModel):
    id: int
    name: str
    parent_id: Optional[int] = None
    created_by: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DocumentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    file_name: str
    file_type: Optional[str] = None
    file_size: int = 0
    folder_id: Optional[int] = None
    related_to: Optional[str] = None
    related_id: Optional[int] = None


class DocumentResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    file_name: str
    file_type: Optional[str] = None
    file_size: int
    folder_id: Optional[int] = None
    related_to: Optional[str] = None
    related_id: Optional[int] = None
    created_by: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
