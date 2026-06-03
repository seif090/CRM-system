import asyncio
from datetime import datetime, date, timedelta
import random
from sqlalchemy import select
from .core.database import async_session_factory
from .core.security import get_password_hash
from .models.user import User
from .models.customer import Customer
from .models.product import Category, Product
from .models.sale import Sale, SaleItem
from .models.purchase import Supplier, Purchase, PurchaseItem
from .models.employee import Employee
from .models.expense import Expense, ExpenseCategory
from .models.loyalty import LoyaltyTier, CustomerLoyalty, Coupon
from .models.branch import Branch
from .models.inventory import Warehouse
from .models.task import Project, Task
from .models.accounting import Account
from .models.email_config import EmailTemplate
from .models.whatsapp import WhatsAppTemplate
from .models.ai_config import AIConfig
from .models.notification import Notification
from .models.leave import LeaveType

CUSTOMERS = [
    {"name": "أحمد محمد", "phone": "01001111111", "company": "شركة الأهرام"},
    {"name": "سارة علي", "phone": "01002222222", "company": "مكتبة النيل"},
    {"name": "محمد حسين", "phone": "01003333333", "company": "مصنع النور"},
    {"name": "فاطمة أحمد", "phone": "01004444444", "company": "شركة الهدى"},
    {"name": "خالد عمر", "phone": "01005555555", "company": "مؤسسة البركة"},
    {"name": "نورة سعيد", "phone": "01006666666", "company": "معرض الشرق"},
    {"name": "عبدالله صالح", "phone": "01007777777", "company": "شركة الفتح"},
    {"name": "مريم كمال", "phone": "01008888888", "company": "مركز الجودة"},
    {"name": "يوسف إبراهيم", "phone": "01009999999", "company": "مختبر الأمل"},
    {"name": "هند عبدالرحمن", "phone": "01001010101", "company": "مكتب السلام"},
]

PRODUCTS_DATA = {
    "إلكترونيات": [
        ("شاشة LED 55 بوصة", "SCR-001", 15000, 12000, 10),
        ("سماعة بلوتوث", "BT-001", 750, 500, 50),
        ("لاب توب Pro", "LPT-001", 25000, 22000, 8),
        ("تابلت 10 بوصة", "TAB-001", 8000, 6500, 15),
        ("ماوس لاسلكي", "MOU-001", 350, 200, 100),
    ],
    "ملابس": [
        ("تيشيرت قطني", "TSH-001", 250, 150, 200),
        ("بنطلون جينز", "JNS-001", 600, 400, 80),
        ("جاكيت شتوي", "JCK-001", 1200, 800, 40),
        ("حذاء رياضي", "SHR-001", 900, 600, 60),
        ("قبعة بيسبول", "CAP-001", 150, 80, 150),
    ],
    "أثاث": [
        ("مكتب حاسوب", "DSK-001", 3000, 2200, 12),
        ("كرسي دوار", "CHR-001", 2500, 1800, 20),
        ("رف كتب", "SHL-001", 1800, 1200, 8),
        ("طاولة اجتماعات", "TBL-001", 5000, 3800, 5),
        ("كنبة 3 مقاعد", "SOF-001", 8000, 6000, 7),
    ],
    "مواد غذائية": [
        ("زيت زيتون 1 لتر", "OIL-001", 120, 80, 500),
        ("عسل نحل 500 جم", "HNY-001", 200, 140, 300),
        ("تمور فاخرة 1 كجم", "DTS-001", 180, 120, 400),
        ("شاي أخضر 100 كيس", "TEA-001", 60, 35, 600),
        ("قهوة تركية 250 جم", "COF-001", 85, 55, 450),
    ],
}

SUPPLIERS = [
    {"name": "المورد الأولى", "company": "شركة الإمداد", "phone": "02001111111"},
    {"name": "المورد الثاني", "company": "مؤسسة التوريد", "phone": "02002222222"},
    {"name": "المورد الثالث", "company": "شركة السلع", "phone": "02003333333"},
]

EMPLOYEES = [
    {"code": "EMP-001", "name": "محمد علي", "position": "مدير مبيعات", "salary": 15000, "dept": "مبيعات"},
    {"code": "EMP-002", "name": "أحمد حسن", "position": "محاسب", "salary": 10000, "dept": "محاسبة"},
    {"code": "EMP-003", "name": "سارة خالد", "position": "موارد بشرية", "salary": 9000, "dept": "موارد بشرية"},
    {"code": "EMP-004", "name": "عمر محمود", "position": "مطور", "salary": 18000, "dept": "تقنية"},
    {"code": "EMP-005", "name": "ليلى عبدالله", "position": "خدمة عملاء", "salary": 7000, "dept": "خدمة عملاء"},
    {"code": "EMP-006", "name": "خالد إبراهيم", "position": "مندوب مبيعات", "salary": 8000, "dept": "مبيعات"},
]

AI_PROMPTS = [
    {
        "name": "مساعد مبيعات محترف",
        "prompt": """أنت مساعد مبيعات محترف ومتخصص في نظام ERP & CRM.
اسم العميل: {customer_name}

مهامك:
- الرد على استفسارات العملاء عن المنتجات والأسعار
- تقديم معلومات عن الطلبات والفواتير
- مساعدة العملاء في متابعة طلباتهم
- تقديم توصيات للمنتجات
- الرد بلطف واحترافية

كن موجزاً ومفيداً في ردودك. استخدم نفس لغة العميل.""",
        "temperature": 70,
    },
    {
        "name": "دعم فني",
        "prompt": "أنت فريق الدعم الفني للنظام. اسم العميل: {customer_name}. قدم دعماً فنياً للمستخدمين والعملاء. ساعد في حل المشكلات التقنية. كن صبوراً وواضحاً.",
        "temperature": 50,
    },
    {
        "name": "مساعد بالعامية المصرية",
        "prompt": "انت مساعد مبيعات شاطر. اسم العميل: {customer_name}. كلم العميل بالعامية المصرية. كون لطيف ومحترم. اسأل عن احتياجاته وساعده يلاقي المنتج المناسب.",
        "temperature": 80,
    },
]

WHATSAPP_TEMPLATES = [
    {"name": "تأكيد الطلب", "content": "مرحباً {customer_name}، تم استلام طلبك رقم {order_number} بنجاح."},
    {"name": "تذكير بالدفع", "content": "عزيزي {customer_name}، الفاتورة رقم {invoice_number} بمبلغ {amount} لم تسدد بعد."},
    {"name": "ترحيب", "content": "أهلاً بك {customer_name} في نظامنا! يسعدنا خدمتك."},
]


async def seed():
    async with async_session_factory() as db:
        existing = await db.execute(select(User).where(User.username == "admin"))
        if existing.scalar_one_or_none():
            print("Database already has data. Skipping seed.")
            return

        print("=== Seeding Demo Data ===")

        admin = User(username="admin", email="admin@erp-crm.com",
            hashed_password=get_password_hash("admin123"),
            full_name="مدير النظام", role="admin", is_superuser=True)
        db.add(admin)
        print("✓ Admin user created (admin / admin123)")

        for e in EMPLOYEES:
            db.add(Employee(employee_code=e["code"], full_name=e["name"],
                position=e["position"], salary=e["salary"], department=e["dept"],
                phone=f"01{random.randint(10000000, 99999999)}", status="active"))
        print(f"✓ {len(EMPLOYEES)} employees created")

        for c in CUSTOMERS:
            db.add(Customer(**c, total_purchases=random.randint(1, 20),
                total_spent=random.randint(5000, 50000)))
        print(f"✓ {len(CUSTOMERS)} customers created")

        cats = {}
        for cat_name, items in PRODUCTS_DATA.items():
            cat = Category(name=cat_name)
            db.add(cat)
            await db.flush()
            cats[cat_name] = cat
            for name, sku, price, cost, qty in items:
                db.add(Product(name=name, sku=sku, unit_price=price,
                    cost_price=cost, quantity_in_stock=qty, category_id=cat.id))
        print(f"✓ {sum(len(v) for v in PRODUCTS_DATA.values())} products created")

        for s in SUPPLIERS:
            db.add(Supplier(**s))
        print(f"✓ {len(SUPPLIERS)} suppliers created")

        for lt in [("إجازة سنوية", 21), ("إجازة مرضية", 30), ("إجازة والدية", 90)]:
            db.add(LeaveType(name=lt[0], days_allowed=lt[1]))
        print("✓ Leave types created")

        for code, name, type_ in [("1000","الأصول","asset"),("1100","النقدية","asset"),
            ("2000","الخصوم","liability"),("3000","حقوق الملكية","equity"),
            ("4000","الإيرادات","revenue"),("5000","المصروفات","expense")]:
            db.add(Account(code=code, name=name, type=type_))
        print("✓ Chart of accounts created")

        for w in ["مخزن رئيسي", "مخزن فرعي"]:
            db.add(Warehouse(name=w))

        for t in [("برونزي",0,0),("فضي",1000,5),("ذهبي",5000,10),("ألماسي",15000,20)]:
            db.add(LoyaltyTier(name=t[0], min_points=t[1], discount_percent=t[2]))
        print("✓ Loyalty tiers created")

        for i, a in enumerate(AI_PROMPTS):
            db.add(AIConfig(name=a["name"], prompt_template=a["prompt"],
                temperature=a["temperature"], is_active=1 if i==0 else 0))
        print(f"✓ {len(AI_PROMPTS)} AI configs created")

        for wt in WHATSAPP_TEMPLATES:
            db.add(WhatsAppTemplate(name=wt["name"], content=wt["content"]))
        print("✓ WhatsApp templates created")

        today = datetime.now()
        for i in range(15):
            c = random.choice(CUSTOMERS)
            total = random.randint(1000, 15000)
            db.add(Sale(invoice_number=f"DEMO-INV-{i+1:04d}",
                customer_name=c["name"], customer_phone=c["phone"],
                total_amount=total, grand_total=total, paid_amount=total,
                payment_status="paid",
                created_at=today - timedelta(days=i)))
        print(f"✓ {15} demo sales created")

        db.add(Notification(title="مرحباً بك!", message="تم إعداد النظام بنجاح!", type="success"))
        db.add(Notification(title="تنبيه مخزون", message="بعض المنتجات وصلت للحد الأدنى.", type="warning"))

        await db.commit()
        print("\n✓✓✓ Demo data seeded successfully!")
        print("  URL:     http://localhost:8000")
        print("  Username: admin")
        print("  Password: admin123")


if __name__ == "__main__":
    asyncio.run(seed())
