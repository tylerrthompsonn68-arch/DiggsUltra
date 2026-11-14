import { ogSize, renderOg } from "@/lib/og";

export const alt = "Book Diggs for your race";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Race directors",
    headline: "Book Diggs for your race.",
    sub: "Live commentary and coverage. Quote only. Book early.",
    image: "last-soul-broadcast-desk.jpg",
    imagePosition: "center",
  });
}
