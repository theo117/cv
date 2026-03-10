# Realtime Chat Server

## 1) Install

```bash
cd chat-server
npm install
```

## 2) Configure

Copy `.env.example` to `.env` and set:

- `ADMIN_KEY` to a secure value.
- `ALLOWED_ORIGIN` to your CV site origin in production.

## 3) Run

```bash
npm start
```

Server runs on `http://localhost:3001` by default.

## 4) Admin Console

Open:

`http://localhost:3001/admin`

Log in with the same admin key from `.env`.

## Notes

- Visitor chat history is in-memory only (resets when server restarts).
- Your frontend widget connects to `http://localhost:3001` by default.

## Deploy On Render

1. Push this repo to GitHub.
2. In Render, click `New` -> `Blueprint`.
3. Select this repo. Render will detect [`render.yaml`](../render.yaml).
4. Set secret env var in Render:
   - `ADMIN_KEY` = your strong key
5. Confirm public env var:
   - `ALLOWED_ORIGIN` = `https://cv.theodorenelson.co.za`
6. Deploy.

After deploy, Render gives you a URL like:

`https://theodore-chat-server.onrender.com`

Then update your CV page so live chat points to Render:

```html
<script>
  window.CHAT_SERVER_URL = "https://theodore-chat-server.onrender.com";
</script>
```

Place that line before your main chat script in `cv/index.html`.
