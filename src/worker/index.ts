import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { CreateKeepsakeInput, UpdateConfigInput } from "../shared/types";
import { BoughStore, type WorkerEnv } from "./store";

export { BoughStore };

const SESSION_COOKIE = "bough_owner_session";

function isLocalRequest(urlStr: string): boolean {
  try {
    const u = new URL(urlStr);
    return (
      u.hostname === "localhost" ||
      u.hostname === "127.0.0.1" ||
      u.hostname === "::1" ||
      u.hostname.endsWith(".local")
    );
  } catch {
    return false;
  }
}

function getSingletonStore(env: WorkerEnv) {
  const id = env.BOUGH_STORE.idFromName("singleton-bough-tree");
  return env.BOUGH_STORE.get(id);
}

function getClientIp(reqHeaders: Headers): string {
  return (
    reqHeaders.get("CF-Connecting-IP") ||
    reqHeaders.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "127.0.0.1"
  );
}

const app = new Hono<{ Bindings: WorkerEnv }>();

app.get("/api/health", (c) =>
  c.json({ ok: true, service: "bough", timestamp: Date.now() })
);

app.get("/api/tree", async (c) => {
  const store = getSingletonStore(c.env);
  const sessionToken = getCookie(c, SESSION_COOKIE);
  const rawReceipts = c.req.header("X-Bough-Receipts") ?? "";
  const receiptTokens = rawReceipts
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const state = await store.getTreeState({
    sessionToken,
    receiptTokens,
    isLocalDev: isLocalRequest(c.req.url),
  });

  return c.json(state);
});

app.post("/api/keepsakes", async (c) => {
  let body: CreateKeepsakeInput;
  try {
    body = await c.req.json<CreateKeepsakeInput>();
  } catch {
    return c.json(
      { code: "INVALID_JSON", message: "Malformed request payload." },
      400
    );
  }

  const store = getSingletonStore(c.env);
  const sessionToken = getCookie(c, SESSION_COOKIE);
  const result = await store.createKeepsake({
    input: body,
    remoteIp: getClientIp(c.req.raw.headers),
    isLocalDev: isLocalRequest(c.req.url),
    sessionToken,
  });

  if (!result.ok) {
    return c.json(
      { code: result.code, message: result.message },
      result.status as 400 | 403 | 429
    );
  }

  return c.json(result.data, 201);
});

app.post("/api/owner/setup", async (c) => {
  let body: { password?: string; ownerName?: string; treeTitle?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ message: "Malformed request payload." }, 400);
  }

  const store = getSingletonStore(c.env);
  const isLocal = isLocalRequest(c.req.url);
  const res = await store.setupFirstBootOwner({
    password: body.password ?? "",
    ownerName: body.ownerName,
    treeTitle: body.treeTitle,
    remoteIp: getClientIp(c.req.raw.headers),
  });

  if (!res.ok) {
    return c.json({ message: res.message }, res.status as 400 | 409);
  }

  setCookie(c, SESSION_COOKIE, res.sessionToken, {
    httpOnly: true,
    sameSite: "Lax",
    secure: !isLocal,
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  return c.json({ ok: true });
});

app.post("/api/owner/login", async (c) => {
  let body: { password?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ message: "Malformed request payload." }, 400);
  }

  const store = getSingletonStore(c.env);
  const isLocal = isLocalRequest(c.req.url);
  const res = await store.loginOwner({
    password: body.password ?? "",
    remoteIp: getClientIp(c.req.raw.headers),
  });

  if (!res.ok) {
    return c.json({ message: res.message }, res.status as 400 | 401 | 429);
  }

  setCookie(c, SESSION_COOKIE, res.sessionToken, {
    httpOnly: true,
    sameSite: "Lax",
    secure: !isLocal,
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  return c.json({ ok: true });
});

app.post("/api/owner/logout", (c) => {
  deleteCookie(c, SESSION_COOKIE, { path: "/" });
  return c.json({ ok: true });
});

app.patch("/api/owner/config", async (c) => {
  let body: UpdateConfigInput;
  try {
    body = await c.req.json<UpdateConfigInput>();
  } catch {
    return c.json({ message: "Malformed request payload." }, 400);
  }

  const store = getSingletonStore(c.env);
  const sessionToken = getCookie(c, SESSION_COOKIE);
  const res = await store.updateConfig({
    sessionToken,
    input: body,
    isLocalDev: isLocalRequest(c.req.url),
  });

  if (!res.ok) {
    return c.json({ message: res.message }, res.status as 401);
  }

  return c.json({ ok: true, config: res.config });
});

app.delete("/api/owner/keepsakes/:id", async (c) => {
  const id = c.req.param("id");
  const store = getSingletonStore(c.env);
  const sessionToken = getCookie(c, SESSION_COOKIE);
  const res = await store.deleteKeepsake({ sessionToken, id });

  if (!res.ok) {
    return c.json({ message: res.message }, res.status as 401);
  }

  return c.json({ ok: true });
});

app.get("/api/owner/export", async (c) => {
  const store = getSingletonStore(c.env);
  const sessionToken = getCookie(c, SESSION_COOKIE);
  const res = await store.exportArchive({
    sessionToken,
    isLocalDev: isLocalRequest(c.req.url),
  });

  if (!res.ok) {
    return c.json({ message: res.message }, res.status as 401);
  }

  return c.json(res.archive);
});

export default app;
