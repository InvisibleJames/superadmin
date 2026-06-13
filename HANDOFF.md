# MedReco Super Admin — Engineering Handoff

> Internal back-office for the **MedReco** EMR platform. Dark, data-dense admin
> console for managing clinics, branches, users, patients, roles and audit
> across a healthcare org. Built from a Claude Design handoff
> (`Super Admin MedReco-handoff.zip`).

This document is the developer handoff: what's built, how it's wired, how to run
and test it, and how to extend it. For step-by-step local setup see
[`README.md`](./README.md).

---

## 1. Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | **Nuxt 4** (Vue 3, SSR) + **Tailwind CSS v4** + **Pinia** |
| Backend | **Laravel 13** REST API |
| Auth | **Sanctum** bearer tokens + **Authentik** OIDC (Google SSO) |
| Database | **MySQL 8** (target); SQLite used for tests / quick local runs |
| Tooling | PHP 8.2+, Node 20+, Composer 2 |

Monorepo: **`backend/`** (Laravel) + **`frontend/`** (Nuxt).

---

## 2. Repository layout

```
superadmin/
├── backend/                         # Laravel API
│   ├── app/Models/                  # User, Role, Clinic, Branch, Patient, SaUser
│   ├── app/Http/Controllers/Api/    # User, Clinic, Branch, Patient, SaUser, Meta, Auth
│   ├── app/Http/Controllers/Auth/   # OAuthController (Authentik OIDC)
│   ├── app/Http/Resources/          # *Resource transformers
│   ├── database/migrations|seeders|factories
│   ├── routes/api.php               # all /api/* routes (Sanctum-guarded)
│   ├── routes/web.php               # /auth/oauth/* (session, for OAuth state)
│   └── tests/Feature/               # PHPUnit feature tests
├── frontend/                        # Nuxt console
│   └── app/
│       ├── assets/css/main.css      # design tokens → Tailwind theme
│       ├── components/ui/           # MButton, MInput, MSelect, MBadge, MStatCard, …
│       ├── components/app/          # Sidebar, Topbar
│       ├── composables/             # useApi, useNav, useUsers, useClinics, …
│       ├── stores/auth.ts           # Pinia auth (token in cookie)
│       ├── middleware/auth.global.ts
│       ├── pages/                   # login, reset-password, auth/callback, <resource>/index
│       └── utils/format.ts
├── docker-compose.authentik.yml     # Authentik + postgres + redis
├── docs/authentik-setup.md          # Google SSO setup guide
├── scripts/smoke.sh                 # API smoke test
└── Super Admin MedReco-handoff.zip  # original design handoff (provenance)
```

---

## 3. Build status

| Group | Screen | Status |
| --- | --- | --- |
| Auth | Login · Forgot/Reset password · Google SSO (Authentik) | ✅ done |
| Master Data | Users Management | ✅ done |
| Master Data | Clinics | ✅ done |
| Master Data | Clinic Branches | ✅ done |
| Master Data | Patients | ✅ done |
| System | SA Users | ✅ done |
| System | Roles & Permissions | ⬜ placeholder |
| System | Audit Logs · Settings · Maintenance | ⬜ placeholder |
| Timetable | Boarding Time · User Logs | ⬜ placeholder |

Every "done" screen is wired end-to-end: Nuxt page → composable → Laravel API →
MySQL, with pagination, search, filters, column sort, multi-select bulk actions,
stat cards and an empty state. Placeholder routes render `pages/[section].vue`.

---

## 4. Architecture

### Auth
- **Password login:** `POST /api/auth/login` → Sanctum token. The SPA stores it
  in a `medreco_token` cookie (`useApi()` attaches it as `Authorization: Bearer`).
  A global route middleware redirects unauthenticated users to `/login`.
- **Forgot/Reset:** `POST /api/auth/forgot-password` emails a link (Laravel
  password broker; URL points at the Nuxt `/reset-password` page via
  `ResetPassword::createUrlUsing`). `POST /api/auth/reset-password` completes it.
- **Google SSO:** `/auth/oauth/redirect` → Authentik `/authorize` (OIDC code
  flow with state+nonce on the session). `/auth/oauth/callback` exchanges the
  code, reads userinfo, matches the admin **by email** (optional auto-provision
  + domain allowlist), issues a Sanctum token, and hands it to the SPA at
  `/auth/callback`. Config in `config/services.php` → `authentik`. See
  `docs/authentik-setup.md`.

### Data flow (per resource)
`pages/<resource>/index.vue` consumes a `use<Resource>()` composable that owns
filters/sort/pagination/selection and calls `useApi()`. The API controller
applies filters + sort + pagination and returns a `*Resource` collection;
a sibling `/stats` endpoint feeds the cards; `/meta` supplies dropdown options.

### Design system
All handoff tokens (colour, type, elevation, motion) live in
`frontend/app/assets/css/main.css`: a `@theme` block exposes ergonomic Tailwind
utilities (`bg-card`, `text-ink-3`, …) and a `:root` block holds the full set for
`var()` references (gradients, tints, role hues). Near-black canvas, teal accent,
Geist / Geist Mono, 8px radius, 150ms ease-out.

---

## 5. Running it

**Fastest — Docker (needs only Docker):**

```bash
docker compose up --build      # MySQL + API + console, auto-migrate + seed
# → http://localhost:3000  (admin@medreco.com / password)
```

See [`README.md`](./README.md) for full manual steps. TL;DR:

```bash
# backend
cd backend && composer install && cp .env.example .env && php artisan key:generate
#   set DB_* (MySQL: medreco) in .env, create the DB, then:
php artisan migrate --seed && php artisan serve      # :8000

# frontend (new terminal)
cd frontend && npm install && cp .env.example .env && npm run dev   # :3000
```

Open http://localhost:3000 and sign in.

### Seed login & data
| Email | Password | Note |
| --- | --- | --- |
| `admin@medreco.com` | `password` | Super Admin (cannot be deleted) |

Seeders also load 5 roles, 14 clinics, 18 branches, 21 users, 215 patients,
14 SA users.

---

## 6. Testing

```bash
cd backend && php artisan test     # 34 PHPUnit tests (in-memory SQLite)
./scripts/smoke.sh                 # 18 API smoke checks on a throwaway DB
cd frontend && npm run build       # type-checks the Nuxt build
```

The smoke script and the test suite both use SQLite and never touch your MySQL.

---

## 7. Adding a new screen (the established pattern)

To build e.g. **Audit Logs**, mirror an existing resource:

1. **Migration + model** (`+ HasFactory`) and a **seeder**; register the seeder
   in `DatabaseSeeder`.
2. **`<Name>Resource`** — shape the JSON (format dates as ISO; derive display
   codes/tones server-side).
3. **`<Name>Controller`** — `index` (filters + `sort`/`dir` + `per_page`
   pagination), `stats`, and CRUD/`bulk` if writable. Register routes in
   `routes/api.php` (Sanctum group).
4. Add any new dropdown data to **`MetaController`**.
5. **`use<Name>()` composable** — copy `useClinics.ts` and adjust fields/filters.
6. **`pages/<name>/index.vue`** — copy an existing page; reuse the shared
   `.med-table-*` / `.med-pagination` classes (already global in `main.css`).
   A static `pages/<name>/index.vue` overrides the `[section].vue` placeholder.
7. **Tests** — add a `Feature/<Name>ApiTest` and a couple of lines to
   `scripts/smoke.sh`.

Read-only screens (User Logs, Audit Logs) skip CRUD/bulk and add columns like
result/IP. Roles & Permissions is a matrix (different layout). Boarding Time is
a live queue board.

---

## 8. Deployment notes

- **Frontend:** `npm run build` → `.output/`; serve with `node .output/server/index.mjs`
  behind your reverse proxy. Set `NUXT_PUBLIC_API_BASE` to the API URL.
- **Backend:** `php artisan config:cache route:cache`; serve `backend/public`
  via nginx/Apache + PHP-FPM. Set `FRONTEND_URL` (CORS), `APP_URL`, mailer, and
  the `AUTHENTIK_*` vars if using SSO.
- A `docker-compose.authentik.yml` is provided for the Authentik IdP.

---

## 9. Known limitations / TODO

- 4 screens still placeholders (Roles & Permissions, Audit Logs, Settings,
  Maintenance, Boarding Time, User Logs).
- Import/Export CSV buttons are present but not yet wired.
- SSO requires a running Authentik + Google OAuth credentials (code is complete;
  no live instance was bundled).
- "Last Import" / "New This Month" stats reflect seed dates, so they can read 0
  on a freshly seeded recent date — expected, not a bug.
- Token is stored in a JS-readable cookie and passed via query on SSO callback;
  fine for this console, revisit if stricter handling is required.
