import "server-only";
import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";
import { getDb, schema } from "@/db";

/**
 * Fixed-window limiter stored in Postgres, so it works across serverless
 * instances. IPs are hashed with AUTH_SECRET so raw IPs are never stored.
 * Returns true if the request is allowed.
 */
export async function rateLimit(
  bucket: string,
  ip: string,
  { limit = 5, windowSeconds = 3600 } = {},
): Promise<boolean> {
  const salt = process.env.AUTH_SECRET ?? "dev-salt";
  const key = `${bucket}:${createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32)}`;
  const t = schema.rateLimits;

  const [row] = await getDb()
    .insert(t)
    .values({ key, count: 1 })
    .onConflictDoUpdate({
      target: t.key,
      set: {
        // New window if the old one expired, else bump the count.
        count: sql`case when ${t.windowStart} < now() - make_interval(secs => ${windowSeconds}) then 1 else ${t.count} + 1 end`,
        windowStart: sql`case when ${t.windowStart} < now() - make_interval(secs => ${windowSeconds}) then now() else ${t.windowStart} end`,
      },
    })
    .returning({ count: t.count });

  return (row?.count ?? 1) <= limit;
}
