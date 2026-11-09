import "server-only";
import { desc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { getDb, schema } from "@/db";

export type Platform = "instagram" | "tiktok" | "youtube";
export type PlatformStat = {
  platform: Platform;
  label: string;
  followers: number;
  views30d: number | null;
  asOf: string;
};

export const platformLabels: Record<Platform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
};

/** Owner-reported numbers from the brief (CLAUDE.md §2). Used until admin saves real ones. */
const fallback: PlatformStat[] = [
  { platform: "instagram", label: "Instagram", followers: 21_000, views30d: 1_100_000, asOf: "2026-11-08" },
  { platform: "tiktok", label: "TikTok", followers: 40_000, views30d: 764_000, asOf: "2026-11-08" },
  { platform: "youtube", label: "YouTube", followers: 250, views30d: null, asOf: "2026-11-08" },
];

export const STATS_TAG = "channel-stats";

/** Latest row per platform. Cached; admin edits call updateTag(STATS_TAG). */
export async function getChannelStats(): Promise<PlatformStat[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(STATS_TAG);

  try {
    const t = schema.channelStats;
    const rows = await getDb()
      .selectDistinctOn([t.platform])
      .from(t)
      .orderBy(t.platform, desc(t.asOf), desc(t.id));
    return fallback.map((f) => {
      const r = rows.find((row) => row.platform === f.platform);
      return r ? { ...f, followers: r.followers, views30d: r.views30d, asOf: r.asOf } : f;
    });
  } catch (err) {
    console.error("[stats] falling back to defaults", err);
    return fallback;
  }
}

export function totals(stats: PlatformStat[]) {
  return {
    followers: stats.reduce((n, s) => n + s.followers, 0),
    views30d: stats.reduce((n, s) => n + (s.views30d ?? 0), 0),
    asOf: stats.map((s) => s.asOf).sort().at(-1) ?? "",
  };
}

export const compact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: n >= 1_000_000 ? 2 : 1 }).format(n);

export const formatAsOf = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
