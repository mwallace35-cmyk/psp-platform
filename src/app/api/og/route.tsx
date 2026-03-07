/**
 * Dynamic Open Graph image generation endpoint
 * Generates 1200x630px branded images for social media sharing
 *
 * Query params:
 * - title (required): Page title
 * - subtitle (optional): Additional context
 * - sport (optional): Sport ID for color customization
 * - type (optional): Content type (player/team/school/article/sport)
 */

import { ImageResponse } from "next/og";
import { getSportColors, truncateTitle, truncateSubtitle } from "@/lib/og-utils";
import type { SportId } from "@/lib/sports";
import { isValidSport } from "@/lib/sports";

export const runtime = "nodejs";

// Cache for 1 year with revalidation (365 * 24 * 60 * 60)
export const revalidate = 31536000;

interface OGParams {
  title?: string;
  subtitle?: string;
  sport?: string;
  type?: string;
}

// Font loader helper (using system fonts available in Node.js environment)
function getFontStyles() {
  return {
    titleFont: {
      fontSize: 72,
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    subtitleFont: {
      fontSize: 36,
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: "0.01em",
    },
    metaFont: {
      fontSize: 24,
      fontWeight: 500,
      lineHeight: 1.3,
    },
  };
}

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const params: OGParams = {
      title: searchParams.get("title") || undefined,
      subtitle: searchParams.get("subtitle") || undefined,
      sport: searchParams.get("sport") || undefined,
      type: searchParams.get("type") || undefined,
    };

    // Validate required parameters
    if (!params.title) {
      return new ImageResponse(
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#0a1628",
            color: "#ffffff",
            fontSize: 48,
          }}
        >
          <div>Error: Title parameter required</div>
        </div>,
        { width: 1200, height: 630 }
      );
    }

    // Validate sport if provided
    const sport = params.sport && isValidSport(params.sport) ? params.sport : undefined;
    const colors = getSportColors(sport as SportId | undefined);

    // Truncate text for display
    const displayTitle = truncateTitle(params.title);
    const displaySubtitle = params.subtitle ? truncateSubtitle(params.subtitle) : null;

    const fonts = getFontStyles();

    // Determine background gradient
    const bgGradient = sport
      ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
      : `linear-gradient(135deg, #0a1628 0%, #1a365d 100%)`;

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: bgGradient,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Accent accent color bar at top */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 8,
              background: colors.accent,
            }}
          />

          {/* Main content container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "60px 80px",
              height: "100%",
              gap: "20px",
              position: "relative",
              zIndex: 10,
            }}
          >
            {/* Title */}
            <div
              style={{
                display: "flex",
                fontSize: fonts.titleFont.fontSize,
                fontWeight: fonts.titleFont.fontWeight,
                lineHeight: fonts.titleFont.lineHeight,
                color: colors.text,
                margin: 0,
                padding: 0,
                maxWidth: "90%",
                wordWrap: "break-word",
                letterSpacing: fonts.titleFont.letterSpacing,
              }}
            >
              {displayTitle}
            </div>

            {/* Subtitle */}
            {displaySubtitle && (
              <div
                style={{
                  display: "flex",
                  fontSize: fonts.subtitleFont.fontSize,
                  fontWeight: fonts.subtitleFont.fontWeight,
                  lineHeight: fonts.subtitleFont.lineHeight,
                  color: colors.text,
                  opacity: 0.9,
                  margin: 0,
                  padding: 0,
                  maxWidth: "90%",
                  wordWrap: "break-word",
                  letterSpacing: fonts.subtitleFont.letterSpacing,
                }}
              >
                {displaySubtitle}
              </div>
            )}
          </div>

          {/* Footer section with branding */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "30px 80px",
              background: "rgba(0, 0, 0, 0.3)",
              zIndex: 20,
            }}
          >
            {/* Logo/Brand text */}
            <div
              style={{
                display: "flex",
                fontSize: fonts.metaFont.fontSize,
                fontWeight: fonts.metaFont.fontWeight,
                color: colors.text,
                margin: 0,
              }}
            >
              PhillySportsPack
            </div>

            {/* Sport indicator */}
            {sport && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: fonts.metaFont.fontSize,
                  fontWeight: fonts.metaFont.fontWeight,
                  color: colors.accent,
                  margin: 0,
                }}
              >
                <span>{getSportEmoji(sport)}</span>
                <span>{getSportName(sport)}</span>
              </div>
            )}
          </div>

          {/* Decorative elements - corner accent */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 200,
              height: 200,
              background: colors.accent,
              opacity: 0.1,
              borderRadius: "50%",
              transform: "translate(50%, 50%)",
              zIndex: 1,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Type": "image/png",
        },
      }
    );
  } catch (error) {
    console.error("OG image generation error:", error);
    // Return a fallback error image
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#0a1628",
          color: "#ffffff",
          fontSize: 48,
        }}
      >
        <div>PhillySportsPack</div>
      </div>,
      { width: 1200, height: 630 }
    );
  }
}

/**
 * Get sport emoji from sport ID
 */
function getSportEmoji(sport: string): string {
  const emojiMap: Record<string, string> = {
    football: "🏈",
    basketball: "🏀",
    baseball: "⚾",
    "track-field": "🏃",
    lacrosse: "🥍",
    wrestling: "🤼",
    soccer: "⚽",
  };
  return emojiMap[sport] || "🏅";
}

/**
 * Get sport name from sport ID
 */
function getSportName(sport: string): string {
  const nameMap: Record<string, string> = {
    football: "Football",
    basketball: "Basketball",
    baseball: "Baseball",
    "track-field": "Track & Field",
    lacrosse: "Lacrosse",
    wrestling: "Wrestling",
    soccer: "Soccer",
  };
  return nameMap[sport] || "Sports";
}
