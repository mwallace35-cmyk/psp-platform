import Link from "next/link";
import type { SchoolHistoryEntry } from "@/lib/data";

interface PlayerSchoolHistoryProps {
  schoolHistory: SchoolHistoryEntry[];
  sport: string;
  /** Fallback: single school from player.schools (when no multi-school history) */
  fallbackSchool?: { name: string; slug: string } | null;
}

/**
 * Displays a player's school history in the header.
 * - Single school: gold link (identical to current display)
 * - Transfer: chronological chain with arrow separator, each linking to the team's season page
 * - Mobile: abbreviated school names to preserve layout
 */
export default function PlayerSchoolHistory({
  schoolHistory,
  sport,
  fallbackSchool,
}: PlayerSchoolHistoryProps) {
  // No multi-school history — render single school link (current behavior)
  if (!schoolHistory || schoolHistory.length === 0) {
    if (!fallbackSchool) return null;
    return (
      <Link
        href={`/${sport}/schools/${fallbackSchool.slug}`}
        className="text-sm font-semibold hover:underline"
        style={{ color: "var(--psp-gold)" }}
      >
        {fallbackSchool.name}
      </Link>
    );
  }

  // Single school in history — same as fallback
  if (schoolHistory.length === 1) {
    const entry = schoolHistory[0];
    const href = entry.lastSeason
      ? `/${sport}/teams/${entry.school.slug}/${entry.lastSeason}`
      : `/${sport}/schools/${entry.school.slug}`;
    return (
      <Link
        href={href}
        className="text-sm font-semibold hover:underline"
        style={{ color: "var(--psp-gold)" }}
      >
        {entry.school.name}
      </Link>
    );
  }

  // Multiple schools — transfer display
  return (
    <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
      {schoolHistory.map((entry, i) => {
        const seasonRange =
          entry.firstSeason === entry.lastSeason
            ? entry.firstSeason
            : `${entry.firstSeason}\u2013${entry.lastSeason}`;

        const href = entry.lastSeason
          ? `/${sport}/teams/${entry.school.slug}/${entry.lastSeason}`
          : `/${sport}/schools/${entry.school.slug}`;

        return (
          <span key={entry.school.id} className="inline-flex items-center gap-x-1.5">
            {i > 0 && (
              <span className="text-gray-500 text-xs" aria-hidden="true">
                &rarr;
              </span>
            )}
            <Link
              href={href}
              className="text-sm font-semibold hover:underline sm:inline"
              style={{ color: "var(--psp-gold)" }}
              title={`${entry.school.name} (${seasonRange})`}
            >
              {/* Full name on sm+, abbreviated on mobile */}
              <span className="hidden sm:inline">
                {entry.school.name}
              </span>
              <span className="sm:hidden">
                {abbreviateSchool(entry.school.name)}
              </span>
            </Link>
            {seasonRange && (
              <span className="text-xs text-gray-400 ml-0.5">
                ({seasonRange})
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

/** Abbreviate long school names for mobile: "Archbishop Wood" → "Abp. Wood" etc. */
function abbreviateSchool(name: string): string {
  return name
    .replace(/^Archbishop /, "Abp. ")
    .replace(/^Cardinal /, "Card. ")
    .replace(/ High School$/, "")
    .replace(/ Vo-Tech$/, "")
    .replace(/ Career & Technical$/, "")
    .replace(/ College High School$/, " CHS")
    .replace(/^Jules E\. Mastbaum/, "Mastbaum")
    .replace(/^Murrell Dobbins/, "Dobbins")
    .replace(/^St\. Joseph's Prep$/, "SJP")
    .replace(/^La Salle College High School$/, "La Salle")
    .replace(/^Conwell-Egan Catholic$/, "C-E Catholic")
    .replace(/^Bonner-Prendergast$/, "Bonner-Prend.")
    .replace(/^Benjamin Franklin$/, "Ben Franklin")
    .replace(/^George Washington$/, "GW")
    .replace(/^Germantown Academy$/, "GA")
    .replace(/^Germantown High School$/, "Germantown")
    .replace(/^Neumann-Goretti$/, "N-G")
    .replace(/^West Philadelphia$/, "West Phila.");
}
