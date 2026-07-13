# Maize-Inventory-System Hub Backend

Backend API for **Maize-Inventory-System** — a B2B SaaS platform for wholesale maize/flour distributors in Tanzania. It tracks the full mill-to-market flow: raw maize procurement, milling production batches, sales to wholesale customers, operating expenses, stock movements, and business reports — plus subscription billing for the platform itself.

Originally built as an Express + raw SQL app; this is the migrated version on **NestJS + Drizzle ORM + PostgreSQL**.

---

## Tech stack

- **Framework:** NestJS 10
- **ORM:** Drizzle ORM (`drizzle-orm` 0.45+, `node-postgres` driver)
- **Database:** PostgreSQL
- **Auth:** JWT (`jsonwebtoken`) + `bcrypt` password hashing
- **Validation:** `class-validator` / `class-transformer` via Nest's `ValidationPipe`
- **Language:** TypeScript

## Domain model

| Module | Purpose |
|---|---|
| `auth` | Signup, login, forgot/reset password |
| `procurement` | Recording maize purchases from suppliers |
| `production` | Milling batches: maize in → flour + bran out, resource usage |
| `sales` | Sales of flour/bran to wholesale customers |
| `expenses` | Operating costs (sacks, electricity, transport, etc.) |
| `inventory` | Computed stock movements and recent-activity feed, derived from the above |
| `reports` | CSV exports per domain + a comprehensive JSON business report |
| `subscriptions` | Platform billing: plans, trials, payments (new — not in the original app) |
| `contacts` | Public contact form submissions |
| `settings` | User profile and password management |



---

## Project structure

```
.
├── main.ts                  # entrypoint, global prefix + validation pipe
├── app.module.ts            # wires every feature module together
├── config/
│   └── env.ts                # typed env loader, throws on missing required vars
├── db/
│   ├── db.module.ts          # global Drizzle connection provider (DB_PROVIDER)
│   └── schema/index.ts       # Drizzle table definitions
└── modules/
    ├── auth/
    ├── procurement/
    ├── production/
    ├── sales/
    ├── expenses/
    ├── inventory/
    ├── reports/
    ├── subscriptions/
    ├── contacts/
    └── settings/
```

Each feature module follows the same shape: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/*.dto.ts`.

---

## Getting started

### 1. Prerequisites
- Node.js 20+
- A PostgreSQL database (local, Docker, or hosted — see deployment guide below)

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Create a `.env` file in the project root:
```env
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/staples_hub
JWT_ACCESS_SECRET=replace-with-a-long-random-string
JWT_ACCESS_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
`config/env.ts` will throw on startup if `DATABASE_URL`, `JWT_ACCESS_SECRET`, or `JWT_ACCESS_EXPIRES_IN` are missing.

### 4. Apply the database schema
This project doesn't yet include committed migrations — push the Drizzle schema directly for local development:
```bash
npx drizzle-kit push
```
(Add a `drizzle.config.ts` pointing at `db/schema/index.ts` if you don't already have one — see the deployment guide for a production-safe alternative using generated migrations.)

### 5. Run it
```bash
npm run start:dev   # watch mode
npm run build && npm run start:prod   # production build
```

The API will be available at `http://localhost:3000/api/...`.

---

## Auth model

Every protected route expects:
```
Authorization: Bearer <jwt>
```
Get a token from `POST /api/auth/login`. Tokens are signed with `JWT_ACCESS_SECRET` and expire after `JWT_ACCESS_EXPIRES_IN`. There's no refresh-token flow yet — when the token expires, the user logs in again.

There is currently **no role-based access control** — every guarded route just checks "is this a valid logged-in user," including the subscription-plan admin endpoints (`POST/PATCH /subscriptions/plans`). Add a roles guard before exposing those publicly.

---

## Known limitations (read before production)

- Email is **console-logged, not sent** (password reset, contact form) — no email provider is wired up.
- **No automated tests** currently ship with the migrated modules.
- **Subscription logic not complete**
