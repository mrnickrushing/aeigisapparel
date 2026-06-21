# AEGIS Apparel

AEGIS is a split frontend/backend storefront with a FastAPI API and a React 19 frontend.

## Local setup

Backend:

```bash
cd backend
cp .env.example .env  # if present
pip install -r requirements.txt
uvicorn server:app --reload
```

Frontend:

```bash
cd frontend
yarn install
yarn start
```

## Environment

- `MONGO_URL`
- `DB_NAME`
- `REACT_APP_BACKEND_URL`
- `CORS_ORIGINS`
- `SENTRY_DSN`
- `SENTRY_ENVIRONMENT`
- `SENTRY_RELEASE`
- `SENTRY_TRACES_SAMPLE_RATE`
- `RESEND_API_KEY`
- `NEWSLETTER_FROM_EMAIL`
- `NEWSLETTER_ADMIN_TOKEN`
- `NEWSLETTER_CONFIRMATION_REQUIRED`
- `ADMIN_PASSWORD` — password for the `/admin` dashboard login.
- `ADMIN_JWT_SECRET` (optional) — signs admin session tokens; defaults to a value derived from `ADMIN_PASSWORD` if unset.
- `PUBLIC_SITE_URL` (optional) — base URL used to build unsubscribe links in admin newsletter blasts; defaults to `https://strengthinorder.com`.

For frontend source-map upload or release automation, keep the Sentry auth token in CI as `SENTRY_AUTH_TOKEN` along with `SENTRY_ORG` and `SENTRY_PROJECT`.

Newsletter flow:
- Signups hit `POST /api/newsletter`.
- If `RESEND_API_KEY` is set, new subscribers are sent a confirmation email when confirmation is enabled.
- Confirmations land at `GET /api/newsletter/confirm?token=...`.
- To send a newsletter, call `POST /api/newsletter/send` with header `X-Newsletter-Admin-Token: <your token>` and a JSON body containing `subject` and `html`.
- Use `GET /api/newsletter/subscribers` with the same admin header to inspect the subscriber list.

Admin dashboard:
- Lives at `/admin` (login at `/admin/login`); also reachable at `admin.strengthinorder.com`, which redirects its root to `/admin` and is served by the same single backend service.
- Auth is a single shared password (`ADMIN_PASSWORD`) issuing a short-lived JWT — no broader user/auth system.
- Shows newsletter subscribers (including pending double opt-in signups) and contact form messages, and can send a one-shot HTML blast via Resend to confirmed subscribers only, with a signed per-subscriber unsubscribe link.
- Deploying `admin.strengthinorder.com` requires adding it as a custom domain on the Railway service and adding the CNAME record Railway provides in Cloudflare DNS. Sending real email also requires verifying the sending domain in Resend and adding the DNS records Resend provides in Cloudflare.

## Notes

- The storefront UI is public, but order entry can be kept hidden until launch.
- Backend tests expect the API to be reachable via `REACT_APP_BACKEND_URL`.
