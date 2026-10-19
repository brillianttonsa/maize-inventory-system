# Maize Inventory System

Maize Inventory System helps maize millers track procurement, production, sales, operating expenses, stock movement, and business reports.

The repository contains a React frontend and a NestJS API backed by PostgreSQL and Drizzle ORM.

## Features

- Track maize procurement, milling batches, flour and bran sales, and expenses.
- View current stock, stock movement history, and production balances.
- Review dashboard totals, including sales revenue for today.
- Export business reports and CSV data.
- Use server-side pagination for sales, expenses, procurement, production, and inventory movement lists.
- Cache and refresh server data with TanStack Query.
- Explore the API using the OpenAPI specification and Swagger UI.

## Technology

| Area | Stack |
| --- | --- |
| Frontend | React, TypeScript, Vite, TanStack Query |
| Backend | NestJS, TypeScript, Drizzle ORM |
| Database | PostgreSQL |
| Authentication | JWT |

## Requirements

- Node.js 20 or newer
- npm
- A PostgreSQL database

## Local development

The API and frontend run in separate terminals.

### 1. Configure and start the backend

```powershell
cd maize-inventory-system\backend
npm ci
```

Create `backend/.env` with your local configuration:

```env
PORT=3000
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<database>
JWT_ACCESS_SECRET=<long-random-secret>
JWT_ACCESS_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Apply the committed database migrations:

```powershell
npm run db:migrate
```

Start the API:

```powershell
npm run start:dev
```

The API base URL is `http://localhost:3000/api/v4`.

### 2. Configure and start the frontend

In a second terminal:

```powershell
cd maize-inventory-system\frontend
npm ci
```

The frontend defaults to `http://localhost:3000/api/v4`. To use a different API address, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api/v4
```

Start the frontend:

```powershell
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Data fetching and pagination

TanStack Query handles server reads and writes across the sales, expenses, procurement, production, dashboard, and inventory screens. It caches recent responses, displays previous results while pages load, and refreshes related queries after successful mutations. The default query cache freshness is 30 seconds.

List endpoints accept `page` and `limit` query parameters. Pagination defaults to page 1 and 20 records per page when either parameter is supplied; `limit` is capped at 100. Paginated responses have this shape:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "limit": 20,
  "totalPages": 0
}
```

For compatibility, requests without `page` or `limit` return the legacy array response. The application requests only the current page for its tables; a full list may still be fetched when a user explicitly exports it. Inventory movement pages include per-item running balances computed by the database.

## API documentation

With the backend running:

- Swagger UI: [http://localhost:3000/api/v4/docs](http://localhost:3000/api/v4/docs)
- OpenAPI JSON: [http://localhost:3000/api/v4/openapi.json](http://localhost:3000/api/v4/openapi.json)

Swagger UI loads its assets from a CDN and therefore requires an internet connection. See the [backend README](./maize-inventory-system/backend/README.md) for backend commands and API details.

## Build and tests

Run commands from the relevant project directory.

Backend:

```powershell
cd maize-inventory-system\backend
npm run build
npm test -- --runInBand
```

Frontend (the build includes a TypeScript check):

```powershell
cd maize-inventory-system\frontend
npm run build
```

## Project layout

```text
maize-inventory-system/
  backend/   NestJS API, Drizzle schema and migrations, backend tests
  frontend/  React application
```