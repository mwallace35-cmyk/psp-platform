/**
 * IG Story OG image for a game recap / final score.
 *
 * Query params:
 * - home, away:           team names (required)
 * - homeScore, awayScore: final scores (optional — if missing, renders "VS")
 * - sport:                sport id
 * - date:                 formatted date string (e.g. "Fri Oct 27")
 *
 * Returns a 1080x1920 PNG.
 */

import { ImageResponse } from "next/og";
import {
  IG_STORY_WIDTH,
  IG_STORY_HEIGHT,
  IG_CACHE_HEADERS,
  StoryShell,
  StoryErrorFallback,
  getSport,
} from "@/lib/ig-story-og";

export const runtime = "nodejs";

function truncTeam(name: string): string {
  return name.length > 18 ? name.slice(0, 18) + "…" : name;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const home = truncTeam(searchParams.get("home") || "Home");
    const away = truncTeam(searchParams.get("away") || "Away");
    const homeScoreRaw = searchParams.get("homeScore");
    const awayScoreRaw = searchParams.get("awayScore");
    const sport = searchParams.get("sport") || "";
    const date = searchParams.get("date") || "";

    const hasScores = homeScoreRaw != null && awayScoreRaw != null && homeScoreRaw !== "" && awayScoreRaw !== "";
    const homeScore = hasScores ? parseInt(homeScoreRaw!, 10) : null;
    const awayScore = hasScores ? parseInt(awayScoreRaw!, 10) : null;
    const homeWon = hasScores && (homeScore ?? 0) > (awayScore ?? 0);
    const awayWon = hasScores && (awayScore ?? 0) > (homeScore ?? 0);

    const colors = getSport(sport);

    const TeamBlock = ({
      name,
      score,
      won,
    }: {
      name: string;
      score: number | null;
      won: boolean;
    }) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: name.length > 14 ? 56 : 68,
            fontWeight: 800,
            color: won ? "#ffffff" : hasScores ? "#64748b" : "#ffffff",
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          {name}
        </div>
        {hasScores && (
          <div
            style={{
              display: "flex",
              fontSize: 180,
              fontWeight: 900,
              color: won ? "#f0a500" : "#475569",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            {score}
          </div>
        )}
      </div>
    );

    return (
      new ImageResponse(
        (
          <StoryShell sport={sport} topLabel={hasScores ? "FINAL" : "MATCHUP"}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 70,
                alignItems: "center",
              }}
            >
              {date && (
                <div
                  style={{
                    display: "flex",
                    fontSize: 36,
                    color: "#94a3b8",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                  }}
                >
                  {date.toUpperCase()}
                </div>
              )}

              <TeamBlock name={away} score={awayScore} won={awayWon} />

              <div
                style={{
                  display: "flex",
                  fontSize: 44,
                  fontWeight: 800,
                  color: colors.accent,
                  letterSpacing: "0.2em",
                }}
              >
                {hasScores ? "—" : "VS"}
              </div>

              <TeamBlock name={home} score={homeScore} won={homeWon} />
            </div>
          </StoryShell>
        ),
        {
          width: IG_STORY_WIDTH,
          height: IG_STORY_HEIGHT,
          headers: IG_CACHE_HEADERS,
        },
      )
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("IG story game OG error:", error);
    }
    return new ImageResponse(<StoryErrorFallback />, {
      width: IG_STORY_WIDTH,
      height: IG_STORY_HEIGHT,
    });
  }
}
