export const SPA_SESSION_COOKIE = "spa_session";

/** Zgodne z ustawieniami ciasteczka w API logowania */
export const SPA_SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

/**
 * Używane tylko gdy sesja nie jest HttpOnly (np. stary flow).
 * Logowanie ustawia sesję przez POST /api/auth/login (HttpOnly).
 */
export function setSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SPA_SESSION_COOKIE}=1; path=/; max-age=${SPA_SESSION_MAX_AGE_SEC}; SameSite=Lax`;
}

export function clearSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SPA_SESSION_COOKIE}=; path=/; max-age=0`;
}
