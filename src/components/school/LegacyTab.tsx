import Link from "next/link";
import { AchievementBadge } from "@/components/ui";
import { SPORT_EMOJI, SPORT_META, type SportId } from "@/lib/sports";
import SchoolRecordsSection from "./SchoolRecordsSection";
import type { SchoolHubData, SchoolChampionshipData, NextLevelAthlete, SchoolCoach, SchoolAward, RecentSeasonData, SchoolRecord } from "@/lib/data/school-hub";
import { Trophy } from "lucide-react";

interface LegacyTabProps {
  school: SchoolHubData;
  championships: SchoolChampionshipData[];
  nextLevel: NextLevelAthlete[];
  coaches: SchoolCoach[];
  awards: SchoolAward[];
  recentSeasons: RecentSeasonData[];
  records: SchoolRecord[];
}

export default function LegacyTab({
  school,
  championships,
  nextLevel,
  coaches,
  awards,
  recentSeasons,
  records,
}: LegacyTabProps) {
  const slug = school.slug;

  // Group championships by sport
  const champsBySport = new Map<string, SchoolChampionshipData[]>();
  championships.forEach((c) => {
    if (!champsBySport.has(c.sport_id)) champsBySport.set(c.sport_id, []);
    champsBySport.get(c.sport_id)!.push(c);
  });

  // Sort next level: pros first
  const sortedNextLevel = [...nextLevel].sort((a, b) => {
    if (a.pro_league && !b.pro_league) return -1;
    if (!a.pro_league && b.pro_league) return 1;
    return a.person_name.localeCompare(b.person_name);
  });
  const proCount = sortedNextLevel.filter((a) => a.pro_league).length;

  return (
    <div className="space-y-8">
      {/* Championships */}
      {championships.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="psp-h2" style={{ color: "var(--psp-navy)" }}>
              Championships ({championships.length})
            </h2>
          </div>

          {Array.from(champsBySport.entries())
            .sort((a, b) => b[1].length - a[1].length)
            .map(([sportId, sportChamps]) => (
              <div key={sportId} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{SPORT_EMOJI[sportId] || "trophy"}</span>
                  <h3
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{ color: "var(--psp-navy)" }}
                  >
                    {sportChamps[0]?.sport_name || sportId} ({sportChamps.length})
                  </h3>
                  <Link
                    href={`/${sportId}/championships`}
                    className="text-xs ml-auto hover:underline"
                    style={{ color: "var(--psp-blue)" }}
                  >
                    All {sportChamps[0]?.sport_name} Championships →
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sportChamps.map((c, idx) => (
                    <Link
                      key={c.id}
                      href={`/${c.sport_id}/schools/${slug}`}
                      className="inline-flex items-center gap-1.5 bg-white border border-[var(--psp-gray-200)] rounded-full px-3 py-1.5 text-sm hover:border-[var(--psp-gold)]/50 hover:shadow-sm transition animate-fade-in-up"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <Trophy className="w-5 h-5 inline" />
                      <span
                        className="font-bold tabular-nums"
                        style={{ color: "var(--psp-navy)" }}
                      >
                        {c.year}
                      </span>
                      <span className="text-gray-400 text-xs">{c.level}</span>
                      {c.league_name && (
                        <span className="text-gray-300 text-xs hidden sm:inline">
                          &bull; {c.league_name}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </section>
      )}

      {/* Coaching Staff */}
      {coaches.length > 0 && (
        <section>
          <h2 className="psp-h2 mb-4" style={{ color: "var(--psp-navy)" }}>
            Coaching Staff
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {coaches.map((coach) => {
              const yearRange = coach.end_year
                ? `${coach.start_year}\u2013${coach.end_year}`
                : `${coach.start_year}\u2013present`;
              const hasRecord = coach.record_wins > 0 || coach.record_losses > 0;

              return (
                <Link
                  key={`${coach.id}-${coach.sport_id}`}
                  href={`/${coach.sport_id}/coaches/${coach.slug}`}
                  className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-4 hover:shadow-md hover:border-[var(--psp-gold)]/40 transition group"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="min-w-0 flex-1">
                      <h3
                        className="text-sm font-bold group-hover:text-[var(--psp-gold)] transition-colors truncate"
                        style={{ color: "var(--psp-navy)" }}
                      >
                        {coach.name}
                      </h3>
                      <div className="text-xs text-gray-400">
                        {coach.role} &bull; {yearRange}
                      </div>
                    </div>
                    <span className="text-lg ml-2 flex-shrink-0">
                      {SPORT_EMOJI[coach.sport_id] || "📋"}
                    </span>
                  </div>
                  {(hasRecord || coach.championships > 0) && (
                    <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-100">
                      {hasRecord && (
                        <div className="text-xs">
                          <span
                            className="font-bold"
                            style={{ color: "var(--psp-navy)" }}
                          >
                            {coach.record_wins}-{coach.record_losses}
                            {coach.record_ties > 0 ? `-${coach.record_ties}` : ""}
                          </span>
                          <span className="text-gray-300 ml-1">Record</span>
                        </div>
                      )}
                      {coach.championships > 0 && (
                        <div className="text-xs">
                          <span
                            className="font-bold"
                            style={{ color: "var(--psp-gold)" }}
                          >
                            {coach.championships}
                          </span>
                          <span className="text-gray-300 ml-1">
                            {coach.championships === 1 ? "Title" : "Titles"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Season History */}
      {recentSeasons.length > 0 && (
        <section>
          <h2 className="psp-h2 mb-4" style={{ color: "var(--psp-navy)" }}>
            Season History
          </h2>
          <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
            <div className="overflow-x-auto">
              <table aria-label="Season history" className="data-table">
                <thead>
                  <tr>
                    <th>Sport</th>
                    <th>Season</th>
                    <th className="text-center">W</th>
                    <th className="text-center">L</th>
                    <th className="hidden sm:table-cell text-center">T</th>
                    <th className="hidden sm:table-cell">Playoff</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSeasons.map((season) => {
                    const totalSeasonGames = season.wins + season.losses + (season.ties || 0);
                    const seasonWinPct =
                      totalSeasonGames > 0
                        ? ((season.wins / totalSeasonGames) * 100).toFixed(0)
                        : "\u2014";
                    const hasRecord = totalSeasonGames > 0;
                    const isChampSeason = championships.some(
                      (c) =>
                        c.sport_id === season.sport_id &&
                        c.season_label === season.season_label
                    );
                    return (
                      <tr
                        key={season.id}
                        className={isChampSeason ? "bg-amber-50" : ""}
                      >
                        <td>
                          <span className="font-medium">
                            {isChampSeason && <Trophy className="w-5 h-5 inline" />}
                            {season.sport_name}
                          </span>
                        </td>
                        <td>
                          <Link
                            href={`/${season.sport_id}/teams/${slug}/${season.season_label}`}
                            className="hover:underline"
                            style={{ color: "var(--psp-blue)" }}
                          >
                            {season.season_label}
                          </Link>
                        </td>
                        <td className="text-center font-medium">
                          {hasRecord ? season.wins : "\u2014"}
                        </td>
                        <td className="text-center font-medium">
                          {hasRecord ? season.losses : "\u2014"}
                        </td>
                        <td className="hidden sm:table-cell text-center text-sm">
                          {hasRecord ? season.ties || "\u2014" : "\u2014"}
                        </td>
                        <td className="hidden sm:table-cell text-xs">
                          {season.playoff_result ||
                            (hasRecord ? `${seasonWinPct}%` : "\u2014")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Awards */}
      {awards.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="psp-h2" style={{ color: "var(--psp-navy)" }}>
              Awards & Honors ({awards.length})
            </h2>
          </div>
          <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
            <div className="overflow-x-auto">
              <table aria-label="Awards and honors" className="data-table">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Award</th>
                    <th className="hidden sm:table-cell">Sport</th>
                    <th className="text-center">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {awards.slice(0, 20).map((award) => (
                    <tr key={award.id}>
                      <td>
                        {award.player_slug ? (
                          <Link
                            href={`/${award.sport_id}/players/${award.player_slug}`}
                            className="font-medium hover:underline"
                            style={{ color: "var(--psp-blue)" }}
                          >
                            {award.player_name}
                          </Link>
                        ) : (
                          <span className="font-medium">{award.player_name}</span>
                        )}
                      </td>
                      <td className="text-sm">
                        {award.award_name}
                        {award.tier && (
                          <span className="text-xs text-gray-300 ml-1">({award.tier})</span>
                        )}
                      </td>
                      <td className="hidden sm:table-cell text-sm">
                        <span className="mr-1">{SPORT_EMOJI[award.sport_id] || ""}</span>
                        {SPORT_META[award.sport_id as SportId]?.name || award.sport_id}
                      </td>
                      <td className="text-center tabular-nums text-sm">
                        {award.year || "\u2014"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {awards.length > 20 && (
              <div className="text-center py-3 border-t border-gray-100">
                <span className="text-sm" style={{ color: "var(--psp-blue)" }}>
                  + {awards.length - 20} more awards &mdash; explore sport pages for full
                  lists
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Next Level Alumni */}
      {sortedNextLevel.length > 0 && (
        <section>
          <h2
            className="psp-h2 mb-1"
            style={{ color: "var(--psp-navy)" }}
          >
            Next Level Alumni ({sortedNextLevel.length})
          </h2>
          {proCount > 0 && (
            <p className="text-sm text-gray-400 mb-4">
              Including {proCount} professional athlete{proCount !== 1 ? "s" : ""}
            </p>
          )}
          <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
            <div className="overflow-x-auto">
              <table aria-label="Next level alumni" className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Level</th>
                    <th>College / Organization</th>
                    <th className="hidden sm:table-cell">Sport</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedNextLevel.slice(0, 15).map((athlete, idx) => (
                    <tr
                      key={athlete.id}
                      className={`${athlete.pro_league ? "bg-amber-50" : ""} animate-fade-in-up`}
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <td className="font-medium">
                        {athlete.person_name.includes(",")
                          ? `${athlete.person_name
                              .split(",")
                              .slice(1)
                              .join(",")
                              .trim()} ${athlete.person_name.split(",")[0].trim()}`
                          : athlete.person_name}
                      </td>
                      <td>
                        <AchievementBadge
                          type={athlete.pro_league ? "pro" : "college"}
                          showLabel
                        />
                      </td>
                      <td>
                        {athlete.pro_league ? (
                          <>
                            <div className="text-sm font-medium">
                              {athlete.pro_team || athlete.pro_league}
                            </div>
                            {athlete.pro_league && athlete.pro_team && (
                              <div
                                className="text-xs"
                                style={{ color: "var(--psp-gold)" }}
                              >
                                {athlete.pro_league}
                              </div>
                            )}
                            {athlete.college && (
                              <div className="text-xs text-gray-300">
                                via {athlete.college}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-sm">{athlete.college || "\u2014"}</div>
                        )}
                      </td>
                      <td className="hidden sm:table-cell text-sm capitalize">
                        {athlete.sport_id?.replace("-", " ") || "\u2014"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {sortedNextLevel.length > 15 && (
              <div className="text-center py-3 border-t border-gray-100">
                <span className="text-sm" style={{ color: "var(--psp-blue)" }}>
                  Showing 15 of {sortedNextLevel.length} alumni &mdash; explore sport
                  pages for full lists
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* School Records */}
      <SchoolRecordsSection records={records} />
    </div>
  );
}
