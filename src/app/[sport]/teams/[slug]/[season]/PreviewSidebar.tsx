import Link from "next/link";
import type { LeagueStanding, ScheduleStrength, NextLevelAlumnus } from "@/lib/data";

interface PreviewSidebarProps {
  sport: string;
  scheduleStrength: ScheduleStrength[];
  leagueStandings: LeagueStanding[];
  nextLevelAlumni: NextLevelAlumnus[];
}

export default function PreviewSidebar({ sport, scheduleStrength, leagueStandings, nextLevelAlumni }: PreviewSidebarProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      {/* Main Content */}
      <div className="lg:col-span-3" />

      {/* Sidebar */}
      <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
        {/* Strength of Schedule */}
        {scheduleStrength.length > 0 && (
          <div
            className="rounded-lg p-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <h3 className="psp-h3 text-white mb-4">
              Strength of Schedule
            </h3>
            <div className="space-y-2 text-sm">
              {scheduleStrength.slice(0, 8).map((opp: ScheduleStrength, idx: number) => (
                <Link
                  key={idx}
                  href={`/${sport}/teams/${opp.opponent_slug}`}
                  className="flex justify-between items-center hover:bg-white/5 p-2 rounded transition-colors"
                >
                  <span className="text-gray-300">{opp.opponent_name}</span>
                  <span className="text-gray-300 text-xs font-mono">
                    {opp.last_season_record}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* League Outlook */}
        {leagueStandings.length > 0 && (
          <div
            className="rounded-lg p-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <h3 className="psp-h3 text-white mb-4">
              League Outlook
            </h3>
            <div className="space-y-2 text-xs">
              {leagueStandings.map((standing: LeagueStanding, idx: number) => (
                <Link
                  key={idx}
                  href={`/${sport}/teams/${standing.school_slug}`}
                  className={`flex justify-between p-2 rounded transition-colors ${
                    standing.is_current_team
                      ? "bg-blue-900/30 border border-blue-700"
                      : "hover:bg-white/5"
                  }`}
                >
                  <span className={standing.is_current_team ? "text-blue-300 font-bold" : "text-gray-300"}>
                    {standing.school_name}
                  </span>
                  <span className="text-gray-300 font-mono">
                    {standing.wins}-{standing.losses}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Next Level Alumni */}
        {nextLevelAlumni.length > 0 && (
          <div
            className="rounded-lg p-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <h3 className="psp-h3 text-white mb-4">
              College & Pro Alumni
            </h3>
            <div className="space-y-2 text-sm">
              {nextLevelAlumni.map((alumni: NextLevelAlumnus, idx: number) => (
                <Link
                  key={idx}
                  href={`/${sport}/players/${alumni.player_slug}`}
                  className="block hover:text-blue-400 transition-colors"
                >
                  <div className="text-gray-300">{alumni.player_name}</div>
                  <div className="text-xs text-gray-400">
                    {alumni.level}
                    {alumni.organization ? ` • ${alumni.organization}` : ""}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
