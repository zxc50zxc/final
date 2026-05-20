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

## Deploy on Render

The repo root is `final/` (parent of `nabd-system/`). Use the included **`render.yaml`** at repo root.

1. Push this repository to GitHub.
2. In [Render](https://render.com): **New → Blueprint** → connect the repo.
3. Render creates **nabd-api** (Python) and **nabd-web** (static React) with correct `rootDir`.
4. After deploy, open the **nabd-web** URL (frontend). API docs: `https://<nabd-api-host>/docs`.

**Manual setup (if not using Blueprint):**

| Service | Root Directory | Build | Start / Publish |
|---------|----------------|-------|-----------------|
| API | `nabd-system/backend` | `pip install -r requirements.txt` | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Web | `nabd-system/frontend` | `npm install && npm run build` | Publish: `dist` |

Set `PYTHON_VERSION=3.13.9` on the API service. Set `VITE_API_URL` to your API URL (no trailing slash).
