# Wellness Sessions App

Full-stack app with React (Vite) + Node/Express + MongoDB + JWT.

## Features
- Register/Login with hashed passwords (bcrypt) and JWT
- Public published sessions
- Draft and publish own sessions
- Auto-save drafts after 5s of inactivity

## Dev Setup
1. Backend
   - Copy `backend/.env.example` to `backend/.env` and set values
   - Install deps and run:

   Windows CMD:
   - Install: `cd backend && pnpm i`
   - Start: `pnpm dev`

2. Frontend
   - Install and run:

   Windows CMD:
   - Install: `cd frontend && pnpm i`
   - Start: `pnpm dev`

- Frontend dev server proxies `/api` to `http://localhost:3000`.

### Start Mongo quickly (optional via Docker)
- Install Docker Desktop, then run in repo root:
  - `docker compose up -d`
  - This exposes MongoDB on `mongodb://127.0.0.1:27017/wellness_app`.

## API
- POST /api/register {email,password}
- POST /api/login {email,password} -> {token,user}
- GET /api/sessions
- GET /api/my-sessions (Bearer token)
- GET /api/my-sessions/:id (Bearer token)
- POST /api/my-sessions/save-draft (Bearer token)
- POST /api/my-sessions/publish (Bearer token)

## Deploy
Backend (Render or Railway):
- Repo: point to `backend/` or set root to repo and working dir to `backend`
- Build command: `pnpm i`
- Start command: `pnpm start`
- Env vars: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_ORIGIN` (your frontend domain)

Frontend (Netlify or Vercel):
- Set environment variable `VITE_API_BASE` to your backend origin (e.g., `https://your-api.onrender.com`)
- Netlify: base `frontend/`, build `pnpm i && pnpm build`, publish `frontend/dist`
- Vercel: project in `frontend/`, framework Vite, build `pnpm build`

Optional Docker:
- Backend: build `docker build -t wellness-backend ./backend` and run with envs and port 3000
- Frontend: build `docker build -t wellness-frontend ./frontend` and serve on port 80

### Linode (single VM) with Docker Compose
See `DEPLOY-LINODE.md` for a production `docker-compose.prod.yml` stack (Mongo + backend + frontend with Nginx proxy).

### AWS EC2 (single instance) with Docker Compose
See `DEPLOY-EC2.md` for EC2 steps on Amazon Linux or Ubuntu.
