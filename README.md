# buildanddeploy

Express + Drizzle ORM API backed by [Neon Serverless Postgres](https://neon.tech).

## Local development (Docker + Neon Local)

Neon Local is a proxy that creates an **ephemeral Neon branch** when the container starts and deletes it when it stops, giving each dev session an isolated copy of the database.

### Prerequisites

- Docker Desktop
- A Neon account ([console.neon.tech](https://console.neon.tech))
- Your **Neon API key**, **Project ID**, and optionally a **Parent Branch ID**

### Steps

1. Copy the dev template and fill in your Neon credentials:

   ```bash
   cp .env.development .env.development.local
   # edit .env.development.local with your NEON_API_KEY, NEON_PROJECT_ID, etc.
   ```

   Or edit `.env.development` directly (it is gitignored).

2. Start both services:

   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

   The `db` service creates an ephemeral Neon branch; `app` connects to it via HTTP on `db:5432`.

3. Run migrations against the local branch (in a separate terminal):

   ```bash
   DATABASE_URL=postgres://neon:npg@localhost:5432/neondb npm run db:migrate
   ```

4. The API is available at `http://localhost:3000`.

5. When you stop the stack the ephemeral branch is automatically deleted:

   ```bash
   docker compose -f docker-compose.dev.yml down
   ```

## Production deployment (Neon Cloud)

1. Copy the prod template and set your Neon Cloud connection string:

   ```bash
   cp .env.production .env.production.local
   # set DATABASE_URL to your Neon pooled connection string
   ```

2. Build and run:

   ```bash
   docker compose -f docker-compose.prod.yml up --build -d
   ```

   The production image omits dev dependencies and uses the standard `node src/index.js` entrypoint. No Neon Local proxy is used.

## Environment variables

| Variable           | Dev                                  | Prod           | Description                                               |
| ------------------ | ------------------------------------ | -------------- | --------------------------------------------------------- |
| `DATABASE_URL`     | `postgres://neon:npg@db:5432/neondb` | Neon Cloud URL | Postgres connection string                                |
| `NEON_LOCAL_HOST`  | `db`                                 | —              | Enables HTTP proxy mode for the Neon serverless driver    |
| `NEON_API_KEY`     | required                             | —              | Neon API key (for Neon Local container)                   |
| `NEON_PROJECT_ID`  | required                             | —              | Neon project ID (for Neon Local container)                |
| `PARENT_BRANCH_ID` | optional                             | —              | Branch to create ephemeral branch from (defaults to main) |
| `PORT`             | `3000`                               | `3000`         | HTTP port                                                 |
| `NODE_ENV`         | `development`                        | `production`   | Node environment                                          |
