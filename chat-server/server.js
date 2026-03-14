const fs = require("fs");
const path = require("path");
const http = require("http");
const crypto = require("crypto");
const { EventEmitter } = require("events");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
dotenv.config();

const PORT = Number(process.env.PORT || 3001);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";
const DATA_DIR = path.join(__dirname, "data");
const AUTOMATION_EVENTS_FILE = path.join(DATA_DIR, "automation-events.ndjson");
const AUTOMATION_RECENT_LIMIT = 250;
const automationBus = new EventEmitter();

const app = express();
app.use(express.json({ limit: "100kb" }));
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
const historyByConversation = new Map();
const automationState = {
  totals: {
    events: 0,
    contactSubmissions: 0,
    cvDownloads: 0,
    diplomaDownloads: 0,
    certificateDownloads: 0,
    projectViews: 0,
  },
  recentEvents: [],
  leads: new Map(),
  projects: new Map(),
};

function sanitizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 2000);
}

function sanitizeShortText(value, maxLength = 120) {
  return sanitizeText(value).slice(0, maxLength);
}

function sanitizeEmail(value) {
  return sanitizeText(value).toLowerCase().slice(0, 320);
}

function sanitizeUrl(value) {
  return sanitizeText(value).slice(0, 500);
}

function sanitizeEventType(value) {
  return sanitizeText(value).toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 80);
}

function toPositiveInteger(value, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }
  return Math.round(parsed);
}

function getConversationKey(emailA, emailB) {
  return [emailA, emailB].map((value) => sanitizeText(value).toLowerCase()).sort().join("::");
}

function getUserRoom(email) {
  return `user:${sanitizeText(email).toLowerCase()}`;
}

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

function ensureAutomationStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(AUTOMATION_EVENTS_FILE)) {
    fs.writeFileSync(AUTOMATION_EVENTS_FILE, "", "utf8");
  }
}

function appendAutomationEvent(event) {
  ensureAutomationStore();
  fs.appendFileSync(AUTOMATION_EVENTS_FILE, `${JSON.stringify(event)}\n`, "utf8");
}

function trackRecentEvent(event) {
  automationState.recentEvents.unshift(event);
  if (automationState.recentEvents.length > AUTOMATION_RECENT_LIMIT) {
    automationState.recentEvents.length = AUTOMATION_RECENT_LIMIT;
  }
}

function getLeadKey(event) {
  const email = sanitizeEmail(event.contact && event.contact.email);
  if (email) {
    return email;
  }
  return sanitizeShortText(event.sessionId || event.clientId || "", 80);
}

function upsertLead(event, scoreDelta, stage) {
  const leadKey = getLeadKey(event);
  if (!leadKey) {
    return;
  }

  const current = automationState.leads.get(leadKey) || {
    id: leadKey,
    name: "",
    email: "",
    score: 0,
    stage: "anonymous",
    firstSeenAt: event.timestamp,
    lastSeenAt: event.timestamp,
    cvDownloads: 0,
    diplomaDownloads: 0,
    certificateDownloads: 0,
    contactSubmissions: 0,
    events: 0,
  };

  current.name = sanitizeShortText((event.contact && event.contact.name) || current.name, 120);
  current.email = sanitizeEmail((event.contact && event.contact.email) || current.email);
  current.score += scoreDelta;
  current.stage = stage || current.stage;
  current.lastSeenAt = event.timestamp;
  current.events += 1;

  if (event.type === "contact.submitted") {
    current.contactSubmissions += 1;
    current.lastMessageLength = toPositiveInteger(event.contact && event.contact.messageLength);
  }

  if (event.type === "cv.downloaded") {
    current.cvDownloads += 1;
  }

  if (event.type === "diploma.downloaded") {
    current.diplomaDownloads += 1;
  }

  if (event.type === "certificate.downloaded") {
    current.certificateDownloads += 1;
  }

  automationState.leads.set(leadKey, current);
}

function upsertProject(event) {
  const projectKey = sanitizeShortText(event.project && event.project.slug, 80);
  if (!projectKey) {
    return;
  }

  const current = automationState.projects.get(projectKey) || {
    slug: projectKey,
    name: sanitizeShortText(event.project && event.project.name, 120),
    views: 0,
    opens: 0,
    lastViewedAt: "",
    lastOpenedAt: "",
  };

  current.name = sanitizeShortText((event.project && event.project.name) || current.name, 120);

  if (event.type === "project.viewed") {
    current.views += 1;
    current.lastViewedAt = event.timestamp;
  }

  if (event.type === "project.opened") {
    current.opens += 1;
    current.lastOpenedAt = event.timestamp;
  }

  automationState.projects.set(projectKey, current);
}

function applyAutomationEvent(event, options = {}) {
  automationState.totals.events += 1;
  trackRecentEvent(event);

  switch (event.type) {
    case "contact.submitted":
      automationState.totals.contactSubmissions += 1;
      upsertLead(event, 50, "contacted");
      break;
    case "cv.downloaded":
      automationState.totals.cvDownloads += 1;
      upsertLead(event, 15, "engaged");
      break;
    case "diploma.downloaded":
      automationState.totals.diplomaDownloads += 1;
      upsertLead(event, 12, "engaged");
      break;
    case "certificate.downloaded":
      automationState.totals.certificateDownloads += 1;
      upsertLead(event, 10, "engaged");
      break;
    case "project.viewed":
      automationState.totals.projectViews += 1;
      upsertLead(event, 5, "engaged");
      upsertProject(event);
      break;
    case "project.opened":
      upsertLead(event, 8, "engaged");
      upsertProject(event);
      break;
    default:
      upsertLead(event, 2, "engaged");
      break;
  }

  if (!options.replay) {
    appendAutomationEvent(event);
  }
}

automationBus.on("automation:event", (event, options = {}) => {
  applyAutomationEvent(event, options);
});

function loadAutomationEvents() {
  ensureAutomationStore();
  const raw = fs.readFileSync(AUTOMATION_EVENTS_FILE, "utf8");
  if (!raw.trim()) {
    return;
  }

  raw
    .split(/\r?\n/)
    .filter(Boolean)
    .forEach((line) => {
      try {
        const event = JSON.parse(line);
        if (event && event.type && event.timestamp) {
          automationBus.emit("automation:event", event, { replay: true });
        }
      } catch (_error) {
        // Ignore malformed historical lines instead of crashing startup.
      }
    });
}

function getClientIp(req) {
  return sanitizeShortText(
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "",
    120
  );
}

function normalizeAutomationEvent(payload = {}, req) {
  const type = sanitizeEventType(payload.type);
  if (!type) {
    return null;
  }

  const project =
    payload.project && typeof payload.project === "object"
      ? {
          slug: sanitizeShortText(payload.project.slug, 80),
          name: sanitizeShortText(payload.project.name, 120),
          href: sanitizeUrl(payload.project.href),
        }
      : undefined;

  const contact =
    payload.contact && typeof payload.contact === "object"
      ? {
          name: sanitizeShortText(payload.contact.name, 120),
          email: sanitizeEmail(payload.contact.email),
          subject: sanitizeShortText(payload.contact.subject, 180),
          messageLength: toPositiveInteger(payload.contact.messageLength),
        }
      : undefined;

  const asset =
    payload.asset && typeof payload.asset === "object"
      ? {
          label: sanitizeShortText(payload.asset.label, 120),
          href: sanitizeUrl(payload.asset.href),
          kind: sanitizeShortText(payload.asset.kind, 60),
        }
      : undefined;

  return {
    id: crypto.randomUUID(),
    type,
    timestamp: new Date().toISOString(),
    source: sanitizeShortText(payload.source || "portfolio-site", 80),
    page: sanitizeUrl(payload.page || req.headers.referer || ""),
    referrer: sanitizeUrl(payload.referrer || req.headers.referer || ""),
    sessionId: sanitizeShortText(payload.sessionId, 80),
    clientId: sanitizeShortText(payload.clientId, 80),
    userAgent: sanitizeShortText(req.headers["user-agent"], 240),
    ip: getClientIp(req),
    project,
    contact,
    asset,
    metadata:
      payload.metadata && typeof payload.metadata === "object"
        ? {
            viewport: sanitizeShortText(payload.metadata.viewport, 40),
            path: sanitizeShortText(payload.metadata.path, 200),
          }
        : undefined,
  };
}

function requireAdmin(req, res, next) {
  if (!process.env.ADMIN_KEY) {
    next();
    return;
  }

  const providedKey = req.get("x-admin-key") || req.query.adminKey;
  if (providedKey && providedKey === process.env.ADMIN_KEY) {
    next();
    return;
  }

  res.status(401).json({ error: "Admin key required." });
}

app.post("/api/automation/events", (req, res) => {
  const payloads = Array.isArray(req.body) ? req.body : [req.body];
  const acceptedEvents = [];

  payloads.forEach((payload) => {
    const event = normalizeAutomationEvent(payload, req);
    if (!event) {
      return;
    }
    automationBus.emit("automation:event", event);
    acceptedEvents.push(event);
  });

  if (acceptedEvents.length === 0) {
    res.status(400).json({ error: "At least one valid event payload is required." });
    return;
  }

  res.status(202).json({
    accepted: acceptedEvents.length,
    events: acceptedEvents.map((event) => ({
      id: event.id,
      type: event.type,
      timestamp: event.timestamp,
    })),
  });
});

app.get("/api/automation/summary", requireAdmin, (_req, res) => {
  const leads = Array.from(automationState.leads.values())
    .sort((a, b) => b.score - a.score || String(b.lastSeenAt).localeCompare(String(a.lastSeenAt)))
    .slice(0, 25);
  const projects = Array.from(automationState.projects.values()).sort((a, b) => b.views - a.views);

  res.json({
    totals: automationState.totals,
    leads,
    projects,
    recentEvents: automationState.recentEvents.slice(0, 50),
  });
});

app.get("/api/automation/events/recent", requireAdmin, (_req, res) => {
  res.json({ events: automationState.recentEvents });
});

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

loadAutomationEvents();

server.listen(PORT, () => {
  console.log(`Chat server listening on http://localhost:${PORT}`);
});
