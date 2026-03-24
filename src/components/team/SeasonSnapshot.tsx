import Link from "next/link";
import { School, TeamSeason } from "@/lib/data";

interface SeasonSnapshotProps {
  school: School;
  teamSeason: TeamSeason;
  sport: string;
}

export function SeasonSnapshot({
  school,
  teamSeason,
  sport,
}: SeasonSnapshotProps) {
  const wins = teamSeason.wins || 0;
  const losses = teamSeason.losses || 0;
  const ties = teamSeason.ties || 0;
  const total = wins + losses + ties;
  const winPct = total > 0 ? ((wins / total) * 100).toFixed(1) : "-";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-600">
        Season Snapshot
      </h3>

      <dl className="space-y-4">
        {/* Record */}
        <div className="flex justify-between items-start">
          <dt className="text-sm font-semibold text-gray-600">Record</dt>
          <dd
            className="psp-h1"
            style={{ color: "var(--psp-navy)" }}
          >
            {wins}-{losses}{ties > 0 ? `-${ties}` : ""}
          </dd>
        </div>

        {/* Win Percentage */}
        {total > 0 && (
          <div className="flex justify-between items-start">
            <dt className="text-sm font-semibold text-gray-600">Win %</dt>
            <dd className="text-lg font-bold text-blue-600">{winPct}%</dd>
          </div>
        )}

        {/* League */}
        {school.leagues?.name && (
          <div className="flex justify-between items-start">
            <dt className="text-sm font-semibold text-gray-600">League</dt>
            <dd className="text-sm font-medium text-gray-900">
              {school.leagues.name}
            </dd>
          </div>
        )}

        {/* Home Venue */}
        {school.city && (
          <div className="flex justify-between items-start">
            <dt className="text-sm font-semibold text-gray-600">Location</dt>
            <dd className="text-sm font-medium text-gray-900">
              {school.city}
              {school.state && `, ${school.state}`}
            </dd>
          </div>
        )}

        {/* Coach */}
        {teamSeason.coaches?.name && (
          <div className="flex justify-between items-start pt-2 border-t border-gray-200">
            <dt className="text-sm font-semibold text-gray-600">Head Coach</dt>
            <dd className="text-sm font-medium">
              <Link
                href={`/${sport}/coaches/${teamSeason.coaches.slug}`}
                className="text-[var(--psp-navy)] hover:text-[var(--psp-gold)]"
              >
                {teamSeason.coaches.name}
              </Link>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
