from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..core.base import Base


class Driver(Base):
    __tablename__ = "drivers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    license_number = Column(String(100))
    phone = Column(String(50))
    status = Column(String(20), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    plate_number = Column(String(50), nullable=False, unique=True)
    model = Column(String(200))
    year = Column(Integer)
    fuel_type = Column(String(20))
    status = Column(String(20), default="active")
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class VehicleMaintenance(Base):
    __tablename__ = "vehicle_maintenance"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    maintenance_type = Column(String(100))
    date = Column(DateTime(timezone=True))
    cost = Column(Float, default=0)
    notes = Column(String(500))
    next_maintenance_date = Column(DateTime(timezone=True), nullable=True)


class FuelLog(Base):
    __tablename__ = "fuel_logs"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    date = Column(DateTime(timezone=True))
    liters = Column(Float, default=0)
    cost_per_liter = Column(Float, default=0)
    total_cost = Column(Float, default=0)
    odometer = Column(Integer, default=0)
