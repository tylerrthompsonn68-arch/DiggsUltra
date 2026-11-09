"use server";

import { headers } from "next/headers";
import { getDb, schema } from "@/db";
import { AdminAlertEmail } from "@/emails/admin-alert";
import { RaceConfirmationEmail } from "@/emails/race-confirmation";
import { SponsorConfirmationEmail } from "@/emails/sponsor-confirmation";
import { site } from "@/config/site";
import { adminEmail, sendEmail } from "@/lib/email";
import {
  labelFor,
  lodgingOptions,
  partnershipTypes,
  services as serviceOptions,
} from "@/lib/inquiry-options";
import { classifyLeadTime, leadTimeMessage, todayIso } from "@/lib/lead-time";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import {
  fieldErrors,
  formDataToObject,
  raceInquirySchema,
  sponsorInquirySchema,
} from "@/lib/validation";

export type FormState = {
  ok: boolean;
  errors?: Record<string, string>;
  message?: string;
};

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/** Shared spam gate: honeypot, Turnstile, rate limit. Returns an error state or null. */
async function spamGate(fd: FormData, bucket: string): Promise<FormState | null> {
  // Honeypot: bots fill hidden fields. Pretend success so they don't retry.
  if (String(fd.get("website_hp") ?? "").length > 0) return { ok: true };

  const ip = await clientIp();
  const token = fd.get("cf-turnstile-response");
  if (!(await verifyTurnstile(typeof token === "string" ? token : null, ip))) {
    return { ok: false, message: "Couldn't verify you're human. Refresh the page and try again." };
  }
  if (!(await rateLimit(bucket, ip))) {
    return { ok: false, message: "Too many submissions from this connection. Try again in an hour." };
  }
  return null;
}

const fmtList = (vals: readonly string[] | undefined) => (vals?.length ? vals.join(", ") : undefined);

/* ---------- /book ---------- */

export async function submitRaceInquiry(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = raceInquirySchema.safeParse(formDataToObject(fd));
  if (!parsed.success) {
    return { ok: false, errors: fieldErrors(parsed.error), message: "Check the highlighted fields." };
  }
  const d = parsed.data;

  const lead = classifyLeadTime(d.raceStartDate, todayIso());
  if (lead.status === "past" || lead.status === "too_far" || lead.status === "invalid") {
    return { ok: false, errors: { raceStartDate: leadTimeMessage(lead)! }, message: "Check the race date." };
  }

  const blocked = await spamGate(fd, "race");
  if (blocked) return blocked;

  const shortNotice = lead.status === "short";
  const db = getDb();

  let id: string;
  try {
    const [row] = await db
      .insert(schema.inquiries)
      .values({
        type: "race",
        status: "new",
        contactName: d.contactName,
        contactEmail: d.contactEmail,
        contactPhone: d.contactPhone,
        contactRole: d.contactRole,
        referralSource: d.referralSource,
        message: d.message,
        raceName: d.raceName,
        raceUrl: d.raceUrl,
        raceStartDate: d.raceStartDate,
        raceEndDate: d.raceEndDate,
        city: d.city,
        state: d.state,
        country: d.country || "US",
        formats: d.formats,
        fieldSize: d.fieldSize,
        streamProducer: d.streamProducer,
        services: d.services,
        expensesAcknowledged: d.expensesAcknowledged,
        nearestAirport: d.nearestAirport,
        lodging: d.lodging,
        budgetRange: d.budgetRange,
        shortNotice,
        leadDays: lead.days,
      })
      .returning({ id: schema.inquiries.id });
    id = row.id;
    await db.insert(schema.inquiryEvents).values({ inquiryId: id, fromStatus: null, toStatus: "new" });
  } catch (err) {
    console.error("[inquiry:race] save failed", err);
    return { ok: false, message: "Something broke on my end. Please try again, or DM @diggsultra." };
  }

  const admin = adminEmail();
  await Promise.all([
    sendEmail({
      to: d.contactEmail,
      subject: `Got your request: ${d.raceName}`,
      react: RaceConfirmationEmail({
        contactName: d.contactName,
        raceName: d.raceName,
        raceStartDate: d.raceStartDate,
        shortNotice,
      }),
      replyTo: admin,
    }),
    admin &&
      sendEmail({
        to: admin,
        subject: `${shortNotice ? "[SHORT NOTICE] " : ""}New race request: ${d.raceName} (${d.raceStartDate})`,
        replyTo: d.contactEmail,
        react: AdminAlertEmail({
          title: `New race request: ${d.raceName}`,
          link: `${site.url}/admin/inquiries/${id}`,
          warning: shortNotice ? `Short notice: ${lead.days} days out.` : undefined,
          rows: [
            ["Race", d.raceName],
            ["Dates", d.raceEndDate ? `${d.raceStartDate} → ${d.raceEndDate}` : d.raceStartDate],
            ["Lead time", `${lead.days} days`],
            ["Location", [d.city, d.state, d.country].filter(Boolean).join(", ")],
            ["Format", fmtList(d.formats)],
            ["Field size", d.fieldSize],
            ["Stream producer", d.streamProducer],
            ["Wants", fmtList(d.services.map((s) => labelFor(serviceOptions, s)))],
            ["Budget", d.budgetRange],
            ["Nearest airport", d.nearestAirport],
            ["Lodging on site", labelFor(lodgingOptions, d.lodging)],
            ["Website", d.raceUrl],
            ["Contact", `${d.contactName}${d.contactRole ? ` (${d.contactRole})` : ""}`],
            ["Email", d.contactEmail],
            ["Phone", d.contactPhone],
            ["Heard about Diggs", d.referralSource],
            ["Notes", d.message],
          ],
        }),
      }),
  ]);

  return { ok: true };
}

/* ---------- /partners ---------- */

export async function submitSponsorInquiry(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = sponsorInquirySchema.safeParse(formDataToObject(fd));
  if (!parsed.success) {
    return { ok: false, errors: fieldErrors(parsed.error), message: "Check the highlighted fields." };
  }
  const d = parsed.data;

  const blocked = await spamGate(fd, "sponsor");
  if (blocked) return blocked;

  const db = getDb();
  let id: string;
  try {
    const [row] = await db
      .insert(schema.inquiries)
      .values({
        type: "sponsorship",
        status: "new",
        contactName: d.contactName,
        contactEmail: d.contactEmail,
        contactRole: d.contactRole,
        message: d.message,
        brandName: d.brandName,
        brandUrl: d.brandUrl,
        partnershipTypes: d.partnershipTypes,
        budgetRange: d.budgetRange,
        timeline: d.timeline,
      })
      .returning({ id: schema.inquiries.id });
    id = row.id;
    await db.insert(schema.inquiryEvents).values({ inquiryId: id, fromStatus: null, toStatus: "new" });
  } catch (err) {
    console.error("[inquiry:sponsor] save failed", err);
    return { ok: false, message: "Something broke on my end. Please try again, or DM @diggsultra." };
  }

  const admin = adminEmail();
  await Promise.all([
    sendEmail({
      to: d.contactEmail,
      subject: "Thanks for reaching out to DiggsUltra",
      react: SponsorConfirmationEmail({ contactName: d.contactName, brandName: d.brandName }),
      replyTo: admin,
    }),
    admin &&
      sendEmail({
        to: admin,
        subject: `New sponsor inquiry: ${d.brandName}`,
        replyTo: d.contactEmail,
        react: AdminAlertEmail({
          title: `New sponsor inquiry: ${d.brandName}`,
          link: `${site.url}/admin/inquiries/${id}`,
          rows: [
            ["Brand", d.brandName],
            ["Website", d.brandUrl],
            ["Interested in", fmtList(d.partnershipTypes.map((t) => labelFor(partnershipTypes, t)))],
            ["Budget", d.budgetRange],
            ["Timeline", d.timeline],
            ["Contact", `${d.contactName}${d.contactRole ? ` (${d.contactRole})` : ""}`],
            ["Email", d.contactEmail],
            ["Message", d.message],
          ],
        }),
      }),
  ]);

  return { ok: true };
}
