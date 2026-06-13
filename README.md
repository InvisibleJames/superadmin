# MedReco — Super Admin

Internal back-office for the **MedReco** Electronic Medical Records (EMR) platform.
System Administrators use this dark, data-dense console to manage clinics, branches,
users, patients, roles, imports/exports and audit logs across large healthcare
organizations.

This repo implements the design delivered in the Claude Design handoff
(`Super Admin MedReco-handoff.zip`) as a real application:

- **`frontend/`** — [Nuxt 4](https://nuxt.com) SPA/SSR + [Tailwind CSS v4](https://tailwindcss.com), faithfully recreating the MedReco design system.
- **`backend/`** — [Laravel 13](https://laravel.com) REST API backed by **MySQL**, with token auth via [Sanctum](https://laravel.com/docs/sanctum).

> **Status — Foundation + Users end-to-end.** The app shell (sidebar, top bar),
> the authentication flow, and the **Users Management** screen are fully wired to
> the API. The remaining screens (Clinics, Branches, Patients, Roles, Audit Logs,
> Boarding Time, etc.) render a consistent placeholder and are slated to follow
> the same pattern.

---

## Architecture

```
superadmin/
├── backend/                 # Laravel 13 API (MySQL + Sanctum)
│   ├── app/Models/          # User, Role, Clinic, Branch
│   ├── app/Http/Controllers/Api/  # Auth, User, Meta
│   ├── app/Http/Resources/  # UserResource
│   ├── database/migrations/ # roles, clinics, branches, users profile fields
│   └── database/seeders/    # seed data ported from the design prototype
├── frontend/                # Nuxt 4 + Tailwind v4 admin console
│   ├── app/components/ui/    # Design-system components (Button, Badge, StatCard…)
│   ├── app/components/app/   # Sidebar, Topbar
│   ├── app/composables/      # useApi, useUsers, useNav
│   ├── app/stores/auth.ts    # Pinia auth store (token in cookie)
│   ├── app/pages/            # login, users, [section] placeholder
│   └── app/assets/css/main.css  # design tokens → Tailwind theme
└── Super Admin MedReco-handoff.zip  # original Claude Design handoff
```

### Design system

The full token set from the handoff (`colors`, `typography`, `spacing`,
`elevation`) is mirrored in `frontend/app/assets/css/main.css`: a near-black
canvas, charcoal cards, teal (`#18C7B5`) as the single hero accent, blue
secondary, fixed role hues, Geist / Geist Mono type, 8px default radius, soft
dark-tuned shadows, and 150ms ease-out motion.

---

## Backend setup (Laravel + MySQL)

```bash
cd backend
composer install
cp .env.example .env          # configured for MySQL (db: medreco)
php artisan key:generate

# Create the MySQL database, then:
php artisan migrate --seed
php artisan serve              # http://localhost:8000
```

`.env.example` targets MySQL out of the box:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=medreco
DB_USERNAME=root
DB_PASSWORD=
FRONTEND_URL=http://localhost:3000   # CORS origin for the Nuxt app
```

### Seeded login

| Email               | Password   | Role            |
| ------------------- | ---------- | --------------- |
| `admin@medreco.com` | `password` | Super Admin     |

The seeders also load 20 clinic users, 14 clinics, and 18 branches ported
directly from the design prototype's mock data.

### API

| Method | Endpoint            | Description                                            |
| ------ | ------------------- | ----------------------------------------------------- |
| POST   | `/api/auth/login`   | Authenticate, returns a Sanctum bearer token          |
| GET    | `/api/auth/me`      | Current user                                          |
| POST   | `/api/auth/logout`  | Revoke the current token                              |
| GET    | `/api/meta`         | Roles, clinics, branches & statuses for filters/forms |
| GET    | `/api/users`        | Paginated, filterable (`q`, `role_id`, `status`, `clinic_id`, `branch_id`), sortable (`sort`, `dir`) |
| GET    | `/api/users/stats`  | Aggregate counts for the stat cards                   |
| POST   | `/api/users`        | Create a user                                         |
| PUT    | `/api/users/{id}`   | Update a user                                         |
| DELETE | `/api/users/{id}`   | Delete a user                                         |
| POST   | `/api/users/bulk`   | Bulk `activate` / `deactivate` / `delete`             |

All routes except `login` require `Authorization: Bearer <token>`.

---

## Frontend setup (Nuxt + Tailwind)

```bash
cd frontend
npm install
cp .env.example .env          # NUXT_PUBLIC_API_BASE=http://localhost:8000/api
npm run dev                   # http://localhost:3000
```

The auth token is stored in an `httpOnly`-style cookie (`medreco_token`) and
attached to every API request by the `useApi()` composable. A global route
middleware redirects unauthenticated visitors to `/login`.

---

## Testing

**Backend feature tests** (PHPUnit, runs on an in-memory SQLite DB — no setup):

```bash
cd backend
php artisan test            # 33 tests: auth, users, clinics, branches, patients, SA users, meta, OAuth
```

**API smoke test** — boots the API on a throwaway SQLite DB, logs in, and
exercises every endpoint, then tears down (never touches your MySQL data):

```bash
./scripts/smoke.sh          # 18 checks across auth + all resources
PORT=8899 ./scripts/smoke.sh
```

**Frontend** builds type-check the pages/components:

```bash
cd frontend && npm run build
```

## Notes

- The local dev `.env` in this repo may use SQLite for quick verification, but
  the committed `.env.example` and the project's target stack is **MySQL**, per
  the brief.
- Fonts (Geist / Geist Mono) load from Google Fonts, matching the handoff. Swap
  in licensed files via `@font-face` if available.
