# Ephemeral — Decentralized API Marketplace

Rent, publish, and consume production APIs through an ultra-low latency cryptographic edge gateway.

## Architecture Overview

| Service | Port | Stack | Description |
|---------|------|-------|-------------|
| `gateway` | `8080` | Go (chi) | API Gateway — proxies live API traffic with rate limiting and usage tracking |
| `core-api` | `8081` | Go (chi) + PostgreSQL + Redis + Stripe | Core platform — auth, users, subscriptions, APIs, plans, webhooks |
| `admin-api` | `8082` | Go (chi) + PostgreSQL + Redis | Publisher administration — analytics, revenue, auditing |
| `web` | `3000` | Next.js 14 + React 18 + Tailwind v4 | Web client — consumer dashboards, publisher portals, marketing site, marketplace |

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| [Go](https://go.dev/doc/install) | **1.27.1** | Backend services (gateway, core-api, admin-api) |
| [Node.js](https://nodejs.org/) | **18.17+** (recommended 20.x) | Next.js web client |
| [npm](https://www.npmjs.com/) | Bundled with Node.js | Web dependencies |
| [Docker](https://docs.docker.com/get-docker/) | Latest | PostgreSQL & Redis (local infrastructure) |
| [Docker Compose](https://docs.docker.com/compose/install/) | v2+ | Orchestrate local services |

---

## 1. Infrastructure (PostgreSQL + Redis)

Start the database and cache via Docker Compose:

```bash
docker compose up -d
```

This spins up:
- **PostgreSQL 16** on `localhost:5432` — user: `postgres`, password: `postgres`, database: `ephemeral`
- **Redis 7** on `localhost:6379`

Verify both are healthy:

```bash
docker compose ps
```

To stop infrastructure:

```bash
docker compose down
# To also wipe data volumes:
docker compose down -v
```

---

## 2. Environment Variables

### Root (backend services share one `.env`)

Copy the example and adjust as needed:

```bash
cp .env.example .env
```

| Variable | Default (dev) | Required | Description |
|----------|---------------|----------|-------------|
| `PORT` | Per-service default | No | Override the listening port (rarely needed) |
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:5432/ephemeral?sslmode=disable` | Yes | PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379/0` | Yes | Redis connection string |
| `JWT_SECRET` | embedded dev key | **Production: YES** | 32+ char JWT signing secret |
| `STRIPE_SECRET_KEY` | `sk_test_mock_…` | No | Stripe secret key (leave default for local mock mode) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_mock_…` | No | Stripe webhook signing secret |

> **Note:** All three Go services (gateway, core-api, admin-api) read from the same env vars. `PORT` is only used if you explicitly want to override the service defaults (`8080` / `8081` / `8082`).

### Web client (`apps/web/.env.local`)

```bash
cd apps/web
cp .env.example .env.local
```

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_CORE_API` | `http://localhost:8081` | Core API base URL |
| `NEXT_PUBLIC_ADMIN_API` | `http://localhost:8082` | Admin API base URL |
| `NEXT_PUBLIC_GATEWAY` | `http://localhost:8080` | Gateway ingress URL |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Public app base URL (canonical links, sitemap) |

---

## 3. Install Dependencies

### Backend (Go modules)

Go modules are managed via the workspace ([go.work](file:///Users/darshit/Desktop/ephemeral-api/go.work)). Download all dependencies from the project root:

```bash
go mod download
```

### Web client

```bash
cd apps/web
npm install
```

---

## 4. Run the Project

You need **four separate terminal tabs** (or use a process manager like `tmux`, `overmind`, or your IDE's run configurations). The services are independent but the web client depends on the three APIs.

### Terminal 1 — Infrastructure (keep running)

```bash
docker compose up -d
```

### Terminal 2 — Gateway (`:8080`)

```bash
cd apps/gateway
go run cmd/server/main.go
```

Expected log line: `{"msg":"server listening","addr":":8080"}`

### Terminal 3 — Core API (`:8081`)

```bash
cd apps/core-api
go run cmd/server/main.go
```

Expected log lines:
- `connected to postgres`
- `connected to redis`
- Migrations auto-run on startup (tables: users, apis, plans, subscriptions, usage_events, indexes)
- `server listening` on `:8081`

### Terminal 4 — Admin API (`:8082`)

```bash
cd apps/admin-api
go run cmd/server/main.go
```

Expected: `server listening` on `:8082`

### Terminal 5 — Web Client (`:3000`)

```bash
cd apps/web
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Quick Start (Copy-Paste)

```bash
# 1. Infrastructure
docker compose up -d

# 2. Env files
cp .env.example .env
cd apps/web && cp .env.example .env.local && cd ../..

# 3. Dependencies
go mod download
cd apps/web && npm install && cd ../..

# 4. Run each service in its own terminal:
# (Terminal A)
cd apps/gateway && go run cmd/server/main.go
# (Terminal B)
cd apps/core-api && go run cmd/server/main.go
# (Terminal C)
cd apps/admin-api && go run cmd/server/main.go
# (Terminal D)
cd apps/web && npm run dev
```

---

## Production Builds

### Web client

```bash
cd apps/web
npm run build      # Builds optimized production bundle
npm run start      # Serves the built bundle on :3000
```

### Go services

```bash
cd apps/gateway    && go build -o bin/gateway cmd/server/main.go
cd apps/core-api   && go build -o bin/core-api cmd/server/main.go
cd apps/admin-api  && go build -o bin/admin-api cmd/server/main.go
```

Then run the resulting binaries with the appropriate env vars exported.

---

## Testing

Run all backend tests from the project root:

```bash
go test ./...
```

Run a specific package:

```bash
go test ./apps/core-api/internal/service/... -v
```

Web client lint / typecheck:

```bash
cd apps/web
npm run lint
```

---

## Project Structure

```
ephemeral-api/
├── apps/
│   ├── gateway/         # :8080 — API proxy, rate limit, usage middleware
│   ├── core-api/        # :8081 — Auth, subscriptions, APIs, plans, Stripe
│   │   └── migrations/  # PostgreSQL schema migrations (auto-run)
│   ├── admin-api/       # :8082 — Publisher analytics & revenue
│   └── web/             # :3000 — Next.js app (App Router)
│       ├── app/         # Route groups: (auth) / (consumer) / (marketing) / (marketplace) / publisher
│       ├── components/  # UI components per domain + shared ui/
│       └── lib/         # Hooks, API client, utilities
├── packages/
│   └── go-shared/       # Shared Go libs: auth, config, db, middleware, models, response
├── docker-compose.yml   # Postgres + Redis
├── go.work              # Go workspace
└── .env.example         # Backend env template
```

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `failed to connect to postgres` | Docker not running or compose not up | `docker compose up -d` then wait ~10s |
| `failed to connect to redis` | Same as above | Same fix |
| Web styles not loading (unstyled page) | Missing `postcss.config.mjs` | Ensure the file exists in `apps/web/`, then `rm -rf apps/web/.next && npm run dev` |
| 401 / JWT errors between services | `JWT_SECRET` mismatch | Ensure the same `JWT_SECRET` is used for core-api and admin-api |
| Port already in use | Another service on `8080/8081/8082/3000` | Kill the process or set a custom `PORT` env var per service |
| Migration failures | Stale DB state from older schemas | `docker compose down -v && docker compose up -d` (wipes data) |
