/**
 * Dynamic Open Graph image for player profiles
 * Generated at: /[sport]/players/[slug]/opengraph-image.png
 *
 * This route generates player-specific OG images with:
 * - Player name and school
 * - Sport-specific career totals
 * - PSP branding with gold accents
 */

import { ImageResponse } from "next/og";
import { createStaticClient } from "@/lib/supabase/static";

export const runtime = "nodejs";
export const alt = "Player Profile - PhillySportsPack.com";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400; // 24 hours
export const dynamic = "force-dynamic";
interface PlayerOGData {
  name: string;
  schools?: { name: string } | null;
  id: number;
}

interface PlayerStats {
  rush_yards?: number;
  rush_td?: number;
  pass_yards?: number;
  rec_yards?: number;
  total_td?: number;
  points?: number;
  games_played?: number;
  rebounds?: number;
}

const SPORT_COLORS: Record<string, string> = {
  football: "#16a34a",
  basketball: "#ea580c",
  baseball: "#dc2626",
  "track-field": "#7c3aed",
  lacrosse: "#0891b2",
  wrestling: "#ca8a04",
  soccer: "#059669",
};

const SPORT_NAMES: Record<string, string> = {
  football: "Football",
  basketball: "Basketball",
  baseball: "Baseball",
  "track-field": "Track & Field",
  lacrosse: "Lacrosse",
  wrestling: "Wrestling",
  soccer: "Soccer",
};

const SPORT_EMOJIS: Record<string, string> = {
  football: "🏈",
  basketball: "🏀",
  baseball: "⚾",
  "track-field": "🏃",
  lacrosse: "🥍",
  wrestling: "🤼",
  soccer: "⚽",
};

export default async function Image({ params }: { params: Promise<{ sport: string; slug: string }> }) {
  const { sport, slug } = await params;
  const sportColor = SPORT_COLORS[sport] || "#1a365d";
  const goldColor = "#f0a500";
  const navyColor = "#0a1628";

  let playerName = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  let schoolName = "";
  let careerStatsDisplay: Array<{ label: string; value: string }> = [];
  let playerId: number | null = null;

  try {
    const supabase = createStaticClient();

    // Fetch player data
    const { data: playerData } = await supabase
      .from("players")
      .select("id, name, schools:schools!players_primary_school_id_fkey(name)")
      .eq("slug", slug)
      .single();

    if (playerData) {
      const player = playerData as unknown as PlayerOGData;
      playerName = player.name;
      schoolName = player.schools?.name || "";
      playerId = player.id;

      // Fetch sport-specific stats
      if (playerId) {
        if (sport === "football") {
          const { data: statsData } = await supabase
            .from("football_player_seasons")
            .select("rush_yards, rush_td, pass_yards, rec_yards, total_td")
            .eq("player_id", playerId);

          if (statsData && statsData.length > 0) {
            const totalRushYards = (statsData as PlayerStats[]).reduce((sum, s) => sum + (s.rush_yards || 0), 0);
            const totalTd = (statsData as PlayerStats[]).reduce((sum, s) => sum + (s.total_td || 0), 0);
            const totalPassYards = (statsData as PlayerStats[]).reduce((sum, s) => sum + (s.pass_yards || 0), 0);
            const totalRecYards = (statsData as PlayerStats[]).reduce((sum, s) => sum + (s.rec_yards || 0), 0);

            careerStatsDisplay = [
              { label: "Rush Yards", value: totalRushYards.toLocaleString() },
              { label: "TDs", value: totalTd.toString() },
            ];
            if (totalPassYards > 0) {
              careerStatsDisplay.push({ label: "Pass Yards", value: totalPassYards.toLocaleString() });
            }
            if (totalRecYards > 0) {
              careerStatsDisplay.push({ label: "Rec Yards", value: totalRecYards.toLocaleString() });
            }
          }
        } else if (sport === "basketball") {
          const { data: statsData } = await supabase
            .from("basketball_player_seasons")
            .select("points, games_played, rebounds")
            .eq("player_id", playerId);

          if (statsData && statsData.length > 0) {
            const totalPoints = (statsData as PlayerStats[]).reduce((sum, s) => sum + (s.points || 0), 0);
            const totalGames = (statsData as PlayerStats[]).reduce((sum, s) => sum + (s.games_played || 0), 0);
            const totalRebounds = (statsData as PlayerStats[]).reduce((sum, s) => sum + (s.rebounds || 0), 0);
            const ppg = totalGames > 0 ? (totalPoints / totalGames).toFixed(1) : "0.0";

            careerStatsDisplay = [
              { label: "Points", value: totalPoints.toLocaleString() },
              { label: "PPG", value: ppg },
              { label: "Rebounds", value: totalRebounds.toString() },
            ];
          }
        } else if (sport === "baseball") {
          const { data: statsData } = await supabase
            .from("baseball_player_seasons")
            .select("id")
            .eq("player_id", playerId);

          if (statsData && statsData.length > 0) {
            careerStatsDisplay = [
              { label: "Seasons", value: statsData.length.toString() },
            ];
          }
        }
      }
    }
  } catch (error) {
    // Silently fail - use defaults
    console.error("Error fetching player OG image data:", error);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${navyColor} 0%, #0f2040 100%)`,
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
            background: sportColor,
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
          {/* Sport badge */}
          {sport in SPORT_EMOJIS && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
                fontSize: "24px",
                color: goldColor,
                fontWeight: "600",
              }}
            >
              <span>{SPORT_EMOJIS[sport] || "🏅"}</span>
              <span>{SPORT_NAMES[sport] || "Sports"}</span>
            </div>
          )}

          {/* School name */}
          {schoolName && (
            <div
              style={{
                display: "flex",
                fontSize: "28px",
                color: goldColor,
                marginBottom: "12px",
                fontWeight: "500",
              }}
            >
              {schoolName}
            </div>
          )}

          {/* Player name */}
          <h1
            style={{
              display: "flex",
              fontSize: "80px",
              fontWeight: "700",
              color: "#ffffff",
              margin: "0 0 24px 0",
              padding: 0,
              maxWidth: "90%",
              wordWrap: "break-word",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {playerName}
          </h1>

          {/* Career stats grid */}
          {careerStatsDisplay.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "28px",
                maxWidth: "800px",
                marginTop: "8px",
              }}
            >
              {careerStatsDisplay.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: "700",
                      color: goldColor,
                      marginBottom: "4px",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      color: "rgba(255, 255, 255, 0.7)",
                      fontWeight: "500",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
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
            background: "rgba(0, 0, 0, 0.4)",
            borderTop: `2px solid ${goldColor}`,
            zIndex: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "20px",
              fontWeight: "600",
              color: "#ffffff",
              letterSpacing: "0.5px",
            }}
          >
            PhillySportsPack.com
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "18px",
              fontWeight: "600",
              color: goldColor,
            }}
          >
            {sport.toUpperCase()}
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
            background: sportColor,
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
