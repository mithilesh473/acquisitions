# Acquisitions API — Docker + Neon

This repository is configured to run with Neon in two modes:

- **Development:** Neon Local proxy via Docker, which creates ephemeral branches automatically.
- **Production:** Neon Cloud using the real `DATABASE_URL` (no Neon Local container).

## Prerequisites

- Docker Desktop
- A Neon account (for API key + project ID)

## Environment files

- `.env.development` — local dev with Neon Local
- `.env.production` — production with Neon Cloud

These files are already ignored by `.gitignore` (`.env.*`).

## Development (Neon Local)

1. Update `.env.development`:
   - `NEON_API_KEY` and `NEON_PROJECT_ID` from your Neon console
   - `DATABASE_URL` should point to the Neon Local service:
     - `postgres://neon:npg@neon-local:5432/<db_name>`
2. Start the dev stack:

   ```bash
   docker compose -f docker-compose.dev.yml --env-file .env.development up --build
   ```

3. Visit: `http://localhost:3000/`

Neon Local automatically creates an **ephemeral branch** when the container starts and deletes it on shutdown.  
To pick a specific parent branch, set `PARENT_BRANCH_ID` in `.env.development`.

## Production (Neon Cloud)

1. Update `.env.production` with your Neon Cloud connection string:
   - `DATABASE_URL=postgres://<user>:<password>@<project>.neon.tech/<db>?sslmode=require`
2. Start the production stack (app only):

   ```bash
   docker compose -f docker-compose.prod.yml --env-file .env.production up --build
   ```

There is **no** Neon Local proxy in production. The app connects directly to Neon Cloud.

## How `DATABASE_URL` switches between dev and prod

- **Dev:** `.env.development` sets `DATABASE_URL` to `postgres://neon:npg@neon-local:5432/<db_name>`
- **Prod:** `.env.production` sets `DATABASE_URL` to your Neon Cloud URL

The app reads `DATABASE_URL` at runtime and, in development, automatically configures the Neon serverless driver
to route requests through the Neon Local proxy.
