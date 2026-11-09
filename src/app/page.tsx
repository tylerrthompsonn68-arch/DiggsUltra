import Link from "next/link";
import { site } from "@/config/site";

// Phase 0 brand hero. Phase 1 replaces this with the next-race hero + reach strip.
export default function Home() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">
        {site.tagline}
      </p>
      <h1 className="stamp mt-4 max-w-3xl text-4xl leading-tight sm:text-6xl">
        They stream your race. I make people care about it.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-ink-muted">
        Live commentary, hype videos, and on-the-ground coverage for ultras.
        Backyards, 200s, and everything in between.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/book"
          className="rounded-sm bg-accent px-6 py-3 font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-hover"
        >
          Book Diggs for Your Race
        </Link>
        <Link
          href="/partners"
          className="rounded-sm border border-ink px-6 py-3 font-semibold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
        >
          Partner With Diggs
        </Link>
      </div>
    </section>
  );
}
