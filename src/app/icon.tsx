import { ImageResponse } from "next/og";
import { googleFont } from "@/lib/og";

/** Browser-tab icon: rust "D" (Archivo Black, the DIGGS font) on ink. */
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
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
          fontSize: 50,
          fontFamily: "Archivo Black",
          borderRadius: 12,
        }}
      >
        D
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Archivo Black", data: font, weight: 400, style: "normal" }] : undefined },
  );
}
