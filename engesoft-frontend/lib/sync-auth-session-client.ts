/**
 * Mirrors the bearer token into an HttpOnly cookie (via Route Handler) so that
 * middleware and Server Components can enforce route-level authorization.
 */
export async function syncAuthSessionCookie(token: string): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function clearAuthSessionCookie(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    /* ignore */
  }
}
