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

routers = [
    auth_router,
    customers_router,
    products_router,
    sales_router,
    purchases_router,
    employees_router,
    accounting_router,
    dashboard_router,
    whatsapp_router,
    ai_router,
    expenses_router,
    tasks_router,
    returns_router,
    inventory_router,
    notifications_router,
    audit_router,
    permissions_router,
    pos_router,
    reports_router,
]
