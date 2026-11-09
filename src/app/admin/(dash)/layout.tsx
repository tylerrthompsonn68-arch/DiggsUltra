import type { Metadata } from "next";
import Link from "next/link";
import { adminSignOut } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

/** Static admin chrome. Auth is enforced per page (requireAdmin) and per action (assertAdmin). */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav aria-label="Admin" className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-rule pb-4 text-sm font-semibold">
        <span className="text-xs uppercase tracking-wide text-ink-muted">Admin</span>
        <Link href="/admin" className="hover:text-accent">Pipeline</Link>
        <Link href="/admin?view=table" className="hover:text-accent">Table</Link>
        <Link href="/admin/stats" className="hover:text-accent">Stats</Link>
        <form action={adminSignOut} className="ml-auto">
          <button type="submit" className="text-ink-muted hover:text-accent">Sign out</button>
        </form>
      </nav>
      {children}
    </div>
  );
}
