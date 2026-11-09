import { booking } from "@/config/site";

/**
 * Lead-time rules for race bookings (CLAUDE.md §7).
 * Dates are plain YYYY-MM-DD strings. All math is done at UTC midnight so
 * daylight-saving changes can't shift a day.
 */

export type LeadTimeStatus =
  | "invalid" // not a real date
  | "past" // race already started: reject
  | "too_far" // beyond maxLeadDays: reject
  | "short" // under minLeadDays: allow, flag short_notice
  | "soon" // between min and preferred: allow, soft note
  | "ok"; // preferred lead time or more

export type LeadTime = { status: LeadTimeStatus; days: number | null };

type Rules = { minLeadDays: number; preferredLeadDays: number; maxLeadDays: number };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;

function toUtcMs(iso: string): number | null {
  if (!ISO_DATE.test(iso)) return null;
  const ms = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(ms)) return null;
  // Reject rollovers like 2026-02-31 → March 3.
  return new Date(ms).toISOString().slice(0, 10) === iso ? ms : null;
}

/** Whole days from `fromIso` to `toIso` (negative if `toIso` is earlier). */
export function daysBetween(fromIso: string, toIso: string): number | null {
  const from = toUtcMs(fromIso);
  const to = toUtcMs(toIso);
  if (from === null || to === null) return null;
  return Math.round((to - from) / DAY_MS);
}

/** Today's date as YYYY-MM-DD in a given time zone (US Central by default). */
export function todayIso(timeZone = "America/Chicago", now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function classifyLeadTime(
  raceStartIso: string,
  today: string,
  rules: Rules = booking,
): LeadTime {
  const days = daysBetween(today, raceStartIso);
  if (days === null) return { status: "invalid", days: null };
  if (days < 0) return { status: "past", days };
  if (days > rules.maxLeadDays) return { status: "too_far", days };
  if (days < rules.minLeadDays) return { status: "short", days };
  if (days < rules.preferredLeadDays) return { status: "soon", days };
  return { status: "ok", days };
}

/** Copy shown to race directors for each status. */
export function leadTimeMessage({ status, days }: LeadTime): string | null {
  switch (status) {
    case "invalid":
      return "Enter a valid race date.";
    case "past":
      return "That date has already passed. Double-check the race date.";
    case "too_far":
      return "I book up to 18 months ahead. Reach out again closer to race day.";
    case "short":
      return `Your race is ${days} day${days === 1 ? "" : "s"} out. Requests with under ${booking.minLeadDays} days' notice are rarely accepted, but you can still send it.`;
    case "soon":
      return `Your race is ${days} days out. That can work, but ${booking.preferredLeadDays}+ days' notice gives the best shot.`;
    case "ok":
      return null;
  }
}
