# Realtime Chat Server And Automation API

## 1) Install

```bash
cd chat-server
npm install
```

## 2) Configure

Copy `.env.example` to `.env` and set:

- `ADMIN_KEY` to a secure value.
- `ALLOWED_ORIGIN` to your CV site origin in production.
- `DATABASE_URL` to a PostgreSQL connection string for durable automation storage in production.
- `DATABASE_SSL=false` only if your local Postgres does not use SSL.

## 3) Run

```bash
npm start
```

Server runs on `http://localhost:3001` by default.

## 4) Admin Console

Open:

`http://localhost:3001/admin`

Log in with the same admin key from `.env`.

## Automation Events

The same Node service now accepts portfolio automation events at:

- `POST /api/automation/events`
- `GET /api/automation/summary`
- `GET /api/automation/events/recent`

The portfolio page emits:

- `contact.submitted`
- `cv.downloaded`
- `diploma.downloaded`
- `certificate.downloaded`
- `project.viewed`
- `project.opened`

Automation events are persisted to PostgreSQL when `DATABASE_URL` is set.
If `DATABASE_URL` is not set, the server falls back to `chat-server/data/automation-events.ndjson` for local development.
Admin reads on summary and recent-events endpoints require `x-admin-key: <ADMIN_KEY>` when `ADMIN_KEY` is configured.

## Notes

- Visitor chat history is in-memory only and resets when the server restarts.
- Automation analytics persist to PostgreSQL in production when `DATABASE_URL` is configured.
- Local development falls back to file storage in `chat-server/data`.
- Your frontend widget connects to `http://localhost:3001` by default.

## Deploy On Render

1. Push this repo to GitHub.
2. In Render, click `New` -> `Blueprint`.
3. Select this repo. Render will detect [`render.yaml`](../render.yaml).
4. Set secret env var in Render:
   - `ADMIN_KEY` = your strong key
5. Confirm public env var:
   - `ALLOWED_ORIGIN` = `https://cv.theodorenelson.co.za`
6. Confirm database env vars:
   - `DATABASE_URL` is supplied by Render from the attached PostgreSQL database
   - `DATABASE_SSL` = `true`
7. Deploy.

After deploy, Render gives you a URL like:

`https://theodore-chat-server.onrender.com`

Then update your CV page so live chat and automation point to Render:

```html
<script>
  window.CHAT_SERVER_URL = "https://theodore-chat-server.onrender.com";
  window.AUTOMATION_SERVER_URL = window.CHAT_SERVER_URL;
</script>
```

Place that line before your main chat script in `cv/index.html`.
