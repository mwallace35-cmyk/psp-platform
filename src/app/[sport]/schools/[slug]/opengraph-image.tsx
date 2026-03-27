/**
 * Dynamic Open Graph image for school profiles
 * Generated at: /[sport]/schools/[slug]/opengraph-image.png
 *
 * This route generates school-specific OG images with:
 * - School name with league information
 * - All-time record, championships, and seasons played
 * - School colors (if available from JSONB)
 * - PSP branding with gold accents
 */

import { ImageResponse } from "next/og";
import { createStaticClient } from "@/lib/supabase/static";

export const runtime = "nodejs";
export const alt = "School Profile - PhillySportsPack.com";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400; // 24 hours
interface SchoolOGData {
  name: string;
  leagues?: { name: string } | null;
  colors?: {
    primary?: string;
    secondary?: string;
  } | null;
  id: number;
}

interface TeamSeasonData {
  wins: number | null;
  losses: number | null;
  ties: number | null;
}

interface ChampionshipData {
  id: number;
}

const SPORT_COLORS: Record<string, string> = {
  football: "#16a34a",
  basketball: "#3b82f6",
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

  let schoolName = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  let leagueName = "";
  let wins = 0;
  let losses = 0;
  let championships = 0;
  let seasonsRecorded = 0;
  let winPercentage = 0;
  let schoolId: number | null = null;

  try {
    const supabase = createStaticClient();

    // Fetch school data
    const { data: schoolData } = await supabase
      .from("schools")
      .select("id, name, leagues:leagues(name), colors")
      .eq("slug", slug)
      .single();

    if (schoolData) {
      const school = schoolData as unknown as SchoolOGData;
      schoolName = school.name;
      leagueName = school.leagues?.name || "";
      schoolId = school.id;

      // Fetch team seasons for all-time record
      if (schoolId) {
        const { data: teamSeasons } = await supabase
          .from("team_seasons")
          .select("wins, losses, ties")
          .eq("school_id", schoolId)
          .eq("sport_id", sport);

        if (teamSeasons && teamSeasons.length > 0) {
          seasonsRecorded = teamSeasons.length;
          for (const ts of teamSeasons as TeamSeasonData[]) {
            wins += ts.wins || 0;
            losses += ts.losses || 0;
          }
          const totalGames = wins + losses;
          if (totalGames > 0) {
            winPercentage = Math.round((wins / totalGames) * 100);
          }
        }

        // Fetch championships
        const { data: champs } = await supabase
          .from("championships")
          .select("id")
          .eq("school_id", schoolId)
          .eq("sport_id", sport);

        championships = champs?.length || 0;
      }
    }
  } catch (error) {
    // Silently fail - use defaults
    console.error("Error fetching school OG image data:", error);
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

          {/* League name */}
          {leagueName && (
            <div
              style={{
                display: "flex",
                fontSize: "20px",
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "8px",
                fontWeight: "400",
              }}
            >
              {leagueName}
            </div>
          )}

          {/* School name */}
          <h1
            style={{
              display: "flex",
              fontSize: "80px",
              fontWeight: "700",
              color: "#ffffff",
              margin: "0 0 28px 0",
              padding: 0,
              maxWidth: "90%",
              wordWrap: "break-word",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {schoolName}
          </h1>

          {/* Stats grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
              maxWidth: "900px",
            }}
          >
            {/* All-Time Record */}
            <div
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
                {wins}-{losses}
              </div>
              <div
                style={{
                  fontSize: "16px",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: "500",
                }}
              >
                All-Time Record
              </div>
            </div>

            {/* Win Percentage */}
            <div
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
                {winPercentage}%
              </div>
              <div
                style={{
                  fontSize: "16px",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: "500",
                }}
              >
                Win %
              </div>
            </div>

            {/* Championships */}
            <div
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
                {championships}
              </div>
              <div
                style={{
                  fontSize: "16px",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: "500",
                }}
              >
                Championships
              </div>
            </div>

            {/* Seasons */}
            <div
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
                {seasonsRecorded}
              </div>
              <div
                style={{
                  fontSize: "16px",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: "500",
                }}
              >
                Seasons
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
            SCHOOL PROFILE
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
