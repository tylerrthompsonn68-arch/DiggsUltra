import { site } from "@/config/site";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "DiggsUltra: The voice of ultra running";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: site.tagline,
    headline: site.headline,
    sub: "Live commentary, update videos, and race-day coverage.",
    image: "headshot-high-desert.jpg",
  });
}
