"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { getDb, schema } from "@/db";
import { assertAdmin } from "@/lib/admin";
import { declineReasons, inquiryStatuses } from "@/lib/inquiry-options";
import { STATS_TAG } from "@/lib/stats";

/* Every action here starts with assertAdmin(): server actions are public POST endpoints. */

const statusEnum = z.enum(inquiryStatuses.map((s) => s.value) as [string, ...string[]]);
const reasonEnum = z.enum(declineReasons.map((r) => r.value) as [string, ...string[]]);
const uuid = z.uuid();

type Status = (typeof schema.inquiryStatus.enumValues)[number];
type Reason = (typeof schema.declineReason.enumValues)[number];

export async function adminSignIn() {
  await signIn("google", { redirectTo: "/admin" });
}

export async function adminSignOut() {
  await signOut({ redirectTo: "/" });
}

/** Change status and log it in the history. Used by kanban drag, card selects, and the detail page. */
export async function updateInquiryStatus(id: string, to: string, reason?: string | null) {
  await assertAdmin();
  const inquiryId = uuid.parse(id);
  const toStatus = statusEnum.parse(to) as Status;
  const declineReason = toStatus === "declined" && reason ? (reasonEnum.parse(reason) as Reason) : null;

  const db = getDb();
  const [current] = await db
    .select({ status: schema.inquiries.status })
    .from(schema.inquiries)
    .where(eq(schema.inquiries.id, inquiryId));
  if (!current) throw new Error("Inquiry not found");
  if (current.status === toStatus && !declineReason) return;

  await db
    .update(schema.inquiries)
    .set({ status: toStatus, declineReason: toStatus === "declined" ? declineReason : null })
    .where(eq(schema.inquiries.id, inquiryId));
  if (current.status !== toStatus) {
    await db.insert(schema.inquiryEvents).values({ inquiryId, fromStatus: current.status, toStatus });
  }
  // Phase 3: Google Calendar sync hooks in here (→ confirmed creates, ← confirmed deletes).
  revalidatePath("/admin", "layout");
}

export async function updateStatusFromForm(fd: FormData) {
  await updateInquiryStatus(String(fd.get("id")), String(fd.get("status")), (fd.get("declineReason") as string) || null);
}

/** Append-only private note. */
export async function addInquiryNote(fd: FormData) {
  await assertAdmin();
  const inquiryId = uuid.parse(fd.get("id"));
  const body = z.string().trim().min(1).max(5000).parse(fd.get("body"));
  await getDb().insert(schema.inquiryNotes).values({ inquiryId, body });
  revalidatePath(`/admin/inquiries/${inquiryId}`);
}

const dollarsToCents = z
  .string()
  .trim()
  .transform((v) => v.replace(/[$,\s]/g, ""))
  .transform((v) => (v === "" ? null : Math.round(Number(v) * 100)))
  .refine((v) => v === null || (Number.isFinite(v) && v >= 0), "Enter an amount like 1500");

/** Follow-up date + private quoted/agreed amounts. */
export async function updateInquiryDetails(fd: FormData) {
  await assertAdmin();
  const inquiryId = uuid.parse(fd.get("id"));
  const followUp = z
    .string()
    .regex(/^(\d{4}-\d{2}-\d{2})?$/)
    .parse(fd.get("nextFollowUpDate") ?? "");
  await getDb()
    .update(schema.inquiries)
    .set({
      nextFollowUpDate: followUp || null,
      quotedAmountCents: dollarsToCents.parse(fd.get("quotedAmount") ?? ""),
      agreedAmountCents: dollarsToCents.parse(fd.get("agreedAmount") ?? ""),
    })
    .where(eq(schema.inquiries.id, inquiryId));
  revalidatePath("/admin", "layout");
}

/** Saves a new snapshot of follower counts + 30-day views per platform. */
export async function saveChannelStats(fd: FormData) {
  await assertAdmin();
  const asOf = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).parse(fd.get("asOf"));
  const count = z
    .string()
    .trim()
    .transform((v) => v.replace(/[,\s]/g, ""))
    .transform((v) => (v === "" ? null : Number(v)))
    .refine((v) => v === null || (Number.isInteger(v) && v >= 0));

  const rows = (["instagram", "tiktok", "youtube"] as const).map((platform) => ({
    platform,
    followers: count.parse(fd.get(`${platform}.followers`) ?? "") ?? 0,
    views30d: count.parse(fd.get(`${platform}.views30d`) ?? ""),
    asOf,
  }));
  await getDb().insert(schema.channelStats).values(rows);
  updateTag(STATS_TAG);
  revalidatePath("/admin/stats");
}
