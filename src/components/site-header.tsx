import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { bookCta, nav } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
        <Link href="/" className="text-3xl" aria-label="DiggsUltra home">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-ink-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={bookCta.href}
            className="rounded-sm bg-accent px-4 py-2 uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-hover"
          >
            {bookCta.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
