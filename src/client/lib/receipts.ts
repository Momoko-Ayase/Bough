const RECEIPTS_STORAGE_KEY = "bough_sender_receipts_v1";

export function loadReceiptTokens(): string[] {
  try {
    const raw = localStorage.getItem(RECEIPTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string").slice(-40);
  } catch {
    return [];
  }
}

export function saveReceiptToken(token: string) {
  try {
    const current = loadReceiptTokens();
    if (!current.includes(token)) {
      current.push(token);
    }
    localStorage.setItem(
      RECEIPTS_STORAGE_KEY,
      JSON.stringify(current.slice(-40))
    );
  } catch {
    // ignore storage errors
  }
}
