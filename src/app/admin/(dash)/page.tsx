import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin";
import { inquiryStatuses, labelFor } from "@/lib/inquiry-options";
import { bookingRate, formatDate, inquiryTitle, listInquiries, type InquiryFilters } from "@/lib/inquiries";
import { todayIso } from "@/lib/lead-time";
import { Kanban, type Card } from "./kanban";

type SP = Record<string, string | string[] | undefined>;

export default function PipelinePage({ searchParams }: PageProps<"/admin">) {
  return (
    <Suspense fallback={<p className="text-ink-muted">Loading pipeline…</p>}>
      <Pipeline searchParams={searchParams} />
    </Suspense>
  );
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

async function Pipeline({ searchParams }: { searchParams: Promise<SP> }) {
  await requireAdmin();
  const sp = await searchParams;
  const view = one(sp.view) === "table" ? "table" : "board";
  const filters: InquiryFilters = {
    type: one(sp.type) === "race" || one(sp.type) === "sponsorship" ? (one(sp.type) as InquiryFilters["type"]) : undefined,
    status: inquiryStatuses.some((s) => s.value === one(sp.status)) ? one(sp.status) : undefined,
    shortNotice: one(sp.short) === "yes" || one(sp.short) === "no" ? (one(sp.short) as "yes" | "no") : undefined,
    from: one(sp.from),
    to: one(sp.to),
  };

  const [rows, rate] = await Promise.all([listInquiries(view === "table" ? filters : {}), bookingRate()]);
  const today = todayIso();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl">{view === "table" ? "Inquiries" : "Pipeline"}</h1>
        <dl className="flex gap-8 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">Race inquiries</dt>
            <dd className="font-display text-2xl">{rate.total}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">Booked</dt>
            <dd className="font-display text-2xl">{rate.won}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">Booking rate</dt>
            <dd className="font-display text-2xl">{rate.rate === null ? "—" : `${Math.round(rate.rate * 100)}%`}</dd>
            <dd className="text-xs text-ink-muted">Baseline 33% (2 of 6)</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6">
        {view === "board" ? (
          rows.length ? (
            <Kanban
              cards={rows.map<Card>((r) => ({
                id: r.id,
                title: inquiryTitle(r),
                status: r.status,
                type: r.type,
                date: formatDate(r.raceStartDate),
                location: [r.city, r.state].filter(Boolean).join(", "),
                shortNotice: r.shortNotice,
                followUp: r.nextFollowUpDate ? formatDate(r.nextFollowUpDate) : null,
                overdue: !!r.nextFollowUpDate && r.nextFollowUpDate <= today,
              }))}
            />
          ) : (
            <p className="text-ink-muted">No inquiries yet. They&apos;ll show up here when someone fills out /book or /partners.</p>
          )
        ) : (
          <InquiryTable rows={rows} filters={filters} />
        )}
      </div>
    </>
  );
}

function InquiryTable({ rows, filters }: { rows: Awaited<ReturnType<typeof listInquiries>>; filters: InquiryFilters }) {
  const sel = "rounded-sm border border-rule bg-paper-raised px-2 py-1.5 text-sm";
  return (
    <>
      <form method="get" className="mb-4 flex flex-wrap items-end gap-3 text-sm">
        <input type="hidden" name="view" value="table" />
        <label className="flex flex-col gap-1">Type
          <select name="type" defaultValue={filters.type ?? ""} className={sel}>
            <option value="">All</option><option value="race">Race</option><option value="sponsorship">Sponsor</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">Status
          <select name="status" defaultValue={filters.status ?? ""} className={sel}>
            <option value="">All</option>
            {inquiryStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">Short notice
          <select name="short" defaultValue={filters.shortNotice ?? ""} className={sel}>
            <option value="">Any</option><option value="yes">Yes</option><option value="no">No</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">Race from<input type="date" name="from" defaultValue={filters.from} className={sel} /></label>
        <label className="flex flex-col gap-1">Race to<input type="date" name="to" defaultValue={filters.to} className={sel} /></label>
        <button type="submit" className="rounded-sm bg-accent px-4 py-2 font-semibold text-accent-ink">Filter</button>
        <Link href="/admin?view=table" className="py-2 text-ink-muted underline">Clear</Link>
      </form>
      <div className="overflow-x-auto rounded-sm border border-rule">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-paper-raised text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th scope="col" className="px-3 py-2">Name</th><th scope="col" className="px-3 py-2">Type</th>
              <th scope="col" className="px-3 py-2">Status</th><th scope="col" className="px-3 py-2">Race date</th>
              <th scope="col" className="px-3 py-2">Location</th><th scope="col" className="px-3 py-2">Lead</th>
              <th scope="col" className="px-3 py-2">Follow up</th><th scope="col" className="px-3 py-2">Received</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-rule">
                <td className="px-3 py-2 font-semibold"><Link href={`/admin/inquiries/${r.id}`} className="hover:text-accent">{inquiryTitle(r)}</Link></td>
                <td className="px-3 py-2">{r.type === "race" ? "Race" : "Sponsor"}</td>
                <td className="px-3 py-2">{labelFor(inquiryStatuses, r.status)}</td>
                <td className="px-3 py-2">{formatDate(r.raceStartDate)}</td>
                <td className="px-3 py-2">{[r.city, r.state].filter(Boolean).join(", ") || "—"}</td>
                <td className="px-3 py-2">{r.leadDays ?? "—"}{r.shortNotice && <span className="ml-1 font-bold text-accent">short</span>}</td>
                <td className="px-3 py-2">{formatDate(r.nextFollowUpDate)}</td>
                <td className="px-3 py-2">{r.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={8} className="px-3 py-6 text-center text-ink-muted">No matches.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
