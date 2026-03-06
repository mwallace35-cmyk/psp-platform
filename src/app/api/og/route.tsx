import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const SPORT_COLORS: Record<string, string> = {
  football: "#16a34a",
  basketball: "#ea580c",
  baseball: "#dc2626",
  soccer: "#0284c7",
  lacrosse: "#7c3aed",
  wrestling: "#b91c1c",
  "track-field": "#0891b2",
};

const SPORT_EMOJI: Record<string, string> = {
  football: "🏈",
  basketball: "🏀",
  baseball: "⚾",
  soccer: "⚽",
  lacrosse: "🥍",
  wrestling: "🤼",
  "track-field": "🏃",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "PhillySportsPack";
  const subtitle = searchParams.get("subtitle") || "Philadelphia High School Sports Database";
  const sport = searchParams.get("sport") || "";
  const stat = searchParams.get("stat") || "";
  const type = searchParams.get("type") || "default"; // default, player, school, leaderboard, game

  const sportColor = SPORT_COLORS[sport] || "#f0a500";
  const sportEmoji = SPORT_EMOJI[sport] || "🏅";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #0a1628 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background accent */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${sportColor}30 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -50,
            left: -50,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, #f0a50020 0%, transparent 70%)",
          }}
        />

        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "40px 60px 20px",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "white",
              letterSpacing: 2,
            }}
          >
            PHILLY
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#f0a500",
              letterSpacing: 2,
            }}
          >
            SPORTS
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "white",
              letterSpacing: 2,
            }}
          >
            PACK
          </div>
          {sport && (
            <div
              style={{
                marginLeft: "auto",
                fontSize: 48,
              }}
            >
              {sportEmoji}
            </div>
          )}
        </div>

        {/* Gold accent line */}
        <div
          style={{
            height: 4,
            background: `linear-gradient(90deg, #f0a500, ${sportColor}, transparent)`,
            margin: "0 60px",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "40px 60px",
            gap: 16,
          }}
        >
          {type !== "default" && (
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: sportColor,
                textTransform: "uppercase",
                letterSpacing: 3,
              }}
            >
              {type === "player" ? "Player Profile" :
               type === "school" ? "School Profile" :
               type === "leaderboard" ? "Leaderboard" :
               type === "game" ? "Game Recap" :
               type === "career" ? "Career Leaders" : ""}
            </div>
          )}

          <div
            style={{
              fontSize: title.length > 40 ? 48 : 64,
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              maxWidth: "90%",
            }}
          >
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                fontSize: 24,
                color: "#94a3b8",
                maxWidth: "80%",
              }}
            >
              {subtitle}
            </div>
          )}

          {stat && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 8,
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  color: "#f0a500",
                }}
              >
                {stat}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 60px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ fontSize: 16, color: "#64748b" }}>
            phillysportspack.com
          </div>
          <div style={{ fontSize: 14, color: "#475569" }}>
            25 Years of Philly HS Sports Data
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
