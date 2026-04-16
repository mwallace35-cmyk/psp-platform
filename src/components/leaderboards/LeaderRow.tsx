/**
 * LeaderRow — single row in a leader board card.
 *
 * Stacks player name over school metadata (audit LB-3 fix), shows tabular
 * stat number with unit, optional delta chip. All Tailwind, no inline styles.
 */

import Link from "next/link";

interface LeaderRowProps {
  rank: number;
  href?: string;
  playerName: string;
  schoolName: string;
  position?: string | null;
  classYear?: string | null;
  statValue: string | number;
  statUnit?: string;
  delta?: string | null; // e.g. "+184", "-12", "NEW"
  deltaKind?: "up" | "down" | "new" | "even";
  sportColor: string; // CSS var or hex for the rank number color
}

export default function LeaderRow({
  rank,
  href,
  playerName,
  schoolName,
  position,
  classYear,
  statValue,
  statUnit,
  delta,
  deltaKind = "even",
  sportColor,
}: LeaderRowProps) {
  const deltaColor =
    deltaKind === "up"
      ? "text-[var(--fb)] border-[rgba(22,163,74,0.4)]"
      : deltaKind === "down"
      ? "text-[var(--psp-live)] border-[rgba(230,57,70,0.4)]"
      : deltaKind === "new"
      ? "text-[var(--psp-gold)] border-[rgba(240,165,0,0.4)]"
      : "psp-cream-dim border-[var(--psp-rule-strong)]";

  const content = (
    <div className="grid items-center gap-3 py-3 px-1 border-b border-[var(--psp-rule)] last:border-b-0" style={{ gridTemplateColumns: "2.5ch 1fr auto auto" }}>
      <div className="font-display font-extrabold text-xl tabular-nums leading-none" style={{ color: sportColor }}>
        {rank}
      </div>
      <div className="min-w-0">
        <div className="psp-cream font-semibold text-sm sm:text-base leading-snug break-words">
          {playerName}
        </div>
        <div className="psp-cream-muted text-[11px] uppercase tracking-wider mt-0.5">
          {position && (
            <span className="text-[var(--psp-gold)] font-bold mr-1.5">{position}</span>
          )}
          <span>{schoolName}</span>
          {classYear && (
            <span className="psp-cream-dim ml-1.5">· {classYear}</span>
          )}
        </div>
      </div>
      <div className="text-right tabular-nums">
        <div className="psp-cream font-extrabold text-lg leading-none">
          {statValue}
        </div>
        {statUnit && (
          <div className="text-[10px] psp-cream-dim font-semibold uppercase tracking-wider mt-1">
            {statUnit}
          </div>
        )}
      </div>
      {delta && (
        <div className={`text-[11px] font-bold py-1 px-1.5 border min-w-[44px] text-center tabular-nums ${deltaColor}`}>
          {delta}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block hover:bg-white/[0.02] transition-colors">
        {content}
      </Link>
    );
  }
  return content;
}
