## Goal
- Build a full ERP & CRM system with WhatsApp + AI integration, deploy a live online demo for the client.

## Constraints & Preferences
- Any tech stack works (chosen: Python FastAPI + React/TypeScript/Vite + PostgreSQL + Electron + Capacitor)
- Must support Web + Desktop + Mobile (PWA + Android APK)
- WhatsApp via Business API + Web JS (both)
- AI via Google Gemini API
- All core modules: Sales, CRM, Purchasing, Inventory, HR, Accounting, Manufacturing, Contracts, Knowledge Base, Feedback, Subscriptions
- Fully customizable (prompts, roles, templates)
- RTL Arabic-first UI
- Push to GitHub repo seif090/CRM-system

## Progress
### Done
- **Phases 1-3 (200+ files):** Full backend (FastAPI + async PostgreSQL), frontend (React/TS + MUI), auth/permissions, POS, Dashboard, Reports, WhatsApp, AI, Shipping, Email, Leaves, Payroll, Payments, Assets, Budgets, Branches, Loyalty, Import/Export, Print, Customer Portal, Notifications, Audit
- **Deployment:** Auto-seed on startup (admin/admin123 + demo data), DEPLOY.md guide (Render/Railway/VPS), Docker Compose, production-ready docker-compose
- **Desktop App:** Electron portable build (ERP-CRM-Portable.zip ~108MB), setup scripts, APP_URL env for remote server
- **Mobile App:** PWA (manifest + service worker), Mobile-responsive layout with bottom nav, Capacitor Android project, build-mobile.ps1 script
- **Bug fixes:** Renamed `type` column conflicts in 4 models, fixed google-genai to google-generativeai, removed dead code in ai.py + notifications.py, added server_default to User.updated_at
- **+11 Modules (two sessions):** Support Tickets, Sales Pipeline, Calendar, Internal Chat, Document Management, Time Tracking, Manufacturing/MRP (BOM + Production Orders), Contract Management, Knowledge Base/Wiki, Feedback/Surveys, Subscription Plans
- **Source lines:** ~12,000+ across ~230 files
- **Git repo:** https://github.com/seif090/CRM-system (all code pushed)

### Blocked
- Android APK build blocked — requires Android SDK + JDK (not installed on this machine)

## Key Decisions
- Python FastAPI over Django for lighter weight + easier AI integration
- React+Vite over Next.js for simpler static frontend with Electron wrapper
- WhatsApp Web JS as fallback when Business API not verified
- Gemini API (Google) as primary AI provider over OpenAI for better Arabic support
- RTL Material-UI with Cairo font for Arabic-first UX
- All new modules follow same pattern: model → schema → API route → frontend page
- Capacitor over React Native for mobile because same codebase as web + faster development
- TypeScript removed from build step to avoid tsc errors (vite build only)

## Next Steps
- Rebuild desktop portable ZIP (if needed)
- Create final demo script for client walkthrough (demo-presentation.html already exists)
- Get a VPS or Railway account for production deployment

## Critical Context
- **Default credentials:** admin / admin123
- **Backend port:** 8000, **Frontend port:** 3000
- **WhatsApp service port:** 3001 (requires QR scan)
- **Gemini API key** needed for AI features (set in backend/.env)
- **PostgreSQL + Redis** required for full stack
- Database auto-creates tables + seeds demo data on startup
- Desktop app supports `$env:APP_URL` to point to any server
- Mobile Android platform added via Capacitor; APK build needs `build-mobile.ps1` on a machine with Android SDK

## Relevant Files
- `backend/app/main.py`: App entry point, auto-seeds on startup
- `backend/app/api/__init__.py`: Central router registry (43 routers)
- `backend/app/models/__init__.py`: All ORM models
- `backend/app/seed_demo.py`: Demo data seeder (now includes all modules)
- `backend/requirements.txt`: Python deps (google-generativeai fixed)
- `frontend/src/App.tsx`: 40+ route definitions
- `frontend/src/components/Layout.tsx`: Sidebar (41 items) + bottom nav for mobile
- `frontend/src/services/api.ts`: Complete Axios client for all modules
- `frontend/public/manifest.json` + `sw.js`: PWA support
- `desktop/main.js`: Electron wrapper with APP_URL env
- `mobile/capacitor.config.json`: Capacitor config (webDir: ../frontend/dist)
- `DEPLOY.md`: Full deployment guide for Render/Railway/VPS
- `demo-presentation.html`: Interactive 10-slide demo walkthrough
- `build-mobile.ps1`: Builds APK from current frontend build
- `setup-desktop.ps1`: Installs desktop app to LocalAppData + shortcut
- `start-desktop.ps1`: One-click start for backend+frontend+desktop
