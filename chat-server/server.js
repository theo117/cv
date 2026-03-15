const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

dotenv.config();

const PORT = Number(process.env.PORT || 3001);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  if (ALLOWED_ORIGIN === "*") {
    return true;
  }

  const allowedOrigins = new Set([
    ALLOWED_ORIGIN,
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:4173",
    "http://localhost:5500",
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:4173",
    "http://127.0.0.1:5500",
    "null",
  ]);

  return allowedOrigins.has(origin);
}

function sanitizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 2000);
}

function getConversationKey(emailA, emailB) {
  return [emailA, emailB].map((value) => sanitizeText(value).toLowerCase()).sort().join("::");
}

function getUserRoom(email) {
  return `user:${sanitizeText(email).toLowerCase()}`;
}

const app = express();
app.use(express.json({ limit: "100kb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    service: "portfolio-chat-server",
  });
});

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "Portfolio chat server is running.",
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    methods: ["GET", "POST"],
  },
});

const usersBySocket = new Map();
const historyByConversation = new Map();

function pushHistory(conversationKey, message) {
  const history = historyByConversation.get(conversationKey) || [];
  history.push(message);
  if (history.length > 200) {
    history.shift();
  }
  historyByConversation.set(conversationKey, history);
}

function requireAuth(socket) {
  return usersBySocket.get(socket.id);
}

io.on("connection", (socket) => {
  socket.on("auth:login", (payload = {}) => {
    const name = sanitizeText(payload.name);
    const email = sanitizeText(payload.email).toLowerCase();

    if (!name || !email || !email.includes("@")) {
      socket.emit("auth:error", { message: "Name and valid email are required." });
      return;
    }

    const user = { name, email };
    usersBySocket.set(socket.id, user);
    socket.join(getUserRoom(email));
    socket.emit("auth:ok", { user });
  });

  socket.on("chat:send", (payload = {}) => {
    const sender = requireAuth(socket);
    if (!sender) {
      socket.emit("chat:error", { message: "You must log in before chatting." });
      return;
    }

    const text = sanitizeText(payload.text);
    if (!text) {
      socket.emit("chat:error", { message: "Message cannot be empty." });
      return;
    }

    const targetEmail = sanitizeText(payload.targetEmail).toLowerCase();
    if (!targetEmail || !targetEmail.includes("@")) {
      socket.emit("chat:error", { message: "A valid recipient email is required." });
      return;
    }

    if (targetEmail === sender.email) {
      socket.emit("chat:error", { message: "Recipient email must be different from your email." });
      return;
    }

    const timestamp = new Date().toISOString();
    const conversationKey = getConversationKey(sender.email, targetEmail);
    const directMessage = {
      conversationKey,
      fromEmail: sender.email,
      toEmail: targetEmail,
      senderName: sender.name,
      text,
      timestamp,
    };

    pushHistory(conversationKey, directMessage);
    io.to(getUserRoom(sender.email)).emit("chat:message", directMessage);
    io.to(getUserRoom(targetEmail)).emit("chat:message", directMessage);
  });

  socket.on("chat:history", (payload = {}) => {
    const user = requireAuth(socket);
    if (!user) {
      return;
    }

    const peerEmail = sanitizeText(payload.peerEmail).toLowerCase();
    if (!peerEmail || !peerEmail.includes("@")) {
      socket.emit("chat:error", { message: "A valid peer email is required to load history." });
      return;
    }

    const conversationKey = getConversationKey(user.email, peerEmail);
    socket.emit("chat:history", {
      conversationKey,
      peerEmail,
      history: historyByConversation.get(conversationKey) || [],
    });
  });

  socket.on("disconnect", () => {
    usersBySocket.delete(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Chat server listening on http://localhost:${PORT}`);
});
