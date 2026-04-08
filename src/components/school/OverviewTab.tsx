import Link from "next/link";
import ThisSeasonBanner from "./ThisSeasonBanner";

const SPORT_EMOJI: Record<string, string> = {
  football: "🏈",
  basketball: "🏀",
  baseball: "⚾",
  "track-field": "🏃",
  lacrosse: "🥍",
  wrestling: "🤼",
  soccer: "⚽",
};

interface OverviewTabProps {
  school: any;
  sports: any[];
  currentSeasons: any[];
  recentGames: any[];
}

export default function OverviewTab({ school, sports, currentSeasons, recentGames }: OverviewTabProps) {
  const slug = school.slug;

  return (
    <div className="space-y-8">
      {/* This Season Banner */}
      <ThisSeasonBanner seasons={currentSeasons} schoolSlug={slug} />

      {/* Sport Program Cards — SP-4: hide cards with 0 players AND 0 seasons */}
      {sports.filter((s: any) => (s.player_count ?? 0) > 0 || (s.season_count ?? 0) > 0 || (s.championship_count ?? 0) > 0).length > 0 && (
        <section>
          <h2
            className="psp-h2 mb-4"
            style={{ color: "var(--psp-navy)" }}
          >
            Sports Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sports
              .filter((s: any) => (s.player_count ?? 0) > 0 || (s.season_count ?? 0) > 0 || (s.championship_count ?? 0) > 0)
              .map((sport: any) => (
              <Link
                key={sport.sport_id}
                href={`/${sport.sport_id}/schools/${slug}`}
                className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-5 hover:shadow-lg hover:border-[var(--psp-gold)]/40 transition block group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{sport.sport_emoji}</span>
                  <h3
                    className="psp-h3 flex-1 truncate group-hover:text-[var(--psp-gold)] transition-colors"
                    style={{ color: "var(--psp-navy)" }}
                  >
                    {sport.sport_name}
                  </h3>
                  {(sport.wins + sport.losses + sport.ties) > 0 && (
                    <span
                      className="text-lg font-bold tabular-nums whitespace-nowrap"
                      style={{ color: "var(--psp-navy)" }}
                    >
                      {sport.wins}-{sport.losses}{sport.ties > 0 ? `-${sport.ties}` : ""}
                    </span>
                  )}
                </div>

                <div className="flex gap-4 text-center border-t border-gray-100 pt-3">
                  <div className="flex-1">
                    <div className="text-base font-bold" style={{ color: "var(--psp-gold)" }}>
                      {sport.championship_count}
                    </div>
                    <div className="text-xs text-gray-400">Titles</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-bold" style={{ color: "var(--psp-blue)" }}>
                      {sport.season_count}
                    </div>
                    <div className="text-xs text-gray-400">Seasons</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-bold text-gray-600">
                      {sport.player_count}
                    </div>
                    <div className="text-xs text-gray-400">Players</div>
                  </div>
                  <div className="flex-1 flex items-center justify-end">
                    <span
                      className="text-xs font-medium group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 transition-transform"
                      style={{ color: "var(--psp-blue)" }}
                    >
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Results */}
      {recentGames.length > 0 && (
        <section>
          <h2
            className="psp-h2 mb-4"
            style={{ color: "var(--psp-navy)" }}
          >
            Recent Results
          </h2>
          <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
            <div className="divide-y divide-gray-100">
              {recentGames.map((game: any) => {
                const isHome = game.home_school_id === school.id;
                const schoolScore = isHome ? game.home_score : game.away_score;
                const oppScore = isHome ? game.away_score : game.home_score;
                const oppName = isHome ? game.away_school_name : game.home_school_name;
                const oppSlug = isHome ? game.away_school_slug : game.home_school_slug;
                const won = schoolScore !== null && oppScore !== null && schoolScore > oppScore;
                const lost = schoolScore !== null && oppScore !== null && schoolScore < oppScore;
                const resultLabel = won ? "W" : lost ? "L" : "T";
                const resultColor = won ? "text-green-600" : lost ? "text-red-500" : "text-gray-400";
                const dateStr = game.game_date
                  ? new Date(game.game_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "";

                return (
                  <Link
                    key={game.id}
                    href={`/${game.sport_id}/games/${game.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <span className="text-base flex-shrink-0">{SPORT_EMOJI[game.sport_id] || "⚽"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${resultColor}`}>{resultLabel}</span>
                        <span className="text-sm font-medium truncate" style={{ color: "var(--psp-navy)" }}>
                          {isHome ? "vs" : "@"} {oppName}
                        </span>
                      </div>
                      {dateStr && <div className="text-xs text-gray-300">{dateStr}</div>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold tabular-nums" style={{ color: "var(--psp-navy)" }}>
                        {schoolScore}&ndash;{oppScore}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="mt-2 text-center">
            {sports.length > 0 && (
              <Link
                href={`/${sports[0].sport_id}/schools/${slug}`}
                className="text-xs hover:underline"
                style={{ color: "var(--psp-blue)" }}
              >
                View full game history →
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
