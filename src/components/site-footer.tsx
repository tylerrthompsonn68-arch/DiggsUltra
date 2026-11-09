import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { site, socials } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-rule">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:grid-cols-3 sm:px-6">
        <div>
          <p className="text-2xl"><Wordmark /></p>
          <p className="mt-1 text-ink-muted">{site.tagline}</p>
        </div>

        <div>
          <h2 className="font-semibold uppercase tracking-wide text-ink-muted">Follow</h2>
          <ul className="mt-2 space-y-1">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} rel="me noopener" target="_blank" className="hover:text-accent">
                  {s.label} <span className="text-ink-muted">{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-semibold uppercase tracking-wide text-ink-muted">Work with Diggs</h2>
          <ul className="mt-2 space-y-1">
            <li><Link href="/book" className="hover:text-accent">Book for your race</Link></li>
            <li><Link href="/partners" className="hover:text-accent">Partner / sponsor</Link></li>
            <li><Link href="/privacy" className="hover:text-accent">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-accent">Terms</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
