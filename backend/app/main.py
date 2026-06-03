from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .core.config import settings
from .core.database import engine, Base, async_session_factory
from sqlalchemy import select
from .api import routers
from .models.user import User


async def seed_if_empty():
    """Auto-seed demo data if database is empty."""
    try:
        async with async_session_factory() as db:
            result = await db.execute(select(User).limit(1))
            if not result.scalar_one_or_none():
                from .seed_demo import seed
                await seed()
    except Exception as e:
        print(f"Seed check skipped: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await seed_if_empty()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in routers:
    app.include_router(router)


@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.VERSION,
    }
