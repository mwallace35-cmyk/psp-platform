import Link from "next/link";
import dynamic from "next/dynamic";
import PSPPromo from "@/components/ads/PSPPromo";
import type { Championship } from "@/lib/data/types";
import type { HubGame } from "./HubScoresStrip";
import { getSchoolDisplayName } from "@/lib/utils/schoolDisplayName";

const PhillyEverywhereSection = dynamic(() => import("@/components/philly-everywhere/PhillyEverywhereSection"), { ssr: false });

interface FeaturedArticle {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  featured_image_url?: string | null;
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

interface SportLayoutBProps {
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

export default function SportLayoutB({ sport, sportColor, meta, overview, champions, schools, featured, freshness, recentGames, standings, trackedAlumni }: SportLayoutBProps) {
  return (
    <div className="espn-container">
      <main>
        {/* Stat Cards Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            { label: "Players", value: overview.players, icon: "👤" },
            { label: "Schools", value: overview.schools, icon: "🏫" },
            { label: "Seasons", value: overview.seasons, icon: "📅" },
            { label: "Championships", value: overview.championships, icon: "🏆" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "var(--psp-white)",
                border: "1px solid var(--g100)",
                borderRadius: 6,
                padding: "16px 14px",
                textAlign: "center",
                borderTop: `3px solid ${sportColor}`,
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "var(--psp-navy)",
                  fontFamily: '"Bebas Neue", sans-serif',
                  lineHeight: 1,
                }}
              >
                {stat.value.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: "var(--g400)", fontWeight: 600, marginTop: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Games */}
        {recentGames.length > 0 && (
          <>
            <div className="sec-head">
              <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>🏆</span> Recent Matchups
              </h2>
              <Link href={`/${sport}/teams`} className="more">Full Schedule →</Link>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
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
                    borderTop: `3px solid ${sportColor}`,
                    cursor: "pointer",
                    transition: "box-shadow 0.2s ease",
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--psp-navy)", marginBottom: 4 }}>
                      {game.home_school ? getSchoolDisplayName(game.home_school) : "Home"}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--g400)", marginBottom: 2 }}>
                      vs {game.away_school ? getSchoolDisplayName(game.away_school) : "Away"}
                    </div>
                    {game.home_score !== null && game.away_score !== null ? (
                      <div style={{ fontSize: 16, fontWeight: 800, color: sportColor }}>
                        {game.home_score}-{game.away_score}
                      </div>
                    ) : (
                      <div style={{ fontSize: 11, color: "var(--g400)" }}>Final pending</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Philly Everywhere */}
        <PhillyEverywhereSection sport={sport} alumni={trackedAlumni} />

        {/* The Pulse - Community Feed */}
        <div className="sec-head">
          <h2 style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: sportColor }}>●</span> The Pulse
          </h2>
          <Link href="/potw" className="more">Player of the Week →</Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {[
            { user: "CoachK_Philly", text: `Big matchup tonight — ${sport === "football" ? "Prep vs La Salle" : sport === "basketball" ? "Neumann vs Roman" : "La Salle vs Prep"} will set the tone for the league.`, time: "2h ago", type: "hot_take" },
            { user: "PhillyHoopsScout", text: "Just left practice — keep an eye on the freshman class this year. Philly is LOADED.", time: "4h ago", type: "insider" },
            { user: "PSP_Community", text: `Who's your pick for ${meta.name} Player of the Week? Cast your vote now!`, time: "6h ago", type: "poll" },
          ].map((item, i) => (
            <div key={i} style={{
              background: "var(--psp-white)",
              border: "1px solid var(--g100)",
              borderRadius: 6,
              padding: "12px 14px",
              display: "flex",
              gap: 10,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: item.type === "hot_take" ? "#fef3c7" : item.type === "insider" ? "#dbeafe" : "#f3e8ff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, flexShrink: 0,
              }}>
                {item.type === "hot_take" ? "🔥" : item.type === "insider" ? "👀" : "📊"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 12, color: "var(--psp-navy)" }}>@{item.user}</span>
                  <span style={{ fontSize: 10, color: "var(--g400)" }}>{item.time}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.5 }}>{item.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Leaders Preview Section */}
        <div className="sec-head">
          <h2>Stat Leaders</h2>
          <Link href={`/${sport}/leaderboards/${meta.statCategories[0]}`} className="more">Full Leaderboards &#8594;</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 20 }}>
          {meta.statCategories.slice(0, 4).map((cat) => (
            <Link
              key={cat}
              href={`/${sport}/leaderboards/${cat}`}
              className="ldr-card"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="ldr-head" style={{ background: sportColor }}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                  Top {cat} performers
                </div>
                <div style={{ fontSize: 11, color: "var(--g400)" }}>
                  View all {cat} leaders &#8594;
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Schools Directory (Sortable Table Style) */}
        {schools.length > 0 && (
          <>
            <div className="sec-head">
              <h2>Schools Directory</h2>
              <Link href={`/${sport}/teams`} className="more">All Teams &#8594;</Link>
            </div>
            <div className="rank-table">
              <div className="rt-head">
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <span>Schools Playing {meta.name}</span>
                  <span style={{ fontSize: 10, color: "var(--psp-gold)" }}>{schools.length} teams</span>
                </div>
              </div>
              {schools.slice(0, 15).map((school, i: number) => (
                <div key={school.id} className="rt-row">
                  <div className="rt-num" style={{ background: i < 3 ? sportColor : "var(--g300)" }}>{i + 1}</div>
                  <div className="rt-info">
                    <Link href={`/${sport}/schools/${school.slug}`} className="rname" style={{ color: "var(--link)" }}>
                      {school.name}
                    </Link>
                    <div className="rsub">{school.city || "Philadelphia"}, {school.state || "PA"}</div>
                  </div>
                </div>
              ))}
              {schools.length > 15 && (
                <div style={{ padding: "10px 14px", textAlign: "center" }}>
                  <Link href={`/${sport}/teams`} style={{ fontSize: 12, fontWeight: 600, color: "var(--link)" }}>
                    View all {schools.length} schools &#8594;
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        {/* Championship Dynasty Tracker */}
        {champions.length > 0 && (
          <>
            <div className="sec-head">
              <h2>Championship History</h2>
              <Link href={`/${sport}/championships`} className="more">All Championships &#8594;</Link>
            </div>
            <div className="rank-table">
              <div className="rt-head">Recent Titles</div>
              {champions.map((champ, i: number) => (
                <div key={champ.id} className="rt-row">
                  <div className="rt-num" style={{ background: i < 3 ? sportColor : "var(--g300)" }}>{i + 1}</div>
                  <div className="rt-info">
                    <Link href={`/${sport}/schools/${champ.schools?.slug}`} className="rname" style={{ color: "var(--link)" }}>
                      {champ.schools?.name}
                    </Link>
                    <div className="rsub">{champ.seasons?.label} &mdash; {champ.level}{champ.score ? ` (${champ.score})` : ""}</div>
                  </div>
                  <div className="rt-rec">🏆</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Featured Stories (compact) */}
        {featured && featured.length > 0 && (
          <>
            <div className="sec-head">
              <h2>Latest News</h2>
              <Link href="/articles" className="more">All Articles &#8594;</Link>
            </div>
            <div className="headline-list">
              {featured.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="hl-item">
                    <div
                      className="hl-img"
                      style={{
                        background: article.featured_image_url
                          ? `url(${article.featured_image_url}) center / cover`
                          : `linear-gradient(135deg, ${meta.color}66, var(--psp-navy))`,
                      }}
                    />
                    <div className="hl-text">
                      <div className="hl-tag" style={{ color: sportColor }}>{meta.name}</div>
                      <h3>{article.title}</h3>
                      <p>{article.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Sidebar */}
      <aside className="sidebar">
        {freshness && (
          <div style={{ padding: "8px 12px", background: "#f3f4f6", borderLeft: "3px solid var(--psp-gold)", marginBottom: 16, borderRadius: 3 }}>
            <div style={{ fontSize: 10, color: "var(--psp-gray-400)", fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>
              {freshness.source ? `Data source: ${freshness.source}` : "Data updated"}
            </div>
          </div>
        )}

        <div className="widget">
          <div className="w-head">📊 Data Overview</div>
          <div className="w-body">
            <div className="w-row"><span className="name">Total Players</span><span className="val">{overview.players.toLocaleString()}</span></div>
            <div className="w-row"><span className="name">Active Schools</span><span className="val">{overview.schools.toLocaleString()}</span></div>
            <div className="w-row"><span className="name">Seasons Tracked</span><span className="val">{overview.seasons.toLocaleString()}</span></div>
            <div className="w-row"><span className="name">Total Titles</span><span className="val">{overview.championships.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="widget">
          <div className="w-head">{meta.emoji} Quick Links</div>
          <div className="w-body">
            <Link href={`/${sport}/leaderboards/${meta.statCategories[0]}`} className="w-link">&#8594; Leaderboards</Link>
            <Link href={`/${sport}/championships`} className="w-link">&#8594; Championship History</Link>
            <Link href={`/${sport}/records`} className="w-link">&#8594; Records</Link>
            <Link href={`/search?sport=${sport}`} className="w-link">&#8594; Player Search</Link>
            <Link href="/compare" className="w-link">&#8594; Compare Players</Link>
          </div>
        </div>

        <PSPPromo size="sidebar" variant={1} />
        <PSPPromo size="sidebar" variant={2} />
      </aside>
    </div>
  );
}
