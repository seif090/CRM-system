# 🏢 ERP & CRM System

<div dir="rtl">

نظام متكامل لإدارة المؤسسات والعلاقات مع العملاء (ERP & CRM) مع دعم **الواتساب** و **الذكاء الاصطناعي** للردود التلقائية. قابل للتخصيص بالكامل ويعمل كـ **تطبيق ويب + ديسكتوب**.

</div>

> **Tech Stack:** Python FastAPI · React + TypeScript · PostgreSQL · Electron · WhatsApp API + Web JS · Google Gemini AI

---

## 📋 Table of Contents / المحتويات

- [Features Overview](#features-overview)
- [Project Structure](#project-structure)
- [Modules](#modules)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Screenshots](#screenshots)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Customization](#customization)
- [License](#license)

---

## ✨ Features Overview

### 🔧 ERP Core
| Module | Description |
|--------|-------------|
| **Sales** | Invoices, items, payments, customer management |
| **Purchasing** | Purchase orders, suppliers, auto stock update |
| **Inventory** | Products, categories, stock alerts, warehouses, movements & adjustments |
| **HR** | Employees, salaries, attendance, departments |
| **Accounting** | Chart of accounts, journal entries, ledgers |

### 🤝 CRM
| Feature | Description |
|---------|-------------|
| **Customer Management** | Full customer profile, purchase history, status |
| **Communication Log** | Track all interactions via WhatsApp & email |
| **Segmentation** | Filter and group customers by various criteria |

### 💬 WhatsApp Integration
| Method | Description |
|--------|-------------|
| **WhatsApp Business API** | Official Meta API for production use |
| **WhatsApp Web JS** | Unofficial bridge using `whatsapp-web.js` (no verification needed) |
| **Message Templates** | Reusable message templates with variables |
| **Webhook** | Receive incoming messages via webhook |

### 🤖 AI (Gemini)
| Feature | Description |
|---------|-------------|
| **Auto Replies** | Gemini-powered automatic customer responses |
| **Custom Prompt Templates** | Fully customizable prompts per use case |
| **Conversation History** | Context-aware replies using last 10 messages |
| **Configurable** | Temperature, max tokens, model selection |

### 💳 Point of Sale (POS)
| Feature | Description |
|---------|-------------|
| **Quick Cashier Interface** | Fast product search by name or barcode |
| **Cart Management** | Add/remove items, adjust quantities |
| **Multi Payment** | Cash, card, credit support |
| **Customer Selection** | Quick customer lookup and assignment |

### 📊 Reports & Analytics
| Feature | Description |
|---------|-------------|
| **Sales Reports** | Daily/monthly revenue charts (Bar, Pie) |
| **Expense Reports** | Track expenses by category |
| **Profit Analysis** | Revenue vs expenses vs profit visualization |
| **Low Stock Alerts** | Products below minimum stock level |

### 🛡️ System
| Feature | Description |
|---------|-------------|
| **Authentication** | JWT-based auth with role support |
| **Permissions** | Granular role-based access control |
| **Audit Log** | Full activity tracking for all entities |
| **Notifications** | In-app notifications with read/unread status |
| **Task Management** | Projects, tasks, priorities, assignments |
| **Returns** | Sales returns with automatic stock restock |

---

## 📁 Project Structure

```
ERP & CRM System/
├── backend/                          # Python FastAPI server
│   ├── app/
│   │   ├── api/                      # 19 API route modules
│   │   ├── core/                     # Config, DB, security, dependencies
│   │   ├── models/                   # 22 SQLAlchemy models
│   │   ├── schemas/                  # Pydantic validation schemas
│   │   ├── services/                 # Gemini AI & WhatsApp services
│   │   └── main.py                   # App entry point
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                         # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/               # Shared UI (Layout, DataTable, StatCard)
│   │   ├── pages/                    # 18 pages
│   │   ├── services/                 # API client (Axios)
│   │   └── utils/                    # Helpers, auth
│   ├── index.html
│   ├── Dockerfile
│   └── package.json
├── desktop/                          # Electron desktop wrapper
│   ├── main.js
│   └── package.json
├── whatsapp/                         # WhatsApp Web JS bridge service
│   ├── index.js
│   └── package.json
├── ai/                               # Standalone AI service
│   ├── gemini_service.py
│   └── package.json
├── docker-compose.yml                # Full stack deployment
├── start.ps1                         # Local startup (Windows)
└── .gitignore
```

**Total: 93 files**

---

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL 16+
- Redis 7+ (for Celery)

### 1. Clone & Setup Environment

```bash
git clone https://github.com/seif090/CRM-system.git
cd CRM-system
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

**Edit `backend/.env` with your settings:**
```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/erp_crm
GEMINI_API_KEY=your-gemini-api-key
SECRET_KEY=your-secret-key
```

**Run the server:**
```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. WhatsApp Service (Optional)

```bash
cd whatsapp
npm install
npm start
# Scan the QR code with WhatsApp
```

### 🚀 Docker (One Command)

```bash
docker-compose up -d
```

### 🌐 Access Points

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:8000 |
| **API Docs (Swagger)** | http://localhost:8000/docs |
| **API Docs (ReDoc)** | http://localhost:8000/redoc |
| **WhatsApp Service** | http://localhost:3001 |

### 🖥️ Desktop App

```bash
cd desktop
npm install
npm start
```

---

## ⚙️ Configuration

### `backend/.env`

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL async connection string | ✅ |
| `DATABASE_URL_SYNC` | PostgreSQL sync connection string | ✅ |
| `SECRET_KEY` | JWT signing key | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | For AI features |
| `WHATSAPP_API_KEY` | Meta WhatsApp Business API key | For Business API |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Business phone ID | For Business API |
| `CELERY_BROKER_URL` | Redis URL for Celery | For background tasks |

### AI Prompt Customization

Configure AI behavior via the **AI Settings page** in the app (`/ai`). You can set:

- **System prompt** — the AI's personality and instructions
- **Temperature** (0–100) — creativity level
- **Max tokens** — response length

Example prompt template:
```
You are a professional sales assistant for {customer_name}.
Answer customer inquiries politely and concisely.
You can check product prices, order status, and help with purchases.
Respond in the customer's language.
```

---

## 📚 API Documentation

Once running, visit **http://localhost:8000/docs** for interactive Swagger docs.

### API Endpoints Overview

| Module | Endpoints |
|--------|-----------|
| **Auth** | `POST /api/auth/login`, `POST /api/auth/register` |
| **Dashboard** | `GET /api/dashboard/summary` |
| **Customers** | `GET/POST/PUT/DELETE /api/customers` |
| **Products** | `GET/POST/PUT/DELETE /api/products`, `/api/products/categories` |
| **Sales** | `GET/POST /api/sales` |
| **Purchases** | `GET/POST /api/purchases`, `/api/purchases/suppliers` |
| **Returns** | `GET/POST /api/returns` |
| **Inventory** | `GET /api/inventory/movements`, `POST /api/inventory/adjust`, `/api/inventory/warehouses` |
| **Expenses** | `GET/POST /api/expenses`, `/api/expenses/categories`, `/api/expenses/summary` |
| **Employees** | `GET/POST/PUT/DELETE /api/employees` |
| **Tasks** | `GET/POST /api/tasks`, `/api/tasks/projects` |
| **POS** | `GET /api/pos/products`, `GET /api/pos/customers` |
| **WhatsApp** | `GET/POST /api/whatsapp/messages`, `/api/whatsapp/templates`, `POST /api/whatsapp/send` |
| **AI** | `POST /api/ai/reply`, `GET/POST /api/ai/config` |
| **Reports** | `GET /api/reports/sales`, `GET /api/reports/summary` |
| **Notifications** | `GET /api/notifications`, `POST /api/notifications/{id}/read`, `POST /api/notifications/read-all` |
| **Audit** | `GET /api/audit` |
| **Permissions** | `GET/POST /api/permissions/roles`, `GET /api/permissions/my` |
| **Accounting** | `GET/POST /api/accounting/accounts` |
| **Health** | `GET /api/health` |

---

## 🐳 Deployment

### Docker Compose (Production)

```bash
# Set environment variables
export GEMINI_API_KEY=your-key
export SECRET_KEY=your-secret

# Start all services
docker-compose up -d --build

# Check logs
docker-compose logs -f
```

### Manual Deployment (Production)

**Backend:**
```bash
cd backend
gunicorn -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the dist/ folder with nginx or similar
```

---

## 🎨 Customization

### Adding a New Module

1. **Model:** Create `backend/app/models/your_model.py`
2. **Schema:** Create `backend/app/schemas/your_schema.py`
3. **API:** Create `backend/app/api/your_api.py`
4. **Register:** Update `__init__.py` files
5. **Frontend:** Add page + API service + route

### Customizing the AI

Edit the prompt template in the AI Settings page (`/ai`). You can make it act as:

- A sales assistant
- A technical support agent
- An order tracking bot
- A business consultant

### Adding WhatsApp Templates

Manage reusable message templates in the WhatsApp page (`/whatsapp`). Use variables like `{customer_name}`, `{invoice_number}`, etc.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary.

---

<div align="center" dir="rtl">

**ERP & CRM System** — 🚀 بنظامك في أيدك

</div>
