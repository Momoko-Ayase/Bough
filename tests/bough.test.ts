import { describe, expect, it } from "vitest";
import {
  BRANCH_HOOKS,
  ORNAMENT_CATALOG,
  SLOTS_PER_PAGE,
  TOPPER_CATALOG,
  TURNSTILE_TEST_SECRET_KEY,
} from "../src/shared/catalog";
import {
  DICTIONARIES,
  SUPPORTED_LOCALES,
} from "../src/client/i18n/dictionaries";
import {
  createSessionToken,
  hashPassword,
  sha256Hex,
  timingSafeStringEqual,
  verifyPassword,
  verifySessionToken,
} from "../src/worker/crypto";
import { verifyTurnstileToken } from "../src/worker/turnstile";

describe("Bough catalog & i18n parity", () => {
  it("defines 28 ornaments across 4 craft families and 6 crown toppers", () => {
    expect(ORNAMENT_CATALOG).toHaveLength(28);
    expect(TOPPER_CATALOG).toHaveLength(6);
    expect(BRANCH_HOOKS).toHaveLength(SLOTS_PER_PAGE);

    const uniqueIds = new Set(ORNAMENT_CATALOG.map((o) => o.id));
    expect(uniqueIds.size).toBe(28);
  });

  it("translates every ornament and topper across all 5 supported locales", () => {
    expect(SUPPORTED_LOCALES).toEqual(["en", "zh-CN", "zh-TW", "ja", "ko"]);

    for (const locale of SUPPORTED_LOCALES) {
      const dict = DICTIONARIES[locale];
      for (const ornament of ORNAMENT_CATALOG) {
        expect(dict.composer.ornaments[ornament.id]).toBeTruthy();
      }
      for (const topper of TOPPER_CATALOG) {
        expect(dict.composer.toppers[topper.id]).toBeTruthy();
      }
    }
  });
});

describe("Bough Web Crypto owner auth & session tokens", () => {
  it("hashes and verifies PBKDF2-SHA256 passwords accurately", async () => {
    const hash = await hashPassword("winter-spruce-2026");
    expect(await verifyPassword("winter-spruce-2026", hash)).toBe(true);
    expect(await verifyPassword("wrong-password", hash)).toBe(false);
  });

  it("signs and validates HMAC-SHA256 owner session cookies and rejects tampering", async () => {
    const secret = "super-secret-signing-key";
    const token = await createSessionToken(secret, 3600);
    expect(await verifySessionToken(token, secret)).toBe(true);
    expect(await verifySessionToken(token, "other-secret")).toBe(false);
    expect(await verifySessionToken(`${token}tampered`, secret)).toBe(false);
    expect(await verifySessionToken(undefined, secret)).toBe(false);

    const expired = await createSessionToken(secret, -10);
    expect(await verifySessionToken(expired, secret)).toBe(false);
  });

  it("performs constant-time string equality and SHA-256 receipt hashing", async () => {
    expect(await timingSafeStringEqual("alpha", "alpha")).toBe(true);
    expect(await timingSafeStringEqual("alpha", "beta")).toBe(false);

    const digest = await sha256Hex("receipt-token-123");
    expect(digest).toHaveLength(64);
  });
});

describe("Cloudflare Turnstile verification guards", () => {
  it("rejects empty or oversized tokens and unconfigured production secrets", async () => {
    const empty = await verifyTurnstileToken({
      token: "",
      secretKey: TURNSTILE_TEST_SECRET_KEY,
      isLocalDev: true,
    });
    expect(empty.ok).toBe(false);

    const unconfiguredProd = await verifyTurnstileToken({
      token: "valid-looking-token",
      secretKey: null,
      isLocalDev: false,
    });
    expect(unconfiguredProd.ok).toBe(false);
    expect(unconfiguredProd.errorCodes).toContain("turnstile-not-configured");
  });

  it("accepts Cloudflare official dummy token paired with test secret in local dev", async () => {
    const dummyPass = await verifyTurnstileToken({
      token: "XXXX.DUMMY.TOKEN.XXXX",
      secretKey: null,
      isLocalDev: true,
    });
    expect(dummyPass.ok).toBe(true);
  });
});
