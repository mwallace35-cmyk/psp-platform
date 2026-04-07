import Link from "next/link";
import Image from "next/image";
import type { UnifiedLegend } from "@/lib/mdx/legendAdapter";
import { legendPhotoUrl } from "@/lib/legends/photoUrl";
import { SPORT_LABELS } from "@/lib/data/legends";

interface Props {
  current: UnifiedLegend;
  all: UnifiedLegend[];
  className?: string;
}

/**
 * Algorithmic "more legends" rail below the main content. Scores other
 * legends against the current one by:
 *
 *   same school      +5
 *   same sport       +2
 *   same category    +1
 *   overlapping era  +1 per decade of overlap
 *
 * Shows up to 4 of the top scores. Falls back to random same-category
 * entries if no one scored. Rendered as a 4-up card grid, or a 2-up on
 * mobile.
 */
export default function RelatedRail({ current, all, className = "" }: Props) {
  const cur = current.frontmatter;
  const curSchools = new Set(cur.schools.map((s) => s.toLowerCase().trim()));
  const curStart = parseInt(cur.careerSpan?.match(/\d{4}/)?.[0] ?? "", 10);
  const curEnd = parseInt(
    cur.careerSpan?.match(/\d{4}(?!.*\d{4})/)?.[0] ?? "",
    10,
  );

  interface Scored {
    legend: UnifiedLegend;
    score: number;
  }

  const scored: Scored[] = all
    .filter((l) => l.slug !== current.slug)
    .map((l) => {
      const other = l.frontmatter;
      let score = 0;
      for (const s of other.schools) {
        if (curSchools.has(s.toLowerCase().trim())) score += 5;
      }
      if (other.sport === cur.sport) score += 2;
      if (other.category === cur.category) score += 1;

      const otherStart = parseInt(
        other.careerSpan?.match(/\d{4}/)?.[0] ?? "",
        10,
      );
      const otherEnd = parseInt(
        other.careerSpan?.match(/\d{4}(?!.*\d{4})/)?.[0] ?? "",
        10,
      );
      if (
        Number.isFinite(curStart) &&
        Number.isFinite(curEnd) &&
        Number.isFinite(otherStart) &&
        Number.isFinite(otherEnd)
      ) {
        const overlap =
          Math.min(curEnd, otherEnd) - Math.max(curStart, otherStart);
        if (overlap > 0) score += Math.min(3, Math.floor(overlap / 10) + 1);
      }

      return { legend: l, score };
    })
    .sort((a, b) => b.score - a.score);

  let picks = scored.filter((s) => s.score > 0).slice(0, 4);
  if (picks.length < 4) {
    // Fall back to random same-category entries
    const pool = all
      .filter(
        (l) =>
          l.slug !== current.slug &&
          l.frontmatter.category === cur.category &&
          !picks.some((p) => p.legend.slug === l.slug),
      )
      .sort(() => Math.random() - 0.5);
    for (const l of pool) {
      if (picks.length >= 4) break;
      picks.push({ legend: l, score: 0 });
    }
  }

  if (picks.length === 0) return null;

  return (
    <section
      aria-labelledby="related-rail-heading"
      className={`max-w-7xl mx-auto px-4 py-12 ${className}`}
    >
      <h2
        id="related-rail-heading"
        className="font-heading text-2xl text-[var(--psp-navy)] mb-6"
      >
        More Legends
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {picks.map(({ legend }) => {
          const fm = legend.frontmatter;
          const href = `/hof/${
            fm.category === "in-memoriam"
              ? "in-memoriam"
              : fm.category === "player-spotlight"
                ? "spotlights"
                : "legends"
          }/${legend.slug}`;
          const photoUrl = legendPhotoUrl(legend.slug, fm.heroPhoto);
          const initials = fm.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2);
          return (
            <Link
              key={legend.slug}
              href={href}
              className="group block bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden hover:border-[var(--psp-gold)] hover:shadow-md transition"
            >
              <div className="relative aspect-[4/3] bg-[var(--psp-navy)] overflow-hidden">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={fm.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[var(--psp-gold)]/60">
                    {initials}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-heading text-base text-[var(--psp-navy)] leading-tight group-hover:text-[var(--psp-gold)] transition">
                  {fm.name}
                </h3>
                <p className="text-xs text-[var(--psp-gray-500)] mt-1 truncate">
                  {SPORT_LABELS[fm.sport]}
                  {fm.schools[0] && (
                    <>
                      <span className="mx-1">&middot;</span>
                      {fm.schools[0]}
                    </>
                  )}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
