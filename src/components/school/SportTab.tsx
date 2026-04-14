"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SchoolRoster from "./SchoolRoster";
import StatLeadersCard from "./StatLeadersCard";
import TeamGameLog from "./TeamGameLog";
import RivalryRecord from "./RivalryRecord";
import type { SchoolHubData, CurrentSeasonInfo, SchoolChampionshipData, RecentSeasonData, SchoolAward, SchoolCoach } from "@/lib/data/school-hub";

const SPORT_EMOJI: Record<string, string> = {
  football: "🏈",
  basketball: "🏀",
  baseball: "⚾",
  "track-field": "🏃",
  lacrosse: "🥍",
  wrestling: "🤼",
  soccer: "⚽",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic API response shape
type SportData = Record<string, any>; // from /api/schools/[slug]/sport-data

interface SportTabProps {
  school: SchoolHubData;
  sportId: string;
  sportName: string;
  currentSeason?: CurrentSeasonInfo;
  championships: SchoolChampionshipData[];
  recentSeasons: RecentSeasonData[];
  awards: SchoolAward[];
  coaches: SchoolCoach[];
}

export default function SportTab({
  school,
  sportId,
  sportName,
  currentSeason,
  championships,
  recentSeasons,
  awards,
  coaches,
}: SportTabProps) {
  const [sportData, setSportData] = useState<SportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setSportData(null);

    fetch(`/api/schools/${school.slug}/sport-data?sport=${sportId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setSportData(data);
        setLoading(false);
      })
      .catch(() => {
        setSportData(null);
        setLoading(false);
      });
  }, [school.slug, sportId]);

  const filteredSeasons = recentSeasons.filter((s) => s.sport_id === sportId);
  const filteredAwards = awards.filter((a) => a.sport_id === sportId);
  const filteredChamps = championships.filter((c) => c.sport_id === sportId);
  const filteredCoaches = coaches.filter((c) => c.sport_id === sportId);

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Season Spotlight */}
      {currentSeason && (
        <div
          className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{SPORT_EMOJI[sportId] || "⚽"}</span>
            <div className="flex-1">
              <h3 className="psp-h3" style={{ color: "var(--psp-navy)" }}>
                {currentSeason.season_label} Season
              </h3>
              <div className="text-sm text-gray-400">
                {filteredCoaches.length > 0 && (
                  <span>
                    Coach:{" "}
                    <Link
                      href={`/${sportId}/coaches/${filteredCoaches[0].slug}`}
                      className="hover:underline"
                      style={{ color: "var(--psp-gold)" }}
                    >
                      {filteredCoaches[0].name}
                    </Link>
                  </span>
                )}
              </div>
            </div>
            <div
              className="text-2xl font-bold tabular-nums font-bebas"
              style={{ color: "var(--psp-navy)" }}
            >
              {currentSeason.wins}-{currentSeason.losses}
              {currentSeason.ties > 0 ? `-${currentSeason.ties}` : ""}
            </div>
          </div>
          {currentSeason.next_game && (
            <div className="text-sm text-gray-400 border-t border-gray-100 pt-2 mt-2">
              Next: {currentSeason.next_game.is_home ? "vs" : "@"}{" "}
              {currentSeason.next_game.opponent_name} &mdash;{" "}
              {new Date(currentSeason.next_game.game_date + "T12:00:00").toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric" }
              )}
            </div>
          )}
        </div>
      )}

      {/* Roster */}
      {sportData?.roster && sportData.roster.length > 0 && (
        <section>
          <h3 className="psp-h3 mb-3" style={{ color: "var(--psp-navy)" }}>
            Roster ({sportData.roster.length})
          </h3>
          <SchoolRoster players={sportData.roster} sport={sportId} />
        </section>
      )}

      {/* Stat Leaders */}
      {sportData?.statLeaders && sportData.statLeaders.length > 0 && (
        <section>
          <h3 className="psp-h3 mb-3" style={{ color: "var(--psp-navy)" }}>
            Stat Leaders
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sportData.statLeaders.map((cat: SportData) => (
              <StatLeadersCard
                key={cat.category}
                title={cat.category}
                leaders={cat.leaders}
                sport={sportId}
              />
            ))}
          </div>
        </section>
      )}

      {/* Game Log */}
      {sportData?.games && sportData.games.length > 0 && (
        <section>
          <h3 className="psp-h3 mb-3" style={{ color: "var(--psp-navy)" }}>
            Game Log
          </h3>
          <TeamGameLog
            games={sportData.games}
            schoolId={school.id}
            sport={sportId}
          />
        </section>
      )}

      {/* Rivalries */}
      {sportData?.rivalries && sportData.rivalries.length > 0 && (
        <section>
          <h3 className="psp-h3 mb-3" style={{ color: "var(--psp-navy)" }}>
            Rivalries
          </h3>
          <RivalryRecord
            rivalries={sportData.rivalries}
            sport={sportId}
            schoolName={school.name}
          />
        </section>
      )}

      {/* Season History */}
      {filteredSeasons.length > 0 && (
        <section>
          <h3 className="psp-h3 mb-3" style={{ color: "var(--psp-navy)" }}>
            Season History
          </h3>
          <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
            <div className="overflow-x-auto">
              <table aria-label={`${sportName} season history`} className="data-table">
                <thead>
                  <tr>
                    <th>Season</th>
                    <th className="text-center">W</th>
                    <th className="text-center">L</th>
                    <th className="hidden sm:table-cell text-center">T</th>
                    <th className="hidden sm:table-cell">Playoff</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSeasons.map((season) => {
                    const isChamp = filteredChamps.some(
                      (c) => c.season_label === season.season_label
                    );
                    return (
                      <tr key={season.id} className={isChamp ? "bg-amber-50" : ""}>
                        <td>
                          {isChamp && <span className="mr-1">🏆</span>}
                          <Link
                            href={`/${sportId}/teams/${school.slug}/${season.season_label}`}
                            className="hover:underline"
                            style={{ color: "var(--psp-blue)" }}
                          >
                            {season.season_label}
                          </Link>
                        </td>
                        <td className="text-center font-medium">{season.wins}</td>
                        <td className="text-center font-medium">{season.losses}</td>
                        <td className="hidden sm:table-cell text-center text-sm">
                          {season.ties || "--"}
                        </td>
                        <td className="hidden sm:table-cell text-xs">
                          {season.playoff_result || "--"}
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
      {filteredAwards.length > 0 && (
        <section>
          <h3 className="psp-h3 mb-3" style={{ color: "var(--psp-navy)" }}>
            Awards & Honors ({filteredAwards.length})
          </h3>
          <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
            <div className="overflow-x-auto">
              <table aria-label={`${sportName} awards`} className="data-table">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Award</th>
                    <th className="text-center">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAwards.map((award) => (
                    <tr key={award.id}>
                      <td>
                        {award.player_slug ? (
                          <Link
                            href={`/${sportId}/players/${award.player_slug}`}
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
                      <td className="text-center tabular-nums text-sm">{award.year || "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Championships */}
      {filteredChamps.length > 0 && (
        <section>
          <h3 className="psp-h3 mb-3" style={{ color: "var(--psp-navy)" }}>
            Championships ({filteredChamps.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {filteredChamps.map((c, idx) => (
              <Link
                key={c.id}
                href={`/${c.sport_id}/schools/${school.slug}`}
                className="inline-flex items-center gap-1.5 bg-white border border-[var(--psp-gray-200)] rounded-full px-3 py-1.5 text-sm hover:border-[var(--psp-gold)]/50 hover:shadow-sm transition animate-fade-in-up"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <span className="text-xs">🏆</span>
                <span className="font-bold tabular-nums" style={{ color: "var(--psp-navy)" }}>
                  {c.year}
                </span>
                <span className="text-gray-400 text-xs">{c.level}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
