// Persistent API key store (localStorage-backed).
// Keys are stored client-side only — never sent to any backend.
//
// Hardcoded defaults match the project's provisioned keys.
// localStorage entries override the defaults if present.

const KEYS = {
  openaq: 'pim_apikey_openaq',
  gfw:    'pim_apikey_gfw',
} as const;

// ── Hardcoded defaults ────────────────────────────────────────────────────────
const DEFAULTS: Record<ApiKeyId, string> = {
  openaq: '9eb1dc7163a576657916669f182960dc191aa2f137b2da17de09883a15b98420',
  gfw:    '55133598-dd6d-426a-8720-562db0326a1c',
};

export type ApiKeyId = keyof typeof KEYS;

/** Returns the localStorage override, or the hardcoded default. */
export function getApiKey(id: ApiKeyId): string {
  return localStorage.getItem(KEYS[id]) ?? DEFAULTS[id] ?? '';
}

/** Store an override key in localStorage (empty string clears the override, reverting to default). */
export function setApiKey(id: ApiKeyId, value: string): void {
  if (value.trim()) {
    localStorage.setItem(KEYS[id], value.trim());
  } else {
    localStorage.removeItem(KEYS[id]); // falls back to hardcoded default
  }
}

export function hasApiKey(id: ApiKeyId): boolean {
  return !!getApiKey(id);
}
