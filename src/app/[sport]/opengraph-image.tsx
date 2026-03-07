import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PhillySportsPack.com";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SPORT_CONFIG: Record<string, { name: string; emoji: string; color: string; gradient: string }> = {
  football: { name: "Football", emoji: "🏈", color: "#16a34a", gradient: "linear-gradient(135deg, #0a1628 0%, #0f5132 100%)" },
  basketball: { name: "Basketball", emoji: "🏀", color: "#ea580c", gradient: "linear-gradient(135deg, #0a1628 0%, #7c2d12 100%)" },
  baseball: { name: "Baseball", emoji: "⚾", color: "#dc2626", gradient: "linear-gradient(135deg, #0a1628 0%, #7f1d1d 100%)" },
  "track-field": { name: "Track & Field", emoji: "🏃", color: "#7c3aed", gradient: "linear-gradient(135deg, #0a1628 0%, #4c1d95 100%)" },
  lacrosse: { name: "Lacrosse", emoji: "🥍", color: "#0891b2", gradient: "linear-gradient(135deg, #0a1628 0%, #155e75 100%)" },
  wrestling: { name: "Wrestling", emoji: "🤼", color: "#ca8a04", gradient: "linear-gradient(135deg, #0a1628 0%, #713f12 100%)" },
  soccer: { name: "Soccer", emoji: "⚽", color: "#059669", gradient: "linear-gradient(135deg, #0a1628 0%, #064e3b 100%)" },
};

export default async function Image({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  const config = SPORT_CONFIG[sport] || SPORT_CONFIG.football;

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
          background: config.gradient,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 100, marginBottom: 16 }}>{config.emoji}</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: -1,
            marginBottom: 8,
          }}
        >
          {config.name}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 28,
            marginTop: 16,
          }}
        >
          <span style={{ color: "#ffffff" }}>PHILLY</span>
          <span style={{ color: "#d4a843" }}>SPORTS</span>
          <span style={{ color: "#ffffff" }}>PACK</span>
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#94a3b8",
            marginTop: 12,
          }}
        >
          Philadelphia High School Sports Database
        </div>
      </div>
    ),
    { ...size }
  );
}
