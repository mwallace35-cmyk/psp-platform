import { ImageResponse } from "next/og";
import { getUnifiedLegendBySlug } from "@/lib/mdx/legendAdapter";
import { legendPhotoUrl } from "@/lib/legends/photoUrl";
import { SPORT_LABELS } from "@/lib/data/legends";

export const runtime = "nodejs";

/**
 * GET /api/og/legend/[slug]
 *
 * Dynamic OpenGraph image for legend tribute pages. Returns a 1200x630
 * PNG featuring the legend's hero portrait, name, role, schools, career
 * span, and career record. Used as the og:image and twitter:image for
 * social shares.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #0a1628 100%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {photoUrl && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              opacity: 0.18,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt=""
              width={1200}
              height={630}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Left: portrait */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "60px",
            zIndex: 1,
          }}
        >
          {photoUrl ? (
            <div
              style={{
                width: 320,
                height: 400,
                borderRadius: 24,
                overflow: "hidden",
                border: "4px solid rgba(240, 165, 0, 0.5)",
                display: "flex",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt={l.name}
                width={320}
                height={400}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : (
            <div
              style={{
                width: 320,
                height: 400,
                borderRadius: 24,
                background:
                  "linear-gradient(135deg, #f0a500 0%, rgba(240,165,0,0.7) 100%)",
                color: "#0a1628",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 140,
                fontWeight: 900,
                border: "4px solid rgba(240, 165, 0, 0.3)",
              }}
            >
              {l.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}
        </div>

        {/* Right: text block */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 60px 60px 0",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#f0a500",
              fontWeight: 700,
              display: "flex",
            }}
          >
            PSP Legend &middot; {SPORT_LABELS[l.sport] ?? l.sport}
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 900,
              lineHeight: 1,
              marginTop: 12,
              letterSpacing: -2,
              display: "flex",
            }}
          >
            {l.name}
          </div>
          <div
            style={{
              fontSize: 30,
              color: "rgba(255,255,255,0.75)",
              marginTop: 18,
              display: "flex",
            }}
          >
            {l.role}
            {l.schools[0] && ` · ${l.schools[0]}`}
          </div>
          {l.careerSpan && (
            <div
              style={{
                fontSize: 24,
                color: "rgba(255,255,255,0.45)",
                marginTop: 4,
                display: "flex",
              }}
            >
              {l.careerSpan}
            </div>
          )}
          {totalRecord && totalRecord.wins > 0 && (
            <div
              style={{
                marginTop: 28,
                display: "flex",
                alignItems: "baseline",
                gap: 16,
                background: "rgba(240, 165, 0, 0.15)",
                border: "2px solid rgba(240, 165, 0, 0.4)",
                borderRadius: 999,
                padding: "10px 26px",
                alignSelf: "flex-start",
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  color: "#f0a500",
                  display: "flex",
                }}
              >
                {totalRecord.wins}&ndash;{totalRecord.losses}
              </div>
              <div
                style={{
                  fontSize: 16,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "rgba(240, 165, 0, 0.8)",
                  display: "flex",
                }}
              >
                Career Record
              </div>
            </div>
          )}
          <div
            style={{
              marginTop: "auto",
              fontSize: 18,
              color: "rgba(255,255,255,0.45)",
              display: "flex",
            }}
          >
            phillysportspack.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
