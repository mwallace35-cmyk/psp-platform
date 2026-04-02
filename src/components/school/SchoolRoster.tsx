import Link from "next/link";
import type { SchoolRosterPlayer } from "@/lib/data/school-hub";

interface SchoolRosterProps {
  players: SchoolRosterPlayer[];
  sport: string;
}

const POSITION_GROUPS: Record<string, Record<string, string[]>> = {
  football: {
    Offense: ["QB", "RB", "WR", "OL", "TE", "OT", "OG", "C", "FB", "HB"],
    Defense: ["DL", "LB", "DB", "S", "CB", "DE", "DT", "NG", "FS", "SS"],
    "Special Teams": ["K", "P", "LS", "KR", "PR"],
  },
  basketball: {
    Guards: ["PG", "SG", "G"],
    Forwards: ["SF", "PF", "F"],
    Centers: ["C"],
  },
  baseball: {
    Infield: ["C", "1B", "2B", "SS", "3B", "INF"],
    Outfield: ["LF", "CF", "RF", "OF"],
    Pitchers: ["P", "SP", "RP", "LHP", "RHP"],
  },
};

function getClassLabel(gradYear: number | null): string {
  if (!gradYear) return "--";
  const now = new Date();
  const currentYear = now.getFullYear();
  // After July, next graduating class is current year + 1
  const seniorYear = now.getMonth() >= 7 ? currentYear + 1 : currentYear;
  const diff = gradYear - seniorYear;
  if (diff <= 0) return "Sr";
  if (diff === 1) return "Jr";
  if (diff === 2) return "So";
  if (diff === 3) return "Fr";
  return `${gradYear}`;
}

function groupPlayers(players: SchoolRosterPlayer[], sport: string) {
  const groups = POSITION_GROUPS[sport];
  if (!groups) {
    return [{ groupName: "Roster", players }];
  }

  const result: { groupName: string; players: SchoolRosterPlayer[] }[] = [];
  const assigned = new Set<number>();

  for (const [groupName, positions] of Object.entries(groups)) {
    const posSet = new Set(positions.map((p) => p.toUpperCase()));
    const groupPlayers = players.filter((p, idx) => {
      if (assigned.has(idx)) return false;
      const playerPos = (p.positions || []).map((pos) => pos.toUpperCase());
      return playerPos.some((pos) => posSet.has(pos));
    });
    groupPlayers.forEach((_, i) => {
      const origIdx = players.indexOf(groupPlayers[i]);
      assigned.add(origIdx);
    });
    if (groupPlayers.length > 0) {
      result.push({ groupName, players: groupPlayers });
    }
  }

  // Any unassigned players
  const unassigned = players.filter((_, idx) => !assigned.has(idx));
  if (unassigned.length > 0) {
    result.push({ groupName: "Other", players: unassigned });
  }

  return result;
}

export default function SchoolRoster({ players, sport }: SchoolRosterProps) {
  if (!players || players.length === 0) return null;

  const groups = groupPlayers(players, sport);

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.groupName}>
          <h4
            className="text-xs font-bold uppercase tracking-wider mb-2"
            style={{ color: "var(--psp-gray-400)" }}
          >
            {group.groupName} ({group.players.length})
          </h4>
          <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
            <div className="overflow-x-auto">
              <table aria-label={`${group.groupName} roster`} className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Pos</th>
                    <th className="hidden md:table-cell">Class</th>
                    <th className="hidden md:table-cell">Ht</th>
                    <th className="hidden md:table-cell">Wt</th>
                    <th className="text-center">GP</th>
                  </tr>
                </thead>
                <tbody>
                  {group.players.map((player) => (
                    <tr key={player.player_id}>
                      <td>
                        {player.player_slug ? (
                          <Link
                            href={`/${sport}/players/${player.player_slug}`}
                            className="font-medium hover:underline"
                            style={{ color: "var(--psp-blue)" }}
                          >
                            {player.player_name}
                          </Link>
                        ) : (
                          <span className="font-medium">{player.player_name}</span>
                        )}
                      </td>
                      <td className="text-sm">{(player.positions || []).join("/") || "--"}</td>
                      <td className="hidden md:table-cell text-sm">
                        {getClassLabel(player.graduation_year)}
                      </td>
                      <td className="hidden md:table-cell text-sm">{player.height || "--"}</td>
                      <td className="hidden md:table-cell text-sm">
                        {player.weight ? `${player.weight}` : "--"}
                      </td>
                      <td className="text-center text-sm tabular-nums">
                        {player.games_played ?? "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
