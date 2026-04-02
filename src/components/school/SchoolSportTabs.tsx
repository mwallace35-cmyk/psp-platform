"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SportTab {
  sport_id: string;
  sport_name: string;
  sport_emoji: string;
  wins: number;
  losses: number;
  ties: number;
}

const SPORT_COLORS: Record<string, string> = {
  football: "var(--fb, #16a34a)",
  basketball: "var(--bb, #3b82f6)",
  baseball: "var(--base, #ea580c)",
  "track-field": "var(--track, #7c3aed)",
  lacrosse: "var(--lac, #0891b2)",
  wrestling: "var(--wrest, #ca8a04)",
  soccer: "var(--soccer, #059669)",
};

export default function SchoolSportTabs({
  sports,
  slug,
}: {
  sports: SportTab[];
  slug: string;
}) {
  const pathname = usePathname();

  if (sports.length === 0) return null;

  // "All" tab is active when on /schools/[slug]
  const isAllActive = pathname === `/schools/${slug}`;

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200 -mx-4 px-4 mb-6">
      <nav
        className="flex gap-1 overflow-x-auto scrollbar-hide py-2"
        aria-label="School sports navigation"
      >
        {/* All Sports tab */}
        <Link
          href={`/schools/${slug}`}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
            isAllActive
              ? "bg-[var(--psp-navy)] text-white shadow-sm"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          }`}
        >
          All Sports
        </Link>

        {sports.map((sport) => {
          const sportPath = `/${sport.sport_id}/schools/${slug}`;
          const isActive = pathname === sportPath;
          const color = SPORT_COLORS[sport.sport_id] || "var(--psp-blue)";
          const totalGames = sport.wins + sport.losses + sport.ties;
          const record = totalGames > 0
            ? `${sport.wins}-${sport.losses}${sport.ties > 0 ? `-${sport.ties}` : ""}`
            : null;

          return (
            <Link
              key={sport.sport_id}
              href={sportPath}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
              style={isActive ? { backgroundColor: color } : undefined}
            >
              <span className="text-base">{sport.sport_emoji}</span>
              <span>{sport.sport_name}</span>
              {record && (
                <span className={`text-xs tabular-nums ${isActive ? "text-white/70" : "text-gray-400"}`}>
                  {record}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
