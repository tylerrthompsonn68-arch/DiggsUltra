import "server-only";
import { and, asc, desc, eq, gte, lte, type SQL, sql } from "drizzle-orm";
import { getDb, schema } from "@/db";

/** Admin-only data access. Callers must have run requireAdmin(). */

export type InquiryFilters = {
  type?: "race" | "sponsorship";
  status?: string;
  shortNotice?: "yes" | "no";
  from?: string;
  to?: string;
};

const t = schema.inquiries;
export type Inquiry = typeof t.$inferSelect;

export async function listInquiries(f: InquiryFilters = {}) {
  const where: SQL[] = [];
  if (f.type) where.push(eq(t.type, f.type));
  if (f.status) where.push(sql`${t.status} = ${f.status}`);
  if (f.shortNotice) where.push(eq(t.shortNotice, f.shortNotice === "yes"));
  if (f.from) where.push(gte(t.raceStartDate, f.from));
  if (f.to) where.push(lte(t.raceStartDate, f.to));

  // Default sort (CLAUDE.md §8): race date ascending, short notice last.
  return getDb()
    .select()
    .from(t)
    .where(where.length ? and(...where) : undefined)
    .orderBy(asc(t.shortNotice), sql`${t.raceStartDate} asc nulls last`, desc(t.createdAt));
}

export async function getInquiry(id: string) {
  const db = getDb();
  const [inquiry] = await db.select().from(t).where(eq(t.id, id));
  if (!inquiry) return null;
  const [history, notes] = await Promise.all([
    db.select().from(schema.inquiryEvents).where(eq(schema.inquiryEvents.inquiryId, id)).orderBy(desc(schema.inquiryEvents.createdAt)),
    db.select().from(schema.inquiryNotes).where(eq(schema.inquiryNotes.inquiryId, id)).orderBy(desc(schema.inquiryNotes.createdAt)),
  ]);
  return { inquiry, history, notes };
}

/** The business metric (CLAUDE.md §12): race inquiry → confirmed booking. */
export async function bookingRate() {
  const rows = await getDb()
    .select({ status: t.status, n: sql<number>`count(*)::int` })
    .from(t)
    .where(eq(t.type, "race"))
    .groupBy(t.status);
  const by = Object.fromEntries(rows.map((r) => [r.status, r.n])) as Record<string, number>;
  const total = rows.reduce((n, r) => n + r.n, 0);
  const won = (by.confirmed ?? 0) + (by.completed ?? 0);
  return { total, won, byStatus: by, rate: total ? won / total : null };
}

export const inquiryTitle = (i: Pick<Inquiry, "type" | "raceName" | "brandName">) =>
  (i.type === "race" ? i.raceName : i.brandName) ?? "Untitled";

export const formatDate = (iso: string | null) =>
  iso ? new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "—";

export const formatCents = (c: number | null) =>
  c === null ? "" : (c / 100).toLocaleString("en-US", { maximumFractionDigits: 2, useGrouping: false });
