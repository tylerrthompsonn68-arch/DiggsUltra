import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";

/** Shared renderer for share-preview images (Open Graph). 1200×630, brand colors + photo. */

export const ogSize = { width: 1200, height: 630 };

const INK = "#161412";
const PAPER = "#f5f1ea";
const RUST = "#8a3b1f";
const MUTED = "#5c544a";

/**
 * Load a Google Font as TTF for the image renderer, limited to the characters used.
 * Runs at build time, like next/font. If it fails, the bundled default font is used,
 * so the build never breaks over a font.
 */
export async function googleFont(family: string, text: string): Promise<ArrayBuffer | null> {
  "use cache";
  cacheLife("max");
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const res = await fetch(url);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

async function photo(file: string): Promise<string> {
  const buf = await readFile(join(process.cwd(), "public/images/diggs", file));
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

export async function renderOg({
  eyebrow,
  headline,
  sub,
  image,
  imagePosition = "center top",
}: {
  eyebrow: string;
  headline: string;
  sub: string;
  image: string;
  imagePosition?: string;
}) {
  const [display, script, body, src] = await Promise.all([
    googleFont("Archivo Black", `DIGGS${headline}`),
    googleFont("Yellowtail", "Ultra"),
    // The eyebrow renders uppercase, so subset both cases.
    googleFont("Inter", `${sub}${eyebrow}${eyebrow.toUpperCase()}`),
    photo(image),
  ]);

  const fonts = [
    display && { name: "Archivo Black", data: display, weight: 400 as const, style: "normal" as const },
    script && { name: "Yellowtail", data: script, weight: 400 as const, style: "normal" as const },
    body && { name: "Inter", data: body, weight: 400 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400; style: "normal" }[];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: PAPER, color: INK }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 56px 60px 72px" }}>
          {/* Wordmark: DIGGS with Ultra hooked under its end */}
          <div style={{ display: "flex", position: "relative", width: 250, height: 74 }}>
            <span style={{ fontFamily: "Archivo Black", fontSize: 60, lineHeight: 1, letterSpacing: -1 }}>DIGGS</span>
            <span style={{ position: "absolute", right: -18, bottom: -6, fontFamily: "Yellowtail", fontSize: 40, color: RUST, transform: "rotate(-7deg)" }}>
              Ultra
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "Inter", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: MUTED }}>{eyebrow}</span>
            <span style={{ fontFamily: "Archivo Black", fontSize: 76, lineHeight: 1.02, letterSpacing: -2, marginTop: 18 }}>{headline}</span>
            <span style={{ fontFamily: "Inter", fontSize: 28, lineHeight: 1.35, color: MUTED, marginTop: 24 }}>{sub}</span>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser */}
        <img src={src} alt="" width={460} height={630} style={{ width: 460, height: 630, objectFit: "cover", objectPosition: imagePosition }} />
      </div>
    ),
    { ...ogSize, fonts: fonts.length ? fonts : undefined },
  );
}
