import { TURNSTILE_TEST_SECRET_KEY } from "../shared/catalog";

export interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function verifyTurnstileToken(opts: {
  token: string;
  secretKey: string | null;
  remoteIp?: string | null;
  isLocalDev: boolean;
}): Promise<{ ok: boolean; errorCodes: string[] }> {
  const { token, secretKey, remoteIp, isLocalDev } = opts;

  if (!token || typeof token !== "string" || token.length > 2048) {
    return { ok: false, errorCodes: ["missing-or-invalid-token"] };
  }

  const effectiveSecret =
    secretKey && secretKey.trim().length > 0
      ? secretKey.trim()
      : isLocalDev
        ? TURNSTILE_TEST_SECRET_KEY
        : null;

  if (!effectiveSecret) {
    return { ok: false, errorCodes: ["turnstile-not-configured"] };
  }

  // Offline resilience in local dev when using official dummy token + test secret
  if (
    effectiveSecret === TURNSTILE_TEST_SECRET_KEY &&
    token.includes("DUMMY.TOKEN")
  ) {
    return { ok: true, errorCodes: [] };
  }

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10_000),
        body: JSON.stringify({
          secret: effectiveSecret,
          response: token,
          ...(remoteIp ? { remoteip: remoteIp } : {}),
          idempotency_key: crypto.randomUUID(),
        }),
      }
    );

    if (!res.ok) {
      return { ok: false, errorCodes: [`http-${res.status}`] };
    }

    const data = (await res.json()) as TurnstileVerifyResponse;
    return {
      ok: Boolean(data.success),
      errorCodes: data["error-codes"] ?? [],
    };
  } catch {
    // If local developer has no internet access while testing with dummy token
    if (isLocalDev && effectiveSecret === TURNSTILE_TEST_SECRET_KEY) {
      return { ok: true, errorCodes: [] };
    }
    return { ok: false, errorCodes: ["network-verify-error"] };
  }
}
