import "server-only";
import { redirect } from "next/navigation";
import { auth, isAdminEmail } from "@/auth";

/**
 * The authorization check (CLAUDE.md §8). Call at the top of EVERY admin page
 * and EVERY admin server action; the proxy redirect alone is only optimistic.
 */
export async function requireAdmin(): Promise<{ email: string }> {
  const session = await auth();
  const email = session?.user?.email;
  if (!isAdminEmail(email)) redirect("/admin/login");
  return { email: email! };
}

/** For server actions: throws instead of redirecting. */
export async function assertAdmin(): Promise<void> {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) throw new Error("Unauthorized");
}
