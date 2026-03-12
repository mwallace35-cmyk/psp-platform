import Link from "next/link";
import { RosterPlayer } from "@/lib/data";

interface RosterTabProps {
  roster: RosterPlayer[];
  sport: string;
  positionGroups: Record<string, string[]>;
}

interface GroupedRoster {
  [group: string]: RosterPlayer[];
}

function groupRosterByPosition(
  roster: RosterPlayer[],
  positionGroups: Record<string, string[]>
): GroupedRoster {
  const grouped: GroupedRoster = {};

  Object.keys(positionGroups).forEach((group) => {
    grouped[group] = roster.filter((player) =>
      positionGroups[group].includes(player.position || "")
    );
  });

  return grouped;
}

export function RosterTab({
  roster,
  sport,
  positionGroups,
}: RosterTabProps) {
  if (!roster || roster.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-600">No roster data available</p>
      </div>
    );
  }

  const grouped = groupRosterByPosition(roster, positionGroups);

  return (
    <div className="space-y-8">
      {/* Roster Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-lg border border-gray-200 p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-[var(--psp-navy)]">
            {roster.length}
          </div>
          <div className="text-xs text-gray-600 mt-1">Total Players</div>
        </div>
      </div>

      {/* Roster by Position Group */}
      {Object.entries(grouped).map(([group, players]) => {
        if (players.length === 0) return null;

        return (
          <div key={group}>
            <h3 className="text-lg font-bold text-[var(--psp-navy)] mb-4 flex items-center gap-2">
              <span
                className="inline-block w-1 h-6 rounded-full"
                style={{ backgroundColor: "var(--psp-gold)" }}
              />
              {group}
            </h3>

            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {players.map((player) => (
                <div
                  key={`${player.id}`}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  {player.players && (
                    <Link
                      href={`/${sport}/players/${player.players.slug}`}
                    >
                      <div className="text-sm font-bold text-[var(--psp-navy)] hover:text-[var(--psp-gold)] transition-colors">
                        {player.players.name}
                      </div>
                    </Link>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-semibold text-gray-600">
                      {player.position || "N/A"}
                    </span>
                    {player.jersey_number && (
                      <span
                        className="text-xs font-bold px-2 py-1 rounded"
                        style={{
                          backgroundColor: "var(--psp-gold)",
                          color: "var(--psp-navy)",
                        }}
                      >
                        #{player.jersey_number}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile List */}
            <div className="md:hidden space-y-2 mb-6">
              {players.map((player) => (
                <div
                  key={`${player.id}`}
                  className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-gray-900">
                      {player.players?.name || "Unknown"}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {player.position || "N/A"}
                    </div>
                  </div>
                  {player.jersey_number && (
                    <span
                      className="text-xs font-bold px-2 py-1 rounded whitespace-nowrap ml-2"
                      style={{
                        backgroundColor: "var(--psp-gold)",
                        color: "var(--psp-navy)",
                      }}
                    >
                      #{player.jersey_number}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
