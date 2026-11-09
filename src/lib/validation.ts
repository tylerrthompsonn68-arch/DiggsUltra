import { z } from "zod";
import {
  lodgingOptions,
  partnershipTypes,
  raceBudgetRanges,
  raceFormats,
  services,
  sponsorBudgetRanges,
} from "./inquiry-options";

/**
 * One Zod schema per form (CLAUDE.md §6). Used for per-step checks in the
 * browser and as the source of truth in the server actions.
 * Lead-time rules live in lead-time.ts, because they depend on "today".
 */

const values = <T extends { value: string }>(list: readonly T[]) =>
  list.map((o) => o.value) as [T["value"], ...T["value"][]];

const trimmed = (max: number) => z.string().trim().max(max);
const required = (label: string, max = 200) =>
  trimmed(max).min(1, `${label} is required.`);
const optional = (max = 200) =>
  trimmed(max)
    .optional()
    .transform((v) => (v ? v : undefined));

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((v) => {
    if (!v) return undefined;
    return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  })
  .pipe(z.url("Enter a valid web address.").optional());

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date.");

const optionalInt = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? Number(v) : undefined))
  .pipe(z.number().int("Use a whole number.").min(1).max(100_000).optional());

/* ---------- Race director intake (/book) ---------- */

export const raceStepSchemas = {
  race: z
    .object({
      raceName: required("Race name"),
      raceUrl: optionalUrl,
      raceStartDate: isoDate,
      raceEndDate: isoDate.optional().or(z.literal("").transform(() => undefined)),
      city: required("City", 100),
      state: required("State", 100),
      country: trimmed(100).default("US"),
      formats: z.array(z.enum(raceFormats)).min(1, "Pick at least one format."),
      fieldSize: optionalInt,
      streamProducer: optional(300),
    })
    .refine((d) => !d.raceEndDate || d.raceEndDate >= d.raceStartDate, {
      message: "End date can't be before the start date.",
      path: ["raceEndDate"],
    }),
  services: z.object({
    services: z.array(z.enum(values(services))).min(1, "Pick at least one."),
  }),
  logistics: z.object({
    expensesAcknowledged: z.literal(true, {
      error: "Please confirm the race covers travel, lodging, and food.",
    }),
    nearestAirport: optional(100),
    lodging: z.enum(values(lodgingOptions)).optional(),
    budgetRange: z.enum(raceBudgetRanges).optional(),
  }),
  contact: z.object({
    contactName: required("Name", 120),
    contactRole: optional(120),
    contactEmail: z.email("Enter a valid email."),
    contactPhone: optional(40),
    referralSource: optional(200),
    message: optional(4000),
  }),
} as const;

export const raceInquirySchema = raceStepSchemas.race
  .and(raceStepSchemas.services)
  .and(raceStepSchemas.logistics)
  .and(raceStepSchemas.contact);

export type RaceInquiryInput = z.infer<typeof raceInquirySchema>;
export type RaceStep = keyof typeof raceStepSchemas;
export const raceSteps: { key: RaceStep; title: string }[] = [
  { key: "race", title: "The race" },
  { key: "services", title: "What you want" },
  { key: "logistics", title: "Logistics" },
  { key: "contact", title: "You" },
];

/* ---------- Sponsor intake (/partners) ---------- */

export const sponsorInquirySchema = z.object({
  brandName: required("Brand name"),
  brandUrl: optionalUrl,
  contactName: required("Name", 120),
  contactEmail: z.email("Enter a valid email."),
  contactRole: optional(120),
  partnershipTypes: z
    .array(z.enum(values(partnershipTypes)))
    .min(1, "Pick at least one."),
  budgetRange: z.enum(sponsorBudgetRanges).optional(),
  timeline: optional(200),
  message: optional(4000),
});

export type SponsorInquiryInput = z.infer<typeof sponsorInquirySchema>;

/* ---------- FormData helpers ---------- */

const ARRAY_FIELDS = new Set(["formats", "services", "partnershipTypes"]);

/** Turn FormData into a plain object; checkbox groups become arrays, "" becomes undefined. */
export function formDataToObject(fd: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of new Set(fd.keys())) {
    if (key.startsWith("$") || key === "cf-turnstile-response" || key === "website_hp") continue;
    if (ARRAY_FIELDS.has(key)) {
      out[key] = fd.getAll(key).map(String);
    } else if (key === "expensesAcknowledged") {
      out[key] = fd.get(key) === "on" || fd.get(key) === "true";
    } else {
      const v = String(fd.get(key) ?? "");
      out[key] = v === "" ? undefined : v;
    }
  }
  for (const key of ARRAY_FIELDS) if (!(key in out)) out[key] = [];
  return out;
}

/** Zod error → { field: firstMessage } for inline display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_form");
    out[key] ??= issue.message;
  }
  return out;
}
