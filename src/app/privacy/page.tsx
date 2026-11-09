import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";

export const metadata: Metadata = { title: "Privacy" };

// PLACEHOLDER: plain-language draft. Owner to review (CLAUDE.md §7).
export default function PrivacyPage() {
  return (
    <ProsePage title="Privacy" updated="November 8, 2026">
      <p>This is a plain-language summary of what DiggsUltra.com collects and why.</p>

      <h2>What I collect</h2>
      <ul>
        <li><strong>Booking and partnership forms:</strong> what you type in, like your name, email, phone, race or brand details, and message.</li>
        <li><strong>Analytics:</strong> anonymous page views and form-step counts through Vercel Web Analytics. No cookies, no cross-site tracking.</li>
        <li><strong>Spam protection:</strong> forms use Cloudflare Turnstile and a rate limit. IP addresses are hashed, never stored in plain text.</li>
      </ul>

      <h2>How I use it</h2>
      <p>Only to reply to your request, plan coverage, and run the business. I don&apos;t sell or rent your information.</p>

      <h2>Who else sees it</h2>
      <p>
        Service providers that run the site: Vercel (hosting and analytics), Neon (database), Resend (email), and Cloudflare
        (spam protection). They only process data to provide those services.
      </p>

      <h2>Your choices</h2>
      <p>Want your information deleted or corrected? Email me or DM @diggsultra and I&apos;ll take care of it.</p>
    </ProsePage>
  );
}
