import Image from "next/image";
import Link from "next/link";
import { buttonPrimary, buttonSecondary } from "@/components/form";
import { ReachStrip } from "@/components/reach-strip";
import { site, socials } from "@/config/site";

const offerings = [
  {
    title: "Live stream commentary",
    body: "I come to your race and call it live on your stream: the lead changes, the late-night grind, the finish.",
  },
  {
    title: "Update videos",
    body: "Short-form videos that keep fans in the loop on your race: who to watch before, what's happening during, and how it ended.",
  },
  {
    title: "Race-day coverage",
    body: "On-the-ground updates across Instagram, TikTok, and YouTube while your race is happening.",
  },
];

const racesCovered = ["Last Soul Ultra", "Longhorn Last Stand"];

// Structured data so search engines know who Diggs is and link the social profiles.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Diggs",
  alternateName: "DiggsUltra",
  url: site.url,
  image: `${site.url}/images/diggs/headshot-high-desert.jpg`,
  jobTitle: "Ultramarathon commentator and content creator",
  description: site.description,
  sameAs: socials.map((s) => s.href),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output from static config; escape "<" so it can't close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.15fr_1fr] md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">{site.tagline}</p>
          <h1 className="font-display mt-4 text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            {site.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-muted">{site.description}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/book" className={buttonPrimary}>Book Diggs for Your Race</Link>
            <Link href="/partners" className={buttonSecondary}>Partner With Diggs</Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <Image
            src="/images/diggs/headshot-high-desert.jpg"
            alt="Diggs smiling on a high-desert trail"
            width={1500}
            height={2000}
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 768px) 28rem, 100vw"
            className="aspect-[4/5] w-full rounded-sm object-cover object-top"
          />
        </div>
      </section>

      <ReachStrip />

      {/* What I do */}
      <section aria-labelledby="offer-heading" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 id="offer-heading" className="font-display text-3xl sm:text-4xl">What I do</h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {offerings.map((o) => (
            <li key={o.title} className="border-t-2 border-ink pt-5">
              <h3 className="text-lg font-bold">{o.title}</h3>
              <p className="mt-2 text-ink-muted">{o.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Proof */}
      <section aria-labelledby="proof-heading" className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 sm:px-6 md:grid-cols-2">
        <Image
          src="/images/diggs/last-soul-broadcast-desk.jpg"
          alt="Diggs on the broadcast desk at Last Soul Ultra, headset on, with the live race scoreboard behind him"
          width={1320}
          height={752}
          sizes="(min-width: 768px) 36rem, 100vw"
          className="w-full rounded-sm"
        />
        <div>
          <h2 id="proof-heading" className="font-display text-3xl sm:text-4xl">On the mic at Last Soul.</h2>
          <p className="mt-4 text-ink-muted">
            Backyard ultras run for days. I&apos;m there for all of it, from loop one to the last runner standing, calling it live
            and posting it out as it happens.
          </p>
          <h3 className="mt-8 text-xs font-semibold uppercase tracking-wide text-ink-muted">Races covered</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {racesCovered.map((r) => (
              <li key={r} className="rounded-sm border border-rule px-3 py-1.5 text-sm font-semibold">{r}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-night text-night-ink">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_20rem]">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl">Got a race? Let&apos;s talk.</h2>
            <p className="mt-4 max-w-lg text-night-muted">
              Races book up to 18 months out. Reach out early. 90 days&apos; notice or more is best.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/book" className="inline-flex min-h-11 items-center rounded-sm bg-night-accent px-6 py-3 font-semibold uppercase tracking-wide text-night hover:bg-night-accent-hover">
                Book Diggs
              </Link>
              <Link href="/partners" className="inline-flex min-h-11 items-center rounded-sm border border-night-ink px-6 py-3 font-semibold uppercase tracking-wide hover:bg-night-ink hover:text-night">
                Partner With Diggs
              </Link>
            </div>
          </div>
          <Image
            src="/images/diggs/snow-pointing.jpg"
            alt="Diggs in the snow, pointing at the camera"
            width={1500}
            height={2000}
            sizes="20rem"
            className="hidden aspect-[3/4] w-full rounded-sm object-cover md:block"
          />
        </div>
      </section>
    </>
  );
}
