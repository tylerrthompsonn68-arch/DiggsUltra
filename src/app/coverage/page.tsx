import type { Metadata } from "next";
import Link from "next/link";
import { buttonPrimary } from "@/components/form";
import { ProsePage } from "@/components/prose-page";

export const metadata: Metadata = { title: "Coverage" };

// Phase 2 replaces this with the coverage grid + detail pages.
export default function CoveragePage() {
  return (
    <ProsePage title="Coverage">
      <p>Race recaps, clips, and numbers from every race I&apos;ve covered are coming soon.</p>
      <p><strong>Covered so far:</strong> Last Soul Ultra · Longhorn Last Stand</p>
      <p><Link href="/book" className={buttonPrimary}>Book Diggs for your race</Link></p>
    </ProsePage>
  );
}
