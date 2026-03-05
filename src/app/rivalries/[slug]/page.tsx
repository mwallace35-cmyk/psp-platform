import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getRivalryBySlug,
  getRivalryRecord,
  getRivalryGames,
  getRivalryNotes,
  getRivalryTopPlayers,
  getRivalryChampionships,
  SPORT_META,
} from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import RivalryTimeline from "./RivalryTimeline";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageParams = { slug: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug } = await params;
  const rivalry = await getRivalryBySlug(slug);
  if (!rivalry) return {};
  return {
    title: `${rivalry.display_name} Rivalry — PhillySportsPack`,
    description: rivalry.subtitle
      ? `${rivalry.subtitle} — Head-to-head history, game records, and legendary matchups between ${rivalry.school_a?.name} and ${rivalry.school_b?.name}.`
      : `Rivalry history, game records, and stats between ${rivalry.school_a?.name} and ${rivalry.school_b?.name}. ${rivalry.sport_id ? "Philadelphia " + (SPORT_META as any)[rivalry.sport_id]?.name : "High school sports"}.`,
  };
}

export default async function RivalryPage({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const rivalry = await getRivalryBySlug(slug);

  if (!rivalry) {
    notFound();
  }

  // Fetch all related data in parallel
  const [record, games, notes, playersA, playersB, champsA, champsB] = await Promise.all([
    getRivalryRecord(rivalry.id),
    getRivalryGames(rivalry.school_a_id, rivalry.school_b_id, rivalry.sport_id),
    getRivalryNotes(rivalry.id),
    getRivalryTopPlayers(rivalry.school_a_id, rivalry.sport_id, 5),
    getRivalryTopPlayers(rivalry.school_b_id, rivalry.sport_id, 5),
    getRivalryChampionships(rivalry.school_a_id, rivalry.sport_id),
    getRivalryChampionships(rivalry.school_b_id, rivalry.sport_id),
  ]);

  const sportMeta = (SPORT_META as any)[rivalry.sport_id] || { name: rivalry.sport_id, emoji: "🏅", color: "#666" };

  // Separate notes by type
  const notableGames = notes.filter((n: any) => n.note_type === "notable_game");
  const historyNotes = notes.filter((n: any) => n.note_type === "history");

  // Calculate records
  const schoolAWins = games.filter((g: any) => {
    const aWon = g.home_school?.id === rivalry.school_a_id
      ? (g.home_score ?? 0) > (g.away_score ?? 0)
      : (g.away_score ?? 0) > (g.home_score ?? 0);
    return aWon;
  }).length;

  const schoolBWins = games.filter((g: any) => {
    const bWon = g.home_school?.id === rivalry.school_b_id
      ? (g.home_score ?? 0) > (g.away_score ?? 0)
      : (g.away_score ?? 0) > (g.home_score ?? 0);
    return bWon;
  }).length;

  const ties = games.filter((g: any) => g.home_score === g.away_score).length;

  return (
    <main className="min-h-screen bg-navy">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: "Rivalries", href: "/rivalries" }, { label: rivalry.display_name }]}
          className="mb-8"
        />

        {/* Hero Section - Split Screen */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-lg overflow-hidden border-4 border-gold shadow-2xl">
            {/* School A - Left */}
            <div className="bg-gradient-to-br from-navy-mid to-navy p-8 flex flex-col justify-between min-h-[300px] relative">
              {/* School A Logo */}
              {rivalry.school_a?.logo_url && (
                <div className="flex justify-center mb-4">
                  <img
                    src={rivalry.school_a.logo_url}
                    alt={rivalry.school_a.name}
                    className="w-20 h-20 object-contain opacity-80"
                  />
                </div>
              )}

              <div className="space-y-4 text-center flex-1 flex flex-col justify-center">
                <div>
                  <h2 className="text-3xl font-bold font-bebas text-white mb-2">
                    {rivalry.school_a?.name}
                  </h2>
                  {rivalry.school_a?.city && (
                    <p className="text-sm text-gray-400">{rivalry.school_a.city}, {rivalry.school_a?.league?.name || "PA"}</p>
                  )}
                </div>

                {/* Record for School A */}
                <div className="flex justify-center gap-3 text-sm">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-gold">{schoolAWins}</div>
                    <div className="text-xs text-gray-400">Wins</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-gray-400">{schoolBWins}</div>
                    <div className="text-xs text-gray-400">Losses</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-gray-500">{ties}</div>
                    <div className="text-xs text-gray-400">Ties</div>
                  </div>
                </div>
              </div>

              {/* Accent line */}
              <div className="absolute bottom-0 right-0 h-1 w-full bg-gradient-to-r from-transparent to-gold" />
            </div>

            {/* Center - VS Divider */}
            <div className="relative hidden md:flex items-center justify-center bg-navy border-l-4 border-r-4 border-gold">
              <div className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent pointer-events-none" />
              <div className="space-y-2 text-center z-10">
                <div className="text-5xl font-black font-bebas text-gold">VS</div>
                {sportMeta && (
                  <div className="flex items-center justify-center gap-2 text-white">
                    <span className="text-2xl">{sportMeta.emoji}</span>
                    <span className="text-sm font-semibold">{sportMeta.name}</span>
                  </div>
                )}
                {rivalry.display_name && (
                  <div className="text-xs text-gray-400 mt-4 max-w-sm">{rivalry.display_name}</div>
                )}
              </div>
            </div>

            {/* School B - Right */}
            <div className="bg-gradient-to-bl from-navy-mid to-navy p-8 flex flex-col justify-between min-h-[300px] relative">
              {/* School B Logo */}
              {rivalry.school_b?.logo_url && (
                <div className="flex justify-center mb-4">
                  <img
                    src={rivalry.school_b.logo_url}
                    alt={rivalry.school_b.name}
                    className="w-20 h-20 object-contain opacity-80"
                  />
                </div>
              )}

              <div className="space-y-4 text-center flex-1 flex flex-col justify-center">
                <div>
                  <h2 className="text-3xl font-bold font-bebas text-white mb-2">
                    {rivalry.school_b?.name}
                  </h2>
                  {rivalry.school_b?.city && (
                    <p className="text-sm text-gray-400">{rivalry.school_b.city}, {rivalry.school_b?.league?.name || "PA"}</p>
                  )}
                </div>

                {/* Record for School B */}
                <div className="flex justify-center gap-3 text-sm">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-gold">{schoolBWins}</div>
                    <div className="text-xs text-gray-400">Wins</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-gray-400">{schoolAWins}</div>
                    <div className="text-xs text-gray-400">Losses</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-gray-500">{ties}</div>
                    <div className="text-xs text-gray-400">Ties</div>
                  </div>
                </div>
              </div>

              {/* Accent line */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-l from-transparent to-gold" />
            </div>
          </div>

          {/* Mobile VS Section */}
          <div className="md:hidden mt-6 text-center space-y-2">
            <div className="text-3xl font-bold font-bebas text-gold">VS</div>
            {sportMeta && (
              <div className="flex items-center justify-center gap-2 text-white">
                <span className="text-2xl">{sportMeta.emoji}</span>
                <span className="text-sm font-semibold">{sportMeta.name}</span>
              </div>
            )}
          </div>
        </section>

        {/* All-Time Record Stats */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold font-bebas text-white mb-6">All-Time Record</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-navy-mid rounded-lg p-6 text-center border border-navy-mid hover:border-gold transition-colors duration-200">
              <div className="text-4xl font-bold text-gold mb-2">{schoolAWins}</div>
              <div className="text-sm text-gray-400">{rivalry.school_a?.short_name || rivalry.school_a?.name} Wins</div>
            </div>
            <div className="bg-navy-mid rounded-lg p-6 text-center border border-navy-mid hover:border-gold transition-colors duration-200">
              <div className="text-4xl font-bold text-gold mb-2">{schoolBWins}</div>
              <div className="text-sm text-gray-400">{rivalry.school_b?.short_name || rivalry.school_b?.name} Wins</div>
            </div>
            <div className="bg-navy-mid rounded-lg p-6 text-center border border-navy-mid hover:border-gold transition-colors duration-200">
              <div className="text-4xl font-bold text-gold mb-2">{ties}</div>
              <div className="text-sm text-gray-400">Ties</div>
            </div>
            <div className="bg-navy-mid rounded-lg p-6 text-center border border-navy-mid hover:border-gold transition-colors duration-200">
              <div className="text-4xl font-bold text-gold mb-2">{games.length}</div>
              <div className="text-sm text-gray-400">Total Games</div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Head-to-Head Timeline */}
            {games.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold font-bebas text-white mb-6">Head-to-Head</h2>
                <RivalryTimeline
                  games={games}
                  schoolAId={rivalry.school_a_id}
                  schoolBId={rivalry.school_b_id}
                  sportId={rivalry.sport_id}
                />
              </section>
            )}

            {/* Player Matchups */}
            {(playersA.length > 0 || playersB.length > 0) && (
              <section>
                <h2 className="text-2xl font-bold font-bebas text-white mb-6">Top Players</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* School A Players */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white mb-4">{rivalry.school_a?.name}</h3>
                    {playersA.length > 0 ? (
                      playersA.map((player: any, idx: number) => (
                        <Link
                          key={idx}
                          href={`/${rivalry.sport_id}/players/${player.player_slug || "unknown"}`}
                        >
                          <div className="bg-navy-mid rounded-lg p-4 border border-navy-mid hover:border-gold transition-colors duration-200 group">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-semibold text-white group-hover:text-gold transition-colors">
                                {player.player_name || "Unknown"}
                              </div>
                              <div className="text-xs text-gray-400">#{player.career_games || 0} games</div>
                            </div>
                            <div className="text-xs text-gray-400">
                              {rivalry.sport_id === "football" && (
                                <div>
                                  {player.career_rush_yards || 0} rush yds · {player.career_pass_yards || 0} pass yds · {player.career_rec_yards || 0} rec yds
                                </div>
                              )}
                              {rivalry.sport_id === "basketball" && (
                                <div>
                                  {player.career_points || 0} points · {player.career_ppg?.toFixed(1) || 0} PPG
                                </div>
                              )}
                              {rivalry.sport_id === "baseball" && (
                                <div>
                                  Career stats available
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">No player data available</div>
                    )}
                  </div>

                  {/* School B Players */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white mb-4">{rivalry.school_b?.name}</h3>
                    {playersB.length > 0 ? (
                      playersB.map((player: any, idx: number) => (
                        <Link
                          key={idx}
                          href={`/${rivalry.sport_id}/players/${player.player_slug || "unknown"}`}
                        >
                          <div className="bg-navy-mid rounded-lg p-4 border border-navy-mid hover:border-gold transition-colors duration-200 group">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-semibold text-white group-hover:text-gold transition-colors">
                                {player.player_name || "Unknown"}
                              </div>
                              <div className="text-xs text-gray-400">#{player.career_games || 0} games</div>
                            </div>
                            <div className="text-xs text-gray-400">
                              {rivalry.sport_id === "football" && (
                                <div>
                                  {player.career_rush_yards || 0} rush yds · {player.career_pass_yards || 0} pass yds · {player.career_rec_yards || 0} rec yds
                                </div>
                              )}
                              {rivalry.sport_id === "basketball" && (
                                <div>
                                  {player.career_points || 0} points · {player.career_ppg?.toFixed(1) || 0} PPG
                                </div>
                              )}
                              {rivalry.sport_id === "baseball" && (
                                <div>
                                  Career stats available
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">No player data available</div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Championships */}
            {(champsA.length > 0 || champsB.length > 0) && (
              <section>
                <h2 className="text-2xl font-bold font-bebas text-white mb-6">Championships</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* School A Championships */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white mb-4">
                      {rivalry.school_a?.name} ({champsA.length})
                    </h3>
                    {champsA.length > 0 ? (
                      champsA.map((champ: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-navy-mid rounded-lg p-3 border border-navy-mid hover:border-gold transition-colors duration-200"
                        >
                          <div>
                            <div className="font-semibold text-white">{champ.seasons?.label}</div>
                            <div className="text-xs text-gray-400">{champ.championship_level || "Title"}</div>
                          </div>
                          {champ.level === "state" && <span className="text-xl">🏆</span>}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">No championships</div>
                    )}
                  </div>

                  {/* School B Championships */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white mb-4">
                      {rivalry.school_b?.name} ({champsB.length})
                    </h3>
                    {champsB.length > 0 ? (
                      champsB.map((champ: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-navy-mid rounded-lg p-3 border border-navy-mid hover:border-gold transition-colors duration-200"
                        >
                          <div>
                            <div className="font-semibold text-white">{champ.seasons?.label}</div>
                            <div className="text-xs text-gray-400">{champ.championship_level || "Title"}</div>
                          </div>
                          {champ.level === "state" && <span className="text-xl">🏆</span>}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">No championships</div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* History Notes */}
            {historyNotes.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold font-bebas text-white mb-6">Rivalry History</h2>
                <div className="space-y-4">
                  {historyNotes.map((note: any, idx: number) => (
                    <div key={idx} className="bg-navy-mid rounded-lg p-6 border border-navy-mid">
                      {note.title && <h3 className="text-lg font-bold text-white mb-2">{note.title}</h3>}
                      <p className="text-gray-300 leading-relaxed">{note.description || note.content}</p>
                      {note.year && (
                        <div className="text-xs text-gray-500 mt-3">{note.year}</div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Facts */}
            <div className="bg-navy-mid rounded-lg p-6 border border-navy-mid space-y-4">
              <h3 className="text-lg font-bold text-white">Quick Facts</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Sport</div>
                  <div className="text-white font-semibold flex items-center gap-2">
                    {sportMeta.emoji} {sportMeta.name}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Total Games</div>
                  <div className="text-white font-semibold">{games.length}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Head-to-Head Record</div>
                  <div className="text-white font-semibold">
                    {rivalry.school_a?.short_name || rivalry.school_a?.name}: {schoolAWins}-{schoolBWins}
                    {ties > 0 && `-${ties}`}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">School A Wins</div>
                  <div className="text-gold font-bold">{((schoolAWins / (games.length || 1)) * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">School B Wins</div>
                  <div className="text-gold font-bold">{((schoolBWins / (games.length || 1)) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>

            {/* School Links */}
            <div className="bg-navy-mid rounded-lg p-6 border border-navy-mid space-y-3">
              <h3 className="text-lg font-bold text-white mb-4">Visit Schools</h3>
              <Link href={`/schools/${rivalry.school_a?.slug}`}>
                <button className="w-full bg-navy border border-navy-mid hover:border-gold text-white font-semibold py-2 rounded-lg transition-colors duration-200">
                  {rivalry.school_a?.name}
                </button>
              </Link>
              <Link href={`/schools/${rivalry.school_b?.slug}`}>
                <button className="w-full bg-navy border border-navy-mid hover:border-gold text-white font-semibold py-2 rounded-lg transition-colors duration-200">
                  {rivalry.school_b?.name}
                </button>
              </Link>
            </div>

            {/* Promo */}
            <PSPPromo size="sidebar" variant={Math.floor(Math.random() * 5)} />
          </aside>
        </div>
      </div>
    </main>
  );
}
