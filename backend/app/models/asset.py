from sqlalchemy import Column, Integer, String, Text, DateTime, func, ForeignKey, Date
from ..core.database import Base


class AssetCategory(Base):
    __tablename__ = "asset_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category_id = Column(Integer, ForeignKey("asset_categories.id"), nullable=True)
    code = Column(String(100), unique=True, nullable=False)
    purchase_price = Column(Integer, default=0)
    current_value = Column(Integer, default=0)
    purchase_date = Column(Date, nullable=True)
    location = Column(String(255), nullable=True)
    status = Column(String(50), default="active")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AssetMaintenance(Base):
    __tablename__ = "asset_maintenance"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    description = Column(Text, nullable=False)
    cost = Column(Integer, default=0)
    maintenance_date = Column(Date, nullable=False)
    next_maintenance_date = Column(Date, nullable=True)
    vendor = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
