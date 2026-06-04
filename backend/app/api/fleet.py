from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.fleet import Driver, Vehicle, VehicleMaintenance, FuelLog
from ..models.user import User
from ..schemas.fleet import DriverCreate, DriverResponse, VehicleCreate, VehicleResponse, MaintenanceCreate, MaintenanceResponse, FuelLogResponse

router = APIRouter(prefix="/api/fleet", tags=["Fleet"])


@router.get("/drivers", response_model=List[DriverResponse])
async def list_drivers(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Driver).order_by(Driver.id.desc()))
    return result.scalars().all()


@router.post("/drivers", response_model=DriverResponse)
async def create_driver(data: DriverCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    d = Driver(**data.model_dump())
    db.add(d); await db.commit(); await db.refresh(d)
    return d


@router.get("/vehicles", response_model=List[VehicleResponse])
async def list_vehicles(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Vehicle).order_by(Vehicle.id.desc()))
    return result.scalars().all()


@router.post("/vehicles", response_model=VehicleResponse)
async def create_vehicle(data: VehicleCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    v = Vehicle(**data.model_dump())
    db.add(v); await db.commit(); await db.refresh(v)
    return v


@router.get("/maintenance", response_model=List[MaintenanceResponse])
async def list_maintenance(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(VehicleMaintenance).order_by(VehicleMaintenance.id.desc()))
    return result.scalars().all()


@router.post("/maintenance", response_model=MaintenanceResponse)
async def create_maintenance(data: MaintenanceCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    m = VehicleMaintenance(**data.model_dump())
    db.add(m); await db.commit(); await db.refresh(m)
    return m


@router.get("/fuel", response_model=List[FuelLogResponse])
async def list_fuel(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(FuelLog).order_by(FuelLog.id.desc()))
    return result.scalars().all()


@router.post("/fuel")
async def add_fuel_log(vehicle_id: int, liters: float, cost_per_liter: float, odometer: int = 0,
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    fl = FuelLog(vehicle_id=vehicle_id, liters=liters, cost_per_liter=cost_per_liter,
        total_cost=liters * cost_per_liter, odometer=odometer)
    db.add(fl); await db.commit()
    return {"status": "ok"}
