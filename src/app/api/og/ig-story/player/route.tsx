/**
 * IG Story OG image for a player stat card.
 *
 * Query params (all optional except `name`):
 * - name:    player display name
 * - school:  school name
 * - sport:   sport id (football, basketball, etc.)
 * - stat:    headline stat line, e.g. "2,847 Career Rush Yards"
 *
 * Returns a 1080x1920 PNG suitable for Instagram Stories.
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || "Philly HS Star";
    const school = searchParams.get("school") || "";
    const sport = searchParams.get("sport") || "";
    const stat = searchParams.get("stat") || "";

    const colors = getSport(sport);
    const displayName = name.length > 28 ? name.slice(0, 28) + "…" : name;
    const nameFontSize = displayName.length > 22 ? 92 : displayName.length > 16 ? 116 : 140;

    return new ImageResponse(
      (
        <StoryShell sport={sport}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 48,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: nameFontSize,
                fontWeight: 900,
                color: "#ffffff",
                textAlign: "center",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                maxWidth: "100%",
              }}
            >
              {displayName}
            </div>

            {school && (
              <div
                style={{
                  display: "flex",
                  fontSize: 48,
                  fontWeight: 500,
                  color: "#e2e8f0",
                  textAlign: "center",
                  lineHeight: 1.2,
                  maxWidth: "90%",
                }}
              >
                {school.length > 36 ? school.slice(0, 36) + "…" : school}
              </div>
            )}

            {stat && (
              <div
                style={{
                  display: "flex",
                  fontSize: 56,
                  fontWeight: 800,
                  color: "#ffffff",
                  backgroundColor: `${colors.accent}33`,
                  border: `4px solid ${colors.accent}`,
                  borderRadius: 32,
                  padding: "32px 56px",
                  textAlign: "center",
                  marginTop: 16,
                }}
              >
                {stat}
              </div>
            )}
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
      console.error("IG story player OG error:", error);
    }
    return new ImageResponse(<StoryErrorFallback />, {
      width: IG_STORY_WIDTH,
      height: IG_STORY_HEIGHT,
    });
  }
}
