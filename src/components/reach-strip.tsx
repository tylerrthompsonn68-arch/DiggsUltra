import { compact, formatAsOf, getChannelStats, totals } from "@/lib/stats";

/** Combined reach + per-platform numbers, each with an "as of" date (CLAUDE.md §7). */
export async function ReachStrip({ detailed = false }: { detailed?: boolean }) {
  const stats = await getChannelStats();
  const t = totals(stats);

  return (
    <section aria-labelledby="reach-heading" className="border-y border-rule bg-paper-raised">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 id="reach-heading" className="sr-only">Audience reach</h2>
        <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Views, last 30 days</dt>
            <dd className="font-display mt-1 text-4xl">{compact(t.views30d)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Followers</dt>
            <dd className="font-display mt-1 text-4xl">{compact(t.followers)}</dd>
          </div>
          {(detailed ? stats : stats.filter((s) => s.platform !== "youtube")).map((s) => (
            <div key={s.platform} className={detailed ? "" : "hidden sm:block"}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{s.label}</dt>
              <dd className="font-display mt-1 text-4xl">{compact(s.followers)}</dd>
              {s.views30d !== null && (
                <dd className="text-sm text-ink-muted">{compact(s.views30d)} views / 30 days</dd>
              )}
            </div>
          ))}
        </dl>
        <p className="mt-6 text-xs text-ink-muted">Owner-reported, as of {formatAsOf(t.asOf)}.</p>
      </div>
    </section>
  );
}
