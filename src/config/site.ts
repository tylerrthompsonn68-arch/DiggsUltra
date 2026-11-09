/**
 * Site-wide config. Business rules live here so they change in one place.
 * Secrets and per-environment values belong in env vars, not this file.
 */

export const site = {
  name: "DiggsUltra",
  tagline: "Everything Ultra Marathon",
  description:
    "Live commentary, hype videos, and on-the-ground coverage for ultramarathons. They stream your race. I make people care about it.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const socials = [
  { label: "YouTube", handle: "@Diggsultra", href: "https://www.youtube.com/@Diggsultra" },
  { label: "TikTok", handle: "@diggsultra", href: "https://www.tiktok.com/@diggsultra" },
  { label: "Instagram", handle: "@diggsultra", href: "https://www.instagram.com/diggsultra" },
] as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Coverage", href: "/coverage" },
  { label: "Races", href: "/races" },
  { label: "Partners", href: "/partners" },
] as const;

export const bookCta = { label: "Book Diggs", href: "/book" } as const;

/** Booking lead-time rules (CLAUDE.md §7). Owner-confirmed 2026-11-08. */
export const booking = {
  /** Below this, the inquiry is flagged short_notice and the form shows a warning. */
  minLeadDays: 30,
  /** Preferred notice. Between min and preferred, show a soft "earlier is better" note. */
  preferredLeadDays: 90,
  /** Races book up to ~18 months out. Beyond this, reject. */
  maxLeadDays: 548,
  /** No fixed SLA. Used in the confirmation email. */
  responseTime: "as soon as I can",
} as const;
