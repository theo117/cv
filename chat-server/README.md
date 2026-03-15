# Realtime Chat Server

## Install

```bash
cd chat-server
npm install
```

## Configure

Set these environment variables as needed:

- `PORT` to override the default `3001`
- `ALLOWED_ORIGIN` to your deployed CV site origin

## Run

```bash
npm start
```

The server exposes:

- `GET /health`
- Socket.IO chat events for login, messaging, and history

## Notes

- Chat history is stored in memory and resets when the server restarts.
- The frontend widget connects to `http://localhost:3001` by default in local development.
- Render uses [`render.yaml`](../render.yaml) to deploy this service.
