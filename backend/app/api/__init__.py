from .auth import router as auth_router
from .customers import router as customers_router
from .products import router as products_router
from .sales import router as sales_router
from .purchases import router as purchases_router
from .employees import router as employees_router
from .accounting import router as accounting_router
from .dashboard import router as dashboard_router
from .whatsapp import router as whatsapp_router
from .ai import router as ai_router
from .expenses import router as expenses_router
from .tasks import router as tasks_router
from .returns import router as returns_router
from .inventory import router as inventory_router
from .notifications import router as notifications_router
from .audit import router as audit_router
from .permissions import router as permissions_router
from .pos import router as pos_router
from .reports import router as reports_router
from .shipping import router as shipping_router
from .email_integration import router as email_router
from .leaves import router as leaves_router
from .payroll import router as payroll_router
from .payments import router as payments_router
from .assets import router as assets_router
from .budgets import router as budgets_router
from .branches import router as branches_router
from .loyalty import router as loyalty_router
from .import_export import router as import_export_router
from .printing import router as printing_router
from .customer_portal import router as portal_router
from .tickets import router as tickets_router
from .pipeline import router as pipeline_router
from .calendar_api import router as calendar_router
from .chat import router as chat_router
from .documents import router as documents_router
from .timetrack import router as timetrack_router

routers = [
    auth_router, customers_router, products_router, sales_router,
    purchases_router, employees_router, accounting_router, dashboard_router,
    whatsapp_router, ai_router, expenses_router, tasks_router,
    returns_router, inventory_router, notifications_router, audit_router,
    permissions_router, pos_router, reports_router,
    shipping_router, email_router, leaves_router, payroll_router,
    payments_router, assets_router, budgets_router, branches_router,
    loyalty_router, import_export_router, printing_router, portal_router,
    tickets_router, pipeline_router, calendar_router,
    chat_router, documents_router, timetrack_router,
]
