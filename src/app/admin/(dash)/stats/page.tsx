import { Suspense } from "react";
import { saveChannelStats } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin";
import { todayIso } from "@/lib/lead-time";
import { formatAsOf, getChannelStats } from "@/lib/stats";

export default function StatsPage() {
  return (
    <Suspense fallback={<p className="text-ink-muted">Loading…</p>}>
      <StatsEditor />
    </Suspense>
  );
}

const input = "mt-1 block w-full rounded-sm border border-rule bg-paper-raised px-3 py-2 text-sm";

async function StatsEditor() {
  await requireAdmin();
  const stats = await getChannelStats();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl">Audience stats</h1>
      <p className="mt-2 text-ink-muted">
        These numbers show on the home page and the media kit. Saving creates a new snapshot. Older ones are kept.
      </p>
      <form action={saveChannelStats} className="mt-8 space-y-6">
        {stats.map((s) => (
          <fieldset key={s.platform} className="rounded-sm border border-rule p-4">
            <legend className="px-1 font-bold">{s.label}</legend>
            <p className="text-xs text-ink-muted">Current: as of {formatAsOf(s.asOf)}</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">Followers
                <input name={`${s.platform}.followers`} inputMode="numeric" required defaultValue={s.followers} className={input} />
              </label>
              <label className="block text-sm">Views, last 30 days
                <input name={`${s.platform}.views30d`} inputMode="numeric" defaultValue={s.views30d ?? ""} className={input} />
              </label>
            </div>
          </fieldset>
        ))}
        <label className="block max-w-xs text-sm">As of
          <input type="date" name="asOf" required defaultValue={todayIso()} className={input} />
        </label>
        <button type="submit" className="rounded-sm bg-accent px-5 py-2.5 font-semibold text-accent-ink hover:bg-accent-hover">Save stats</button>
      </form>
    </div>
  );
}
