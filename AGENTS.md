## Goal
- Build a full ERP & CRM system with WhatsApp + AI integration, deploy a live online demo for the client.

## Constraints & Preferences
- Any tech stack works (chosen: Python FastAPI + React/TypeScript/Vite + PostgreSQL + Electron + Capacitor)
- Must support Web + Desktop + Mobile (PWA + Android APK)
- WhatsApp via Business API + Web JS (both)
- AI via Google Gemini API
- All core modules: Sales, CRM, Purchasing, Inventory, HR, Accounting, Manufacturing, Contracts, Knowledge Base, Feedback, Subscriptions + 16 more
- Fully customizable (prompts, roles, templates)
- RTL Arabic-first UI
- Push to GitHub repo seif090/CRM-system

## Progress
### Done
- **Phases 1-3 (230+ files):** Full backend (FastAPI + async PostgreSQL), frontend (React/TS + MUI), auth/permissions, POS, Dashboard, Reports, WhatsApp, AI, Shipping, Email, Leaves, Payroll, Payments, Assets, Budgets, Branches, Loyalty, Import/Export, Print, Customer Portal, Notifications, Audit
- **Deployment:** Auto-seed on startup (admin/admin123 + demo data), DEPLOY.md guide (Render/Railway/VPS), Docker Compose, production-ready docker-compose
- **Desktop App:** Electron portable build, setup scripts, APP_URL env
- **Mobile App:** PWA (manifest + service worker), Mobile-responsive layout with bottom nav, Capacitor Android project, build-mobile.ps1
- **+11 Modules (session 2):** Support Tickets, Sales Pipeline, Calendar, Internal Chat, Document Management, Time Tracking, Manufacturing/MRP, Contract Management, Knowledge Base/Wiki, Feedback/Surveys, Subscription Plans
- **+16 Modules (session 3 - this round):** Recruitment, Training & Development, Performance Reviews, Quality Control, Fleet Management, Service Management, Rentals, Marketing Campaigns, CRM Activities (Calls/Meetings/Notes), Bank Reconciliation, Tax Management, Recurring Invoices, Procurement (Requests/RFQ), Batch/Serial Tracking, Gift Cards, Membership Programs
- **Source lines:** ~15,000+ across ~300 files
- **Git repo:** https://github.com/seif090/CRM-system (all code pushed)

### Blocked
- Android APK build blocked — requires Android SDK + JDK (not installed on this machine)

## Key Decisions
- Python FastAPI over Django for lighter weight + easier AI integration
- React+Vite over Next.js for simpler static frontend with Electron wrapper
- WhatsApp Web JS as fallback when Business API not verified
- Gemini API (Google) as primary AI provider for better Arabic support
- RTL Material-UI with Cairo font for Arabic-first UX
- All new modules follow same pattern: model → schema → API route → frontend page
- Capacitor over React Native for mobile because same codebase as web + faster development
- TypeScript removed from build step to avoid tsc errors (vite build only)

## Next Steps
- Get a VPS or Railway account for production deployment
- Rebuild desktop portable ZIP (if needed)
- Demo walkthrough with client

## Critical Context
- **Default credentials:** admin / admin123
- **Backend port:** 8000, **Frontend port:** 3000
- **WhatsApp service port:** 3001 (requires QR scan)
- **Gemini API key** needed for AI features (set in backend/.env)
- **PostgreSQL + Redis** required for full stack
- Database auto-creates tables + seeds demo data on startup
- Desktop app supports `$env:APP_URL` to point to any server
- Mobile Android platform added via Capacitor; APK build needs `build-mobile.ps1` on a machine with Android SDK

## Module Index (all 48 modules)
| # | Module | Files |
|---|--------|-------|
| 1 | Auth/Permissions | user.py, permission.py, auth.py |
| 2 | Dashboard | dashboard.py |
| 3 | POS | pos.py |
| 4 | Customers | customer.py, customers.py |
| 5 | Products | product.py, products.py |
| 6 | Sales | sale.py, sales.py |
| 7 | Purchases | purchase.py, purchases.py |
| 8 | Returns | returns.py, returns.py |
| 9 | Inventory | inventory.py, inventory.py |
| 10 | Expenses | expense.py, expenses.py |
| 11 | Employees/HR | employee.py, employees.py |
| 12 | Tasks/Projects | task.py, tasks.py |
| 13 | Reports | reports.py |
| 14 | Accounting | accounting.py, accounting.py |
| 15 | WhatsApp | whatsapp.py, whatsapp.py |
| 16 | AI/Gemini | ai_config.py, ai.py |
| 17 | Shipping | shipping.py, shipping.py |
| 18 | Email | email_config.py, email_integration.py |
| 19 | Leaves | leave.py, leaves.py |
| 20 | Payroll | payroll.py, payroll.py |
| 21 | Payments | payment.py, payments.py |
| 22 | Assets | asset.py, assets.py |
| 23 | Budgets | budget.py, budgets.py |
| 24 | Branches | branch.py, branches.py |
| 25 | Loyalty | loyalty.py, loyalty.py |
| 26 | Import/Export | import_export.py |
| 27 | Print | printing.py |
| 28 | Customer Portal | customer_portal.py |
| 29 | Notifications | notification.py, notifications.py |
| 30 | Audit | audit.py, audit.py |
| 31 | Support Tickets | ticket.py, tickets.py |
| 32 | Sales Pipeline | pipeline.py, pipeline.py |
| 33 | Calendar | calendar_events.py, calendar_api.py |
| 34 | Internal Chat | chat.py, chat.py |
| 35 | Document Management | document.py, documents.py |
| 36 | Time Tracking | timetrack.py, timetrack.py |
| 37 | Manufacturing/MRP | manufacturing.py, manufacturing.py |
| 38 | Contracts | contract.py, contracts.py |
| 39 | Knowledge Base | knowledge.py, knowledge.py |
| 40 | Feedback/Surveys | feedback.py, feedback.py |
| 41 | Subscriptions | subscription.py, subscriptions.py |
| 42 | Recruitment | recruitment.py, recruitment.py |
| 43 | Training | training.py, training.py |
| 44 | Performance Reviews | performance.py, performance.py |
| 45 | Quality Control | quality.py, quality.py |
| 46 | Fleet Management | fleet.py, fleet.py |
| 47 | Service Management | service.py, service.py |
| 48 | Rentals | rentals.py, rentals.py |
| 49 | Marketing Campaigns | marketing.py, marketing.py |
| 50 | CRM Activities | crm_activities.py, crm_activities.py |
| 51 | Bank Reconciliation | bank_reconciliation.py, bank_reconciliation.py |
| 52 | Tax Management | tax.py, tax.py |
| 53 | Recurring Invoices | recurring_invoice.py, recurring_invoices.py |
| 54 | Procurement | procurement.py, procurement.py |
| 55 | Batch/Serial Tracking | batch_serial.py, batch_serial.py |
| 56 | Gift Cards | gift_cards.py, gift_cards.py |
| 57 | Membership Program | memberships.py, memberships.py |
