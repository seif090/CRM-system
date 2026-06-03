from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi.responses import StreamingResponse
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from ..core.database import get_db
from ..core.dependencies import get_current_user
from ..models.sale import Sale, SaleItem
from ..models.product import Product
from ..models.user import User

router = APIRouter(prefix="/api/print", tags=["Print"])


@router.get("/invoice/{sale_id}")
async def print_invoice(
    sale_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Sale).where(Sale.id == sale_id))
    sale = result.scalar_one_or_none()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    items_result = await db.execute(select(SaleItem).where(SaleItem.sale_id == sale_id))
    items = items_result.scalars().all()

    buf = io.BytesIO()
    p = canvas.Canvas(buf, pagesize=A4)
    width, height = A4

    p.setFont("Helvetica-Bold", 20)
    p.drawString(50, height - 60, "INVOICE")
    p.setFont("Helvetica", 12)
    p.drawString(50, height - 85, f"#{sale.invoice_number}")
    p.drawString(400, height - 85, f"Date: {sale.created_at.strftime('%Y-%m-%d') if sale.created_at else ''}")

    p.drawString(50, height - 120, f"Customer: {sale.customer_name or 'N/A'}")
    p.drawString(50, height - 140, f"Phone: {sale.customer_phone or 'N/A'}")

    y = height - 180
    p.setFont("Helvetica-Bold", 10)
    p.drawString(50, y, "Product")
    p.drawString(250, y, "Qty")
    p.drawString(300, y, "Price")
    p.drawString(400, y, "Total")
    y -= 20

    p.setFont("Helvetica", 10)
    for item in items:
        p.drawString(50, y, item.product_name[:30])
        p.drawString(250, y, str(item.quantity))
        p.drawString(300, y, str(item.unit_price))
        p.drawString(400, y, str(item.total_price))
        y -= 20

    y -= 20
    p.setFont("Helvetica-Bold", 12)
    p.drawString(300, y, f"Grand Total: {sale.grand_total}")
    y -= 20
    p.drawString(300, y, f"Paid: {sale.paid_amount}")
    y -= 20
    p.drawString(300, y, f"Due: {sale.due_amount}")

    p.showPage()
    p.save()
    buf.seek(0)

    return StreamingResponse(
        buf,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=invoice_{sale.invoice_number}.pdf"},
    )


@router.get("/barcode/{product_id}")
async def print_barcode(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    buf = io.BytesIO()
    p = canvas.Canvas(buf, pagesize=A4)
    p.setFont("Helvetica", 14)
    p.drawString(50, 750, f"{product.name}")
    p.drawString(50, 730, f"SKU: {product.sku}")
    p.drawString(50, 710, f"Price: {product.unit_price}")
    p.drawString(50, 690, f"Barcode: {product.barcode or 'N/A'}")
    p.showPage()
    p.save()
    buf.seek(0)

    return StreamingResponse(
        buf,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=barcode_{product.sku}.pdf"},
    )
