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
from .models.manufacturing import BillOfMaterial, BOMItem, ProductionOrder
from .models.contract import Contract
from .models.knowledge import KnowledgeCategory, KnowledgeArticle
from .models.feedback import FeedbackForm
from .models.subscription import SubscriptionPlan, CustomerSubscription
from .models.recruitment import JobPosting, Applicant, Interview
from .models.training import Course, TrainingSession, Enrollment
from .models.performance import ReviewCycle, Review, PerformanceGoal
from .models.quality import QualityChecklist, QualityInspection
from .models.fleet import Driver, Vehicle, VehicleMaintenance, FuelLog
from .models.service import ServiceRequest, WorkOrder, ServiceSchedule
from .models.rentals import RentalItem, RentalOrder
from .models.marketing import Campaign, MarketingLead
from .models.crm_activities import CallLog, Meeting, CRMNote
from .models.bank_reconciliation import BankStatement, Reconciliation
from .models.tax import TaxCode, TaxReturn
from .models.recurring_invoice import RecurringInvoice
from .models.procurement import PurchaseRequest, RFQ
from .models.batch_serial import BatchNumber, SerialNumber
from .models.gift_cards import GiftCard
from .models.memberships import MembershipPlan, Member

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
            db.add(Account(code=code, name=name, account_type=type_))
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

        db.add(Notification(title="مرحباً بك!", message="تم إعداد النظام بنجاح!", notification_type="success"))
        db.add(Notification(title="تنبيه مخزون", message="بعض المنتجات وصلت للحد الأدنى.", notification_type="warning"))

        bom = BillOfMaterial(name="BOM-001 - شاشة LED", product_id=1, quantity=1, notes="تجميع شاشة LED", created_by=1)
        db.add(bom)
        await db.flush()
        db.add(ProductionOrder(reference="MO-20260101-0001", bom_id=bom.id, quantity=5,
            status="draft", notes="أمر إنتاج تجريبي", created_by=1))
        print("✓ Manufacturing demo data created")

        db.add(Contract(title="عقد صيانة سنوي", contract_type="customer", party_name="شركة الأهرام",
            amount=25000, start_date=datetime.now(), end_date=datetime.now() + timedelta(days=365),
            status="active", notes="عقد صيانة شامل", created_by=1))
        db.add(Contract(title="عقد توريد", contract_type="supplier", party_name="المورد الأولى",
            amount=50000, start_date=datetime.now(), end_date=datetime.now() + timedelta(days=180),
            status="active", notes="توريد مواد خام", created_by=1))
        print("✓ Contract demo data created")

        kcat = KnowledgeCategory(name="إرشادات الاستخدام", description="كيفية استخدام النظام")
        db.add(kcat)
        await db.flush()
        db.add(KnowledgeArticle(title="كيفية إضافة عميل جديد", content="من قائمة العملاء، اضغط على إضافة عميل جديد ثم املأ البيانات.",
            category_id=kcat.id, tags="إرشادات,عملاء", is_published=1, created_by=1))
        db.add(KnowledgeArticle(title="كيفية إنشاء فاتورة", content="من المبيعات، اختر فاتورة جديدة، أضف المنتجات ثم حفظ.",
            category_id=kcat.id, tags="فواتير,مبيعات", is_published=1, created_by=1))
        print("✓ Knowledge base demo data created")

        db.add(FeedbackForm(title="رضا العملاء", description="استبيان قياس رضا العملاء عن الخدمة",
            questions="""[{"q":"كيف تقيم خدمتنا؟","type":"stars"},{"q":"ما الذي يمكن تحسينه؟","type":"text"}]""", created_by=1))
        print("✓ Feedback demo data created")

        db.add(SubscriptionPlan(name="Basic", description="الباقة الأساسية", price=99, billing_cycle="monthly", max_users=5, max_storage=100))
        db.add(SubscriptionPlan(name="Professional", description="الباقة المتقدمة", price=199, billing_cycle="monthly", max_users=25, max_storage=500))
        db.add(SubscriptionPlan(name="Enterprise", description="الباقة المؤسسية", price=499, billing_cycle="monthly", max_users=999, max_storage=9999))
        db.add(CustomerSubscription(customer_id=1, plan_id=2, status="active",
            start_date=datetime.now(), end_date=datetime.now() + timedelta(days=30), auto_renew=1))
        print("✓ Subscription demo data created")

        db.add(JobPosting(title="مطور ERP", department="تقنية", description="تطوير نظام ERP", status="open", created_by=1))
        db.add(JobPosting(title="محاسب", department="محاسبة", description="إدارة الحسابات", status="open", created_by=1))
        print("✓ Recruitment demo data created")

        c = Course(title="أساسيات ERP", description="دورة تدريبية عن النظام", duration_hours=8, max_participants=20, created_by=1)
        db.add(c); await db.flush()
        db.add(TrainingSession(course_id=c.id, instructor="مدرب 1", status="planned"))
        print("✓ Training demo data created")

        rc = ReviewCycle(name="مراجعة 2026", status="planned", created_by=1)
        db.add(rc); await db.flush()
        db.add(PerformanceGoal(employee_id=1, title="تحقيق المبيعات", progress=50))
        print("✓ Performance demo data created")

        db.add(QualityChecklist(name="فحص الجودة الأساسي", items="فحص المنتج,فحص التغليف", created_by=1))
        print("✓ Quality control demo data created")

        db.add(Driver(name="سائق 1", license_number="12345", phone="0111111111"))
        db.add(Vehicle(plate_number="ABC123", model="Toyota 2025", status="active"))
        print("✓ Fleet demo data created")

        db.add(ServiceRequest(customer_id=1, title="صيانة جهاز", priority="high", status="open", assigned_to=1))
        print("✓ Service demo data created")

        db.add(RentalItem(name="مولد كهربائي", sku="GEN-001", daily_rate=500, quantity=3))
        db.add(RentalItem(name="حفار", sku="EXC-001", daily_rate=2000, quantity=1))
        print("✓ Rentals demo data created")

        db.add(Campaign(name="حملة رمضان", type="seasonal", budget=10000, status="draft", created_by=1))
        db.add(MarketingLead(campaign_id=1, name="عميل محتمل", source="موقع", score=80))
        print("✓ Marketing demo data created")

        db.add(CallLog(customer_id=1, employee_id=1, duration=120, outcome="مهتم بالمنتج"))
        db.add(Meeting(title="اجتماع مع عميل", employee_id=1, status="scheduled"))
        db.add(CRMNote(customer_id=1, employee_id=1, content="ملاحظة: العميل يريد خصم"))
        print("✓ CRM Activities demo data created")

        db.add(TaxCode(name="ضريبة القيمة المضافة", rate=15, type="sales"))
        db.add(TaxCode(name="ضريبة صفرية", rate=0, type="sales"))
        print("✓ Tax demo data created")

        db.add(RecurringInvoice(customer_id=1, frequency="monthly", interval_value=1, start_date=today, next_date=today, created_by=1))
        print("✓ Recurring invoices demo data created")

        db.add(PurchaseRequest(title="توريد قرطاسية", requestor_id=1, department="إدارة", status="draft"))
        db.add(RFQ(title="طلب عرض سعر للقرطاسية", issue_date=today, due_date=today + timedelta(days=7), status="draft", created_by=1))
        print("✓ Procurement demo data created")

        db.add(BatchNumber(product_id=1, batch_number="BATCH-001", quantity=100))
        db.add(SerialNumber(product_id=1, serial_number="SN-001-00001"))
        print("✓ Batch/Serial demo data created")

        db.add(GiftCard(card_number="GC-001", initial_balance=500, current_balance=500, issue_date=today))
        print("✓ Gift cards demo data created")

        db.add(MembershipPlan(name="عضوية ذهبية", price=299, duration_days=365, max_visits=50))
        db.add(Member(customer_id=1, plan_id=1, start_date=today, end_date=today + timedelta(days=365), status="active"))
        print("✓ Memberships demo data created")

        await db.commit()
        print("\n✓✓✓ Demo data seeded successfully!")
        print("  URL:     http://localhost:8000")
        print("  Username: admin")
        print("  Password: admin123")


if __name__ == "__main__":
    asyncio.run(seed())
