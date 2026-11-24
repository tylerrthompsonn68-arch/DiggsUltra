/**
 * Coverage proof (owner-supplied 2026-11-24 from his Instagram/TikTok analytics, Last Soul Ultra 2026).
 * English stream views read from the rappid. YouTube video page on 2026-11-24.
 */
export type PlatformViews = { instagram: number; tiktok: number };

export const lastSoul = {
  name: "Last Soul Ultra",
  when: "August 14–18, 2026",
  where: "Fürstenau, Germany",
  role: "English broadcast commentator",
  result: "Mark Dowdle won after 94 hours: 94 yards, about 630 km.",
  streamViews: 1_000_000, // English stream on YouTube, "1M+" (1,007,373 on 2026-11-24)
  streamHours: 100,
  streamUrl: "https://www.youtube.com/watch?v=E5o4pTPZmPs",
  videos: [
    { label: "Hype videos", detail: "Before the race: who to watch and why it matters", views: { instagram: 388_000, tiktok: 105_000 } },
    { label: "Live race updates", detail: "During the race, as it happened", views: { instagram: 555_000, tiktok: 505_000 } },
    { label: "Post-race recaps", detail: "How it played out", views: { instagram: 170_000, tiktok: 125_000 } },
  ] satisfies { label: string; detail: string; views: PlatformViews }[],
  asOf: "November 24, 2026",
};

export const totalViews = (v: PlatformViews) => v.instagram + v.tiktok;
export const lastSoulVideoViews = lastSoul.videos.reduce((n, v) => n + totalViews(v.views), 0);

export const nextUp = { name: "Longhorn Last Stand", when: "Saturday, December 5, 2026", where: "Dripping Springs, Texas" };
