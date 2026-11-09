import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";
import { socials } from "@/config/site";

export const metadata: Metadata = { title: "Races" };

// Phase 2 replaces this with the runner calendar, countdowns, and email alerts.
export default function RacesPage() {
  return (
    <ProsePage title="Races">
      <p>A calendar of upcoming races I&apos;m covering, with countdowns and race-day alerts, is coming soon.</p>
      <p>
        Until then, follow along on{" "}
        {socials.map((s, i) => (
          <span key={s.label}>
            <a href={s.href} rel="me noopener" target="_blank" className="font-semibold text-accent underline">{s.label}</a>
            {i < socials.length - 2 ? ", " : i === socials.length - 2 ? ", and " : "."}
          </span>
        ))}
      </p>
    </ProsePage>
  );
}
