import Link from "next/link";

interface TeamWithRecords {
  id: number;
  wins: number;
  losses: number;
  ties?: number;
  schools?: { name: string; slug: string } | null;
  seasons?: { label: string } | null;
}

interface SportHubStandingsProps {
  standings: TeamWithRecords[];
  sport: string;
  sportName: string;
  sportColorHex: string;
  maxTeams?: number;
}

export default function SportHubStandings({
  standings,
  sport,
  sportName,
  sportColorHex,
  maxTeams = 5,
}: SportHubStandingsProps) {
  if (standings.length === 0) return null;

  const displayTeams = standings.slice(0, maxTeams);

  return (
    <section className="py-8 px-4" aria-label={`${sportName} standings`}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="psp-h2 text-white flex items-center gap-2">
            <span
              className="inline-block w-1 h-6 rounded-full"
              style={{ background: sportColorHex }}
            />
            Standings
          </h2>
          <Link
            href={`/${sport}/teams`}
            className="text-xs font-semibold uppercase tracking-wider hover:underline"
            style={{ color: sportColorHex }}
          >
            Full Standings &#8594;
          </Link>
        </div>

        {/* Standings table */}
        <div className="rounded-lg border border-white/10 bg-[var(--psp-navy-mid)] overflow-hidden">
          {/* Table header */}
          <div
            className="flex items-center px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/10"
          >
            <span className="w-8 text-center">#</span>
            <span className="flex-1 pl-2">Team</span>
            <span className="w-10 text-center">W</span>
            <span className="w-10 text-center">L</span>
            {displayTeams.some((t) => t.ties) && (
              <span className="w-10 text-center">T</span>
            )}
            <span className="w-16 text-right pr-2">Record</span>
          </div>

          {/* Rows */}
          {displayTeams.map((team, index) => {
            const winPct =
              team.wins + team.losses > 0
                ? (team.wins / (team.wins + team.losses)).toFixed(3)
                : ".000";

            return (
              <div
                key={team.id}
                className="flex items-center px-4 py-3 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors"
              >
                {/* Rank */}
                <span
                  className="w-8 text-center text-xs font-bold rounded-full flex items-center justify-center"
                  style={{
                    width: 24,
                    height: 24,
                    background: index < 3 ? sportColorHex : "rgba(255,255,255,0.1)",
                    color: index < 3 ? "#fff" : "rgba(255,255,255,0.5)",
                    fontSize: 11,
                  }}
                >
                  {index + 1}
                </span>

                {/* Team name */}
                <div className="flex-1 pl-3">
                  {team.schools?.slug ? (
                    <Link
                      href={`/${sport}/schools/${team.schools.slug}`}
                      className="text-sm font-semibold text-white hover:text-[var(--psp-gold)] transition-colors"
                      style={{ textDecoration: "none" }}
                    >
                      {team.schools.name}
                    </Link>
                  ) : (
                    <span className="text-sm font-semibold text-white/70">
                      {team.schools?.name || `Team ${team.id}`}
                    </span>
                  )}
                </div>

                {/* W */}
                <span className="w-10 text-center text-sm font-bold text-white">
                  {team.wins}
                </span>

                {/* L */}
                <span className="w-10 text-center text-sm text-white/60">
                  {team.losses}
                </span>

                {/* T (only if any team has ties) */}
                {displayTeams.some((t) => t.ties) && (
                  <span className="w-10 text-center text-sm text-white/40">
                    {team.ties || 0}
                  </span>
                )}

                {/* Win pct */}
                <span className="w-16 text-right pr-2 text-xs text-white/40 font-mono">
                  {winPct}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
