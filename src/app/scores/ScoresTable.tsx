import Link from "next/link";
import { SPORT_META } from "@/lib/sports";
import SportIcon from "@/components/ui/SportIcon";
import { getSchoolDisplayName } from "@/lib/utils/schoolDisplayName";
import { Trophy } from "lucide-react";

export interface ScoreGame {
  id: number;
  sport_id: string;
  game_date: string | null;
  home_score: number | null;
  away_score: number | null;
  home_school_id: number;
  away_school_id: number;
  home_school: { name: string; slug: string; city?: string | null; league_id?: number | null } | null;
  away_school: { name: string; slug: string; city?: string | null; league_id?: number | null } | null;
  seasons: { label: string } | null;
  home_league_id: number | null;
  away_league_id: number | null;
  game_type: string | null;
}

const LEAGUE_ORDER = [1, 2, 3]; // CL, PL, IA

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatDateRange(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (start.getTime() === end.getTime()) {
    return start.toLocaleDateString("en-US", { ...opts, weekday: "short" });
  }
  return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
}

/**
 * Classify a game into a league bucket based on participating teams.
 */
function classifyGameLeague(game: ScoreGame): number | "crossover" | "other" {
  const home = game.home_league_id;
  const away = game.away_league_id;

  if (home && away && home === away && LEAGUE_ORDER.includes(home)) return home;
  if (home && away && home !== away && LEAGUE_ORDER.includes(home) && LEAGUE_ORDER.includes(away))
    return "crossover";
  if (home && LEAGUE_ORDER.includes(home)) return home;
  if (away && LEAGUE_ORDER.includes(away)) return away;
  return "other";
}

function groupByLeague(
  games: ScoreGame[]
): { leagueKey: string; leagueLabel: string; games: ScoreGame[] }[] {
  const buckets = new Map<string, ScoreGame[]>();

  for (const game of games) {
    const league = classifyGameLeague(game);
    const key = String(league);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(game);
  }

  const order = ["1", "2", "3", "crossover", "other"];
  const labels: Record<string, string> = {
    "1": "Catholic League",
    "2": "Public League",
    "3": "Inter-Ac",
    crossover: "Crossover",
    other: "Non-League",
  };

  return order
    .filter((k) => buckets.has(k))
    .map((k) => ({
      leagueKey: k,
      leagueLabel: labels[k] || k,
      games: buckets.get(k)!.sort((a, b) => {
        const dateComp = (a.game_date || "").localeCompare(b.game_date || "");
        if (dateComp !== 0) return dateComp;
        return (a.home_school?.name || "").localeCompare(b.home_school?.name || "");
      }),
    }));
}

/**
 * Group games into weekly rounds for football, monthly rounds for other sports.
 */
export function groupIntoRounds(
  games: ScoreGame[],
  sport: string
): { label: string; dateRange: string; games: ScoreGame[] }[] {
  if (games.length === 0) return [];

  const sorted = [...games].sort((a, b) =>
    (a.game_date || "").localeCompare(b.game_date || "")
  );

  if (sport === "football") {
    const weeks: { dates: string[]; games: ScoreGame[] }[] = [];
    let currentWeek: { dates: string[]; games: ScoreGame[] } | null = null;

    for (const game of sorted) {
      const date = game.game_date || "";
      if (!currentWeek) {
        currentWeek = { dates: [date], games: [game] };
      } else {
        const lastDate = currentWeek.dates[currentWeek.dates.length - 1];
        const dayDiff =
          (new Date(date).getTime() - new Date(lastDate).getTime()) /
          (1000 * 60 * 60 * 24);
        if (dayDiff <= 4) {
          if (!currentWeek.dates.includes(date)) currentWeek.dates.push(date);
          currentWeek.games.push(game);
        } else {
          weeks.push(currentWeek);
          currentWeek = { dates: [date], games: [game] };
        }
      }
    }
    if (currentWeek) weeks.push(currentWeek);

    let regularWeekNum = 0;
    let playoffRoundNum = 0;

    return weeks.map((week) => {
      const firstDate = new Date(week.dates[0] + "T12:00:00");
      const lastDate = new Date(
        week.dates[week.dates.length - 1] + "T12:00:00"
      );
      const month = firstDate.getMonth();

      const isPlayoff = month >= 10 && firstDate.getDate() > 10 || month === 11;

      let label: string;
      if (isPlayoff) {
        playoffRoundNum++;
        if (playoffRoundNum === 1) label = "Playoffs — Round 1";
        else if (playoffRoundNum === 2) label = "Playoffs — Quarterfinals";
        else if (playoffRoundNum === 3) label = "Playoffs — Semifinals";
        else if (playoffRoundNum === 4) label = "Playoffs — Championship";
        else label = `Playoffs — Round ${playoffRoundNum}`;
      } else {
        regularWeekNum++;
        label = `Week ${regularWeekNum}`;
      }

      const dateRange = formatDateRange(firstDate, lastDate);
      return { label, dateRange, games: week.games };
    });
  } else {
    const months = new Map<string, ScoreGame[]>();
    for (const game of sorted) {
      const date = game.game_date || "";
      const d = new Date(date + "T12:00:00");
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!months.has(key)) months.set(key, []);
      months.get(key)!.push(game);
    }

    return Array.from(months.entries()).map(([key, games]) => {
      const [year, month] = key.split("-").map(Number);
      const d = new Date(year, month - 1, 1);
      const label = d.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      return { label, dateRange: "", games };
    });
  }
}

// ==================================================================
// GAME CARD COMPONENT
// ==================================================================

export function GameCard({
  game,
  sport,
  showDate = false,
  showSport = false,
}: {
  game: ScoreGame;
  sport: string;
  showDate?: boolean;
  showSport?: boolean;
}) {
  const homeWin =
    game.home_score !== null &&
    game.away_score !== null &&
    game.home_score > game.away_score;
  const awayWin =
    game.away_score !== null &&
    game.home_score !== null &&
    game.away_score > game.home_score;

  const PLAYOFF_TYPES = ['playoff', 'championship', 'semifinal', 'quarterfinal', 'final'];
  const isPlayoffType = PLAYOFF_TYPES.some(t => game.game_type === t || game.game_type?.includes(t));

  const gameTypeBadgeClass = isPlayoffType
    ? 'bg-[#f0a500]/15 text-[#f0a500] border-[#f0a500]/30'
    : game.game_type?.includes('district')
    ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
    : 'bg-gray-500/15 text-gray-300 border-gray-500/30';

  return (
    <Link
      href={`/${sport}/games/${game.id}`}
      className="bg-gradient-to-br from-[#1a1a1a] to-[#222] border border-[#333] rounded-lg px-3 py-2.5 flex flex-row justify-between items-center gap-2 no-underline cursor-pointer transition-[border-color] duration-200 focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--psp-navy)] focus-visible:outline-none"
    >
      {/* Left: date or sport badge */}
      {showSport ? (
        <div className="flex items-center gap-[0.3rem] min-w-[75px]">
          <SportIcon sport={game.sport_id} size="sm" />
          <span className="text-xs text-[#999] font-semibold">
            {SPORT_META[game.sport_id as keyof typeof SPORT_META]?.name || game.sport_id}
          </span>
        </div>
      ) : showDate && game.game_date ? (
        <span className="text-xs text-[#888] min-w-[70px] font-medium">
          {formatDate(game.game_date)}
        </span>
      ) : null}

      {/* Game Score */}
      <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-[0.4rem] text-center">
        <span
          className={`text-[0.85rem] text-right ${awayWin ? 'font-bold' : 'font-medium'}`}
          style={{ color: awayWin ? "var(--psp-gold)" : "#ccc" }}
        >
          {game.away_school ? getSchoolDisplayName(game.away_school) : "TBD"}
        </span>

        <div className="flex items-center gap-[0.35rem] text-[1.3rem] font-bold" style={{ fontFamily: "var(--font-bebas)" }}>
          <span style={{ color: awayWin ? "var(--psp-gold)" : "#999" }}>
            {game.away_score ?? "-"}
          </span>
          <span className="text-[#555] text-[0.85rem]">&ndash;</span>
          <span style={{ color: homeWin ? "var(--psp-gold)" : "#999" }}>
            {game.home_score ?? "-"}
          </span>
        </div>

        <span
          className={`text-[0.85rem] text-left ${homeWin ? 'font-bold' : 'font-medium'}`}
          style={{ color: homeWin ? "var(--psp-gold)" : "#ccc" }}
        >
          {game.home_school ? getSchoolDisplayName(game.home_school) : "TBD"}
        </span>
      </div>

      {/* Right: game type badge */}
      {game.game_type && game.game_type !== 'regular' && (
        <span
          className={`text-xs font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 rounded-sm whitespace-nowrap border ${gameTypeBadgeClass}`}
        >
          {game.game_type === 'playoff' ? <><Trophy className="w-5 h-5 inline" /> Playoff</> :
           game.game_type === 'championship' ? <><span role="img" aria-label="medal">🥇</span> Championship</> :
           game.game_type === 'semifinal' ? <><Trophy className="w-5 h-5 inline" /> Semifinal</> :
           game.game_type === 'quarterfinal' ? <><Trophy className="w-5 h-5 inline" /> Quarterfinal</> :
           game.game_type === 'final' || game.game_type?.includes('final') ? <><span role="img" aria-label="medal">🥇</span> Final</> :
           game.game_type?.includes('championship') ? <><span role="img" aria-label="medal">🥇</span> Championship</> :
           game.game_type?.includes('playoff') ? <><Trophy className="w-5 h-5 inline" /> Playoff</> :
           game.game_type?.includes('district') ? <><span role="img" aria-label="location">📍</span> District</> :
           game.game_type}
        </span>
      )}
    </Link>
  );
}

// ==================================================================
// ROUND VIEW — renders grouped rounds with league sub-groups
// ==================================================================

export function RoundView({
  rounds,
  selectedSport,
}: {
  rounds: { label: string; dateRange: string; games: ScoreGame[] }[];
  selectedSport: string;
}) {
  return (
    <>
      {rounds.length === 0 ? (
        <div className="text-center py-12 px-4 text-[#999]">
          <p className="text-[1.1rem] mb-4">
            No scores found for this selection.
          </p>
          <Link
            href="/scores"
            className="font-semibold no-underline"
            style={{ color: "var(--psp-gold)" }}
          >
            Clear all filters →
          </Link>
        </div>
      ) : (
        rounds.map((round, roundIdx) => {
          const leagueGroups = groupByLeague(round.games);

          return (
            <div
              key={roundIdx}
              className="mb-10"
            >
              {/* Round header */}
              <div
                className="flex items-baseline gap-3 mb-4 pb-2 border-b-2"
                style={{ borderColor: "var(--psp-gold)" }}
              >
                <h2
                  className="psp-h2 m-0"
                  style={{ color: "var(--psp-gold)" }}
                >
                  {round.label}
                </h2>
                {round.dateRange && (
                  <span className="text-[#999] text-[0.85rem]">
                    {round.dateRange}
                  </span>
                )}
                <span className="text-[#666] text-[0.8rem] ml-auto">
                  {round.games.length} game{round.games.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* League sub-groups */}
              {leagueGroups.map((lg) => (
                <div key={lg.leagueKey} className="mb-5">
                  <h3
                    className="text-[0.8rem] font-bold text-[#999] uppercase tracking-[0.08em] mb-2 pl-1"
                  >
                    {lg.leagueLabel}
                  </h3>

                  <div className="grid gap-[0.35rem]">
                    {lg.games.map((game) => (
                      <GameCard key={game.id} game={game} sport={selectedSport} showDate={selectedSport !== "football"} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })
      )}
    </>
  );
}

// ==================================================================
// DEFAULT VIEW — flat list grouped by date
// ==================================================================

export function DefaultScoresView({
  allScores,
  selectedSport,
}: {
  allScores: ScoreGame[];
  selectedSport: string;
}) {
  const groupedByDate = new Map<string, ScoreGame[]>();
  allScores.forEach((game) => {
    const date = game.game_date || "No Date";
    if (!groupedByDate.has(date)) groupedByDate.set(date, []);
    groupedByDate.get(date)!.push(game);
  });

  const sortedDates = Array.from(groupedByDate.keys()).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-12 px-4 text-[#999]">
        <p className="text-[1.1rem] mb-4">
          No scores found for these filters.
        </p>
        <Link
          href="/scores"
          className="font-semibold no-underline"
          style={{ color: "var(--psp-gold)" }}
        >
          Clear all filters →
        </Link>
      </div>
    );
  }

  return (
    <>
      {sortedDates.map((date) => {
        const games = groupedByDate.get(date) || [];
        const dateObj = new Date(date + "T12:00:00");
        const dateLabel = new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(dateObj);

        return (
          <div key={date} className="mb-8">
            <h2
              className="psp-h3 mb-3 pb-2 border-b-2 border-[#333]"
              style={{ color: "var(--psp-gold)" }}
            >
              {dateLabel}
            </h2>

            <div className="grid gap-2">
              {games.map((game) => (
                <GameCard key={game.id} game={game} sport={game.sport_id} showDate={false} showSport={selectedSport === "all"} />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
