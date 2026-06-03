from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.audit import AuditLog
from ..models.user import User
from ..schemas.audit import AuditLogResponse

router = APIRouter(prefix="/api/audit", tags=["Audit"])


@router.get("/", response_model=List[AuditLogResponse])
async def list_audit_logs(
    entity_type: Optional[str] = None,
    action: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(AuditLog).order_by(AuditLog.id.desc())
    if entity_type:
        query = query.where(AuditLog.entity_type == entity_type)
    if action:
        query = query.where(AuditLog.action == action)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()
