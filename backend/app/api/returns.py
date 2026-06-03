from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import datetime
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.returns import SalesReturn, SalesReturnItem
from ..models.product import Product
from ..models.user import User
from ..schemas.returns import SalesReturnCreate, SalesReturnResponse

router = APIRouter(prefix="/api/returns", tags=["Returns"])


@router.get("/", response_model=List[SalesReturnResponse])
async def list_returns(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(SalesReturn).order_by(SalesReturn.id.desc()))
    return result.scalars().all()


@router.post("/", response_model=SalesReturnResponse)
async def create_return(
    data: SalesReturnCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = datetime.now()
    return_number = f"RET-{today.strftime('%Y%m%d%H%M%S')}-{current_user.id}"
    total_amount = sum(item.quantity * item.unit_price for item in data.items)

    ret = SalesReturn(
        return_number=return_number,
        sale_id=data.sale_id,
        customer_id=data.customer_id,
        customer_name=data.customer_name,
        total_amount=total_amount,
        reason=data.reason,
        created_by=current_user.id,
    )
    db.add(ret)
    await db.flush()

    for item in data.items:
        ret_item = SalesReturnItem(
            return_id=ret.id,
            product_id=item.product_id,
            product_name=item.product_name,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.quantity * item.unit_price,
        )
        db.add(ret_item)

        if item.product_id:
            prod_result = await db.execute(select(Product).where(Product.id == item.product_id))
            product = prod_result.scalar_one_or_none()
            if product:
                product.quantity_in_stock += item.quantity

    await db.commit()
    await db.refresh(ret)
    return ret
