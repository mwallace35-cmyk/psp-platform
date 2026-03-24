import Link from "next/link";
import { createStaticClient } from "@/lib/supabase/static";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";

export const revalidate = 300; // ISR: 5 minutes
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Pick'em | PhillySportsPack.com",
  description: "Play pick'em predictions on Philadelphia high school sports games. Pick winners and compete with other fans.",
  metadataBase: new URL("https://phillysportspack.com"),
  alternates: { canonical: "https://phillysportspack.com/pickem" },
  openGraph: {
    title: "Pick'em | PhillySportsPack.com",
    description: "Play pick'em predictions on Philadelphia high school sports games.",
    url: "https://phillysportspack.com/pickem",
    type: "website",
    images: [{ url: "https://phillysportspack.com/og-default.png", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

interface Game {
  id: number;
  home_school_id: number;
  away_school_id: number;
  game_date: string;
  final_home_score?: number;
  final_away_score?: number;
  schools?: {
    home: { id: number; name: string; slug: string };
    away: { id: number; name: string; slug: string };
  };
}

interface PickemWeek {
  id: number;
  sport_id: string;
  week_number: number;
  title: string;
  is_open: boolean;
  starts_at: string;
}

export default async function PickemPage() {
  const supabase = createStaticClient();

  // Fetch current/latest week
  const { data: weeksData } = await supabase
    .from("pickem_weeks")
    .select("*")
    .order("starts_at", { ascending: false })
    .limit(1);

  const currentWeek = (weeksData || []).at(0) as PickemWeek | undefined;

  // Fetch games for current week
  let games: Game[] = [];
  if (currentWeek) {
    const { data: gamesData } = await supabase
      .from("pickem_games")
      .select(`
        *,
        schools:home_school_id(id, name, slug),
        away:away_school_id(id, name, slug)
      `)
      .eq("week_id", currentWeek.id)
      .order("game_date");

    games = (gamesData || []) as Game[];
  }

  // Fetch leaderboard
  const { data: leaderboard } = await supabase
    .from("pickem_picks")
    .select("user_id")
    .limit(10);

  return (
    <>
      {/* Header */}
      <section
        className="py-12 md:py-16"
        style={{ background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 60%, #3b82f620 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: "Pick'em" }]} />

          <div className="flex items-start gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
              style={{ background: "rgba(59,130,246,0.2)" }}
            >
              🎯
            </div>
            <div className="flex-1">
              <h1
                className="text-4xl md:text-5xl text-white tracking-wider mb-2"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                Pick'em
              </h1>
              <p className="text-gray-300 mb-4">Predict winners and compete with other fans</p>
            </div>
          </div>
        </div>
      </section>

      <PSPPromo size="banner" variant={1} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-8">
            {!currentWeek ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center" style={{ color: "var(--psp-gray-500)" }}>
                <p className="text-lg">No pick'em week available right now.</p>
                <p className="text-sm">Check back soon for the next week!</p>
              </div>
            ) : (
              <>
                {/* Week Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2
                        className="text-3xl font-bold mb-2"
                        style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}
                      >
                        {currentWeek.title}
                      </h2>
                      <p style={{ color: "var(--psp-gray-500)" }}>
                        {currentWeek.sport_id} • Week {currentWeek.week_number}
                        {currentWeek.is_open ? (
                          <span className="ml-3 px-3 py-1 rounded text-sm bg-green-100 text-green-900 font-semibold">
                            Voting Open
                          </span>
                        ) : (
                          <span className="ml-3 px-3 py-1 rounded text-sm bg-gray-100 text-gray-900 font-semibold">
                            Voting Closed
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Games Grid */}
                {games.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center" style={{ color: "var(--psp-gray-500)" }}>
                    No games scheduled for this week yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {games.map((game) => (
                      <div
                        key={game.id}
                        className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="space-y-3">
                          {/* Home Team */}
                          <button
                            className="w-full p-3 rounded-lg border-2 border-transparent hover:border-blue-400 transition-colors text-left"
                            style={{ background: "rgba(59,130,246,0.05)" }}
                          >
                            <p className="font-semibold" style={{ color: "var(--psp-navy)" }}>
                              {game.schools?.home?.name || "Home Team"}
                            </p>
                            {game.final_home_score !== undefined && (
                              <p className="text-sm mt-1" style={{ color: "var(--psp-gold)" }}>
                                Final: {game.final_home_score}
                              </p>
                            )}
                          </button>

                          <div className="text-center text-sm" style={{ color: "var(--psp-gray-500)" }}>
                            VS
                          </div>

                          {/* Away Team */}
                          <button
                            className="w-full p-3 rounded-lg border-2 border-transparent hover:border-blue-400 transition-colors text-left"
                            style={{ background: "rgba(59,130,246,0.05)" }}
                          >
                            <p className="font-semibold" style={{ color: "var(--psp-navy)" }}>
                              {game.schools?.away?.name || "Away Team"}
                            </p>
                            {game.final_away_score !== undefined && (
                              <p className="text-sm mt-1" style={{ color: "var(--psp-gold)" }}>
                                Final: {game.final_away_score}
                              </p>
                            )}
                          </button>
                        </div>

                        <p className="text-xs mt-3" style={{ color: "var(--psp-gray-500)" }}>
                          {new Date(game.game_date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Login CTA */}
                {!currentWeek?.is_open && (
                  <div
                    className="bg-blue-50 rounded-lg p-6 text-center border border-blue-200"
                    style={{ color: "var(--psp-navy)" }}
                  >
                    <p className="font-semibold mb-3">Voting for this week is closed.</p>
                    <p className="text-sm mb-4">Check back next week to make your picks!</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                Leaderboard
              </h3>
              {leaderboard && leaderboard.length > 0 ? (
                <ol className="space-y-3">
                  {leaderboard.slice(0, 10).map((entry: any, idx: number) => (
                    <li key={idx} className="flex items-center justify-between text-sm">
                      <span className="font-semibold">{idx + 1}. User {entry.user_id}</span>
                      <span style={{ color: "var(--psp-gold)" }} className="font-medium">
                        {entry.correct_picks}/{entry.pick_count}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
                  No picks yet this week.
                </p>
              )}
            </div>

            {/* How to Play */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                How to Play
              </h3>
              <ol className="space-y-2 text-sm" style={{ color: "var(--psp-gray-600)" }}>
                <li>
                  <strong>1. Pick Winners:</strong> Click on the team you think will win each game
                </li>
                <li>
                  <strong>2. Submit Picks:</strong> Lock in your selections before games start
                </li>
                <li>
                  <strong>3. Compete:</strong> Compare your score with other pickers
                </li>
              </ol>
              <p className="text-xs mt-4" style={{ color: "var(--psp-gray-500)" }}>
                Your picks appear on the leaderboard as you make them. Final scores are updated after games complete.
              </p>
            </div>

            <PSPPromo size="sidebar" variant={2} />
          </div>
        </div>
      </div>
    </>
  );
}
