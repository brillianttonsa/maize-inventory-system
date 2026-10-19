# Maize Inventory System API

The backend is a NestJS API for managing maize procurement, production, sales, expenses, stock movements, user settings, and reports. It uses PostgreSQL through Drizzle ORM.

For the complete application overview and frontend setup, see the [repository README](../../README.md).

## Stack

- Node.js 20+
- NestJS 11 and TypeScript
- PostgreSQL
- Drizzle ORM with the `node-postgres` driver
- JWT authentication
- `class-validator` and `class-transformer` request validation

## Setup

Run the following commands from the `backend` directory:

```powershell
npm ci
```

Create `backend/.env`:

```env
PORT=3000
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<database>
JWT_ACCESS_SECRET=<long-random-secret>
JWT_ACCESS_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

`DATABASE_URL`, `JWT_ACCESS_SECRET`, and `JWT_ACCESS_EXPIRES_IN` are required. `PORT`, `CLIENT_URL`, and `NODE_ENV` have defaults.

Apply the committed migrations:

```powershell
npm run db:migrate
```

Start in watch mode:

```powershell
npm run start:dev
```

The API listens on the configured port and uses the `/api/v4` global prefix. With the default port, the API base URL is `http://localhost:3000/api/v4`.

## Database commands

Run these from `backend`:

| Command | Purpose |
| --- | --- |
| `npm run db:migrate` | Apply committed Drizzle migrations |
| `npm run db:generate` | Generate migrations from schema changes |
| `npm run db:push` | Push the schema directly to the configured database; useful for local development |
| `npm run db:studio` | Open Drizzle Studio |

Review and commit generated migrations before using schema changes in production. Back up production data before applying migrations.

## API documentation

Start the API and open:

- Swagger UI: `http://localhost:3000/api/v4/docs`
- OpenAPI document: `http://localhost:3000/api/v4/openapi.json`

Protected endpoints use a JWT bearer token. Obtain a token through `POST /api/v4/auth/login`, then use the **Authorize** control in Swagger UI or send an `Authorization: Bearer <token>` header. Swagger UI assets are loaded from a CDN, so the interactive page requires internet access; the JSON document is served by the API itself.

## Main endpoints

All paths below are relative to `/api/v4`.

| Path | Methods | Purpose |
| --- | --- | --- |
| `/auth/signup`, `/auth/login` | `POST` | Create an account and log in |
| `/auth/forgot-password`, `/auth/reset-password/{token}` | `POST` | Password recovery |
| `/sales`, `/sales/{id}` | `GET`, `POST`, `PUT`, `DELETE` | Sales records |
| `/expenses`, `/expenses/{id}` | `GET`, `POST`, `PUT`, `DELETE` | Expense records |
| `/expenses/summary` | `GET` | All-time expense totals grouped by category |
| `/procurement`, `/procurement/{id}` | `GET`, `POST`, `PUT`, `DELETE` | Procurement orders |
| `/production`, `/production/{id}` | `GET`, `POST`, `PUT`, `DELETE` | Production batches |
| `/production/chart-data` | `GET` | Daily production totals for a date range |
| `/inventory-movements` | `GET` | Inventory history, filters, and running balances |
| `/recent-activities` | `GET` | Six most recent inventory activities |
| `/dashboard-summary` | `GET` | Aggregated dashboard totals and current stock |
| `/settings/profile`, `/settings/password` | `PUT` | Update profile and password |
| `/reports/generate`, `/reports/comprehensive`, `/reports/archive-and-reset` | `POST`, `GET`, `POST` | Generate or download reports |
| `/contact` | `POST` | Submit a public contact message |

The OpenAPI document is the source of truth for request fields, response descriptions, and authentication requirements.

## Pagination

The sales, expenses, procurement, production, and inventory movement list endpoints accept `page` and `limit` query parameters. Supplying either activates pagination; defaults are `page=1` and `limit=20`. The maximum `limit` is 100.

Paginated list responses use this structure:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "limit": 20,
  "totalPages": 0
}
```

List requests that omit both parameters keep the legacy array response for compatibility. Inventory movement requests can also specify `item` and `source`; the database applies the filters and computes each movement's running balance before returning the requested page. Exports may intentionally request all matching records.

Production chart data accepts `from` and `to` dates in `YYYY-MM-DD` format. The dashboard summary accepts a `date` in that format to calculate sales revenue for that day.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run start:dev` | Run the API in watch mode |
| `npm run build` | Compile the backend |
| `npm run start:prod` | Run the compiled backend |
| `npm test -- --runInBand` | Run backend unit tests |
| `npm run test:cov` | Run tests with coverage |
| `npm run lint` | Run ESLint (the configured script applies fixes) |

## Modules

Feature code is under `src/modules/`. The app currently wires these modules:

- `auth`
- `contacts`
- `expenses`
- `inventory`
- `procurement`
- `production`
- `reports`
- `sales`
- `settings`

The database connection and Drizzle schemas are under `src/db/`; migrations are in `drizzle/`. Focused tests are colocated with source files as `*.spec.ts`.
