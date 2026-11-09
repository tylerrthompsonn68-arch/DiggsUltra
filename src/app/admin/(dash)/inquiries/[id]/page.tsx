import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { addInquiryNote, updateInquiryDetails, updateStatusFromForm } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin";
import {
  declineReasons,
  inquiryStatuses,
  labelFor,
  lodgingOptions,
  partnershipTypes,
  services,
} from "@/lib/inquiry-options";
import { formatCents, formatDate, getInquiry, inquiryTitle } from "@/lib/inquiries";

export default function InquiryPage({ params }: PageProps<"/admin/inquiries/[id]">) {
  return (
    <Suspense fallback={<p className="text-ink-muted">Loading…</p>}>
      <InquiryDetail params={params} />
    </Suspense>
  );
}

const input = "mt-1 block w-full rounded-sm border border-rule bg-paper-raised px-3 py-2 text-sm";
const btn = "rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-accent-ink hover:bg-accent-hover";
const stamp = (d: Date) =>
  d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" });

async function InquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const data = await getInquiry(id);
  if (!data) notFound();
  const { inquiry: i, history, notes } = data;

  const fields: [string, string | number | null | undefined][] =
    i.type === "race"
      ? [
          ["Race", i.raceName],
          ["Dates", i.raceEndDate ? `${formatDate(i.raceStartDate)} → ${formatDate(i.raceEndDate)}` : formatDate(i.raceStartDate)],
          ["Lead time at submission", i.leadDays !== null ? `${i.leadDays} days${i.shortNotice ? " (short notice)" : ""}` : null],
          ["Location", [i.city, i.state, i.country].filter(Boolean).join(", ")],
          ["Format", i.formats?.join(", ")],
          ["Field size", i.fieldSize],
          ["Stream producer", i.streamProducer],
          ["Wants", i.services?.map((s) => labelFor(services, s)).join(", ")],
          ["Expenses acknowledged", i.expensesAcknowledged ? "Yes" : "No"],
          ["Nearest airport", i.nearestAirport],
          ["Lodging on site", labelFor(lodgingOptions, i.lodging)],
          ["Budget", i.budgetRange],
          ["Website", i.raceUrl],
        ]
      : [
          ["Brand", i.brandName],
          ["Website", i.brandUrl],
          ["Interested in", i.partnershipTypes?.map((p) => labelFor(partnershipTypes, p)).join(", ")],
          ["Budget", i.budgetRange],
          ["Timeline", i.timeline],
        ];
  const contact: [string, string | null | undefined][] = [
    ["Name", i.contactName],
    ["Role", i.contactRole],
    ["Email", i.contactEmail],
    ["Phone", i.contactPhone],
    ["Heard about Diggs", i.referralSource],
  ];

  return (
    <div>
      <Link href="/admin" className="text-sm text-ink-muted hover:text-accent">← Pipeline</Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl">{inquiryTitle(i)}</h1>
        <span className="rounded-sm border border-rule px-2 py-0.5 text-xs font-bold uppercase">{i.type === "race" ? "Race" : "Sponsor"}</span>
        {i.shortNotice && <span className="rounded-sm bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">Short notice</span>}
      </div>
      <p className="mt-1 text-sm text-ink-muted">Received {stamp(i.createdAt)}</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-10">
          <section aria-labelledby="details-h">
            <h2 id="details-h" className="text-xs font-bold uppercase tracking-wide text-ink-muted">Details</h2>
            <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {fields.filter(([, v]) => v !== null && v !== undefined && v !== "").map(([k, v]) => (
                <div key={k}><dt className="text-xs text-ink-muted">{k}</dt><dd className="break-words">{String(v)}</dd></div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="contact-h">
            <h2 id="contact-h" className="text-xs font-bold uppercase tracking-wide text-ink-muted">Contact</h2>
            <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {contact.filter(([, v]) => v).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-ink-muted">{k}</dt>
                  <dd className="break-words">{k === "Email" ? <a className="text-accent underline" href={`mailto:${v}`}>{v}</a> : v}</dd>
                </div>
              ))}
            </dl>
            {i.message && (
              <>
                <h3 className="mt-5 text-xs text-ink-muted">Their message</h3>
                <p className="mt-1 whitespace-pre-wrap rounded-sm border border-rule bg-paper-raised p-3">{i.message}</p>
              </>
            )}
          </section>

          <section aria-labelledby="notes-h">
            <h2 id="notes-h" className="text-xs font-bold uppercase tracking-wide text-ink-muted">Private notes</h2>
            <form action={addInquiryNote} className="mt-3">
              <input type="hidden" name="id" value={i.id} />
              <label htmlFor="note-body" className="sr-only">New note</label>
              <textarea id="note-body" name="body" rows={3} required className={input} placeholder="Call notes, next steps…" />
              <button type="submit" className={`${btn} mt-2`}>Add note</button>
            </form>
            <ul className="mt-4 space-y-3">
              {notes.map((n) => (
                <li key={n.id} className="rounded-sm border border-rule p-3">
                  <p className="text-xs text-ink-muted">{stamp(n.createdAt)}</p>
                  <p className="mt-1 whitespace-pre-wrap">{n.body}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-8">
          <section aria-labelledby="status-h" className="rounded-sm border border-rule bg-paper-raised p-4">
            <h2 id="status-h" className="text-xs font-bold uppercase tracking-wide text-ink-muted">Status</h2>
            <form action={updateStatusFromForm} className="mt-3 space-y-3">
              <input type="hidden" name="id" value={i.id} />
              <label className="block text-sm">Status
                <select name="status" defaultValue={i.status} className={input}>
                  {inquiryStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </label>
              <label className="block text-sm">Decline reason (if declined)
                <select name="declineReason" defaultValue={i.declineReason ?? ""} className={input}>
                  <option value="">—</option>
                  {declineReasons.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </label>
              <button type="submit" className={btn}>Update status</button>
            </form>
            <h3 className="mt-5 text-xs text-ink-muted">History</h3>
            <ol className="mt-2 space-y-1.5 text-sm">
              {history.map((h) => (
                <li key={h.id}>
                  <span className="font-semibold">{labelFor(inquiryStatuses, h.toStatus)}</span>
                  {h.fromStatus && <span className="text-ink-muted"> from {labelFor(inquiryStatuses, h.fromStatus)}</span>}
                  <span className="block text-xs text-ink-muted">{stamp(h.createdAt)}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="private-h" className="rounded-sm border border-rule bg-paper-raised p-4">
            <h2 id="private-h" className="text-xs font-bold uppercase tracking-wide text-ink-muted">Follow-up &amp; money (private)</h2>
            <form action={updateInquiryDetails} className="mt-3 space-y-3">
              <input type="hidden" name="id" value={i.id} />
              <label className="block text-sm">Next follow-up
                <input type="date" name="nextFollowUpDate" defaultValue={i.nextFollowUpDate ?? ""} className={input} />
              </label>
              <label className="block text-sm">Quoted ($)
                <input name="quotedAmount" inputMode="decimal" defaultValue={formatCents(i.quotedAmountCents)} className={input} />
              </label>
              <label className="block text-sm">Agreed ($)
                <input name="agreedAmount" inputMode="decimal" defaultValue={formatCents(i.agreedAmountCents)} className={input} />
              </label>
              <button type="submit" className={btn}>Save</button>
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}
