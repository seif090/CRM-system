from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.document import Document, DocumentFolder
from ..models.user import User
from ..schemas.document import (
    DocumentCreate, DocumentResponse,
    DocumentFolderCreate, DocumentFolderResponse,
)

router = APIRouter(prefix="/api/documents", tags=["Documents"])


@router.get("/folders", response_model=List[DocumentFolderResponse])
async def list_folders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(DocumentFolder).order_by(DocumentFolder.name))
    return result.scalars().all()


@router.post("/folders", response_model=DocumentFolderResponse)
async def create_folder(
    data: DocumentFolderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    folder = DocumentFolder(**data.model_dump(), created_by=current_user.id)
    db.add(folder)
    await db.commit()
    await db.refresh(folder)
    return folder


@router.get("/", response_model=List[DocumentResponse])
async def list_documents(
    folder_id: Optional[int] = None,
    related_to: Optional[str] = None,
    related_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Document)
    if folder_id:
        query = query.where(Document.folder_id == folder_id)
    if related_to:
        query = query.where(Document.related_to == related_to, Document.related_id == related_id)
    query = query.offset(skip).limit(limit).order_by(Document.id.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=DocumentResponse)
async def create_document(
    data: DocumentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    doc = Document(**data.model_dump(), created_by=current_user.id)
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc


@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Document).where(Document.id == document_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(404, "Document not found")
    await db.delete(doc)
    await db.commit()
    return {"status": "ok"}
