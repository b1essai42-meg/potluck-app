# PotluckShare

Potluck party management app - team development practice.

## Tech Stack

| Role | Tech |
|------|------|
| Frontend (Miwa) | Next.js 14 App Router + TypeScript |
| Backend  (Meg)  | Python + FastAPI + MongoDB |
| Infra/CI (Sayo) | Docker + GitHub Actions + pytest + Playwright |

## Branch Strategy

| Branch | Owner | Content |
|--------|-------|---------|
| `main` | - | production releases |
| `feature/backend-api` | Meg | FastAPI backend |
| `feature/frontend-setup` | Miwa | Next.js frontend |
| `feature/infra-ci` | Sayo | Docker + CI + tests |

## Quick Start

1. Copy `backend/.env.example` to `.env` and set `JWT_SECRET`  
2. Run `docker compose up -d`  
3. Open `http://localhost:8000/docs` (Swagger UI)  
4. Copy `frontend/.env.local.example` to `.env.local` then `npm run dev`  
