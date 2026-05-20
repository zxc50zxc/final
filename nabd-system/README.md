# Nabd System | نظام نبض المشاعر الذكي

Smart crowd-management platform for health centers in the holy sites (Hajj/Umrah).

## Quick Start

### Backend

Use **Python 3.12 or 3.13** (3.14 may fail to build `pydantic-core`).

```bash
cd backend
python3.13 -m venv .venv   # or: python3.12 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

- Frontend: http://localhost:5173
- API docs: http://localhost:8000/docs

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Pilgrim (حاج) | pilgrim@nabd.sa | pilgrim123 |
| Staff (موظف) | staff@nabd.sa | staff123 |
| Admin (مسؤول) | admin@nabd.sa | admin123 |

## Tech Stack

- **Backend:** FastAPI, SQLAlchemy, SQLite, JWT, Plotly
- **Frontend:** React, Vite, TypeScript, Tailwind, Leaflet, react-plotly.js, i18next

## Features (MVP)

- Smart routing to least crowded health center
- Appointment booking
- Medication request workflow
- Staff queue management
- Admin analytics dashboard (heatmap, peak hours)
