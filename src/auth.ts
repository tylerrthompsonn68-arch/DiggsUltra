import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Admin login: Google only, and only the single ADMIN_EMAIL (CLAUDE.md §6).
 * JWT sessions, so no auth tables are needed.
 * Env: AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, ADMIN_EMAIL.
 */

export function isAdminEmail(email: string | null | undefined): boolean {
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return !!admin && !!email && email.trim().toLowerCase() === admin;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  callbacks: {
    signIn({ profile }) {
      return profile?.email_verified === true && isAdminEmail(profile.email);
    },
  },
});
