/**
 * IG Story OG image for a top-N leaderboard snapshot.
 *
 * Query params:
 * - sport:      sport id
 * - statLabel:  human-readable stat label, e.g. "Career Rushing Yards"
 * - scope:      "career" | "season"
 * - rows:       JSON array of up to 5 objects: { name, school, value }
 *
 * Example:
 *   /api/og/ig-story/leaderboard?sport=football&statLabel=Career+Rushing+Yards&scope=career
 *     &rows=[{"name":"John Doe","school":"Neumann-Goretti","value":"2,847"}, ...]
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

interface Row {
  name: string;
  school?: string;
  value: string;
}

function parseRows(raw: string | null): Row[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .slice(0, 5)
      .map((r) => ({
        name: String(r?.name ?? "").slice(0, 28),
        school: r?.school ? String(r.school).slice(0, 24) : undefined,
        value: String(r?.value ?? ""),
      }))
      .filter((r) => r.name.length > 0);
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get("sport") || "";
    const statLabel = searchParams.get("statLabel") || "Top Leaders";
    const scope = (searchParams.get("scope") || "season").toLowerCase();
    const rows = parseRows(searchParams.get("rows"));

    const colors = getSport(sport);
    const scopeLabel = scope === "career" ? "ALL-TIME CAREER" : "SEASON LEADERS";

    return new ImageResponse(
      (
        <StoryShell sport={sport} topLabel={scopeLabel}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 40,
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 72,
                fontWeight: 900,
                color: "#ffffff",
                textAlign: "center",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                maxWidth: "100%",
              }}
            >
              {statLabel.length > 28 ? statLabel.slice(0, 28) + "…" : statLabel}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 20,
                marginTop: 24,
              }}
            >
              {rows.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    fontSize: 44,
                    color: "#94a3b8",
                    fontWeight: 500,
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                >
                  See full leaderboard →
                </div>
              ) : (
                rows.map((row, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 28,
                      padding: "24px 32px",
                      background:
                        i === 0
                          ? "rgba(240, 165, 0, 0.22)"
                          : "rgba(255, 255, 255, 0.06)",
                      border:
                        i === 0
                          ? "3px solid rgba(240, 165, 0, 0.75)"
                          : "2px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 20,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 72,
                        height: 72,
                        borderRadius: 16,
                        background: i === 0 ? "#f0a500" : colors.accent,
                        color: i === 0 ? "#0a1628" : "#ffffff",
                        fontSize: 44,
                        fontWeight: 900,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        gap: 4,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          fontSize: 40,
                          fontWeight: 800,
                          color: "#ffffff",
                          lineHeight: 1.15,
                        }}
                      >
                        {row.name}
                      </div>
                      {row.school && (
                        <div
                          style={{
                            display: "flex",
                            fontSize: 26,
                            color: "#94a3b8",
                            fontWeight: 500,
                          }}
                        >
                          {row.school}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        fontSize: 48,
                        fontWeight: 900,
                        color: i === 0 ? "#f0a500" : "#ffffff",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {row.value}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </StoryShell>
      ),
      {
        width: IG_STORY_WIDTH,
        height: IG_STORY_HEIGHT,
        headers: IG_CACHE_HEADERS,
      },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("IG story leaderboard OG error:", error);
    }
    return new ImageResponse(<StoryErrorFallback />, {
      width: IG_STORY_WIDTH,
      height: IG_STORY_HEIGHT,
    });
  }
}
