# CareerMate AI — Jonathan

Full-stack CareerMate AI app (React frontend + Express backend).

## Structure

```
Jonathan/
├── frontend/     React + TypeScript + Vite
├── backend/      Express + MongoDB + Mongoose
├── requirements/ Feature specs
└── package.json  Run both apps together
```

## Getting started

```bash
cd Jonathan
npm install
cp backend/.env.example backend/.env   # then edit if needed
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:3000

## Prerequisites

- Node.js v20+
- MongoDB (local or MongoDB Atlas)

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start frontend and backend together |
| `npm run dev:frontend` | Frontend only |
| `npm run dev:backend` | Backend only |
| `npm run build:frontend` | Production build |

## Latest updates synced from repo

- Monorepo structure (`frontend/` + `backend/`)
- Security: Helmet, rate limiting, AES-256-GCM email encryption
- Email services via AWS SES
- Backend tests (Jest) and frontend E2E tests (Playwright)
- Dashboard, onboarding, and settings pages
