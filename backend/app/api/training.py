from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.training import Course, TrainingSession, Enrollment
from ..models.user import User
from ..schemas.training import CourseCreate, CourseResponse, TrainingSessionCreate, TrainingSessionResponse, EnrollmentResponse

router = APIRouter(prefix="/api/training", tags=["Training"])


@router.get("/courses", response_model=List[CourseResponse])
async def list_courses(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Course).order_by(Course.id.desc()))
    return result.scalars().all()


@router.post("/courses", response_model=CourseResponse)
async def create_course(data: CourseCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    course = Course(**data.model_dump(), created_by=current_user.id)
    db.add(course); await db.commit(); await db.refresh(course)
    return course


@router.get("/sessions", response_model=List[TrainingSessionResponse])
async def list_sessions(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(TrainingSession).order_by(TrainingSession.id.desc()))
    return result.scalars().all()


@router.post("/sessions", response_model=TrainingSessionResponse)
async def create_session(data: TrainingSessionCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    sess = TrainingSession(**data.model_dump())
    db.add(sess); await db.commit(); await db.refresh(sess)
    return sess


@router.get("/enrollments", response_model=List[EnrollmentResponse])
async def list_enrollments(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Enrollment).order_by(Enrollment.id.desc()))
    return result.scalars().all()


@router.post("/enrollments", response_model=EnrollmentResponse)
async def create_enrollment(session_id: int, employee_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    enr = Enrollment(session_id=session_id, employee_id=employee_id)
    db.add(enr); await db.commit(); await db.refresh(enr)
    return enr
