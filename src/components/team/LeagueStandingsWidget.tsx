import Link from "next/link";
import { LeagueStandingsRow } from "@/lib/data/team-page";
import { School } from "@/lib/data";

interface LeagueStandingsWidgetProps {
  standings: LeagueStandingsRow[];
  currentSchool: School;
  sport: string;
}

export function LeagueStandingsWidget({
  standings,
  currentSchool,
  sport,
}: LeagueStandingsWidgetProps) {
  if (!standings || standings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-600">
          League Standings
        </h3>
        <p className="text-sm text-gray-600">No standings available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-600">
        League Standings
      </h3>

      <div className="space-y-2">
        {standings.slice(0, 5).map((team, idx) => {
          const isCurrentSchool = team.school_id === currentSchool.id;
          const total =
            team.total_wins + team.total_losses + (team.total_ties || 0);
          const winPct =
            total > 0 ? ((team.total_wins / total) * 100).toFixed(0) : "-";

          return (
            <div
              key={team.school_id}
              className={`
                p-3 rounded-lg border transition-colors
                ${
                  isCurrentSchool
                    ? "bg-[var(--psp-gold)]20 border-[var(--psp-gold)]"
                    : "bg-gray-50 border-gray-200"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-600">#{idx + 1}</span>
                    <Link
                      href={`/${sport}/teams/${team.schools?.slug}`}
                      className={`
                        text-sm font-semibold truncate
                        ${
                          isCurrentSchool
                            ? "text-[var(--psp-navy)]"
                            : "text-gray-900 hover:text-[var(--psp-gold)]"
                        }
                      `}
                    >
                      {team.schools?.name}
                    </Link>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {team.total_wins}W-{team.total_losses}L
                    {team.total_ties ? `-${team.total_ties}T` : ""} ({winPct}%)
                  </div>
                </div>
                {isCurrentSchool && (
                  <span
                    className="text-xs font-bold px-2 py-1 rounded ml-2"
                    style={{
                      backgroundColor: "var(--psp-gold)",
                      color: "var(--psp-navy)",
                    }}
                  >
                    You
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {standings.length > 5 && (
        <p className="text-xs text-gray-600 mt-4 text-center">
          +{standings.length - 5} more teams
        </p>
      )}
    </div>
  );
}
