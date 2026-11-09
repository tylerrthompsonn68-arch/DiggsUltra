import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";

export const metadata: Metadata = { title: "Terms" };

// PLACEHOLDER: plain-language draft. Owner to review, and have a lawyer review before contracts exist (CLAUDE.md §11, Phase 4).
export default function TermsPage() {
  return (
    <ProsePage title="Terms" updated="November 8, 2026">
      <p>By using DiggsUltra.com, you agree to the following.</p>

      <h2>Requests aren&apos;t bookings</h2>
      <p>
        Sending a booking or partnership request doesn&apos;t confirm anything. Every booking is approved by Diggs personally, and
        it&apos;s only confirmed once both sides agree on the details in writing.
      </p>

      <h2>Pricing and expenses</h2>
      <p>
        Coverage is quoted individually. For race bookings, the race covers travel, lodging, and food for Diggs, separate from
        any quoted fee.
      </p>

      <h2>Content</h2>
      <p>Photos, videos, and text on this site belong to DiggsUltra unless noted. Please ask before reusing them.</p>

      <h2>Changes</h2>
      <p>These terms may change. The date at the top shows the latest version.</p>
    </ProsePage>
  );
}
