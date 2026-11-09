import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Optimistic gate for /admin: no session → login page.
 * Real authorization happens in requireAdmin()/assertAdmin() on every page and action.
 */
export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (!req.auth?.user) {
    const url = new URL("/admin/login", req.nextUrl);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
