/**
 * Dynamic Open Graph image for sport hub pages
 * Generated at: /[sport]/opengraph-image.png
 *
 * This route generates sport-specific OG images with:
 * - Sport name and emoji
 * - Quick stats (schools, players, games in that sport)
 * - PSP branding
 * - Sport-specific color gradients
 */

import { ImageResponse } from "next/og";
import { createStaticClient } from "@/lib/supabase/static";

export const runtime = "nodejs";
export const alt = "PhillySportsPack.com - Sport Hub";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600; // 1 hour (sports data changes frequently)
export const dynamic = "force-dynamic";
const SPORT_CONFIG: Record<
  string,
  {
    name: string;
    emoji: string;
    color: string;
    gradient: string;
  }
> = {
  football: {
    name: "Football",
    emoji: "🏈",
    color: "#16a34a",
    gradient: "linear-gradient(135deg, #0a1628 0%, #0f5132 100%)",
  },
  basketball: {
    name: "Basketball",
    emoji: "🏀",
    color: "#ea580c",
    gradient: "linear-gradient(135deg, #0a1628 0%, #7c2d12 100%)",
  },
  baseball: {
    name: "Baseball",
    emoji: "⚾",
    color: "#dc2626",
    gradient: "linear-gradient(135deg, #0a1628 0%, #7f1d1d 100%)",
  },
  "track-field": {
    name: "Track & Field",
    emoji: "🏃",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, #0a1628 0%, #4c1d95 100%)",
  },
  lacrosse: {
    name: "Lacrosse",
    emoji: "🥍",
    color: "#0891b2",
    gradient: "linear-gradient(135deg, #0a1628 0%, #155e75 100%)",
  },
  wrestling: {
    name: "Wrestling",
    emoji: "🤼",
    color: "#ca8a04",
    gradient: "linear-gradient(135deg, #0a1628 0%, #713f12 100%)",
  },
  soccer: {
    name: "Soccer",
    emoji: "⚽",
    color: "#059669",
    gradient: "linear-gradient(135deg, #0a1628 0%, #064e3b 100%)",
  },
};

interface SportStats {
  schoolCount: number;
  playerCount: number;
  gameCount: number;
}

export default async function Image({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  const config = SPORT_CONFIG[sport] || SPORT_CONFIG.football;
  const goldColor = "#f0a500";

  let stats: SportStats = {
    schoolCount: 0,
    playerCount: 0,
    gameCount: 0,
  };

  try {
    const supabase = createStaticClient();

    // Fetch sport-specific stats
    const sportId = sport;

    // Count schools with data for this sport
    const { data: schools, count: schoolCount } = await supabase
      .from("team_seasons")
      .select("school_id", { count: "exact" })
      .eq("sport_id", sportId);

    if (schools && schools.length > 0) {
      const uniqueSchools = new Set(schools.map((ts) => ts.school_id));
      stats.schoolCount = uniqueSchools.size;
    }

    // Count players with stats for this sport
    let playerCountQuery;
    if (sportId === "football") {
      const { count } = await supabase
        .from("football_player_seasons")
        .select("*", { count: "exact", head: true });
      stats.playerCount = count || 0;
    } else if (sportId === "basketball") {
      const { count } = await supabase
        .from("basketball_player_seasons")
        .select("*", { count: "exact", head: true });
      stats.playerCount = count || 0;
    } else if (sportId === "baseball") {
      const { count } = await supabase
        .from("baseball_player_seasons")
        .select("*", { count: "exact", head: true });
      stats.playerCount = count || 0;
    }

    // Count games for this sport
    const { count: gameCount } = await supabase
      .from("games")
      .select("*", { count: "exact", head: true })
      .eq("sport_id", sportId);
    stats.gameCount = gameCount || 0;
  } catch (error) {
    // Silently fail - use defaults
    console.error("Error fetching sport OG image stats:", error);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: config.gradient,
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Gold accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: goldColor,
          }}
        />

        {/* Sport color bar on left */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            background: config.color,
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "60px 80px",
            justifyContent: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Sport emoji */}
          <div
            style={{
              display: "flex",
              fontSize: "100px",
              marginBottom: "24px",
            }}
          >
            {config.emoji}
          </div>

          {/* Sport name */}
          <h1
            style={{
              display: "flex",
              fontSize: "80px",
              fontWeight: "700",
              color: "#ffffff",
              margin: "0 0 32px 0",
              padding: 0,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {config.name}
          </h1>

          {/* Stats grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
              maxWidth: "900px",
              marginTop: "16px",
            }}
          >
            {/* Schools */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: "44px",
                  fontWeight: "700",
                  color: goldColor,
                  marginBottom: "6px",
                }}
              >
                {stats.schoolCount}
              </div>
              <div
                style={{
                  fontSize: "18px",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: "500",
                }}
              >
                Schools
              </div>
            </div>

            {/* Players */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: "44px",
                  fontWeight: "700",
                  color: goldColor,
                  marginBottom: "6px",
                }}
              >
                {stats.playerCount.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: "18px",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: "500",
                }}
              >
                Player Seasons
              </div>
            </div>

            {/* Games */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: "44px",
                  fontWeight: "700",
                  color: goldColor,
                  marginBottom: "6px",
                }}
              >
                {stats.gameCount.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: "18px",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: "500",
                }}
              >
                Games
              </div>
            </div>
          </div>
        </div>

        {/* Footer branding */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 80px",
            background: "rgba(0, 0, 0, 0.3)",
            borderTop: `2px solid ${goldColor}`,
            zIndex: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "4px",
              fontSize: "20px",
              fontWeight: "600",
              letterSpacing: "0.5px",
            }}
          >
            <span style={{ color: "#ffffff" }}>PHILLY</span>
            <span style={{ color: goldColor }}>SPORTS</span>
            <span style={{ color: "#ffffff" }}>PACK</span>
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.8)",
            }}
          >
            phillysportspack.com
          </div>
        </div>

        {/* Decorative accent circle */}
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: -60,
            width: 240,
            height: 240,
            background: config.color,
            opacity: 0.08,
            borderRadius: "50%",
            zIndex: 1,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
