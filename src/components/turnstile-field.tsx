"use client";

import { Turnstile } from "@marsidev/react-turnstile";

/** Renders Cloudflare Turnstile only when a site key is configured. It adds a cf-turnstile-response field to the form. */
export function TurnstileField() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;
  return <Turnstile siteKey={siteKey} options={{ theme: "auto", size: "flexible" }} />;
}
