
import { ImageResponse } from "next/og";
import { connection } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

const size = {
  width: 64,
  height: 64,
};

export async function GET() {
  // Keep this endpoint request-time, including with Cache Components enabled.
  await connection();
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
        <span style={{ color: "#3B82F6" }}>a</span>
        <span style={{ color: "#F5F6FA" }}>p</span>
      </div>
    ),
    {
      ...size,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
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
