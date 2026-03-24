import Link from "next/link";
import dynamic from "next/dynamic";
import PSPPromo from "@/components/ads/PSPPromo";
import { SkeletonCard, SkeletonText } from "@/components/ui/Skeleton";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { getCurrentSeasonLabel } from "@/lib/sports";
import LeagueStandings from "./LeagueStandings";
import StatLeadersSidebar from "./StatLeadersSidebar";
import ContextAwareHero from "./ContextAwareHero";
import WeeklyMatchups from "./WeeklyMatchups";
import PhillyPipeline from "./PhillyPipeline";
import PulseHotTakes from "./PulseHotTakes";
import SummerLeagueSection from "./SummerLeagueSection";
import type { Championship } from "@/lib/data/types";
import type { HubGame } from "./HubScoresStrip";
import BilingualHeader from "@/components/ui/BilingualHeader";
import { baseballSpanish } from "@/lib/i18n/baseball-es";
import { getSchoolDisplayName } from "@/lib/utils/schoolDisplayName";

const PhillyEverywhereSection = dynamic(() => import("@/components/philly-everywhere/PhillyEverywhereSection"), { ssr: false });

interface FeaturedArticle {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  featured_image_url?: string | null;
  published_at?: string | null;
}

interface DataFreshness {
  lastUpdated?: string;
  source?: string;
  lastVerified?: string;
}

interface TeamWithRecords {
  id: number;
  wins: number;
  losses: number;
  ties?: number;
  schools?: { name: string; slug: string } | null;
  seasons?: { label: string } | null;
}

interface TrackedAlumni {
  id: number;
  person_name: string;
  current_level: string;
  current_org: string;
  current_role?: string;
  college?: string;
  pro_team?: string;
  pro_league?: string;
  sport_id: string;
  bio_note?: string;
  schools?: { name: string; slug: string } | null;
}

interface SportLayoutAProps {
  sport: string;
  sportColor: string;
  meta: { name: string; emoji: string; color: string; statCategories: string[] };
  overview: { players: number; schools: number; seasons: number; championships: number };
  champions: Championship[];
  schools: Array<{ name: string; slug: string; city?: string; state?: string; id?: number }>;
  featured: FeaturedArticle[];
  freshness: DataFreshness | null;
  recentGames: HubGame[];
  standings: TeamWithRecords[];
  trackedAlumni: TrackedAlumni[];
}

export default function SportLayoutA({ sport, sportColor, meta, overview, champions, schools, featured, freshness, recentGames, standings, trackedAlumni }: SportLayoutAProps) {
  const topStory = featured?.[0];
  const moreStories = featured?.slice(1) || [];
  const seasonLabel = getCurrentSeasonLabel();

  return (
    <div className="espn-container">
      <ErrorBoundary>
        <main>
        {/* Context-Aware Hero - Game Day vs Off-Season */}
        <ContextAwareHero
          sport={sport}
          sportColor={sportColor}
          metaName={meta.name}
          recentGames={recentGames}
          featuredArticle={topStory || undefined}
          playerCount={overview.players}
          schoolCount={overview.schools}
        />

        {/* This Week's Matchups */}
        {recentGames.length > 0 && (
          <WeeklyMatchups games={recentGames} sport={sport} sportColor={sportColor} />
        )}

        {/* Story Grid (2-column) */}
        {moreStories.length > 0 && (
          <>
            <div className="sec-head">
              {sport === "baseball" ? <BilingualHeader english={`Latest ${meta.name} Stories`} spanish={baseballSpanish["Latest Stories"]} /> : <h2>Latest {meta.name} Stories</h2>}
              <Link href="/articles" className="more" aria-label="View all articles">All Articles &#8594;</Link>
            </div>
            <div className="stories">
              {moreStories.map((article: FeaturedArticle) => (
                <Link key={article.id} href={`/articles/${article.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="story">
                    <div
                      className="s-img"
                      style={{
                        background: article.featured_image_url
                          ? `url(${article.featured_image_url}) center / cover`
                          : `linear-gradient(135deg, ${meta.color}66, var(--psp-navy))`,
                      }}
                    />
                    <div className="s-body">
                      <div className="s-tag" style={{ color: sportColor }}>{meta.name}</div>
                      <h4>{article.title}</h4>
                      <p>{article.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Tonight's Games */}
        {recentGames.length > 0 && (
          <>
            <div className="sec-head">
              <h2>Recent Games</h2>
              <Link href={`/${sport}/teams`} className="more" aria-label={`View full ${meta.name} schedule`}>Full Schedule →</Link>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 10,
              marginBottom: 20,
            }}>
              {recentGames.slice(0, 4).map((game) => (
                <Link key={game.id} href={`/${sport}/games/${game.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{
                    background: "var(--psp-white)",
                    border: "1px solid var(--g100)",
                    borderRadius: 6,
                    padding: "12px 14px",
                    borderLeft: `3px solid ${sportColor}`,
                    cursor: "pointer",
                    transition: "box-shadow 0.2s ease",
                  }}>
                    <div style={{ fontSize: 10, color: sportColor, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>
                      {game.game_date ? new Date(game.game_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Date TBA"}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--psp-navy)", marginBottom: 2 }}>
                      {game.home_school ? getSchoolDisplayName(game.home_school) : "Home"}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--g400)", marginBottom: 2 }}>vs</div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", marginBottom: 6 }}>
                      {game.away_school ? getSchoolDisplayName(game.away_school) : "Away"}
                    </div>
                    {game.home_score !== null && game.away_score !== null ? (
                      <div style={{ fontSize: 14, fontWeight: 800, color: sportColor }}>
                        {game.home_score}-{game.away_score}
                      </div>
                    ) : (
                      <div style={{ fontSize: 11, color: "var(--g400)" }}>Final score pending</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Recent Champions */}
        {champions.length > 0 && (
          <>
            <div className="sec-head">
              {sport === "baseball" ? <BilingualHeader english="Recent Champions" spanish={baseballSpanish["Campeones Recientes"]} /> : <h2>Recent Champions</h2>}
              <Link href={`/${sport}/championships`} className="more" aria-label={`View all ${meta.name} championships`}>All Championships &#8594;</Link>
            </div>
            <div className="rank-table">
              <div className="rt-head">Championship History</div>
              {champions.map((champ: Championship, i: number) => (
                <div key={champ.id} className="rt-row">
                  <div className="rt-num" style={{ background: i < 3 ? sportColor : "var(--g300)" }}>{i + 1}</div>
                  <div className="rt-info">
                    <Link href={`/${sport}/schools/${champ.schools?.slug}`} className="rname" style={{ color: "var(--link)" }}>
                      {champ.schools?.name}
                    </Link>
                    <div className="rsub">{champ.seasons?.label} &mdash; {champ.level}{champ.score ? ` (${champ.score})` : ""}</div>
                  </div>
                  <div className="rt-rec" role="img" aria-label="Champion">🏆</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Philly Everywhere */}
        <PhillyEverywhereSection sport={sport} alumni={trackedAlumni} />

        {/* The Pulse - Community Feed (DB-connected with fallback) */}
        <div className="sec-head">
          <h2 style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: sportColor }}>●</span> The Pulse
          </h2>
          <Link href="/potw" className="more" aria-label="Vote for Player of the Week">Player of the Week →</Link>
        </div>
        <PulseHotTakes sport={sport} />

        {/* League Standings - Using New Component */}
        {standings.length > 0 && (
          <>
            <div className="sec-head">
              {sport === "baseball" ? <BilingualHeader english="League Standings" spanish={baseballSpanish["League Standings"]} /> : <h2>League Standings</h2>}
              <Link href={`/${sport}/teams`} className="more" aria-label={`View full ${meta.name} league standings`}>Full Standings →</Link>
            </div>
            <LeagueStandings
              standings={standings}
              sport={sport}
              sportColor={sportColor}
              metaName={meta.name}
            />
          </>
        )}

        {/* Summer League Section - Baseball Only */}
        {sport === "baseball" && <SummerLeagueSection />}

        {/* Quick Nav Cards */}
        <div className="sec-head">{sport === "baseball" ? <BilingualHeader english={`Explore ${meta.name}`} spanish={baseballSpanish["Explore Baseball"]} /> : <h2>Explore {meta.name}</h2>}</div>
        <div className="ldr-grid">
          <Link href={`/${sport}/leaderboards/${meta.statCategories[0]}`} className="ldr-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ldr-head" style={{ background: sportColor }}>Leaderboards</div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }} aria-hidden="true">📊</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Top performers by stat</div>
              <div style={{ fontSize: 11, color: "var(--g400)" }}>{meta.statCategories.join(", ")}</div>
            </div>
          </Link>
          <Link href={`/${sport}/records`} className="ldr-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ldr-head" style={{ background: sportColor }}>Records</div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }} aria-hidden="true">🏅</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>All-time records</div>
              <div style={{ fontSize: 11, color: "var(--g400)" }}>Single-season and career milestones</div>
            </div>
          </Link>
          <Link href={`/${sport}/championships`} className="ldr-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ldr-head" style={{ background: sportColor }}>Championships</div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }} role="img" aria-label="Trophy">🏆</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Title history</div>
              <div style={{ fontSize: 11, color: "var(--g400)" }}>League, state, and national titles</div>
            </div>
          </Link>
          <Link href={`/${sport}/schedule`} className="ldr-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ldr-head" style={{ background: "var(--psp-gold)" }}>{seasonLabel} Schedule</div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }} aria-hidden="true">📅</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Upcoming games</div>
              <div style={{ fontSize: 11, color: "var(--g400)" }}>Week-by-week or filter by team</div>
            </div>
          </Link>
          <Link href={`/${sport}/awards`} className="ldr-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ldr-head" style={{ background: sportColor }}>Awards & Honors</div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🌟</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Honor rolls</div>
              <div style={{ fontSize: 11, color: "var(--g400)" }}>All-City and All-Scholastic selections</div>
            </div>
          </Link>
          <Link href={`/${sport}/rivalries`} className="ldr-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ldr-head" style={{ background: sportColor }}>Rivalries</div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }} aria-hidden="true">🔥</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Head-to-head records</div>
              <div style={{ fontSize: 11, color: "var(--g400)" }}>Historic matchups & series</div>
            </div>
          </Link>
          <Link href={`/${sport}/eras`} className="ldr-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ldr-head" style={{ background: "var(--psp-blue)" }}>Statistical Eras</div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }} aria-hidden="true">📊</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>How the game changed</div>
              <div style={{ fontSize: 11, color: "var(--g400)" }}>Stats trends across decades</div>
            </div>
          </Link>
          <Link href={`/${sport}/breakouts`} className="ldr-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ldr-head" style={{ background: "var(--psp-gold)" }}>Breakout Alerts</div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }} aria-hidden="true">⚡</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Rising stars</div>
              <div style={{ fontSize: 11, color: "var(--g400)" }}>Year-over-year stat jumps</div>
            </div>
          </Link>
        </div>

        {/* Schools */}
        {schools.length > 0 && (
          <>
            <div className="sec-head"><h2>Schools</h2></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
              {schools.map((school) => (
                <Link
                  key={school.id}
                  href={`/${sport}/schools/${school.slug}`}
                  style={{
                    display: "inline-block",
                    padding: "5px 12px",
                    background: "#fff",
                    border: "1px solid var(--g100)",
                    borderRadius: 3,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--text)",
                    textDecoration: "none",
                  }}
                >
                  {school.name}
                </Link>
              ))}
            </div>
          </>
        )}
        </main>
      </ErrorBoundary>

      {/* Sidebar */}
      <ErrorBoundary>
        <aside className="sidebar">
        {freshness && (
          <div style={{ padding: "8px 12px", background: "#f3f4f6", borderLeft: "3px solid var(--psp-gold)", marginBottom: 16, borderRadius: 3 }}>
            <div style={{ fontSize: 10, color: "var(--psp-gray-400)", fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>
              {freshness.source ? `Data source: ${freshness.source}` : "Data updated"}
            </div>
          </div>
        )}

        <div className="widget">
          <div className="w-head">{meta.emoji} Quick Stats</div>
          <div className="w-body">
            {overview.players > 0 && <div className="w-row"><span className="name">Players</span><span className="val">{overview.players.toLocaleString()}</span></div>}
            {overview.schools > 0 && <div className="w-row"><span className="name">Schools</span><span className="val">{overview.schools.toLocaleString()}</span></div>}
            {overview.seasons > 0 && <div className="w-row"><span className="name">Seasons</span><span className="val">{overview.seasons.toLocaleString()}</span></div>}
            {overview.championships > 0 && <div className="w-row"><span className="name">Championships</span><span className="val">{overview.championships.toLocaleString()}</span></div>}
            {overview.players === 0 && overview.schools === 0 && <div className="w-row"><span className="name" style={{ color: "var(--psp-gray-400)" }}>Season data coming soon</span></div>}
          </div>
        </div>

        {/* Stat Leaders Sidebar Widget */}
        <StatLeadersSidebar
          sport={sport}
          sportColor={sportColor}
          statCategories={[]}
        />

        {/* Philly Pipeline - Recruits + Our Guys */}
        <PhillyPipeline sport={sport} sportColor={sportColor} />

        <div className="widget">
          <div className="w-head">{meta.emoji} Tools</div>
          <div className="w-body">
            <Link href={`/${sport}/leaderboards/${meta.statCategories[0]}`} className="w-link">&#8594; Leaderboards</Link>
            <Link href={`/${sport}/championships`} className="w-link">&#8594; Championship History</Link>
            <Link href={`/${sport}/records`} className="w-link">&#8594; Records</Link>
            <Link href={`/${sport}/awards`} className="w-link">&#8594; Awards & Honors</Link>
            <Link href={`/${sport}/rivalries`} className="w-link">&#8594; Rivalries</Link>
            <Link href={`/${sport}/eras`} className="w-link">&#8594; Statistical Eras</Link>
            <Link href={`/${sport}/breakouts`} className="w-link">&#8594; Breakout Alerts</Link>
            <Link href={`/${sport}/schedule`} className="w-link">&#8594; {seasonLabel} Schedule</Link>
            <Link href={`/search?sport=${sport}`} className="w-link">&#8594; Player Search</Link>
            <Link href="/compare" className="w-link">&#8594; Compare Players</Link>
          </div>
        </div>

        <PSPPromo size="sidebar" variant={1} />
        <PSPPromo size="sidebar" variant={2} />
        </aside>
      </ErrorBoundary>
    </div>
  );
}
