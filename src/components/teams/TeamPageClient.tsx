"use client";
// v3: championship_type labels + league standing fix — refactored into sub-components
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import TeamHeader from "@/components/team/TeamHeader";
import TeamSchedule from "@/components/team/TeamSchedule";
import TeamRoster from "@/components/team/TeamRoster";
import TeamStats from "@/components/team/TeamStats";

// Sub-components
import TeamOverviewTab from "./TeamOverviewTab";
import TeamSeasonHistory from "./TeamSeasonHistory";
import TeamSidebar from "./TeamSidebar";

// Shared types & helpers
import type { TeamPageClientProps, TabType, Alumni, DBGame } from "./team-utils";
import {
  getErasWithSeasons,
  buildChampionshipMap,
  formatChampionshipLabel,
  formatGameDate,
  gamesToSchedule,
  rosterToDisplay,
  getPositionGroups,
  getGameOpponent,
  timeAgo,
} from "./team-utils";

/** Module-level constants */
const TAB_OPTIONS: TabType[] = ["overview", "stats", "schedule", "roster", "news"];
const CURRENT_SEASON = "2025-26";

export default function TeamPageClient({
  team,
  school,
  teamSeasons,
  championships,
  alumni,
  sport,
  sportMeta,
  games,
  roster,
  articles,
  statLeaders,
  tedNotes,
  tedCoverage,
}: TeamPageClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Era selector for season history
  const availableEras = getErasWithSeasons(teamSeasons || []);
  const [selectedEra, setSelectedEra] = useState<string>(
    availableEras.length > 0 ? availableEras[0].key : "modern"
  );

  // Championship lookup by season_id
  const champMap = useMemo(() => buildChampionshipMap(championships || []), [championships]);

  // Current-season championship labels for the header ribbon
  const currentSeasonChampionships = useMemo(() => {
    return (championships || [])
      .filter((c) => (c.seasons as any)?.label === CURRENT_SEASON)
      .map((c) => ({
        season: CURRENT_SEASON,
        label: formatChampionshipLabel(c),
      }));
  }, [championships]);

  const totalGames = team.currentRecord.wins + team.currentRecord.losses + team.currentRecord.ties;
  const winPct = totalGames > 0 ? ((team.currentRecord.wins / totalGames) * 100).toFixed(1) : "0.0";

  // Transform DB data for display
  const schedule = gamesToSchedule(games || [], school.id);
  const rosterDisplay = rosterToDisplay(roster || []);
  const positionGroups = getPositionGroups(sport);

  // Find last completed game and next upcoming game
  const sortedGames = [...(games || [])].sort(
    (a, b) => new Date(a.game_date).getTime() - new Date(b.game_date).getTime()
  );
  const lastCompletedGame = [...sortedGames]
    .reverse()
    .find((g) => g.home_score !== null && g.away_score !== null);
  const nextUpcomingGame = sortedGames.find(
    (g) => g.home_score === null || g.away_score === null
  );

  const lastGameInfo = getGameOpponent(lastCompletedGame, school.id);
  const nextGameInfo = getGameOpponent(nextUpcomingGame, school.id);

  // Tab styling
  const tabClasses = (tab: TabType) =>
    `px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
      activeTab === tab
        ? `border-[var(--psp-gold)] text-[var(--psp-navy)]`
        : "border-transparent text-gray-400 hover:text-gray-700"
    }`;

  return (
    <>
      {/* Team Header Component */}
      <TeamHeader
        team={team}
        school={school}
        sport={sport}
        sportMeta={sportMeta}
        currentSeasonChampionships={currentSeasonChampionships}
      />

      {/* Right Now Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-300">
          <div
            className="bg-[var(--psp-navy)] px-5 py-3"
            style={{ borderLeft: `4px solid ${school.primary_color || sportMeta.color}` }}
          >
            <h3 className="psp-caption text-white">Right Now</h3>
          </div>
          <div className="p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Last Game */}
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Last Game</div>
                {lastGameInfo ? (
                  <>
                    <div className="text-sm font-semibold text-[var(--psp-navy)] mb-1">{lastGameInfo.name}</div>
                    <div className="text-xs text-gray-600">{lastGameInfo.homeAway} &bull; {lastGameInfo.date}</div>
                  </>
                ) : (
                  <div className="text-sm text-gray-400">No games played yet</div>
                )}
              </div>
              {/* Current Record */}
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Season Record</div>
                <div className="psp-h3" style={{ color: school.primary_color || sportMeta.color }}>
                  {team.currentRecord.wins}-{team.currentRecord.losses}{team.currentRecord.ties > 0 ? `-${team.currentRecord.ties}` : ""}
                </div>
              </div>
              {/* League Standing */}
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">League Standing</div>
                {team.leagueFinish ? (
                  <div className="psp-h3 text-[var(--psp-gold)]">{team.leagueFinish}</div>
                ) : team.leagueRecord && (team.leagueRecord.wins > 0 || team.leagueRecord.losses > 0) ? (
                  <div className="psp-h3 text-[var(--psp-gold)]">{team.leagueRecord.wins}-{team.leagueRecord.losses}</div>
                ) : (
                  <div className="text-sm text-gray-400">N/A</div>
                )}
                <div className="text-xs text-gray-600 mt-1">in {team.league}</div>
              </div>
              {/* Next Opponent */}
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Next Opponent</div>
                {nextGameInfo ? (
                  <>
                    <div className="text-sm font-semibold text-[var(--psp-navy)] mb-1">{nextGameInfo.name}</div>
                    <div className="text-xs text-gray-600">{nextGameInfo.homeAway} &bull; {nextGameInfo.date}</div>
                  </>
                ) : (
                  <div className="text-sm text-gray-400">No upcoming games</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg border-b border-[var(--psp-gray-200)] flex overflow-x-auto">
              {TAB_OPTIONS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={tabClasses(tab)}
                  style={{ borderBottomColor: activeTab === tab ? "var(--psp-gold)" : "transparent" }}
                >
                  {tab === "overview" && "Overview"}
                  {tab === "stats" && "Stats"}
                  {tab === "schedule" && "Schedule"}
                  {tab === "roster" && "Roster"}
                  {tab === "news" && "News"}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <TeamOverviewTab team={team} articles={articles} tedNotes={tedNotes} />
            )}

            {/* Stats Tab */}
            {activeTab === "stats" && <TeamStats team={team} statLeaders={statLeaders} />}

            {/* Schedule Tab */}
            {activeTab === "schedule" && (
              schedule.length > 0 ? (
                <TeamSchedule schedule={schedule} />
              ) : (
                <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-8 text-center">
                  <p className="text-sm text-gray-400">Schedule data not available for this season.</p>
                </div>
              )
            )}

            {/* Roster Tab */}
            {activeTab === "roster" && (
              rosterDisplay.length > 0 ? (
                <TeamRoster roster={rosterDisplay} positionGroups={positionGroups} sportMeta={sportMeta} />
              ) : (
                <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-8 text-center">
                  <p className="text-sm text-gray-400">Roster data not available for this season.</p>
                </div>
              )
            )}

            {/* Alumni Pipeline */}
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 className="psp-h3" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--psp-navy)" }}>
                  Alumni Pipeline
                </h2>
                <Link href="/philly-everywhere" style={{ color: "var(--psp-navy)", textDecoration: "none", fontWeight: 700, fontSize: "0.875rem" }}>
                  Philly Everywhere &rarr;
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 20 }}>
                {alumni && alumni.length > 0 ? (
                  alumni.map((alum: Alumni, i: number) => {
                    const gradYear = alum.graduation_year;
                    const orgName = alum.current_org || alum.destination_school || "TBA";
                    return (
                      <div
                        key={alum.id || i}
                        className="bg-white rounded-md border border-gray-200"
                        style={{ padding: "12px 14px", borderTop: "3px solid var(--psp-gold)" }}
                      >
                        <div style={{ fontWeight: 700, fontSize: 13, color: "var(--psp-navy)" }}>
                          {alum.person_name || `Alumni ${i + 1}`}
                        </div>
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                          {orgName} {alum.pro_league ? `(${alum.pro_league})` : alum.current_level ? `\u2014 ${alum.current_level}` : ""}
                        </div>
                        {gradYear && (
                          <div style={{ fontSize: 10, color: "var(--psp-gold)", fontWeight: 600, marginTop: 4 }}>
                            Class of {gradYear}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div
                    className="bg-white rounded-md border border-gray-200"
                    style={{ padding: "12px 14px", textAlign: "center", gridColumn: "1 / -1" }}
                  >
                    <div style={{ fontSize: 11, color: "#6b7280" }}>No alumni data available for this school</div>
                  </div>
                )}
              </div>
            </div>

            {/* News Tab */}
            {activeTab === "news" && (
              articles && articles.length > 0 ? (
                <div className="space-y-4">
                  {articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/articles/${article.slug}`}
                      className="flex gap-4 bg-white rounded-lg border border-[var(--psp-gray-200)] p-4 hover:shadow-md transition-shadow"
                    >
                      {article.featured_image_url && (
                        <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={article.featured_image_url}
                            alt={article.title}
                            width={128}
                            height={128}
                            sizes="128px"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base" style={{ color: "var(--psp-navy)" }}>{article.title}</h3>
                        {article.excerpt && <p className="text-sm text-gray-600 mt-2">{article.excerpt}</p>}
                        <p className="text-xs text-gray-300 mt-3">{timeAgo(article.published_at)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-8 text-center">
                  <p className="text-sm text-gray-400">No articles yet for this team.</p>
                </div>
              )
            )}

            {/* Season History */}
            <TeamSeasonHistory
              teamSeasons={teamSeasons}
              champMap={champMap}
              availableEras={availableEras}
              selectedEra={selectedEra}
              setSelectedEra={setSelectedEra}
              sport={sport}
              teamSlug={team.slug}
            />

            {/* Program History Timeline */}
            {championships && championships.length > 0 && (
              <div className="rounded-lg overflow-hidden" style={{ background: "var(--psp-navy)" }}>
                <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderBottom: "2px solid var(--psp-gold)" }}>
                  <h2 className="text-white font-bold text-sm uppercase tracking-wider font-heading" style={{ fontSize: "1.1rem" }}>
                    Program History
                  </h2>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                    {championships.length} Title{championships.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="relative pl-8 pr-4 py-4" style={{ borderLeft: "none" }}>
                  {/* Timeline line */}
                  <div className="absolute left-6 top-4 bottom-4 w-px" style={{ background: "rgba(240,165,0,0.3)" }} />

                  {/* Championship entries — sorted by season year descending */}
                  {[...championships]
                    .sort((a, b) => (b.seasons?.year_start || 0) - (a.seasons?.year_start || 0))
                    .map((c, i) => {
                      const label = formatChampionshipLabel(c);
                      const seasonLabel = c.seasons?.label || "";
                      const isState = label.includes("State") || label.includes("PIAA");
                      return (
                        <div key={c.id || i} className="relative mb-5 last:mb-0">
                          {/* Timeline dot */}
                          <div
                            className="absolute -left-[11px] top-1 w-4 h-4 rounded-full border-2"
                            style={{
                              background: isState ? "var(--psp-gold)" : "var(--psp-navy)",
                              borderColor: isState ? "var(--psp-gold)" : "rgba(240,165,0,0.5)",
                              boxShadow: isState ? "0 0 8px rgba(240,165,0,0.4)" : "none",
                            }}
                          />
                          {/* Content */}
                          <div className="ml-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-white text-sm font-heading" style={{ fontSize: "1rem" }}>
                                {seasonLabel}
                              </span>
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded"
                                style={{
                                  background: isState ? "rgba(240,165,0,0.2)" : "rgba(255,255,255,0.08)",
                                  color: isState ? "var(--psp-gold)" : "var(--psp-gray-400)",
                                }}
                              >
                                {label.replace(" Champion", "")}
                              </span>
                            </div>
                            {c.score && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                Score: {c.score}{c.opponent?.name ? ` vs ${c.opponent.name}` : ""}
                              </div>
                            )}
                            {c.notes && !c.notes.includes("Champion") && (
                              <div className="text-xs text-gray-600 mt-0.5">{c.notes}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                  {/* Founded entry */}
                  {team.founded_year > 0 && (
                    <div className="relative mt-6">
                      <div
                        className="absolute -left-[11px] top-1 w-4 h-4 rounded-full border-2"
                        style={{ background: "var(--psp-navy)", borderColor: "rgba(255,255,255,0.15)" }}
                      />
                      <div className="ml-4">
                        <span className="font-bold text-gray-400 text-sm font-heading" style={{ fontSize: "1rem" }}>
                          Est. {team.founded_year}
                        </span>
                        <div className="text-xs text-gray-600">{team.league}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <TeamSidebar team={team} winPct={winPct} sport={sport} tedCoverage={tedCoverage} />
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsTeam",
            name: team.name,
            sport: sportMeta.name,
            location: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressLocality: team.city,
                addressRegion: team.state,
              },
            },
            url: `https://phillysportspack.com/${sport}/teams/${team.slug}`,
            ...(team.coach ? { coach: team.coach } : {}),
          }),
        }}
      />
    </>
  );
}
