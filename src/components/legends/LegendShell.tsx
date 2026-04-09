import Link from "next/link";
import type { UnifiedLegend } from "@/lib/mdx/legendAdapter";
import type { LegendTribute } from "@/lib/legends/fetchTributes";
import { extractHeadings } from "@/lib/legends/renderMarkdown";
import LegendHero from "./LegendHero";
import StatsAtAGlance from "./StatsAtAGlance";
import StickyPillNav, { type PillSection } from "./StickyPillNav";
import LegendBody from "./LegendBody";
import TributesSection from "./TributesSection";
import RelatedRail from "./RelatedRail";
import ShareButtons from "@/components/social/ShareButtons";
import { buildLegendCaption } from "@/lib/ig-caption";

interface Props {
  unified: UnifiedLegend;
  allLegends: UnifiedLegend[];
  tributes: LegendTribute[];
  variant: "coach" | "memoriam" | "spotlight";
}

/**
 * Orchestrator for the modern legend tribute page. Composes the hero,
 * sticky pill nav, stats-at-a-glance strip, MDX body renderer, tributes
 * section, and related rail into a single reading experience.
 *
 * Sections are dynamically assembled from the frontmatter — sections
 * that have no data are skipped entirely from the pill nav.
 */
export default function LegendShell({
  unified,
  allLegends,
  tributes,
  variant,
}: Props) {
  const legend = unified.frontmatter;
  const body = unified.body;

  // Compute total record for the hero career-record pill (coach variant)
  const totalRecord = legend.stints?.reduce(
    (acc, s) => {
      if (!s.overallRecord) return acc;
      return {
        wins: acc.wins + s.overallRecord.wins,
        losses: acc.losses + s.overallRecord.losses,
        ties: (acc.ties ?? 0) + (s.overallRecord.ties ?? 0),
      };
    },
    { wins: 0, losses: 0, ties: 0 },
  );

  // Assemble the pill nav sections. We start with narrative headings
  // pulled from the MDX body, then add fixed sections that exist on the
  // page (championships, all-stars, tributes).
  const headings = extractHeadings(body);
  const sections: PillSection[] = [];
  sections.push({ id: "top", label: "Overview" });

  // Use only h2 headings for the nav; h3 are sub-sections within a section.
  for (const h of headings) {
    if (h.level === 2) sections.push({ id: h.id, label: h.text });
  }

  if (
    legend.championships &&
    legend.championships.some((c) => !!c.recapId)
  ) {
    // Already anchored inside the body via ChampionshipRecap tokens —
    // just add a single jump link to the first one.
    const first = legend.championships.find((c) => c.recapId);
    if (first?.recapId) {
      sections.push({
        id: `championship-${first.recapId}`,
        label: "Championships",
      });
    }
  }

  if (legend.allStars && legend.allStars.length > 0) {
    sections.push({ id: "all-stars", label: "All-Stars" });
  }

  sections.push({ id: "tributes", label: "Tributes" });

  return (
    <div className="min-h-screen bg-[var(--psp-cream)]">
      {/* Anchor for "Overview" pill */}
      <div id="top" />

      <LegendHero
        frontmatter={legend}
        variant={variant}
        totalRecord={
          totalRecord && totalRecord.wins > 0 ? totalRecord : null
        }
      />

      <StickyPillNav sections={sections} />

      {legend.statsAtAGlance && legend.statsAtAGlance.length > 0 && (
        <StatsAtAGlance stats={legend.statsAtAGlance} />
      )}

      {/* Coach of the Decade honor banner */}
      {legend.coachOfDecade && (
        <section className="max-w-4xl mx-auto px-4 pt-6">
          {(() => {
            const decade = legend.coachOfDecade as string;
            const isRealDecade = ["1970s", "1980s", "1990s", "2000s"].includes(decade);
            const href = isRealDecade ? `/hof/decades/${decade}` : "/hof/decades";
            const label = isRealDecade
              ? `${decade} Coach of the Decade`
              : "Catholic League Coach of the Decade";
            return (
              <Link href={href}>
                <div
                  style={{
                    background: "linear-gradient(135deg, rgba(240,165,0,0.1) 0%, rgba(240,165,0,0.04) 100%)",
                    border: "2px solid rgba(240,165,0,0.4)",
                    borderRadius: "12px",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontSize: "1.75rem", flexShrink: 0 }}>&#127942;</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#f0a500",
                        margin: "0 0 2px",
                      }}
                    >
                      Ted Silary Canon
                    </p>
                    <p
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.2rem",
                        letterSpacing: "0.04em",
                        color: "#92400e",
                        margin: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {label}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#f0a500",
                      flexShrink: 0,
                    }}
                  >
                    View Decade Team ›
                  </span>
                </div>
              </Link>
            );
          })()}
        </section>
      )}

      {/* Highlights / Quick Facts ribbon */}
      {legend.highlights && legend.highlights.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pt-10">
          <div className="bg-white border-l-4 border-[var(--psp-gold)] rounded-r-xl p-6 shadow-sm">
            <h2 className="font-heading text-xs uppercase tracking-[0.2em] text-[var(--psp-gold)] mb-3">
              Quick Facts
            </h2>
            <ul className="grid gap-2 md:grid-cols-2">
              {legend.highlights.map((h, i) => (
                <li
                  key={i}
                  className="text-sm text-[var(--psp-gray-700)] flex items-start gap-2"
                >
                  <span
                    aria-hidden
                    className="text-[var(--psp-gold)] mt-0.5 flex-shrink-0"
                  >
                    &#9670;
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Share row */}
      <section className="max-w-4xl mx-auto px-4 pt-6">
        {(() => {
          const recordStr = totalRecord && totalRecord.wins > 0
            ? `${totalRecord.wins}-${totalRecord.losses}${totalRecord.ties ? `-${totalRecord.ties}` : ""}`
            : undefined;
          const shareUrl = `/hof/legends/${legend.slug}`;
          const igImageUrl = `/api/og/ig-story/legend/${legend.slug}`;
          const igCaption = buildLegendCaption({
            name: legend.name,
            role: legend.role,
            schools: legend.schools,
            record: recordStr,
            sport: legend.sport,
            url: `https://phillysportspack.com${shareUrl}`,
          });
          return (
            <div className="flex justify-end rounded-xl bg-[var(--psp-navy)] p-3">
              <ShareButtons
                url={shareUrl}
                title={`${legend.name} — PSP Legend | PhillySportsPack`}
                description={legend.excerpt}
                igImageUrl={igImageUrl}
                igCaption={igCaption}
              />
            </div>
          );
        })()}
      </section>

      {/* Main narrative */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        <LegendBody frontmatter={legend} body={body} />

        {/* Attribution */}
        <footer className="mt-12 pt-6 border-t border-[var(--psp-gray-200)]">
          <p className="text-sm text-[var(--psp-gray-500)] italic">
            Written by <strong>Ted Silary</strong>. Originally published on
            TedSilary.com. Preserved and republished by PhillySportsPack.
          </p>
          {legend.sourceFiles.length > 0 && (
            <p className="text-xs text-[var(--psp-gray-400)] mt-1">
              Source: {legend.sourceFiles.join(", ")}
            </p>
          )}
        </footer>
      </main>

      {/* Tributes */}
      <div className="bg-[var(--psp-gray-50)] py-12">
        <TributesSection
          legendSlug={legend.slug}
          legendName={legend.name}
          tributes={tributes}
          variant={variant === "memoriam" ? "memoriam" : "default"}
        />
      </div>

      {/* Related */}
      <RelatedRail current={unified} all={allLegends} />

      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <Link
          href="/hof/legends"
          className="text-sm text-[var(--psp-gray-500)] hover:text-[var(--psp-navy)]"
        >
          &larr; All legends
        </Link>
      </div>
    </div>
  );
}
