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
import type { TeamPageClientProps, TabType, Alumni } from "./team-utils";
import {
  getErasWithSeasons,
  buildChampionshipMap,
  formatChampionshipLabel,
  gamesToSchedule,
  rosterToDisplay,
  getPositionGroups,
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

  // Transform DB data for display
  const schedule = gamesToSchedule(games || [], school.id);
  const rosterDisplay = rosterToDisplay(roster || []);
  const positionGroups = getPositionGroups(sport);

  // Tab styling — dark variant for hero-welded tabs
  const tabClasses = (tab: TabType) =>
    `px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
      activeTab === tab
        ? "border-[var(--psp-gold)] text-[var(--psp-gold)]"
        : "border-transparent text-gray-500 hover:text-gray-300"
    }`;

  // Tab bar rendered inside the hero
  const tabBarElement = (
    <div className="flex overflow-x-auto -mb-px">
      {TAB_OPTIONS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={tabClasses(tab)}
        >
          {tab === "overview" && "Overview"}
          {tab === "stats" && "Stats"}
          {tab === "schedule" && "Schedule"}
          {tab === "roster" && "Roster"}
          {tab === "news" && "News"}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Team Header Component — tabs welded to hero bottom */}
      <TeamHeader
        team={team}
        school={school}
        sport={sport}
        sportMeta={sportMeta}
        currentSeasonChampionships={currentSeasonChampionships}
        seasons={(teamSeasons || [])
          .filter((ts: any) => ts.seasons?.label)
          .map((ts: any) => ({
            label: ts.seasons.label as string,
            year_start: ts.seasons.year_start ?? parseInt(ts.seasons.label.substring(0, 4), 10),
          }))}
        currentSeasonLabel={(teamSeasons || [])[0]?.seasons?.label}
        tabBar={tabBarElement}
      />

      {/* Main Content — light background */}
      <div className="bg-gray-50" style={{ minHeight: "60vh" }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <>
                  <TeamOverviewTab team={team} articles={articles} tedNotes={tedNotes} />

                  {/* Alumni Pipeline — inside Overview */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="psp-h3 flex items-center gap-1.5" style={{ color: "var(--psp-navy)" }}>
                        Alumni Pipeline
                      </h2>
                      <Link href="/philly-everywhere" className="text-sm font-bold hover:underline" style={{ color: "var(--psp-navy)" }}>
                        Philly Everywhere &rarr;
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {alumni && alumni.length > 0 ? (
                        alumni.map((alum: Alumni, i: number) => {
                          const gradYear = alum.graduation_year;
                          const orgName = alum.current_org || alum.destination_school || "TBA";
                          return (
                            <div
                              key={alum.id || i}
                              className="bg-white rounded-lg border border-gray-200 p-3"
                              style={{ borderTop: "3px solid var(--psp-gold)" }}
                            >
                              <div className="font-bold text-[13px]" style={{ color: "var(--psp-navy)" }}>
                                {alum.person_name || `Alumni ${i + 1}`}
                              </div>
                              <div className="text-[11px] text-gray-500 mt-0.5">
                                {orgName} {alum.pro_league ? `(${alum.pro_league})` : alum.current_level ? `— ${alum.current_level}` : ""}
                              </div>
                              {gradYear && (
                                <div className="text-[10px] font-semibold mt-1" style={{ color: "var(--psp-gold)" }}>
                                  Class of {gradYear}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center col-span-full">
                          <div className="text-[11px] text-gray-500">No alumni data available for this school</div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Stats Tab */}
              {activeTab === "stats" && <TeamStats team={team} statLeaders={statLeaders} />}

              {/* Schedule Tab */}
              {activeTab === "schedule" && (
                schedule.length > 0 ? (
                  <TeamSchedule schedule={schedule} />
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <p className="text-sm text-gray-400">Schedule data not available for this season.</p>
                  </div>
                )
              )}

              {/* Roster Tab */}
              {activeTab === "roster" && (
                rosterDisplay.length > 0 ? (
                  <TeamRoster roster={rosterDisplay} positionGroups={positionGroups} sportMeta={sportMeta} />
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <p className="text-sm text-gray-400">Roster data not available for this season.</p>
                  </div>
                )
              )}

              {/* News Tab */}
              {activeTab === "news" && (
                articles && articles.length > 0 ? (
                  <div className="space-y-4">
                    {articles.map((article) => (
                      <Link
                        key={article.id}
                        href={`/articles/${article.slug}`}
                        className="flex gap-4 bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
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
                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
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
          <TeamSidebar team={team} sport={sport} tedCoverage={tedCoverage} />
        </div>
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
