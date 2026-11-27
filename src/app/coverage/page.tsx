import type { Metadata } from "next";
import { site } from "@/config/site";
import Image from "next/image";
import Link from "next/link";
import { buttonPrimary } from "@/components/form";
import { lastSoul, lastSoulVideoViews, nextUp, totalViews } from "@/content/coverage";
import { compact } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Coverage",
  description: `Ultramarathon live stream commentary and update videos. Last Soul Ultra 2026: ${compact(lastSoulVideoViews)} views on Diggs's videos and English commentary on a ${compact(lastSoul.streamViews)}+ view stream.`,
};

const n = (v: number) => v.toLocaleString("en-US");

export default function CoveragePage() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl sm:text-5xl">Coverage</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        I call races live and keep fans in the loop before, during, and after. Here&apos;s what that looked like at Last Soul.
      </p>

      <section aria-labelledby="ls-heading" className="mt-12 border-t-2 border-ink pt-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">{lastSoul.when} · {lastSoul.where}</p>
        <h2 id="ls-heading" className="font-display mt-2 text-3xl sm:text-4xl">{lastSoul.name}</h2>

        <div className="mt-8 grid items-start gap-10 md:grid-cols-2">
          <Image
            src="/images/diggs/last-soul-broadcast-desk.jpg"
            alt="Diggs on the English broadcast desk at Last Soul Ultra, headset on, with the live race scoreboard behind him"
            width={1320}
            height={752}
            sizes="(min-width: 768px) 30rem, 100vw"
            className="w-full rounded-sm"
          />
          <div className="text-ink-muted">
            <p>
              I was the {lastSoul.role} for Last Soul, a backyard ultra run like a live sports broadcast. The English stream ran
              more than {lastSoul.streamHours} hours and has passed {compact(lastSoul.streamViews)} views on YouTube. {lastSoul.result}
            </p>
            <p className="mt-4">
              Around the broadcast I covered the race on my own channels: hype videos before the start, live updates while it
              happened, and recaps after.
            </p>
            <a href={lastSoul.streamUrl} target="_blank" rel="noopener" className="mt-4 inline-block text-sm font-semibold text-ink underline hover:text-sage">
              Watch the English stream
            </a>
          </div>
        </div>

        <dl className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="border-t-2 border-ink pt-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Views on my Last Soul videos</dt>
            <dd className="font-display mt-1 text-4xl">{compact(lastSoulVideoViews)}</dd>
          </div>
          <div className="border-t-2 border-ink pt-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Views on the English stream</dt>
            <dd className="font-display mt-1 text-4xl">{compact(lastSoul.streamViews)}+</dd>
          </div>
          <div className="border-t-2 border-ink pt-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Hours on the stream</dt>
            <dd className="font-display mt-1 text-4xl">{lastSoul.streamHours}+</dd>
          </div>
        </dl>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="mb-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
              My Last Soul videos, by type
            </caption>
            <thead className="border-b border-rule text-ink-muted">
              <tr>
                <th className="py-2 font-normal">Videos</th>
                <th className="py-2 text-right font-normal">Instagram</th>
                <th className="py-2 text-right font-normal">TikTok</th>
                <th className="py-2 text-right font-normal">Total</th>
              </tr>
            </thead>
            <tbody>
              {lastSoul.videos.map((v) => (
                <tr key={v.label} className="border-b border-rule">
                  <td className="py-3">
                    <span className="font-semibold">{v.label}</span>
                    <span className="block text-ink-muted">{v.detail}</span>
                  </td>
                  <td className="py-3 text-right tabular-nums">{n(v.views.instagram)}</td>
                  <td className="py-3 text-right tabular-nums">{n(v.views.tiktok)}</td>
                  <td className="py-3 text-right font-semibold tabular-nums">{n(totalViews(v.views))}</td>
                </tr>
              ))}
              <tr>
                <td className="py-3 font-semibold">All Last Soul videos</td>
                <td className="py-3 text-right tabular-nums">{n(lastSoul.videos.reduce((s, v) => s + v.views.instagram, 0))}</td>
                <td className="py-3 text-right tabular-nums">{n(lastSoul.videos.reduce((s, v) => s + v.views.tiktok, 0))}</td>
                <td className="py-3 text-right font-semibold tabular-nums">{n(lastSoulVideoViews)}</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-3 text-xs text-ink-muted">Views as of {lastSoul.asOf}.</p>
        </div>
      </section>

      <section aria-labelledby="more-heading" className="mt-14 border-t border-rule pt-8">
        <h2 id="more-heading" className="text-xl font-bold">Next up</h2>
        <p className="mt-2 text-ink-muted">{nextUp.name} · {nextUp.when} · {nextUp.where}</p>
      </section>

      <p className="mt-12">
        <Link href="/book" className={buttonPrimary}>Book Diggs for your race</Link>
      </p>
      <p className="mt-4 text-sm text-ink-muted">
        Or email me at{" "}
        <a href={`mailto:${site.email}`} className="font-semibold text-ink underline hover:text-accent">{site.emailDisplay}</a>
      </p>
    </article>
  );
}
