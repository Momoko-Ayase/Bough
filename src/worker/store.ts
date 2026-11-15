import { DurableObject } from "cloudflare:workers";
import {
  SLOTS_PER_PAGE,
  TURNSTILE_TEST_SITE_KEY,
  VALID_ORNAMENT_IDS,
  VALID_TOPPER_IDS,
} from "../shared/catalog";
import type {
  CreateKeepsakeInput,
  CreateKeepsakeResponse,
  KeepsakePublic,
  OrnamentId,
  TopperId,
  TreeConfigPublic,
  TreeStateResponse,
  UpdateConfigInput,
  VisibilityMode,
} from "../shared/types";
import {
  createSessionToken,
  hashPassword,
  randomTokenHex,
  sha256Hex,
  timingSafeStringEqual,
  verifyPassword,
  verifySessionToken,
} from "./crypto";
import { DEMO_SEED_KEEPSAKES } from "./seed";
import { verifyTurnstileToken } from "./turnstile";

export interface WorkerEnv {
  BOUGH_STORE: DurableObjectNamespace<BoughStore>;
  ASSETS: Fetcher;
  ADMIN_PASSWORD?: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
}

interface StoredConfigRow {
  owner_name: string;
  tree_title: string;
  welcome_note: string;
  topper_id: string;
  visibility_mode: string;
  reveal_at: string | null;
  allow_guest_private: number;
  hide_sender_names_when_locked: number;
  snowfall_enabled: number;
  turnstile_site_key: string;
  turnstile_secret_key: string;
  admin_password_hash: string | null;
  session_secret: string;
  rate_limit_max: number;
  demo_seeded: number;
  updated_at: number;
}

interface StoredKeepsakeRow {
  id: string;
  ornament_id: string;
  sender_name: string;
  message: string;
  is_private: number;
  slot_index: number;
  page_index: number;
  receipt_hash: string;
  created_at: number;
}

export class BoughStore extends DurableObject<WorkerEnv> {
  private sql: SqlStorage;

  constructor(ctx: DurableObjectState, env: WorkerEnv) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.initSchema();
  }

  private initSchema() {
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS tree_config (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        owner_name TEXT NOT NULL,
        tree_title TEXT NOT NULL,
        welcome_note TEXT NOT NULL,
        topper_id TEXT NOT NULL,
        visibility_mode TEXT NOT NULL,
        reveal_at TEXT,
        allow_guest_private INTEGER NOT NULL DEFAULT 1,
        hide_sender_names_when_locked INTEGER NOT NULL DEFAULT 0,
        snowfall_enabled INTEGER NOT NULL DEFAULT 1,
        turnstile_site_key TEXT NOT NULL DEFAULT '',
        turnstile_secret_key TEXT NOT NULL DEFAULT '',
        admin_password_hash TEXT,
        session_secret TEXT NOT NULL,
        rate_limit_max INTEGER NOT NULL DEFAULT 6,
        demo_seeded INTEGER NOT NULL DEFAULT 0,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS keepsakes (
        id TEXT PRIMARY KEY,
        ornament_id TEXT NOT NULL,
        sender_name TEXT NOT NULL,
        message TEXT NOT NULL,
        is_private INTEGER NOT NULL DEFAULT 0,
        slot_index INTEGER NOT NULL,
        page_index INTEGER NOT NULL,
        receipt_hash TEXT NOT NULL,
        ip_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_keepsakes_page_slot
        ON keepsakes(page_index, slot_index);

      CREATE TABLE IF NOT EXISTS rate_limits (
        bucket_key TEXT PRIMARY KEY,
        count INTEGER NOT NULL,
        window_start INTEGER NOT NULL
      );
    `);

    const existing = this.sql
      .exec("SELECT id FROM tree_config WHERE id = 1")
      .toArray();
    if (existing.length === 0) {
      const now = Date.now();
      const sessionSecret = randomTokenHex(32);
      this.sql.exec(
        `INSERT INTO tree_config (
          id, owner_name, tree_title, welcome_note, topper_id,
          visibility_mode, reveal_at, allow_guest_private,
          hide_sender_names_when_locked, snowfall_enabled,
          turnstile_site_key, turnstile_secret_key, admin_password_hash,
          session_secret, rate_limit_max, demo_seeded, updated_at
        ) VALUES (
          1, ?, ?, ?, ?,
          ?, ?, 1,
          0, 1,
          '', '', NULL,
          ?, 6, 0, ?
        )`,
        "Clara",
        "Clara's Winter Bough",
        "Pick an ornament from the tray and hang a winter note on a branch. Warm wishes, quiet reflections, and tiny stories from this year are all welcome.",
        "north-star",
        "public",
        null,
        sessionSecret,
        now
      );
    }
  }

  private getConfigRow(): StoredConfigRow {
    const rows = this.sql
      .exec("SELECT * FROM tree_config WHERE id = 1")
      .toArray() as unknown as StoredConfigRow[];
    return rows[0];
  }

  private maybeSeedLocalDemo(isLocalDev: boolean) {
    if (!isLocalDev) return;
    const cfg = this.getConfigRow();
    if (cfg.demo_seeded === 1) return;

    const existingCountRow = this.sql
      .exec("SELECT COUNT(*) as cnt FROM keepsakes")
      .toArray()[0] as { cnt: number };

    if (Number(existingCountRow.cnt) === 0) {
      const now = Date.now();
      for (const item of DEMO_SEED_KEEPSAKES) {
        this.sql.exec(
          `INSERT INTO keepsakes (
            id, ornament_id, sender_name, message, is_private,
            slot_index, page_index, receipt_hash, ip_hash, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          crypto.randomUUID(),
          item.ornamentId,
          item.senderName,
          item.message,
          item.isPrivate ? 1 : 0,
          item.slotIndex,
          item.pageIndex,
          "demo-seed",
          "demo",
          now - item.minutesAgo * 60_000
        );
      }
    }

    this.sql.exec("UPDATE tree_config SET demo_seeded = 1 WHERE id = 1");
  }

  private buildPublicConfig(
    row: StoredConfigRow,
    isLocalDev: boolean
  ): TreeConfigPublic {
    const envSiteKey = this.env.TURNSTILE_SITE_KEY?.trim() || "";
    const envSecretKey = this.env.TURNSTILE_SECRET_KEY?.trim() || "";
    const envPasswordConfigured = Boolean(
      this.env.ADMIN_PASSWORD && this.env.ADMIN_PASSWORD.trim().length > 0
    );

    const turnstileEnvLocked = Boolean(envSiteKey && envSecretKey);
    let effectiveSiteKey = envSiteKey || row.turnstile_site_key.trim();
    const effectiveSecretPresent = Boolean(
      envSecretKey || row.turnstile_secret_key.trim()
    );

    let turnstileConfigured = Boolean(
      effectiveSiteKey && effectiveSecretPresent
    );

    if (!turnstileConfigured && isLocalDev) {
      effectiveSiteKey = TURNSTILE_TEST_SITE_KEY;
      turnstileConfigured = true;
    }

    return {
      ownerName: row.owner_name,
      treeTitle: row.tree_title,
      welcomeNote: row.welcome_note,
      topperId: (VALID_TOPPER_IDS.has(row.topper_id)
        ? row.topper_id
        : "north-star") as TopperId,
      visibilityMode: (["public", "owner_only", "scheduled"].includes(
        row.visibility_mode
      )
        ? row.visibility_mode
        : "public") as VisibilityMode,
      revealAt: row.reveal_at,
      allowGuestPrivate: Boolean(row.allow_guest_private),
      hideSenderNamesWhenLocked: Boolean(row.hide_sender_names_when_locked),
      snowfallEnabled: Boolean(row.snowfall_enabled),
      turnstileSiteKey: effectiveSiteKey,
      turnstileConfigured,
      turnstileEnvLocked,
      authInitialized: envPasswordConfigured || Boolean(row.admin_password_hash),
      envPasswordConfigured,
      rateLimitMaxPerWindow: row.rate_limit_max,
      updatedAt: row.updated_at,
    };
  }

  private async isSessionOwner(
    sessionToken: string | undefined,
    cfg: StoredConfigRow
  ): Promise<boolean> {
    return verifySessionToken(sessionToken, cfg.session_secret);
  }

  private mapKeepsakeForViewer(
    row: StoredKeepsakeRow,
    cfg: TreeConfigPublic,
    isOwner: boolean,
    receiptHashSet: Set<string>,
    now: number
  ): KeepsakePublic {
    const unlockedByReceipt =
      row.receipt_hash !== "demo-seed" && receiptHashSet.has(row.receipt_hash);

    let lockReason: KeepsakePublic["lockReason"] = null;

    if (Boolean(row.is_private)) {
      lockReason = "guest_private";
    } else if (cfg.visibilityMode === "owner_only") {
      lockReason = "owner_only";
    } else if (cfg.visibilityMode === "scheduled") {
      const revealMs = cfg.revealAt ? Date.parse(cfg.revealAt) : NaN;
      if (!Number.isFinite(revealMs) || now < revealMs) {
        lockReason = "scheduled";
      }
    }

    const isLockedForViewer =
      lockReason !== null && !isOwner && !unlockedByReceipt;

    const senderDisplay =
      isLockedForViewer && cfg.hideSenderNamesWhenLocked
        ? "•••"
        : row.sender_name;

    return {
      id: row.id,
      ornamentId: row.ornament_id as OrnamentId,
      senderName: senderDisplay,
      message: isLockedForViewer ? null : row.message,
      isPrivate: Boolean(row.is_private),
      isLockedForViewer,
      unlockedByReceipt,
      lockReason,
      slotIndex: row.slot_index,
      pageIndex: row.page_index,
      createdAt: row.created_at,
    };
  }

  private checkRateLimit(
    bucketKey: string,
    maxAllowed: number,
    windowMs: number
  ): boolean {
    if (maxAllowed <= 0) return true;
    const now = Date.now();
    const rows = this.sql
      .exec(
        "SELECT count, window_start FROM rate_limits WHERE bucket_key = ?",
        bucketKey
      )
      .toArray() as { count: number; window_start: number }[];

    if (rows.length === 0 || now - rows[0].window_start > windowMs) {
      this.sql.exec(
        `INSERT INTO rate_limits (bucket_key, count, window_start)
         VALUES (?, 1, ?)
         ON CONFLICT(bucket_key) DO UPDATE SET count = 1, window_start = excluded.window_start`,
        bucketKey,
        now
      );
      return true;
    }

    if (rows[0].count >= maxAllowed) {
      return false;
    }

    this.sql.exec(
      "UPDATE rate_limits SET count = count + 1 WHERE bucket_key = ?",
      bucketKey
    );
    return true;
  }

  async getTreeState(opts: {
    sessionToken?: string;
    receiptTokens: string[];
    isLocalDev: boolean;
  }): Promise<TreeStateResponse> {
    this.maybeSeedLocalDemo(opts.isLocalDev);
    const cfgRow = this.getConfigRow();
    const isOwner = await this.isSessionOwner(opts.sessionToken, cfgRow);
    const publicCfg = this.buildPublicConfig(cfgRow, opts.isLocalDev);

    const receiptHashes = await Promise.all(
      opts.receiptTokens
        .filter((t) => typeof t === "string" && t.length >= 16 && t.length <= 128)
        .slice(0, 50)
        .map((t) => sha256Hex(t))
    );
    const receiptHashSet = new Set(receiptHashes);

    const rows = this.sql
      .exec(
        "SELECT * FROM keepsakes ORDER BY page_index ASC, slot_index ASC, created_at ASC"
      )
      .toArray() as unknown as StoredKeepsakeRow[];

    const now = Date.now();
    const keepsakes = rows.map((r) =>
      this.mapKeepsakeForViewer(r, publicCfg, isOwner, receiptHashSet, now)
    );

    const maxOccupiedPage = rows.reduce(
      (acc, r) => Math.max(acc, r.page_index),
      0
    );
    // Count how many items are on the last page; if full, offer an extra blank page for new ornaments
    const itemsOnLastPage = rows.filter(
      (r) => r.page_index === maxOccupiedPage
    ).length;
    const pageCount =
      itemsOnLastPage >= SLOTS_PER_PAGE
        ? maxOccupiedPage + 2
        : Math.max(1, maxOccupiedPage + 1);

    return {
      config: publicCfg,
      isOwner,
      keepsakes,
      totalCount: keepsakes.length,
      pageCount,
    };
  }

  async createKeepsake(opts: {
    input: CreateKeepsakeInput;
    remoteIp: string;
    isLocalDev: boolean;
    sessionToken?: string;
  }): Promise<
    | { ok: true; data: CreateKeepsakeResponse }
    | { ok: false; status: number; code: string; message: string }
  > {
    const cfgRow = this.getConfigRow();
    const isOwner = await this.isSessionOwner(opts.sessionToken, cfgRow);
    const publicCfg = this.buildPublicConfig(cfgRow, opts.isLocalDev);

    const { input } = opts;
    if (!VALID_ORNAMENT_IDS.has(input.ornamentId)) {
      return {
        ok: false,
        status: 400,
        code: "INVALID_ORNAMENT",
        message: "Please pick one of the keepsake ornaments from the tray.",
      };
    }

    const senderName = (input.senderName ?? "").trim();
    if (senderName.length < 1 || senderName.length > 32) {
      return {
        ok: false,
        status: 400,
        code: "INVALID_SENDER",
        message: "Please sign your name (1–32 characters).",
      };
    }

    const message = (input.message ?? "").trim();
    if (message.length < 1 || message.length > 600) {
      return {
        ok: false,
        status: 400,
        code: "INVALID_MESSAGE",
        message: "Write a message between 1 and 600 characters.",
      };
    }

    const ipHash = await sha256Hex(`ip:${opts.remoteIp}`);
    if (!isOwner) {
      const allowed = this.checkRateLimit(
        `post:${ipHash}`,
        cfgRow.rate_limit_max,
        10 * 60 * 1000
      );
      if (!allowed) {
        return {
          ok: false,
          status: 429,
          code: "RATE_LIMITED",
          message:
            "You have hung several ornaments recently. Wait a few minutes before hanging another.",
        };
      }
    }

    const effectiveSecret =
      this.env.TURNSTILE_SECRET_KEY?.trim() ||
      cfgRow.turnstile_secret_key.trim() ||
      null;

    const turnstileResult = await verifyTurnstileToken({
      token: input.turnstileToken,
      secretKey: effectiveSecret,
      remoteIp: opts.remoteIp,
      isLocalDev: opts.isLocalDev,
    });

    if (!turnstileResult.ok) {
      return {
        ok: false,
        status: 403,
        code: "TURNSTILE_FAILED",
        message: turnstileResult.errorCodes.includes("turnstile-not-configured")
          ? "Turnstile verification is not configured on this tree yet. The owner needs to add Turnstile keys in Settings."
          : "Verification expired or failed. Complete the security check and try again.",
      };
    }

    // Determine available branch slot
    const occupiedRows = this.sql
      .exec("SELECT page_index, slot_index FROM keepsakes")
      .toArray() as { page_index: number; slot_index: number }[];
    const occupiedSet = new Set(
      occupiedRows.map((r) => `${r.page_index}:${r.slot_index}`)
    );

    let chosenPage =
      typeof input.pageIndex === "number" &&
      Number.isInteger(input.pageIndex) &&
      input.pageIndex >= 0 &&
      input.pageIndex <= 200
        ? input.pageIndex
        : 0;
    let chosenSlot =
      typeof input.slotIndex === "number" &&
      Number.isInteger(input.slotIndex) &&
      input.slotIndex >= 0 &&
      input.slotIndex < SLOTS_PER_PAGE
        ? input.slotIndex
        : -1;

    if (
      chosenSlot < 0 ||
      occupiedSet.has(`${chosenPage}:${chosenSlot}`)
    ) {
      // Find first available slot starting from chosenPage, then any page
      let found = false;
      for (let p = chosenPage; p < 200 && !found; p++) {
        for (let s = 0; s < SLOTS_PER_PAGE; s++) {
          if (!occupiedSet.has(`${p}:${s}`)) {
            chosenPage = p;
            chosenSlot = s;
            found = true;
            break;
          }
        }
      }
      if (!found) {
        return {
          ok: false,
          status: 400,
          code: "TREE_FULL",
          message: "Every bough on this tree is full.",
        };
      }
    }

    const isPrivate = Boolean(input.isPrivate && publicCfg.allowGuestPrivate);
    const receiptToken = randomTokenHex(20);
    const receiptHash = await sha256Hex(receiptToken);
    const id = crypto.randomUUID();
    const now = Date.now();

    this.sql.exec(
      `INSERT INTO keepsakes (
        id, ornament_id, sender_name, message, is_private,
        slot_index, page_index, receipt_hash, ip_hash, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      input.ornamentId,
      senderName,
      message,
      isPrivate ? 1 : 0,
      chosenSlot,
      chosenPage,
      receiptHash,
      ipHash,
      now
    );

    const row: StoredKeepsakeRow = {
      id,
      ornament_id: input.ornamentId,
      sender_name: senderName,
      message,
      is_private: isPrivate ? 1 : 0,
      slot_index: chosenSlot,
      page_index: chosenPage,
      receipt_hash: receiptHash,
      created_at: now,
    };

    const keepsake = this.mapKeepsakeForViewer(
      row,
      publicCfg,
      isOwner,
      new Set([receiptHash]),
      now
    );

    return {
      ok: true,
      data: {
        keepsake,
        receiptToken,
      },
    };
  }

  async setupFirstBootOwner(opts: {
    password: string;
    ownerName?: string;
    treeTitle?: string;
    remoteIp: string;
  }): Promise<
    | { ok: true; sessionToken: string }
    | { ok: false; status: number; message: string }
  > {
    const cfgRow = this.getConfigRow();
    const envPasswordConfigured = Boolean(
      this.env.ADMIN_PASSWORD && this.env.ADMIN_PASSWORD.trim().length > 0
    );

    if (envPasswordConfigured || cfgRow.admin_password_hash) {
      return {
        ok: false,
        status: 409,
        message: "Owner password has already been configured.",
      };
    }

    if (!opts.password || opts.password.length < 6) {
      return {
        ok: false,
        status: 400,
        message: "Choose a password of at least 6 characters.",
      };
    }

    const passwordHash = await hashPassword(opts.password);
    const ownerName = (opts.ownerName ?? "").trim() || cfgRow.owner_name;
    const treeTitle = (opts.treeTitle ?? "").trim() || cfgRow.tree_title;

    this.sql.exec(
      `UPDATE tree_config
       SET admin_password_hash = ?, owner_name = ?, tree_title = ?, updated_at = ?
       WHERE id = 1`,
      passwordHash,
      ownerName.slice(0, 40),
      treeTitle.slice(0, 80),
      Date.now()
    );

    const sessionToken = await createSessionToken(cfgRow.session_secret);
    return { ok: true, sessionToken };
  }

  async loginOwner(opts: {
    password: string;
    remoteIp: string;
  }): Promise<
    | { ok: true; sessionToken: string }
    | { ok: false; status: number; message: string }
  > {
    const ipHash = await sha256Hex(`login:${opts.remoteIp}`);
    if (!this.checkRateLimit(ipHash, 10, 15 * 60 * 1000)) {
      return {
        ok: false,
        status: 429,
        message: "Too many sign-in attempts. Wait 15 minutes and try again.",
      };
    }

    const cfgRow = this.getConfigRow();
    const envPassword = this.env.ADMIN_PASSWORD?.trim();

    let valid = false;
    if (envPassword) {
      valid = await timingSafeStringEqual(opts.password ?? "", envPassword);
    } else if (cfgRow.admin_password_hash) {
      valid = await verifyPassword(
        opts.password ?? "",
        cfgRow.admin_password_hash
      );
    } else {
      return {
        ok: false,
        status: 400,
        message: "Claim this tree first by setting an owner password.",
      };
    }

    if (!valid) {
      return {
        ok: false,
        status: 401,
        message: "Incorrect password.",
      };
    }

    const sessionToken = await createSessionToken(cfgRow.session_secret);
    return { ok: true, sessionToken };
  }

  async updateConfig(opts: {
    sessionToken?: string;
    input: UpdateConfigInput;
    isLocalDev: boolean;
  }): Promise<
    | { ok: true; config: TreeConfigPublic }
    | { ok: false; status: number; message: string }
  > {
    const cfgRow = this.getConfigRow();
    const isOwner = await this.isSessionOwner(opts.sessionToken, cfgRow);
    if (!isOwner) {
      return { ok: false, status: 401, message: "Owner sign-in required." };
    }

    const { input } = opts;
    const ownerName =
      typeof input.ownerName === "string" && input.ownerName.trim()
        ? input.ownerName.trim().slice(0, 40)
        : cfgRow.owner_name;

    const treeTitle =
      typeof input.treeTitle === "string" && input.treeTitle.trim()
        ? input.treeTitle.trim().slice(0, 80)
        : cfgRow.tree_title;

    const welcomeNote =
      typeof input.welcomeNote === "string"
        ? input.welcomeNote.trim().slice(0, 320)
        : cfgRow.welcome_note;

    const topperId =
      typeof input.topperId === "string" && VALID_TOPPER_IDS.has(input.topperId)
        ? input.topperId
        : cfgRow.topper_id;

    const visibilityMode =
      typeof input.visibilityMode === "string" &&
      ["public", "owner_only", "scheduled"].includes(input.visibilityMode)
        ? input.visibilityMode
        : cfgRow.visibility_mode;

    let revealAt = cfgRow.reveal_at;
    if (input.revealAt === null) {
      revealAt = null;
    } else if (typeof input.revealAt === "string") {
      const parsed = Date.parse(input.revealAt);
      revealAt = Number.isFinite(parsed)
        ? new Date(parsed).toISOString()
        : cfgRow.reveal_at;
    }

    const allowGuestPrivate =
      typeof input.allowGuestPrivate === "boolean"
        ? input.allowGuestPrivate
          ? 1
          : 0
        : cfgRow.allow_guest_private;

    const hideSenderNamesWhenLocked =
      typeof input.hideSenderNamesWhenLocked === "boolean"
        ? input.hideSenderNamesWhenLocked
          ? 1
          : 0
        : cfgRow.hide_sender_names_when_locked;

    const snowfallEnabled =
      typeof input.snowfallEnabled === "boolean"
        ? input.snowfallEnabled
          ? 1
          : 0
        : cfgRow.snowfall_enabled;

    const rateLimitMax =
      typeof input.rateLimitMaxPerWindow === "number" &&
      Number.isFinite(input.rateLimitMaxPerWindow)
        ? Math.max(0, Math.min(100, Math.round(input.rateLimitMaxPerWindow)))
        : cfgRow.rate_limit_max;

    const turnstileSiteKey =
      typeof input.turnstileSiteKey === "string"
        ? input.turnstileSiteKey.trim().slice(0, 128)
        : cfgRow.turnstile_site_key;

    const turnstileSecretKey =
      typeof input.turnstileSecretKey === "string" &&
      input.turnstileSecretKey.trim() !== ""
        ? input.turnstileSecretKey.trim().slice(0, 128)
        : input.turnstileSecretKey === ""
          ? ""
          : cfgRow.turnstile_secret_key;

    let adminPasswordHash = cfgRow.admin_password_hash;
    if (
      typeof input.newPassword === "string" &&
      input.newPassword.length >= 6 &&
      !this.env.ADMIN_PASSWORD
    ) {
      adminPasswordHash = await hashPassword(input.newPassword);
    }

    const now = Date.now();
    this.sql.exec(
      `UPDATE tree_config SET
        owner_name = ?,
        tree_title = ?,
        welcome_note = ?,
        topper_id = ?,
        visibility_mode = ?,
        reveal_at = ?,
        allow_guest_private = ?,
        hide_sender_names_when_locked = ?,
        snowfall_enabled = ?,
        rate_limit_max = ?,
        turnstile_site_key = ?,
        turnstile_secret_key = ?,
        admin_password_hash = ?,
        updated_at = ?
       WHERE id = 1`,
      ownerName,
      treeTitle,
      welcomeNote,
      topperId,
      visibilityMode,
      revealAt,
      allowGuestPrivate,
      hideSenderNamesWhenLocked,
      snowfallEnabled,
      rateLimitMax,
      turnstileSiteKey,
      turnstileSecretKey,
      adminPasswordHash,
      now
    );

    const updatedRow = this.getConfigRow();
    return {
      ok: true,
      config: this.buildPublicConfig(updatedRow, opts.isLocalDev),
    };
  }

  async deleteKeepsake(opts: {
    sessionToken?: string;
    id: string;
  }): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
    const cfgRow = this.getConfigRow();
    const isOwner = await this.isSessionOwner(opts.sessionToken, cfgRow);
    if (!isOwner) {
      return { ok: false, status: 401, message: "Owner sign-in required." };
    }
    this.sql.exec("DELETE FROM keepsakes WHERE id = ?", opts.id);
    return { ok: true };
  }

  async exportArchive(opts: {
    sessionToken?: string;
    isLocalDev: boolean;
  }): Promise<
    | {
        ok: true;
        archive: {
          exportedAt: string;
          tree: TreeConfigPublic;
          keepsakes: Array<{
            id: string;
            ornamentId: string;
            senderName: string;
            message: string;
            isPrivate: boolean;
            pageIndex: number;
            slotIndex: number;
            createdAt: string;
          }>;
        };
      }
    | { ok: false; status: number; message: string }
  > {
    const cfgRow = this.getConfigRow();
    const isOwner = await this.isSessionOwner(opts.sessionToken, cfgRow);
    if (!isOwner) {
      return { ok: false, status: 401, message: "Owner sign-in required." };
    }

    const rows = this.sql
      .exec(
        "SELECT * FROM keepsakes ORDER BY created_at ASC"
      )
      .toArray() as unknown as StoredKeepsakeRow[];

    return {
      ok: true,
      archive: {
        exportedAt: new Date().toISOString(),
        tree: this.buildPublicConfig(cfgRow, opts.isLocalDev),
        keepsakes: rows.map((r) => ({
          id: r.id,
          ornamentId: r.ornament_id,
          senderName: r.sender_name,
          message: r.message,
          isPrivate: Boolean(r.is_private),
          pageIndex: r.page_index,
          slotIndex: r.slot_index,
          createdAt: new Date(r.created_at).toISOString(),
        })),
      },
    };
  }
}
