import type { Metadata } from "next";
import { adminSignIn } from "@/app/admin/actions";
import { buttonPrimary } from "@/components/form";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-4xl">Admin</h1>
      <p className="mt-4 text-ink-muted">Sign in with the Google account set as the site admin.</p>
      <form action={adminSignIn} className="mt-8">
        <button type="submit" className={buttonPrimary}>Sign in with Google</button>
      </form>
      <p className="mt-6 text-sm text-ink-muted">Any other account is turned away.</p>
    </div>
  );
}
