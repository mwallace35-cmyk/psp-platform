/**
 * IG Story OG image for a legend tribute page.
 *
 * Slug-based: reuses the legend adapter to load frontmatter + photo.
 * Returns a 1080x1920 PNG with the legend's portrait (if available),
 * name, role, school, career span, and overall record.
 */

import { ImageResponse } from "next/og";
import { getUnifiedLegendBySlug } from "@/lib/mdx/legendAdapter";
import { legendPhotoUrl } from "@/lib/legends/photoUrl";
import { SPORT_LABELS } from "@/lib/data/legends";
import {
  IG_STORY_WIDTH,
  IG_STORY_HEIGHT,
  IG_CACHE_HEADERS,
  StoryErrorFallback,
} from "@/lib/ig-story-og";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const unified = getUnifiedLegendBySlug(slug);
    if (!unified) {
      return new Response("Legend not found", { status: 404 });
    }
    const l = unified.frontmatter;

    const totalRecord = l.stints?.reduce(
      (acc, s) => {
        if (!s.overallRecord) return acc;
        return {
          wins: acc.wins + s.overallRecord.wins,
          losses: acc.losses + s.overallRecord.losses,
        };
      },
      { wins: 0, losses: 0 },
    );

    const photoUrl = legendPhotoUrl(l.slug, l.heroPhoto);
    const sportLabel = (SPORT_LABELS[l.sport] ?? l.sport).toUpperCase();

    const initials = l.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background:
              "linear-gradient(180deg, #0a1628 0%, #0f2040 50%, #0a1628 100%)",
            color: "white",
            fontFamily: "system-ui, -apple-system, sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background photo watermark */}
          {photoUrl && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                opacity: 0.15,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt=""
                width={IG_STORY_WIDTH}
                height={IG_STORY_HEIGHT}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          {/* Gold top stripe */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 16,
              background: "linear-gradient(90deg, #f0a500, #f5c542, #f0a500)",
            }}
          />

          {/* PSP LEGEND label */}
          <div
            style={{
              position: "absolute",
              top: 80,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 30,
                fontWeight: 800,
                color: "#f0a500",
                letterSpacing: "0.35em",
              }}
            >
              PSP LEGEND · {sportLabel}
            </div>
          </div>

          {/* Portrait */}
          <div
            style={{
              position: "absolute",
              top: 200,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              zIndex: 20,
            }}
          >
            {photoUrl ? (
              <div
                style={{
                  width: 560,
                  height: 700,
                  borderRadius: 40,
                  overflow: "hidden",
                  border: "8px solid rgba(240, 165, 0, 0.7)",
                  display: "flex",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt={l.name}
                  width={560}
                  height={700}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: 560,
                  height: 700,
                  borderRadius: 40,
                  background:
                    "linear-gradient(135deg, #f0a500 0%, rgba(240,165,0,0.7) 100%)",
                  color: "#0a1628",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 260,
                  fontWeight: 900,
                  border: "8px solid rgba(240, 165, 0, 0.4)",
                }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Name + meta block */}
          <div
            style={{
              position: "absolute",
              top: 960,
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "0 60px",
              gap: 18,
              zIndex: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: l.name.length > 18 ? 100 : 124,
                fontWeight: 900,
                lineHeight: 0.95,
                textAlign: "center",
                letterSpacing: "-0.02em",
              }}
            >
              {l.name}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 44,
                color: "rgba(255, 255, 255, 0.85)",
                textAlign: "center",
                marginTop: 12,
                fontWeight: 500,
              }}
            >
              {l.role}
              {l.schools?.[0] && ` · ${l.schools[0]}`}
            </div>

            {l.careerSpan && (
              <div
                style={{
                  display: "flex",
                  fontSize: 34,
                  color: "rgba(255,255,255,0.55)",
                  fontWeight: 500,
                }}
              >
                {l.careerSpan}
              </div>
            )}

            {totalRecord && totalRecord.wins > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 24,
                  background: "rgba(240, 165, 0, 0.2)",
                  border: "4px solid rgba(240, 165, 0, 0.6)",
                  borderRadius: 999,
                  padding: "20px 48px",
                  marginTop: 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 72,
                    fontWeight: 900,
                    color: "#f0a500",
                  }}
                >
                  {totalRecord.wins}–{totalRecord.losses}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 26,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: "rgba(240, 165, 0, 0.85)",
                    fontWeight: 700,
                  }}
                >
                  Career Record
                </div>
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
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 60px 72px",
              background: "rgba(0, 0, 0, 0.6)",
              gap: 12,
              zIndex: 30,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 44,
                fontWeight: 800,
                letterSpacing: "0.18em",
              }}
            >
              <span style={{ color: "#ffffff" }}>PHILLY</span>
              <span style={{ color: "#f0a500" }}>SPORTS</span>
              <span style={{ color: "#ffffff" }}>PACK</span>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 26,
                color: "#cbd5e1",
                fontWeight: 500,
                letterSpacing: "0.08em",
              }}
            >
              phillysportspack.com
            </div>
          </div>
        </div>
      ),
      {
        width: IG_STORY_WIDTH,
        height: IG_STORY_HEIGHT,
        headers: IG_CACHE_HEADERS,
      },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("IG story legend OG error:", error);
    }
    return new ImageResponse(<StoryErrorFallback />, {
      width: IG_STORY_WIDTH,
      height: IG_STORY_HEIGHT,
    });
  }
}
