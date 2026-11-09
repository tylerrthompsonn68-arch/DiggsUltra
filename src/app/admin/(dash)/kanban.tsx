"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { updateInquiryStatus } from "@/app/admin/actions";
import { inquiryStatuses } from "@/lib/inquiry-options";

export type Card = {
  id: string;
  title: string;
  status: string;
  type: "race" | "sponsorship";
  date: string;
  location: string;
  shortNotice: boolean;
  followUp: string | null;
  overdue: boolean;
};

/**
 * Pipeline board. Drag a card to another column, or use the card's status
 * menu (keyboard-friendly). Both call the same server action.
 */
export function Kanban({ cards }: { cards: Card[] }) {
  const [optimistic, move] = useOptimistic(cards, (state, { id, status }: { id: string; status: string }) =>
    state.map((c) => (c.id === id ? { ...c, status } : c)),
  );
  const [, startTransition] = useTransition();
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function change(id: string, status: string) {
    setError(null);
    startTransition(async () => {
      move({ id, status });
      try {
        await updateInquiryStatus(id, status);
      } catch {
        setError("Couldn't save that change. Refresh and try again.");
      }
    });
  }

  return (
    <>
      {error && <p role="alert" className="mb-4 text-sm font-semibold text-accent">{error}</p>}
      <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
        <div className="grid min-w-[1400px] grid-cols-8 gap-3">
          {inquiryStatuses.map((col) => {
            const items = optimistic.filter((c) => c.status === col.value);
            return (
              <section
                key={col.value}
                aria-label={`${col.label}, ${items.length}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(col.value);
                }}
                onDragLeave={() => setDragOver((v) => (v === col.value ? null : v))}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(null);
                  const id = e.dataTransfer.getData("text/plain");
                  if (id) change(id, col.value);
                }}
                className={`min-h-64 rounded-sm border p-2 ${dragOver === col.value ? "border-accent bg-accent/5" : "border-rule bg-paper-raised"}`}
              >
                <h2 className="mb-2 flex items-center justify-between px-1 text-xs font-bold uppercase tracking-wide">
                  {col.label}
                  <span className="text-ink-muted">{items.length}</span>
                </h2>
                <ul className="space-y-2">
                  {items.map((c) => (
                    <li
                      key={c.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", c.id)}
                      className={`cursor-grab rounded-sm border bg-paper p-2.5 text-sm active:cursor-grabbing ${c.shortNotice ? "border-dashed border-ink-muted" : "border-rule"}`}
                    >
                      <Link href={`/admin/inquiries/${c.id}`} className="font-semibold hover:text-accent">{c.title}</Link>
                      <p className="mt-1 text-xs text-ink-muted">
                        {c.type === "race" ? `${c.date} · ${c.location}` : "Sponsor"}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {c.shortNotice && <span className="rounded-sm bg-accent/10 px-1.5 py-0.5 text-[11px] font-bold text-accent">Short notice</span>}
                        {c.followUp && (
                          <span className={`rounded-sm px-1.5 py-0.5 text-[11px] font-bold ${c.overdue ? "bg-accent text-accent-ink" : "bg-rule text-ink"}`}>
                            Follow up {c.followUp}
                          </span>
                        )}
                      </div>
                      <label className="sr-only" htmlFor={`status-${c.id}`}>Status for {c.title}</label>
                      <select
                        id={`status-${c.id}`}
                        value={c.status}
                        onChange={(e) => change(c.id, e.target.value)}
                        className="mt-2 w-full rounded-sm border border-rule bg-paper-raised px-1.5 py-1 text-xs"
                      >
                        {inquiryStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
