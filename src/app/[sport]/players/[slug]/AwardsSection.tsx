import Link from "next/link";
import type { Award } from "@/lib/data";

/* ===== Awards grouping (for awards section) ===== */
const TIER_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  "First Team": { bg: "#fef3c7", border: "#f59e0b", text: "#92400e", badge: "#f59e0b" },
  "Second Team": { bg: "#e0e7ff", border: "#6366f1", text: "#3730a3", badge: "#6366f1" },
  "Third Team": { bg: "#ecfdf5", border: "#10b981", text: "#065f46", badge: "#10b981" },
  "Honorable Mention": { bg: "#f3f4f6", border: "#9ca3af", text: "#374151", badge: "#9ca3af" },
  "MVP": { bg: "#fef3c7", border: "#d97706", text: "#92400e", badge: "#d97706" },
};
const CAT_ICONS: Record<string, string> = { offense: "\u26A1", defense: "\uD83D\uDEE1\uFE0F", specialist: "\uD83C\uDFAF" };
const DEFAULT_STYLE = { bg: "#f3f4f6", border: "#d1d5db", text: "#374151", badge: "#6b7280" };

// Partition awards: meta-awards (all-era, all-decade) render in a separate
// "Career & Era Honors" section, not under a single year bucket.
const CAREER_AWARD_TYPES = new Set(["all-era", "all-decade"]);

// Derive a display label for career/era awards from source_file or award_name
const careerAwardRangeLabel = (a: Award): string => {
  const src = (a as { source_file?: string | null }).source_file || "";
  const decadeMatch = src.match(/decade(\d{4})s/i);
  if (decadeMatch) return `${decadeMatch[1]}s`;
  if (a.award_type === "all-era") return "40-Year";
  return "";
};

type AwardsSectionProps = {
  awards: Award[];
  sport: string;
  sportName: string;
};

export default function AwardsSection({ awards, sport, sportName }: AwardsSectionProps) {
  const careerAwards: Award[] = [];
  const seasonalAwards: Award[] = [];
  awards.forEach(a => {
    if (CAREER_AWARD_TYPES.has(a.award_type ?? "")) careerAwards.push(a);
    else seasonalAwards.push(a);
  });

  const awardsByYear: Record<number, Award[]> = {};
  seasonalAwards.forEach(a => {
    const y = a.year || (a.seasons?.label ? parseInt(a.seasons.label.split("-")[0]) + 1 : 0);
    if (!awardsByYear[y]) awardsByYear[y] = [];
    awardsByYear[y].push(a);
  });
  const awardYears = Object.keys(awardsByYear).map(Number).sort((a, b) => b - a);

  return (
    <section id="awards" className="scroll-mt-16 max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="psp-h2"
          style={{ color: "var(--psp-navy)" }}
        >
          Honors & Awards
        </h2>
        <Link
          href={`/${sport}/awards`}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
          style={{ background: "rgba(59,130,246,0.1)", color: "var(--psp-blue, #3b82f6)", border: "1px solid rgba(59,130,246,0.2)" }}
        >
          All {sportName} Awards
        </Link>
      </div>
      <div className="space-y-6">
        {awardYears.filter(y => y > 0).map(year => (
          <div key={year}>
            <div className="flex items-center gap-3 mb-3">
              <span className="psp-h4" style={{ color: "var(--psp-gold, #f0a500)" }}>
                {year > 1900 ? `${String(year - 1).slice(-2)}-${String(year).slice(-2)}` : year}
              </span>
              <div className="flex-1 h-px" style={{ background: "var(--psp-gray-200, #e2e8f0)" }} />
            </div>
            <div className="flex flex-wrap gap-3">
              {awardsByYear[year].map(a => {
                const tier = a.award_tier || "";
                const colors = TIER_COLORS[tier] || DEFAULT_STYLE;
                const catIcon = CAT_ICONS[a.category || ""] || "\uD83C\uDFC6";
                let label = a.award_name || a.award_type || "Award";
                label = label.replace(/^(football|basketball|baseball|soccer|lacrosse|wrestling|track-field)-/, "").replace(/-/g, " ");
                if (tier) {
                  label = label.replace(/First Team/i, "").replace(/Second Team/i, "").replace(/Third Team/i, "").replace(/Honorable Mention/i, "").replace(/Red Division/i, "").trim().replace(/[-\s]+$/, "") || label;
                }

                return (
                  <div
                    key={a.id}
                    className="rounded-xl px-4 py-3 transition-transform hover:-translate-y-0.5"
                    style={{
                      background: colors.bg,
                      border: `2px solid ${colors.border}`,
                      minWidth: "180px",
                      maxWidth: "300px",
                      boxShadow: `0 2px 8px ${colors.border}20`,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg shrink-0">{catIcon}</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm leading-tight capitalize" style={{ color: colors.text }}>
                          {label}
                        </p>
                        {a.position && (
                          <p className="text-xs mt-0.5" style={{ color: colors.text, opacity: 0.7 }}>{a.position}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {tier && (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: colors.badge }}>
                          {tier}
                        </span>
                      )}
                      {a.category && (
                        <span className="text-[10px] uppercase tracking-wider font-medium capitalize" style={{ color: colors.text, opacity: 0.75 }}>
                          {a.category}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Career & Era Honors — meta-awards that span multiple years */}
        {careerAwards.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-3 mt-2">
              <span className="psp-h4" style={{ color: "var(--psp-gold, #f0a500)" }}>
                Career &amp; Era Honors
              </span>
              <div className="flex-1 h-px" style={{ background: "var(--psp-gray-200, #e2e8f0)" }} />
            </div>
            <div className="flex flex-wrap gap-3">
              {careerAwards.map(a => {
                const tier = a.award_tier || "";
                const colors = TIER_COLORS[tier] || DEFAULT_STYLE;
                const range = careerAwardRangeLabel(a);
                let label = a.award_name || a.award_type || "Career Honor";
                label = label.replace(/^(football|basketball|baseball|soccer|lacrosse|wrestling|track-field)-/, "").replace(/-/g, " ");
                return (
                  <div
                    key={a.id}
                    className="rounded-xl px-4 py-3 transition-transform hover:-translate-y-0.5"
                    style={{
                      background: colors.bg,
                      border: `2px solid ${colors.border}`,
                      minWidth: "180px",
                      maxWidth: "300px",
                      boxShadow: `0 2px 8px ${colors.border}20`,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg shrink-0">{"\uD83C\uDFC5"}</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm leading-tight capitalize" style={{ color: colors.text }}>
                          {label}
                        </p>
                        {range && (
                          <p className="text-xs mt-0.5 uppercase tracking-wider font-medium" style={{ color: colors.text, opacity: 0.7 }}>
                            {range}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
