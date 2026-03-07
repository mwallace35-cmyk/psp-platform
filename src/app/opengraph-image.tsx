import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PhillySportsPack.com - Philadelphia High School Sports Database";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a1628 0%, #1a365d 50%, #2d4a7a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: -2,
          }}
        >
          <span style={{ color: "#ffffff" }}>PHILLY</span>
          <span style={{ color: "#d4a843" }}>SPORTS</span>
          <span style={{ color: "#ffffff" }}>PACK</span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            marginTop: 8,
          }}
        >
          Philadelphia High School Sports Database
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 40,
            fontSize: 20,
            color: "#64748b",
          }}
        >
          <span>🏈 Football</span>
          <span>🏀 Basketball</span>
          <span>⚾ Baseball</span>
          <span>🥍 Lacrosse</span>
          <span>⚽ Soccer</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
