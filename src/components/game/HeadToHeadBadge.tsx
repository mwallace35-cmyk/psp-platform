import Link from "next/link";
import { getHeadToHead } from "@/lib/data/games";

interface HeadToHeadBadgeProps {
  homeSchoolId: number;
  awaySchoolId: number;
  sportId: string;
}

export default async function HeadToHeadBadge({
  homeSchoolId,
  awaySchoolId,
  sportId,
}: HeadToHeadBadgeProps) {
  const h2h = await getHeadToHead(homeSchoolId, awaySchoolId, sportId);

  if (!h2h || h2h.totalGames === 0) return null;

  // Determine which school leads
  const homeName = h2h.schoolAName;
  const awayName = h2h.schoolBName;
  const homeWins = homeSchoolId === h2h.schoolAWins ? h2h.schoolAWins : h2h.schoolBWins;
  const awayWins = homeSchoolId === h2h.schoolAWins ? h2h.schoolBWins : h2h.schoolAWins;

  // Recompute properly: schoolA = homeSchoolId in our call
  const hWins = h2h.schoolAWins;
  const aWins = h2h.schoolBWins;

  // Short display names (first word or abbreviation)
  const homeShort = homeName.length > 18 ? homeName.split(" ")[0] : homeName;
  const awayShort = awayName.length > 18 ? awayName.split(" ")[0] : awayName;

  // Check if a rivalry page exists for these schools
  // Use slugs to build the rivalry URL
  const rivalrySlug = [h2h.schoolASlug, h2h.schoolBSlug].sort().join("-vs-");

  return (
    <div className="bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700 px-4 py-3 inline-flex flex-col gap-1.5">
      {/* All-time record */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          All-Time:
        </span>
        <span className="text-sm font-bold text-white">
          <span className={hWins > aWins ? "text-[var(--psp-gold)]" : ""}>
            {homeShort} {hWins}
          </span>
          {" - "}
          <span className={aWins > hWins ? "text-[var(--psp-gold)]" : ""}>
            {aWins} {awayShort}
          </span>
          {h2h.ties > 0 && (
            <span className="text-gray-300"> ({h2h.ties}T)</span>
          )}
        </span>
      </div>

      {/* Streak indicator */}
      {h2h.streak && (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">
            Streak:
          </span>
          <span className="text-xs font-semibold text-[var(--psp-gold)]">
            {h2h.streak.team} W{h2h.streak.count}
          </span>
        </div>
      )}

      {/* Rivalry page link */}
      <Link
        href={`/${sportId}/rivalries/${rivalrySlug}`}
        className="text-[10px] font-semibold uppercase tracking-wider text-[var(--psp-blue)] hover:underline mt-0.5"
      >
        Full Rivalry History &rarr;
      </Link>
    </div>
  );
}
