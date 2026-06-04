from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DriverCreate(BaseModel):
    name: str
    license_number: Optional[str] = None
    phone: Optional[str] = None


class DriverResponse(BaseModel):
    id: int
    name: str
    license_number: Optional[str] = None
    phone: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class VehicleCreate(BaseModel):
    plate_number: str
    model: Optional[str] = None
    year: Optional[int] = None
    fuel_type: Optional[str] = None
    driver_id: Optional[int] = None


class VehicleResponse(BaseModel):
    id: int
    plate_number: str
    model: Optional[str] = None
    year: Optional[int] = None
    fuel_type: Optional[str] = None
    status: str
    driver_id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config: from_attributes = True


class MaintenanceCreate(BaseModel):
    vehicle_id: int
    maintenance_type: str
    date: datetime
    cost: float = 0
    notes: Optional[str] = None
    next_maintenance_date: Optional[datetime] = None


class MaintenanceResponse(BaseModel):
    id: int
    vehicle_id: int
    maintenance_type: str
    date: Optional[datetime] = None
    cost: float
    notes: Optional[str] = None
    next_maintenance_date: Optional[datetime] = None

    class Config: from_attributes = True


class FuelLogResponse(BaseModel):
    id: int
    vehicle_id: int
    date: Optional[datetime] = None
    liters: float
    cost_per_liter: float
    total_cost: float
    odometer: int

    class Config: from_attributes = True
