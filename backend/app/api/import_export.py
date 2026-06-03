from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi.responses import StreamingResponse
import io
import csv
import json
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.customer import Customer
from ..models.product import Product
from ..models.employee import Employee
from ..models.sale import Sale, SaleItem
from ..models.user import User

router = APIRouter(prefix="/api/import-export", tags=["Import/Export"])


@router.get("/export/{entity_type}")
async def export_data(
    entity_type: str,
    format: str = "csv",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    model_map = {
        "customers": Customer,
        "products": Product,
        "employees": Employee,
        "sales": Sale,
    }
    model = model_map.get(entity_type)
    if not model:
        raise HTTPException(status_code=400, detail=f"Unsupported entity: {entity_type}")

    result = await db.execute(select(model))
    rows = result.scalars().all()

    if format == "csv":
        output = io.StringIO()
        if rows:
            writer = csv.DictWriter(output, fieldnames=[c.name for c in model.__table__.columns])
            writer.writeheader()
            for row in rows:
                writer.writerow({c.name: getattr(row, c.name, "") for c in model.__table__.columns})
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={entity_type}.csv"},
        )
    else:
        data = [{c.name: str(getattr(row, c.name, "")) for c in model.__table__.columns} for row in rows]
        return data
