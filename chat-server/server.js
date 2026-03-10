const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const { randomUUID } = require("crypto");

dotenv.config();

const PORT = Number(process.env.PORT || 3001);
const ADMIN_KEY = process.env.ADMIN_KEY || "change-me";
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ALLOWED_ORIGIN === "*" ? true : ALLOWED_ORIGIN,
    credentials: true,
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get("/", (_req, res) => {
  res.redirect("/admin");
});

app.use("/admin", express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGIN === "*" ? true : ALLOWED_ORIGIN,
    methods: ["GET", "POST"],
  },
});

const usersBySocket = new Map();
const historyByUser = new Map();

function sanitizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 2000);
}

function pushHistory(userId, message) {
  const history = historyByUser.get(userId) || [];
  history.push(message);
  if (history.length > 200) {
    history.shift();
  }
  historyByUser.set(userId, history);
}

function getOnlineVisitors() {
  return Array.from(usersBySocket.values())
    .filter((u) => u.role === "visitor")
    .map((u) => ({ userId: u.userId, name: u.name, email: u.email }));
}

function requireAuth(socket) {
  return usersBySocket.get(socket.id);
}

io.on("connection", (socket) => {
  socket.on("auth:login", (payload = {}) => {
    const role = payload.role === "admin" ? "admin" : "visitor";
    const name = sanitizeText(payload.name);
    const email = sanitizeText(payload.email).toLowerCase();
    const incomingUserId = sanitizeText(payload.userId);

    if (!name || !email || !email.includes("@")) {
      socket.emit("auth:error", { message: "Name and valid email are required." });
      return;
    }

    if (role === "admin" && payload.adminKey !== ADMIN_KEY) {
      socket.emit("auth:error", { message: "Admin key is invalid." });
      return;
    }

    const userId = role === "admin" ? "admin" : incomingUserId || randomUUID();
    const user = { userId, name, email, role };
    usersBySocket.set(socket.id, user);

    if (role === "admin") {
      socket.join("admins");
      socket.emit("auth:ok", { user, onlineVisitors: getOnlineVisitors() });
      return;
    }

    socket.join(`user:${userId}`);
    socket.emit("auth:ok", { user, history: historyByUser.get(userId) || [] });
    io.to("admins").emit("admin:user-online", { userId, name, email });
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

    const timestamp = new Date().toISOString();

    if (sender.role === "visitor") {
      const message = {
        userId: sender.userId,
        senderRole: "visitor",
        senderName: sender.name,
        text,
        timestamp,
      };

      pushHistory(sender.userId, message);
      io.to(`user:${sender.userId}`).emit("chat:message", message);
      io.to("admins").emit("chat:message", message);
      return;
    }

    const targetUserId = sanitizeText(payload.targetUserId);
    if (!targetUserId) {
      socket.emit("chat:error", { message: "targetUserId is required for admin replies." });
      return;
    }

    const adminMessage = {
      userId: targetUserId,
      senderRole: "admin",
      senderName: sender.name,
      text,
      timestamp,
    };

    pushHistory(targetUserId, adminMessage);
    io.to(`user:${targetUserId}`).emit("chat:message", adminMessage);
    io.to("admins").emit("chat:message", adminMessage);
  });

  socket.on("chat:history", (payload = {}) => {
    const user = requireAuth(socket);
    if (!user || user.role !== "admin") {
      return;
    }

    const userId = sanitizeText(payload.userId);
    socket.emit("admin:history", {
      userId,
      history: historyByUser.get(userId) || [],
    });
  });

  socket.on("disconnect", () => {
    const user = usersBySocket.get(socket.id);
    usersBySocket.delete(socket.id);
    if (user && user.role === "visitor") {
      io.to("admins").emit("admin:user-offline", { userId: user.userId });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Chat server listening on http://localhost:${PORT}`);
});
