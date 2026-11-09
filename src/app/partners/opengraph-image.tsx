import { ogSize, renderOg } from "@/lib/og";

export const alt = "Partner with Diggs: media kit";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Media kit",
    headline: "Partner with Diggs.",
    sub: "Reach ultrarunners across Instagram, TikTok, and YouTube.",
    image: "viper-100-finish.jpg",
  });
}
