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

For frontend source-map upload or release automation, keep the Sentry auth token in CI as `SENTRY_AUTH_TOKEN` along with `SENTRY_ORG` and `SENTRY_PROJECT`.

Newsletter flow:
- Signups hit `POST /api/newsletter`.
- If `RESEND_API_KEY` is set, new subscribers are sent a confirmation email when confirmation is enabled.
- Confirmations land at `GET /api/newsletter/confirm?token=...`.
- To send a newsletter, call `POST /api/newsletter/send` with header `X-Newsletter-Admin-Token: <your token>` and a JSON body containing `subject` and `html`.
- Use `GET /api/newsletter/subscribers` with the same admin header to inspect the subscriber list.

## Notes

- The storefront UI is public, but order entry can be kept hidden until launch.
- Backend tests expect the API to be reachable via `REACT_APP_BACKEND_URL`.
