
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default async function Icon() {
  const geistFont = await readFile(
    path.join(
      process.cwd(),
      "public/fonts/Geist-Bold.otf"
    )
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#191D2B",
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Geist",
          fontWeight: 700,
          fontSize: 40,
          letterSpacing: "-2px",
        }}
      >
        <span style={{ color: "#4ADE80" }}>a</span>
        <span style={{ color: "#F5F6FA" }}>p</span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: geistFont,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
