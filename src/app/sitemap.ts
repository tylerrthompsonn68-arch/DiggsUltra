import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/book", priority: 0.9, changeFrequency: "monthly" },
    { path: "/partners", priority: 0.8, changeFrequency: "monthly" },
    { path: "/coverage", priority: 0.6, changeFrequency: "weekly" },
    { path: "/races", priority: 0.6, changeFrequency: "weekly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  ];
  return pages.map((p) => ({ url: `${site.url}${p.path}`, changeFrequency: p.changeFrequency, priority: p.priority }));
}
