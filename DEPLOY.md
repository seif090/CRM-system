# 🚀 نشر النظام (Deployment Guide)

## الخيار 1: Render.com (أسهل وأسرع)

> مناسب للـ Demo مجاني لمدة 90 يوم

### 1. إنشاء قاعدة بيانات PostgreSQL

1. سجل في [Render.com](https://render.com)
2. اذهب إلى Dashboard → New → PostgreSQL
3. اختر "Free" plan
4. سمها `erp-crm-db`
5. بعد الإنشاء، احفظ **Internal Database URL**

### 2. نشر الـ Backend

1. New → Web Service
2. اختار "Build and deploy from a Git repository"
3. ادخل رابط الـ repo: `https://github.com/seif090/CRM-system`
4. الـ Name: `erp-crm-api`
5. Runtime: `Python 3`
6. Build Command: `pip install -r backend/requirements.txt`
7. Start Command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port 10000`

### 3. إضافة Environment Variables

في صفحة الـ Web Service، اذهب إلى **Environment** وأضف:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Internal Database URL من PostgreSQL (حوّلها لـ async: `+asyncpg`) |
| `DATABASE_URL_SYNC` | نفس الرابط لكن `+psycopg2` |
| `SECRET_KEY` | حط أي كلمة سر قوية |
| `GEMINI_API_KEY` | (اختياري) مفتاح Google Gemini |
| `PYTHON_VERSION` | `3.12.0` |

مثال تحويل رابط PostgreSQL:
```
postgresql://user:pass@host/db  ← الأصلي
postgresql+asyncpg://user:pass@host/db  ← للـ async
postgresql+psycopg2://user:pass@host/db  ← للـ sync
```

### 4. نشر الـ Frontend

1. New → Web Service (من نفس الـ repo)
2. Name: `erp-crm-frontend`
3. Runtime: `Node`
4. Build Command: `cd frontend && npm install && npm run build`
5. Start Command: `cd frontend && npm run preview -- --host 0.0.0.0 --port 10000`

### 5. ربط الدومين

- Render يعطيك رابط تلقائي مثل: `https://erp-crm-api.onrender.com`
- ممكن تضيف domain مخصص من Settings → Custom Domain

---

## الخيار 2: Railway.app (بسيط)

> يعطي $5 credit مجاناً (يكفي لتشغيل المشروع)

### الخطوات:

1. سجل في [Railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. اختار `CRM-system`
4. Railway هيكتشف الـ `docker-compose.yml` تلقائياً
5. اضبط Environment Variables:
   - `SECRET_KEY`: أي كلمة سر
   - `GEMINI_API_KEY`: (اختياري)

---

## الخيار 3: VPS (DigitalOcean / Hetzner)

> للاستخدام الإنتاجي الحقيقي

```bash
# 1. اتصل بالسيرفر
ssh root@your-server-ip

# 2. ثبت Docker و Docker Compose
apt update && apt install -y docker.io docker-compose
systemctl enable docker && systemctl start docker

# 3. انسخ المشروع
git clone https://github.com/seif090/CRM-system.git /opt/erp-crm
cd /opt/erp-crm

# 4. ضبط المتغيرات
export SECRET_KEY="your-strong-secret-key"
export GEMINI_API_KEY="your-gemini-key"

# 5. شغل كل الخدمات
docker-compose up -d --build

# 6. شوف إنها شغالة
curl http://localhost:8000/api/health
```

السيرفرهتشتغل على:
- **Frontend**: http://your-server-ip:3000
- **Backend API**: http://your-server-ip:8000
- **API Docs**: http://your-server-ip:8000/docs

---

## بيانات الدخول التجريبية (Demo)

| الحقل | القيمة |
|-------|--------|
| **Username** | `admin` |
| **Password** | `admin123` |

> ⚠️ غير كلمة السر دي فوراً بعد أول تسجيل دخول

---

## Seed Data

النظام بيتحط فيه بيانات تجريبية تلقائياً أول ما يشغل. لو عايز تعملها يدوي:

```bash
# محلياً
cd backend
python -c "from app.seed_demo import seed; import asyncio; asyncio.run(seed())"
```

---

## خدمة WhatsApp

عشان تشغل WhatsApp Web JS:
```bash
docker-compose up -d whatsapp
# شوف الـ QR code:
docker-compose logs -f whatsapp
# امسح QR الـ كود بالواتساب بتاعك
```

---

## نصائح للعرض على العميل

1. **جهز البيانات**: قبل ما توريه، حط شوية منتجات وعملاء حقيقيين
2. **الواتساب**: لو مش هتستخدم API، اعمل QR code وجدد session
3. **الـ AI**: حط مفتاح Gemini عشان يشتغل
4. **روابط سريعة** للعرض:
   - Dashboard: `/`
   - POS: `/pos`
   - Reports: `/reports`
   - WhatsApp: `/whatsapp`
   - AI Settings: `/ai`
