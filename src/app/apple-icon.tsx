import { ImageResponse } from "next/og";
import { googleFont } from "@/lib/og";

/** Home-screen icon for iPhone/iPad. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const font = await googleFont("Archivo Black", "D");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#161412",
          color: "#d2774c",
          fontSize: 132,
          fontFamily: "Archivo Black",
        }}
      >
        D
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Archivo Black", data: font, weight: 400, style: "normal" }] : undefined },
  );
}
