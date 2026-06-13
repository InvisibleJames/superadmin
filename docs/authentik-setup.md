# Authentik SSO — Google sign-in for MedReco Super Admin

This wires a **"Continue with Google"** button on the login page to a self-hosted
**Authentik** identity provider. Authentik brokers Google: our Laravel API is a
plain OIDC client of Authentik, and Authentik talks to Google.

```
Nuxt login ──"Continue with Google"──▶ Laravel /auth/oauth/redirect
        ▲                                      │
        │                                      ▼
   /auth/callback?token=…           Authentik /authorize ──▶ Google
        ▲                                      │
        └──────────── Sanctum token ◀── Laravel /auth/oauth/callback
```

## 1. Run Authentik

```bash
# Beside docker-compose.authentik.yml, create .env:
cat > .env <<EOF
AUTHENTIK_SECRET_KEY=$(openssl rand -base64 48)
PG_PASS=$(openssl rand -base64 32)
AUTHENTIK_TAG=2024.10
EOF

docker compose -f docker-compose.authentik.yml up -d
```

Open <http://localhost:9000/if/flow/initial-setup/> and create the admin account.

## 2. Add Google as a source

In Google Cloud Console → **APIs & Services → Credentials**, create an
**OAuth client ID** (type *Web application*) and set the authorized redirect URI to:

```
http://localhost:9000/source/oauth/callback/google/
```

Copy the **Client ID** and **Client Secret**. In Authentik:

- **Directory → Federation & Social login → Create → Google OAuth Source**
- Name `Google`, slug `google`, paste the Client ID / Secret, save.

(Optionally enable it on the default authentication flow so it shows on the
Authentik login screen.)

## 3. Create the OAuth2/OIDC provider + application (for this app)

**Applications → Providers → Create → OAuth2/OpenID Provider:**

| Field | Value |
| --- | --- |
| Name | `MedReco Super Admin` |
| Authorization flow | `default-provider-authorization-explicit-consent` |
| Client type | **Confidential** |
| Redirect URIs | `http://localhost:8000/auth/oauth/callback` |
| Scopes | `openid`, `email`, `profile` |
| Signing key | the default self-signed cert |

Copy the generated **Client ID** and **Client Secret**.

**Applications → Applications → Create:**

| Field | Value |
| --- | --- |
| Name | `MedReco Super Admin` |
| Slug | `medreco-super-admin` |
| Provider | the provider you just created |

## 4. Point the Laravel API at Authentik

In `backend/.env`:

```env
AUTHENTIK_BASE_URL=http://localhost:9000
AUTHENTIK_CLIENT_ID=<provider client id>
AUTHENTIK_CLIENT_SECRET=<provider client secret>
AUTHENTIK_REDIRECT_URI=http://localhost:8000/auth/oauth/callback
FRONTEND_URL=http://localhost:3000

# Only let @medreco.com Google accounts in (optional):
AUTH_OAUTH_ALLOWED_DOMAINS=medreco.com
# Auto-provision a non-super admin on first login (default false):
AUTH_OAUTH_AUTO_CREATE=false
```

`php artisan config:clear` after editing.

## 5. Account matching

On callback the API looks the user up **by email**:

- **Match found** → signed in, a Sanctum token is issued, the SPA continues.
- **No match** → rejected with `oauth_no_account`, unless `AUTH_OAUTH_AUTO_CREATE=true`,
  in which case a new **active, non-super** admin is created (elevate it later
  from the Users screen / SA Users).

So to let an existing admin use Google, just make sure their MedReco user's
email equals their Google email.

## Endpoints (reference)

Authentik OIDC endpoints derived from `AUTHENTIK_BASE_URL`:

- Authorize — `/application/o/authorize/`
- Token — `/application/o/token/`
- Userinfo — `/application/o/userinfo/`
- Discovery — `/application/o/<app-slug>/.well-known/openid-configuration`

## Troubleshooting

The login page surfaces failures via `?error=` codes: `oauth_unconfigured`,
`oauth_denied`, `oauth_state`, `oauth_token`, `oauth_no_email`, `oauth_domain`,
`oauth_no_account`, `oauth_inactive`. Check `backend/storage/logs/laravel.log`
for token-exchange details.
