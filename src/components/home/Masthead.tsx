/**
 * Masthead — broadsheet-style title block for the homepage hero.
 *
 * Phase 4d. Replaces the old generic eyebrow + h1 with an editorial
 * dateline / title / volume layout that gives the brand a newspaper
 * heritage rooted in the Ted Silary archive.
 */

const VOLUME = "Vol. XXX";
const ISSUE = "No. 098";

function formatDateline() {
  const now = new Date();
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const monthDay = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return { weekday, monthDay };
}

export default function Masthead() {
  const { weekday, monthDay } = formatDateline();

  return (
    <section className="border-b border-[var(--psp-rule)] py-10 md:py-12 bg-[var(--psp-navy)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid md:grid-cols-[auto_1fr_auto] gap-4 md:gap-8 items-end">
        {/* Dateline (left) */}
        <div
          className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-center md:text-left leading-tight"
          style={{ color: "var(--psp-text-cream-muted)" }}
        >
          <div>{weekday}</div>
          <div>{monthDay}</div>
        </div>

        {/* Title (center) */}
        <div className="text-center">
          <h1
            className="psp-h1-lg m-0"
            style={{
              fontFamily: "var(--font-display), 'Fraunces', serif",
              fontVariationSettings: "'SOFT' 0, 'WONK' 0",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "var(--psp-text-cream)",
            }}
          >
            The Philly
            <span
              style={{
                color: "var(--psp-gold)",
                fontStyle: "italic",
                fontVariationSettings: "'SOFT' 60, 'WONK' 1",
              }}
            >
              Sports
            </span>
            Pack
          </h1>
          <div
            className="mt-3 pt-3 mx-auto max-w-[42ch]"
            style={{ borderTop: "1px solid var(--psp-rule)" }}
          >
            <p
              className="text-[10px] sm:text-[11px] uppercase font-medium"
              style={{ color: "var(--psp-text-cream-muted)", letterSpacing: "0.2em" }}
            >
              The Definitive Database · Every Stat · Every Champion · Every Player
            </p>
          </div>
        </div>

        {/* Volume / Issue (right) */}
        <div
          className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-center md:text-right leading-tight"
          style={{ color: "var(--psp-text-cream-muted)" }}
        >
          <div>{VOLUME}</div>
          <div>{ISSUE}</div>
        </div>
      </div>
    </section>
  );
}
