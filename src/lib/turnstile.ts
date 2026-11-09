import "server-only";

/**
 * Server-side Cloudflare Turnstile check.
 * If TURNSTILE_SECRET_KEY isn't set (local dev, or before keys exist), the
 * check is skipped and the honeypot + rate limit still apply.
 */
export async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
