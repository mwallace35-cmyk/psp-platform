import { createStaticClient } from "@/lib/supabase/static";
import { SPORT_META } from "@/lib/data";
import { getCurrentSeasonLabel } from "@/lib/sports";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ScheduleView from "./ScheduleView";

export const revalidate = 3600;
type PageParams = { sport: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  const meta = SPORT_META[sport];
  const seasonLabel = getCurrentSeasonLabel();
  return {
    title: `${seasonLabel} ${meta.name} Schedule & Results — PhillySportsPack`,
    description: `Complete ${seasonLabel} Philadelphia high school ${meta.name.toLowerCase()} schedule & results. View week-by-week or filter by team.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/schedule`,
    },
  };
}

interface GameRow {
  id: number;
  game_date: string;
  game_time: string | null;
  game_type: string | null;
  home_score: number | null;
  away_score: number | null;
  notes: string | null;
  home_school: {
    id: number;
    name: string;
    slug: string;
    colors: Record<string, string> | null;
    city?: string | null;
    league_id?: number | null;
  } | null;
  away_school: {
    id: number;
    name: string;
    slug: string;
    colors: Record<string, string> | null;
    city?: string | null;
    league_id?: number | null;
  } | null;
}

interface TeamInfo {
  id: number;
  name: string;
  slug: string;
  colors: Record<string, string> | null;
  gameCount: number;
}

export default async function SchedulePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const sport = await validateSportParam(params);

  const meta = SPORT_META[sport];
  const supabase = createStaticClient();
  const seasonLabel = getCurrentSeasonLabel();

  // Get current/upcoming season — try exact match first, then fall back to most recent
  let seasonData: { id: number; label: string } | null = null;
  const { data: exactSeason } = await supabase
    .from("seasons")
    .select("id, label")
    .eq("label", seasonLabel)
    .single();

  if (exactSeason) {
    seasonData = exactSeason;
  } else {
    // Fallback: get the most recent season by label descending
    const { data: latestSeason } = await supabase
      .from("seasons")
      .select("id, label")
      .order("label", { ascending: false })
      .limit(1)
      .single();
    seasonData = latestSeason;
  }

  if (!seasonData) notFound();

  // Fetch all games for this season + sport
  const sportRow = await supabase
    .from("sports")
    .select("id")
    .eq("slug", sport)
    .single();

  const sportId = sportRow.data?.id;

  const { data: rawGames } = await supabase
    .from("games")
    .select(
      "id, game_date, game_time, game_type, home_score, away_score, notes, home_school:home_school_id(id, name, slug, colors, city, league_id), away_school:away_school_id(id, name, slug, colors, city, league_id)"
    )
    .eq("season_id", seasonData.id)
    .eq("sport_id", sportId)
    .order("game_date", { ascending: true })
    .order("game_time", { ascending: true })
    .limit(500);

  const games: GameRow[] = (rawGames ?? []).map((g: Record<string, unknown>) => ({
    ...g,
    home_school: Array.isArray(g.home_school) ? g.home_school[0] : g.home_school,
    away_school: Array.isArray(g.away_school) ? g.away_school[0] : g.away_school,
  })) as GameRow[];

  // Build team list from games
  const teamMap = new Map<number, TeamInfo>();
  for (const g of games) {
    for (const school of [g.home_school, g.away_school]) {
      if (!school) continue;
      const existing = teamMap.get(school.id);
      if (existing) {
        existing.gameCount++;
      } else {
        teamMap.set(school.id, {
          id: school.id,
          name: school.name,
          slug: school.slug,
          colors: school.colors,
          gameCount: 1,
        });
      }
    }
  }

  // Sort teams: most games first (core teams), then alphabetical
  const teams = [...teamMap.values()].sort((a, b) => {
    if (b.gameCount !== a.gameCount) return b.gameCount - a.gameCount;
    return a.name.localeCompare(b.name);
  });

  // Stats
  const totalGames = games.length;
  const leagueGames = games.filter(
    (g) => !g.game_type || g.game_type === "league" || g.game_type === "regular"
  ).length;
  const nonLeague = games.filter((g) => g.game_type === "non-league").length;
  const scrimmages = games.filter((g) => g.game_type === "scrimmage").length;
  const totalTeams = teams.filter((t) => t.gameCount >= 5).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#0a1628] border-b-4 border-[var(--psp-gold)] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-gray-300 mb-3">
            <a href="/" className="hover:text-gold transition">
              Home
            </a>
            <span className="mx-1">›</span>
            <a href={`/${sport}`} className="hover:text-gold transition">
              {meta.name}
            </a>
            <span className="mx-1">›</span>
            <span className="text-gray-300">Schedule</span>
          </nav>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{meta.emoji}</span>
            <h1 className="psp-h1 text-white">
              {seasonLabel} {meta.name} Schedule & Results
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Full schedule for Philadelphia area high school{" "}
            {meta.name.toLowerCase()}
          </p>
          <div className="flex flex-wrap gap-6 mt-4 text-sm">
            <div>
              <span className="text-gold font-bold text-xl">{totalGames}</span>{" "}
              <span className="text-gray-300">Games</span>
            </div>
            <div>
              <span className="text-gold font-bold text-xl">{totalTeams}</span>{" "}
              <span className="text-gray-300">Teams</span>
            </div>
            <div>
              <span className="text-gold font-bold text-xl">
                {leagueGames}
              </span>{" "}
              <span className="text-gray-300">League</span>
            </div>
            <div>
              <span className="text-gold font-bold text-xl">{nonLeague}</span>{" "}
              <span className="text-gray-300">Non-League</span>
            </div>
            {scrimmages > 0 && (
              <div>
                <span className="text-gold font-bold text-xl">
                  {scrimmages}
                </span>{" "}
                <span className="text-gray-300">Scrimmages</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Client-side interactive schedule */}
      <ScheduleView
        games={JSON.parse(JSON.stringify(games))}
        teams={JSON.parse(JSON.stringify(teams))}
        sport={sport}
        seasonLabel={seasonLabel}
      />
    </div>
  );
}
