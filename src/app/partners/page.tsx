import type { Metadata } from "next";
import Image from "next/image";
import { ReachStrip } from "@/components/reach-strip";
import { PartnerForm } from "./partner-form";

export const metadata: Metadata = {
  title: "Partner With Diggs",
  description: "Media kit and partnership inquiries: reach a mostly-US audience of ultrarunners across Instagram, TikTok, and YouTube.",
};

const formats = [
  { title: "Live race coverage", body: "Hour-by-hour updates from the course, posted while the race is happening." },
  { title: "Race previews and results", body: "Who to watch before the start, and how it played out after." },
  { title: "Live stream commentary", body: "On the mic for race broadcasts, start to finish." },
  { title: "Explainers", body: "The stuff runners actually want to know, like what it really costs to run a 200." },
];

export default function PartnersPage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Media kit</p>
          <h1 className="font-display mt-4 text-4xl leading-tight sm:text-6xl">Partner with Diggs.</h1>
          <p className="mt-6 max-w-xl text-lg text-ink-muted">
            My audience is ultrarunners and the people who follow them, mostly in the US. They watch the races, buy the gear,
            and sign up for the next one.
          </p>
        </div>
        <Image
          src="/images/diggs/viper-100-finish.jpg"
          alt="Diggs running toward the Viper 100 finish arch"
          width={1500}
          height={2000}
          sizes="(min-width: 768px) 24rem, 100vw"
          className="mx-auto aspect-[4/5] w-full max-w-sm rounded-sm object-cover"
        />
      </section>

      <ReachStrip detailed />

      <section aria-labelledby="formats-heading" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 id="formats-heading" className="font-display text-3xl sm:text-4xl">What I make</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {formats.map((f) => (
            <li key={f.title} className="border-t-2 border-ink pt-5">
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-ink-muted">{f.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Audience</h3>
            <p className="mt-2">Mostly United States</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Races covered</h3>
            <p className="mt-2">Last Soul Ultra · Longhorn Last Stand</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="partner-form-heading" className="border-t border-rule">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 id="partner-form-heading" className="font-display text-3xl sm:text-4xl">Let&apos;s work together.</h2>
          <p className="mt-3 text-ink-muted">Tell me about your brand and what you have in mind.</p>
          <div className="mt-8">
            <PartnerForm />
          </div>
        </div>
      </section>
    </>
  );
}
