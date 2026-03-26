"use client";
// v2: championship_type labels — refactored into sub-components
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
import type { TeamPageClientProps, TabType, DBGame } from "./team-utils";
import {
  getErasWithSeasons,
  buildChampionshipMap,
  formatGameDate,
  gamesToSchedule,
  rosterToDisplay,
  getPositionGroups,
  getGameOpponent,
  timeAgo,
} from "./team-utils";

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
}: TeamPageClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Era selector for season history
  const availableEras = getErasWithSeasons(teamSeasons || []);
  const [selectedEra, setSelectedEra] = useState<string>(
    availableEras.length > 0 ? availableEras[0].key : "modern"
  );

  // Championship lookup by season_id
  const champMap = useMemo(() => buildChampionshipMap(championships || []), [championships]);

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
      <TeamHeader team={team} school={school} sport={sport} sportMeta={sportMeta} />

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
                <div className="psp-h3 text-[var(--psp-gold)]">TBA</div>
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
              {(["overview", "stats", "schedule", "roster", "news"] as TabType[]).map((tab) => (
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
              <TeamOverviewTab team={team} articles={articles} />
            )}

            {/* Stats Tab */}
            {activeTab === "stats" && <TeamStats team={team} />}

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
                  alumni.map((alum, i) => (
                    <div key={i} style={{ background: "var(--psp-white)", border: "1px solid var(--g100)", borderRadius: 6, padding: "12px 14px", borderTop: `3px solid var(--psp-gold)` }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--psp-navy)" }}>{alum.person_name || `Alumni ${i + 1}`}</div>
                      <div style={{ fontSize: 11, color: "var(--g400)", marginTop: 2 }}>
                        {alum.current_org || alum.destination_school || "TBA"} {alum.pro_league ? `(${alum.pro_league})` : alum.current_level ? `\u2014 ${alum.current_level}` : ""}
                      </div>
                      {alum.graduation_year && (
                        <div style={{ fontSize: 10, color: "var(--psp-gold)", fontWeight: 600, marginTop: 4 }}>
                          Class of {alum.graduation_year}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ background: "var(--psp-white)", border: "1px solid var(--g100)", borderRadius: 6, padding: "12px 14px", textAlign: "center", gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: 11, color: "var(--g400)" }}>No alumni data available</div>
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
              championships={championships}
              champMap={champMap}
              availableEras={availableEras}
              selectedEra={selectedEra}
              setSelectedEra={setSelectedEra}
              sport={sport}
              teamSlug={team.slug}
            />

            {/* Program History Timeline */}
            <div style={{ marginTop: 20 }}>
              <h2 className="psp-h3" style={{ marginBottom: 16, color: "var(--psp-navy)" }}>Program History</h2>
              <div style={{ position: "relative", paddingLeft: 24, borderLeft: `2px solid var(--g200)`, marginBottom: 20 }}>
                {(team.recentChampionships || []).map((year: string, i: number) => (
                  <div key={i} style={{ marginBottom: 16, position: "relative" }}>
                    <div style={{ position: "absolute", left: -31, top: 4, width: 16, height: 16, borderRadius: "50%", background: "var(--psp-gold)", border: "3px solid var(--psp-white)" }} />
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--psp-navy)" }}>{year} Championship</div>
                    <div style={{ fontSize: 11, color: "var(--g400)" }}>League champions</div>
                  </div>
                ))}
                <div style={{ position: "relative", marginBottom: 0 }}>
                  <div style={{ position: "absolute", left: -31, top: 4, width: 16, height: 16, borderRadius: "50%", background: "var(--g300)", border: "3px solid var(--psp-white)" }} />
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--psp-navy)" }}>Founded {team.founded_year}</div>
                  <div style={{ fontSize: 11, color: "var(--g400)" }}>{team.league}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <TeamSidebar team={team} winPct={winPct} sport={sport} />
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
            coach: team.coach,
          }),
        }}
      />
    </>
  );
}
