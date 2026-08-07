# RepoCipher AI

Understand any GitHub repository in minutes, not days.

RepoCipher AI ingests a public GitHub repository — its file tree and README — detects the tech stack, maps the architecture, and hands it to Claude to generate an onboarding summary: what the project does, how it's built, and where to start reading.

## How it works

1. **Paste a GitHub URL** — any public `owner/repo` or full `github.com/...` link.
2. **Ingestion** — the server pulls the repository's file tree, metadata, and README directly from the GitHub API. No cloning required.
3. **Analysis** — the file paths and README are sent to Claude, which detects the stack, infers the architecture, and writes an onboarding summary.
4. **Realtime progress** — job status (`pending → fetching → analyzing → completed`) streams to the client over Socket.IO.
5. **Read the result** — a Markdown onboarding doc covering the stack, structure, and entry points.

## Tech stack

**Client** — React 19, Vite, React Router, Tailwind CSS v4, Socket.IO client, react-markdown.

**Server** — Express, MongoDB (Mongoose), Redis + BullMQ (job queue), Socket.IO, the Anthropic SDK (Claude), JWT auth with Google OAuth, Cloudflare R2 (avatar storage).

## Project structure

```
.
├── client/                  # React + Vite frontend
│   └── src/
│       ├── auth/             # Auth context + protected route
│       ├── components/
│       │   ├── landing/      # Landing page sections (hero, demos, tabs, etc.)
│       │   └── ui/            # Shared primitives (Button, Reveal, icons, hooks)
│       ├── lib/               # Shared hooks
│       └── pages/             # Route-level pages
└── server/                  # Express API + background worker
    └── src/
        ├── config/            # Env, DB, Redis, logger
        ├── controllers/       # Route handlers
        ├── middleware/        # Auth, error handling
        ├── models/            # Mongoose schemas
        ├── queues/            # BullMQ ingestion queue + worker
        ├── routes/            # Express routers
        ├── services/          # GitHub ingestion, Claude, storage
        ├── sockets/           # Socket.IO server
        └── utils/             # GitHub API client, JWT, password helpers
```

## Prerequisites

- Node.js 20+
- MongoDB running locally (or an Atlas connection string)
- Redis running locally (used by BullMQ for the ingestion queue)
- An [Anthropic API key](https://console.anthropic.com/)

## Getting started

```bash
# install dependencies for both workspaces
npm install

# copy the server env template and fill in your values
cp server/.env.example server/.env

# run the client and server together
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:4000

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Runs the client and server together (via `concurrently`) |
| `npm run dev:client` | Runs only the Vite dev server |
| `npm run dev:server` | Runs only the API server (`node --watch`) |
| `npm run build:client` | Builds the client for production |

Inside `server/`, `npm start` runs the API without the file watcher.

## Environment variables

Set these in `server/.env` (see `server/.env.example` for the full template):

| Variable | Description |
| --- | --- |
| `PORT` | API server port (default `4000`) |
| `CORS_ORIGIN` / `CLIENT_URL` | URL of the client app, for CORS and OAuth redirects |
| `MONGODB_URI` | MongoDB connection string |
| `REDIS_URL` | Redis connection string (BullMQ) |
| `ANTHROPIC_API_KEY` | Claude API key used to generate onboarding summaries |
| `GITHUB_TOKEN` | Optional — raises GitHub API rate limits during ingestion |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Secrets for signing access/refresh tokens |
| `JWT_ACCESS_TTL` / `JWT_REFRESH_TTL_DAYS` | Token lifetimes |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_CALLBACK_URL` | Google OAuth login (optional) |
| `CLOUDFLARE_R2_*` | R2 bucket credentials for avatar uploads (optional) |

## API overview

All routes are mounted under `/api`, except `/health`.

| Route | Description |
| --- | --- |
| `GET /health` | Service health check |
| `POST /api/auth/signup` | Create an account |
| `POST /api/auth/login` | Log in |
| `POST /api/auth/refresh` | Refresh the access token |
| `POST /api/auth/logout` | Log out |
| `GET /api/auth/me` | Current user (requires auth) |
| `GET /api/auth/google` / `GET /api/auth/google/callback` | Google OAuth flow |
| `POST /api/users/me/avatar` | Upload profile avatar (requires auth) |
| `POST /api/analyses` | Start a repository analysis job (requires auth) |
| `GET /api/analyses` | List your past analyses (requires auth) |
| `GET /api/analyses/:id` | Get a specific analysis job (requires auth) |

Analysis jobs run on a BullMQ queue backed by Redis; progress is pushed to the client in realtime over a Socket.IO room keyed by job ID.

## Status

RepoCipher AI is under active development. The landing page is a fully interactive product demo — the live repository analysis (stack detection, architecture mapping, AI summary) runs through the authenticated `/app` flow described above.
