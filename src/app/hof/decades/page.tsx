import Link from "next/link";
import { renderMarkdown } from "@/lib/legends/renderMarkdown";
import { loadDecadeMDX } from "@/lib/mdx/loadDecade";
import {
  getDecadeRoster,
  getDecadesIndex,
  DECADE_SLUGS,
  DECADE_META,
  type DecadeSlug,
} from "@/lib/data/decades";
import DecadeNav from "@/components/decades/DecadeNav";
import DecadeHero from "@/components/decades/DecadeHero";
import DecadeIntro from "@/components/decades/DecadeIntro";
import DecadeRoster from "@/components/decades/DecadeRoster";
import DecadeByTheNumbers from "@/components/decades/DecadeByTheNumbers";
import DecadeSchoolChips from "@/components/decades/DecadeSchoolChips";

export const revalidate = 3600;

export const metadata = {
  title: "All-Decade Teams & 30-Year Team | Ted Silary Canon | PhillySportsPack",
  description:
    "Ted Silary's definitive Philly high school football canon — the 30-Year Team (1976–2005) and four All-Decade teams from the 1970s through the 2000s.",
};

const DECADE_TILE_COLORS: Record<DecadeSlug, { accent: string; border: string }> = {
  "30-year": { accent: "#f0a500", border: "rgba(240,165,0,0.3)" },
  "1970s":   { accent: "#a78bfa", border: "rgba(167,139,250,0.25)" },
  "1980s":   { accent: "#f87171", border: "rgba(248,113,113,0.25)" },
  "1990s":   { accent: "#34d399", border: "rgba(52,211,153,0.25)" },
  "2000s":   { accent: "#60a5fa", border: "rgba(96,165,250,0.25)" },
};

export default async function DecadesIndexPage() {
  const [thirtyYear, index, thirtyYearMDX] = await Promise.all([
    getDecadeRoster("30-year"),
    getDecadesIndex(),
    Promise.resolve(loadDecadeMDX("30-year")),
  ]);

  const decadeEntries = index.filter((e) => e.slug !== "30-year");
  const thirtyYearBodyHtml = thirtyYearMDX?.body
    ? renderMarkdown(thirtyYearMDX.body)
    : "";

  return (
    <div style={{ background: "var(--psp-navy)", minHeight: "100vh" }}>
      <DecadeNav current="index" />

      {/* ══════════ PAGE HERO ══════════ */}
      <section
        style={{
          position: "relative",
          background:
            "linear-gradient(160deg, var(--psp-navy) 55%, rgba(240,165,0,0.08) 100%)",
          padding: "4rem 1.5rem 3rem",
          overflow: "hidden",
        }}
      >
        {/* Gold top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              "linear-gradient(90deg, var(--psp-gold), #f5c542, #a78bfa, #f87171, #34d399, #60a5fa)",
          }}
        />

        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
          <div style={{ marginBottom: "1.25rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                background: "rgba(240,165,0,0.12)",
                border: "1px solid rgba(240,165,0,0.3)",
                color: "var(--psp-gold)",
                padding: "0.25rem 0.75rem",
                borderRadius: "999px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 L15 8 L22 8 L17 13 L19 20 L12 16 L5 20 L7 13 L2 8 L9 8 Z" />
              </svg>
              Ted Silary Canon
            </span>
          </div>

          <h1
            className="psp-h1-lg"
            style={{ color: "#fff", maxWidth: "700px", marginBottom: "0.5rem" }}
          >
            All-Decade Teams
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
              color: "#94a3b8",
              maxWidth: "560px",
              lineHeight: 1.65,
            }}
          >
            Ted Silary&rsquo;s definitive Philly high school football canon — the
            30-Year Team (1976–2005) and four decade teams from the 1970s through
            the 2000s.
          </p>
        </div>
      </section>

      {/* ══════════ DECADE TILES ══════════ */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: "1rem",
          }}
          className="decade-tile-grid"
        >
          {decadeEntries.map((entry) => {
            const colors = DECADE_TILE_COLORS[entry.slug];
            return (
              <Link
                key={entry.slug}
                href={`/hof/decades/${entry.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "var(--psp-navy-mid)",
                    border: `1px solid ${colors.border}`,
                    borderRadius: "var(--radius-lg)",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    height: "100%",
                  }}
                  className="decade-tile"
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: colors.accent,
                        margin: "0 0 0.25rem",
                      }}
                    >
                      {entry.years}
                    </p>
                    <h2
                      className="psp-h2"
                      style={{
                        color: "#fff",
                        margin: 0,
                        fontSize: "1.75rem",
                        lineHeight: 1.1,
                      }}
                    >
                      {entry.slug.replace("s", "s")}
                    </h2>
                  </div>

                  <div style={{ flex: 1 }}>
                    {entry.overallPotd && (
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.8rem",
                          color: "#e2e8f0",
                          margin: "0 0 0.25rem",
                        }}
                      >
                        <span style={{ color: "#64748b", fontSize: "0.7rem" }}>
                          Player of the Decade{" "}
                        </span>
                        {entry.overallPotd}
                      </p>
                    )}
                    {entry.coachOfDecade && (
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.8rem",
                          color: "#e2e8f0",
                          margin: 0,
                        }}
                      >
                        <span style={{ color: "#64748b", fontSize: "0.7rem" }}>
                          Coach of the Decade{" "}
                        </span>
                        {entry.coachOfDecade}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.75rem",
                        color: "#475569",
                      }}
                    >
                      {entry.totalPicks} selections
                    </span>
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: colors.accent,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      View
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ══════════ 30-YEAR TEAM HEADLINER ══════════ */}
      <div id="thirty-year" />

      <DecadeHero
        slug="30-year"
        label={thirtyYear.label}
        years={thirtyYear.years}
        headline={thirtyYearMDX?.headline}
        pullQuote={thirtyYearMDX?.pullQuote}
        sourceUrl={thirtyYear.sourceUrl}
      />

      {thirtyYearMDX && (
        <DecadeIntro
          body={thirtyYearBodyHtml}
          headline={thirtyYearMDX.headline}
          pullQuote={thirtyYearMDX.pullQuote}
        />
      )}

      <DecadeRoster picks={thirtyYear.picks} />

      <DecadeByTheNumbers stats={thirtyYear.stats} />

      <DecadeSchoolChips picks={thirtyYear.picks} />

      {/* Attribution footer */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 1.5rem 4rem",
        }}
      >
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "1.5rem",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8rem",
              color: "#475569",
              fontStyle: "italic",
            }}
          >
            Selections by{" "}
            <strong style={{ color: "#64748b" }}>Ted Silary</strong>.
            Originally published on TedSilary.com. Preserved and republished by
            PhillySportsPack.
          </p>
        </div>
      </section>

      <style>{`
        .decade-tile:hover {
          border-color: rgba(240,165,0,0.4) !important;
          box-shadow: 0 0 20px rgba(240,165,0,0.06);
        }
        @media (max-width: 640px) {
          .decade-tile-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 400px) {
          .decade-tile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
