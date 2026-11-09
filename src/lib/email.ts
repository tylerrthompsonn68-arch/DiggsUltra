import "server-only";
import type { ReactElement } from "react";
import { Resend } from "resend";

type Mail = { to: string; subject: string; react: ReactElement; replyTo?: string };

/**
 * Sends through Resend. Without RESEND_API_KEY (local dev, or before the
 * account exists) it logs instead, so the forms still work end to end.
 * Never throws: an email failure must not lose a saved inquiry.
 */
export async function sendEmail(mail: Mail): Promise<{ ok: boolean }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "DiggsUltra <onboarding@resend.dev>";

  if (!key) {
    console.info(`[email:skipped] no RESEND_API_KEY → to=${mail.to} subject="${mail.subject}"`);
    return { ok: false };
  }

  try {
    const { error } = await new Resend(key).emails.send({ from, ...mail });
    if (error) {
      console.error("[email:error]", error.name, error.message);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email:error]", err);
    return { ok: false };
  }
}

export function adminEmail(): string | undefined {
  return process.env.ADMIN_EMAIL?.trim() || undefined;
}
