/**
 * ClassYearStrip — chip row above the sport tabs (audit LB-7 fix).
 *
 * Promotes "Browse by class year" from a buried bottom-of-page widget
 * to a primary filter at the top.
 */

import Link from "next/link";

interface ClassYearStripProps {
  activeYear?: number | "all";
}

const YEARS = [2026, 2027, 2028, 2029] as const;

export default function ClassYearStrip({ activeYear = "all" }: ClassYearStripProps) {
  const chipBase =
    "flex-shrink-0 text-[13px] font-bold uppercase tracking-wider px-4 py-2 border transition-all whitespace-nowrap";
  const chipInactive =
    "border-[var(--psp-rule-strong)] psp-cream hover:border-[var(--psp-gold)] hover:text-[var(--psp-gold)]";
  const chipActive =
    "bg-[var(--psp-gold)] text-[var(--psp-navy)] border-[var(--psp-gold)]";

  return (
    <div className="border-b border-[var(--psp-rule)] py-5">
      <div className="flex items-baseline gap-6 overflow-x-auto">
        <div className="text-[11px] uppercase tracking-widest psp-cream-muted flex-shrink-0">
          By Class
        </div>
        <Link
          href="/leaderboards"
          className={`${chipBase} ${activeYear === "all" ? chipActive : chipInactive}`}
        >
          All Years
        </Link>
        {YEARS.map((yr) => (
          <Link
            key={yr}
            href={`/class/${yr}`}
            className={`${chipBase} ${activeYear === yr ? chipActive : chipInactive}`}
          >
            Class of {yr}
          </Link>
        ))}
        <Link
          href="/records-explorer"
          className={`${chipBase} ${chipInactive}`}
        >
          All-Time
        </Link>
      </div>
    </div>
  );
}
