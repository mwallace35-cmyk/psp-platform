import Link from "next/link";
import { TeamHistory, Championship } from "@/lib/data";

interface HistoryTabProps {
  history: TeamHistory[];
  championships: Championship[];
  sport: string;
  schoolSlug: string;
}

export function HistoryTab({
  history,
  championships,
  sport,
  schoolSlug,
}: HistoryTabProps) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-600">No historical data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Championships Section */}
      {championships && championships.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-[var(--psp-navy)] mb-4 flex items-center gap-2">
            <span>🏆</span> Championships ({championships.length})
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {championships
              .sort((a, b) => {
                const aYear = a.seasons?.year_end || 0;
                const bYear = b.seasons?.year_end || 0;
                return bYear - aYear;
              })
              .slice(0, 20)
              .map((champ) => (
                <div
                  key={champ.id}
                  className="p-3 bg-[var(--psp-gold)]20 border border-[var(--psp-gold)] rounded-lg text-center"
                >
                  <div className="text-sm font-bold text-[var(--psp-navy)]">
                    {champ.seasons?.label || "N/A"}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {champ.level || "Championship"}
                  </div>
                  {champ.opponent?.name && (
                    <div className="text-xs text-gray-500 mt-1">
                      vs {champ.opponent.name}
                    </div>
                  )}
                </div>
              ))}
          </div>

          {championships.length > 20 && (
            <p className="text-sm text-gray-600 mt-4">
              +{championships.length - 20} more championships
            </p>
          )}
        </div>
      )}

      {/* Season-by-Season History */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div
          className="px-6 py-4 border-b border-gray-200"
          style={{ backgroundColor: "var(--psp-navy)" }}
        >
          <h3 className="text-lg font-bold text-white">
            Last {history.length} Seasons
          </h3>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm" aria-label="Season history">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">
                  Season
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-900">
                  Record
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-900">
                  Win %
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-900">
                  PF/PA
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-900">
                  Coach
                </th>
                <th className="px-6 py-3 text-center font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {history.map((season, idx) => {
                const total =
                  (season.wins || 0) + (season.losses || 0) + (season.ties || 0);
                const winPct =
                  total > 0
                    ? (((season.wins || 0) / total) * 100).toFixed(1)
                    : "-";
                const hasChamp = championships?.some(
                  (c) => c.season_id === season.season_id
                );

                return (
                  <tr
                    key={`${season.season_id}-${idx}`}
                    className={`
                      ${hasChamp ? "bg-[var(--psp-gold)]10" : ""}
                      hover:bg-gray-50
                    `}
                  >
                    <td className="px-6 py-3 font-semibold text-gray-900">
                      {season.label}
                      {hasChamp && <span className="ml-2">🏆</span>}
                    </td>
                    <td className="px-6 py-3 text-center text-gray-900">
                      {season.wins}-{season.losses}
                      {season.ties ? `-${season.ties}` : ""}
                    </td>
                    <td className="px-6 py-3 text-center text-gray-900">
                      {winPct}%
                    </td>
                    <td className="px-6 py-3 text-center text-gray-900">
                      {season.points_for !== null &&
                      season.points_against !== null
                        ? `${season.points_for}-${season.points_against}`
                        : "-"}
                    </td>
                    <td className="px-6 py-3 text-center text-gray-700">
                      {season.coaches?.name ? (
                        <Link
                          href={`/${sport}/coaches/${season.coaches.slug}`}
                          className="text-[var(--psp-navy)] hover:text-[var(--psp-gold)] font-semibold"
                        >
                          {season.coaches.name}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <Link
                        href={`/${sport}/teams/${schoolSlug}/${season.label}`}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden space-y-3 p-4">
          {history.map((season, idx) => {
            const total =
              (season.wins || 0) + (season.losses || 0) + (season.ties || 0);
            const winPct =
              total > 0
                ? (((season.wins || 0) / total) * 100).toFixed(1)
                : "-";
            const hasChamp = championships?.some(
              (c) => c.season_id === season.season_id
            );

            return (
              <Link
                key={`${season.season_id}-${idx}`}
                href={`/${sport}/teams/${schoolSlug}/${season.label}`}
                className={`
                  p-4 rounded-lg border
                  ${hasChamp ? "border-[var(--psp-gold)] bg-[var(--psp-gold)]10" : "border-gray-200"}
                  hover:bg-gray-50
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-gray-900">
                    {season.label}
                    {hasChamp && <span className="ml-2">🏆</span>}
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {season.wins}-{season.losses}
                    {season.ties ? `-${season.ties}` : ""}
                  </div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Win % {winPct}%</div>
                  {season.points_for !== null && season.points_against !== null && (
                    <div>
                      PF/PA: {season.points_for}-{season.points_against}
                    </div>
                  )}
                  {season.coaches?.name && (
                    <div>Coach: {season.coaches.name}</div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
