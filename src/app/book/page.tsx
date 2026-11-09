import type { Metadata } from "next";
import Image from "next/image";
import { booking } from "@/config/site";
import { BookForm } from "./book-form";

export const metadata: Metadata = {
  title: "Book Diggs for Your Race",
  description:
    "Request live stream commentary, hype videos, or race-day coverage for your ultramarathon. Quote only. Book early.",
};

const terms = [
  { title: "Quote only", body: "Every race is different, so every quote is too. No public pricing." },
  { title: "Race covers expenses", body: "Travel, lodging, and food for Diggs are covered by the race." },
  {
    title: "Book early",
    body: `${booking.preferredLeadDays}+ days' notice is best. Under ${booking.minLeadDays} days is rarely possible. I book up to 18 months out.`,
  },
  { title: "I read every request", body: `Each booking is approved by me personally. I'll reply ${booking.responseTime}.` },
];

export default function BookPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[22rem_1fr]">
      <aside>
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">Book Diggs for your race.</h1>
        <p className="mt-4 text-ink-muted">
          Tell me about your race. Date and location matter most. I&apos;ll check my calendar and get back to you.
        </p>
        <Image
          src="/images/diggs/last-soul-broadcast-desk.jpg"
          alt="Diggs commentating live from the Last Soul Ultra broadcast desk"
          width={1320}
          height={752}
          sizes="(min-width: 1024px) 22rem, 100vw"
          className="mt-8 w-full rounded-sm"
        />
        <dl className="mt-8 space-y-5">
          {terms.map((t) => (
            <div key={t.title}>
              <dt className="font-bold">{t.title}</dt>
              <dd className="mt-1 text-sm text-ink-muted">{t.body}</dd>
            </div>
          ))}
        </dl>
      </aside>

      <section aria-label="Booking request form" className="min-w-0">
        <BookForm />
      </section>
    </div>
  );
}
