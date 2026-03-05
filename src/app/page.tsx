export const dynamic = 'force-dynamic';

import Link from "next/link";
import HeaderWithScores from "@/components/layout/HeaderWithScores";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import PSPPromo from "@/components/ads/PSPPromo";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";
import { createClient } from "@/lib/supabase/server";

/* ── Featured Hero ── */
const FEATURED = {
  sport: "Football",
  sportColor: "var(--fb)",
  tag: "Featured",
  gradient: "linear-gradient(180deg,rgba(22,163,74,.3) 0%,rgba(10,22,40,.97) 100%)",
  title: "St. Joseph's Prep Captures 9th State Championship",
  desc: "QB Samaj Jones throws for 312 yards and 4 TDs as the Hawks dominate in the 6A title game.",
  time: "2h ago",
  href: "/schools/saint-josephs-prep",
};

/* ── Secondary Stories (2-col grid) ── */
const STORIES = [
  {
    sport: "Basketball", sportColor: "var(--bb)", icon: "🏀",
    gradient: "linear-gradient(135deg,var(--bb),#7c2d12)",
    title: "Imhotep Extends Historic Win Streak to 85 Games",
    desc: "The Panthers capture a 6th consecutive Public League title and remain unbeaten.",
    time: "2h ago", href: "/schools/imhotep-charter",
  },
  {
    sport: "Football", sportColor: "var(--fb)", icon: "🏈",
    gradient: "linear-gradient(135deg,var(--fb),#0f5132)",
    title: "2025 PA All-State Selections: 11 Philly Players",
    desc: "PA Football Writers Association releases full rosters across all classifications.",
    time: "5h ago", href: "/football",
  },
  {
    sport: "Baseball", sportColor: "var(--base)", icon: "⚾",
    gradient: "linear-gradient(135deg,var(--base),#7f1d1d)",
    title: "Neumann-Goretti Repeats as PIAA State Champions",
    desc: "N-G captures back-to-back titles behind a dominant pitching staff.",
    time: "1d ago", href: "/schools/neumann-goretti",
  },
  {
    sport: "Lacrosse", sportColor: "var(--lac)", icon: "🥍",
    gradient: "linear-gradient(135deg,var(--lac),#155e75)",
    title: "Conestoga Wins 4th PIAA State Title",
    desc: "The Pioneers beat Garnet Valley 12-8 in the state final.",
    time: "2d ago", href: "/lacrosse",
  },
];

/* ── Headlines List ── */
const HEADLINES = [
  { sport: "Wrestling", color: "var(--wrest)", title: "Malvern Prep earns #5 national ranking after state title", time: "3h ago", href: "/wrestling" },
  { sport: "Track", color: "var(--track)", title: "West Catholic takes PIAA 2A girls team title", time: "5h ago", href: "/track-field" },
  { sport: "Recruiting", color: "var(--fb)", title: "Top 25 Philly recruits: Class of 2027 rankings update", time: "8h ago", href: "/recruiting" },
  { sport: "Soccer", color: "var(--soccer)", title: "Catholic League soccer preview: breaking down the contenders", time: "1d ago", href: "/soccer" },
  { sport: "Basketball", color: "var(--bb)", title: "Father Judge wins first-ever PIAA state basketball title", time: "1d ago", href: "/schools/father-judge" },
  { sport: "Football", color: "var(--fb)", title: "Archbishop Wood advances to 5A state semifinal", time: "2d ago", href: "/schools/archbishop-wood" },
  { sport: "Baseball", color: "var(--base)", title: "La Salle three-peats with 2021 PIAA state crown", time: "2d ago", href: "/schools/la-salle-college-hs" },
  { sport: "Lacrosse", color: "var(--lac)", title: "Haverford School captures 5th state lacrosse championship", time: "3d ago", href: "/schools/haverford-school" },
];

/* ── Alumni ── */
const ALUMNI = [
  { emoji: "🏀", name: "Kobe Bryant", team: "Lakers (HOF)", hs: "Lower Merion" },
  { emoji: "🏀", name: "Wilt Chamberlain", team: "Warriors (HOF)", hs: "Overbrook" },
  { emoji: "🏈", name: "Marvin Harrison Jr.", team: "Cardinals", hs: "St. Joseph's Prep" },
  { emoji: "⚾", name: "Mike Piazza", team: "Mets (HOF)", hs: "Phoenixville" },
  { emoji: "🏈", name: "Kyle Pitts", team: "Falcons", hs: "Arch. Wood" },
  { emoji: "🏀", name: "Jalen Duren", team: "Pistons", hs: "Roman Catholic" },
  { emoji: "⚾", name: "Reggie Jackson", team: "Yankees (HOF)", hs: "Cheltenham" },
  { emoji: "🏈", name: "D'Andre Swift", team: "Bears", hs: "St. Joseph's Prep" },
];

const SPORT_ABBREV: Record<string, string> = {
  football: "FB", basketball: "BB", baseball: "BSB", lacrosse: "LAX",
  soccer: "SOC", "track-field": "TF", wrestling: "WR",
};

async function getOverviewStats() {
  try {
    const supabase = await createClient();
    const [schools, players, seasons, championships, recentGames] = await Promise.all([
      supabase.from("schools").select("id", { count: "exact", head: true }),
      supabase.from("players").select("id", { count: "exact", head: true }),
      supabase.from("seasons").select("id", { count: "exact", head: true }),
      supabase.from("championships").select("id", { count: "exact", head: true }),
      supabase
        .from("games")
        .select("id, sport_id, home_score, away_score, game_type, home_school:schools!games_home_school_id_fkey(id, name, short_name, slug), away_school:schools!games_away_school_id_fkey(id, name, short_name, slug)")
        .not("home_score", "is", null)
        .not("away_score", "is", null)
        .order("game_date", { ascending: false })
        .limit(6),
    ]);
    return {
      schools: schools.count ?? 0,
      players: players.count ?? 0,
      seasons: seasons.count ?? 0,
      championships: championships.count ?? 0,
      recentGames: recentGames.data ?? [],
    };
  } catch {
    return { schools: 405, players: 10057, seasons: 76, championships: 713, recentGames: [] };
  }
}

export default async function HomePage() {
  const stats = await getOverviewStats();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HeaderWithScores />

      <div className="espn-container" style={{ flex: 1 }}>
        {/* ━━ MAIN CONTENT ━━ */}
        <main>
          {/* Featured Hero Card */}
          <Link href={FEATURED.href} style={{ textDecoration: "none" }}>
            <div className="card-featured fade-in">
              <div className="card-img" style={{ background: FEATURED.gradient, height: 300 }}>
                <div className="card-content">
                  <div className="card-tag">{FEATURED.tag}</div>
                  <h2>{FEATURED.title}</h2>
                  <div className="card-meta">
                    <span style={{ color: FEATURED.sportColor, fontWeight: 700, marginRight: 8 }}>{FEATURED.sport}</span>
                    {FEATURED.desc}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Top Stories — 2-col grid */}
          <div className="sec-head" style={{ marginTop: 20 }}>
            <h2>Top Stories</h2>
            <Link href="/articles" className="more">All News &#8594;</Link>
          </div>
          <div className="stories">
            {STORIES.map((s, i) => (
              <Link key={i} href={s.href} style={{ textDecoration: "none", color: "inherit" }}>
                <div className={`card-secondary fade-in fade-in-delay-${Math.min(i + 1, 3)}`}>
                  <div className="card-img" style={{ background: s.gradient, height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
                    {s.icon}
                  </div>
                  <div className="card-body">
                    <div className="card-tag" style={{ background: s.sportColor }}>{s.sport}</div>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <div className="card-meta">{s.time}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Billboard Promo */}
          <PSPPromo size="billboard" variant={2} />

          {/* Headlines List */}
          <div className="sec-head"><h2>Headlines</h2></div>
          <div style={{ marginBottom: 20 }}>
            {HEADLINES.map((hl, i) => (
              <Link key={i} href={hl.href} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="card-headline">
                  <span className="hl-dot" style={{ background: hl.color }} />
                  <h4>{hl.title}</h4>
                  <span className="hl-time">{hl.time}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Video Section Placeholder */}
          <div className="sec-head"><h2>Watch</h2></div>
          <div className="stories" style={{ marginBottom: 20 }}>
            {[
              { title: "SJP State Championship Highlights", duration: "4:32", gradient: "linear-gradient(135deg,#16a34a,#0a1628)" },
              { title: "Imhotep's 85-Game Win Streak", duration: "3:15", gradient: "linear-gradient(135deg,#ea580c,#0a1628)" },
            ].map((v, i) => (
              <div key={i} className="card-secondary card-video" style={{ position: "relative" }}>
                <div className="card-img" style={{ background: v.gradient, height: 140 }}>
                  <div className="play-btn" />
                  <div className="duration">{v.duration}</div>
                </div>
                <div className="card-body">
                  <h3 style={{ fontSize: 15 }}>{v.title}</h3>
                  <p>Coming soon</p>
                </div>
              </div>
            ))}
          </div>

          {/* Alumni Strip */}
          <div className="sec-head">
            <h2>Philly Pro Alumni</h2>
            <Link href="/our-guys" className="more">All 72 Athletes &#8594;</Link>
          </div>
          <div className="alumni-strip">
            {ALUMNI.map((a, i) => (
              <div key={i} className="a-card hover-lift">
                <div className="a-emoji">{a.emoji}</div>
                <div className="a-name">{a.name}</div>
                <div className="a-team">{a.team}</div>
                <div className="a-hs">{a.hs}</div>
              </div>
            ))}
          </div>
        </main>

        {/* ━━ SIDEBAR ━━ */}
        <aside className="sidebar">
          {/* Recent Scores */}
          <div className="widget">
            <div className="w-head">Recent Scores <span className="badge">Live</span></div>
            <div className="w-body">
              {stats.recentGames.length > 0 ? stats.recentGames.map((g: any) => {
                const home = g.home_school;
                const away = g.away_school;
                const homeWin = (g.home_score ?? 0) >= (g.away_score ?? 0);
                const sportAbbr = SPORT_ABBREV[g.sport_id] || g.sport_id?.toUpperCase();
                const gameType = g.game_type && g.game_type !== "regular"
                  ? ` · ${g.game_type.charAt(0).toUpperCase() + g.game_type.slice(1)}`
                  : "";
                return (
                  <Link key={g.id} href={`/${g.sport_id}/games/${g.id}`} style={{ textDecoration: "none", display: "block" }}>
                    <div className="w-row" style={{ flexDirection: "column", alignItems: "stretch", gap: 2, padding: "8px 14px", cursor: "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                        <span style={{ fontWeight: homeWin ? 800 : 500, color: homeWin ? "var(--text)" : "var(--g400)" }}>{home?.short_name || home?.name}</span>
                        <span style={{ fontWeight: 800, color: homeWin ? "var(--text)" : "var(--g400)" }}>{g.home_score}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                        <span style={{ fontWeight: !homeWin ? 800 : 500, color: !homeWin ? "var(--text)" : "var(--g400)" }}>{away?.short_name || away?.name}</span>
                        <span style={{ fontWeight: 800, color: !homeWin ? "var(--text)" : "var(--g400)" }}>{g.away_score}</span>
                      </div>
                      <div style={{ fontSize: 9, color: "var(--psp-gold)", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: ".3px" }}>Final · {sportAbbr}{gameType}</div>
                    </div>
                  </Link>
                );
              }) : (
                <div className="w-row" style={{ padding: "12px 14px", fontSize: 12, color: "var(--g400)" }}>No recent scores</div>
              )}
              {stats.recentGames.length > 0 && (
                <Link href="/scores" style={{ display: "block", textAlign: "center", padding: "10px", fontSize: 11, fontWeight: 700, color: "var(--psp-gold)", textTransform: "uppercase" as const, letterSpacing: ".5px" }}>
                  All Scores →
                </Link>
              )}
            </div>
          </div>

          {/* Database Stats */}
          <div className="widget">
            <div className="w-head">Database <span className="badge">Live</span></div>
            <div className="w-body">
              <div className="w-row"><span className="name">Players</span><span className="val">{stats.players.toLocaleString()}</span></div>
              <div className="w-row"><span className="name">Schools</span><span className="val">{stats.schools.toLocaleString()}</span></div>
              <div className="w-row"><span className="name">Seasons</span><span className="val">{stats.seasons.toLocaleString()}</span></div>
              <div className="w-row"><span className="name">Championships</span><span className="val">{stats.championships.toLocaleString()}</span></div>
              <div className="w-row"><span className="name">Pro Athletes</span><span className="val">72</span></div>
            </div>
          </div>

          {/* Rushing Leaders */}
          <div className="widget">
            <div className="w-head">🏈 Rushing Leaders</div>
            <div className="w-body">
              <div className="w-row"><span className="rank top">1</span><span className="name">Amir Williams</span><span className="val">4,856</span></div>
              <div className="w-row"><span className="rank">2</span><span className="name">Donte Brown</span><span className="val">4,312</span></div>
              <div className="w-row"><span className="rank">3</span><span className="name">Rashon Miles</span><span className="val">3,987</span></div>
              <div className="w-row"><span className="rank">4</span><span className="name">Khalil Carter</span><span className="val">3,654</span></div>
              <div className="w-row"><span className="rank">5</span><span className="name">DeShawn Jackson</span><span className="val">3,421</span></div>
            </div>
          </div>

          {/* Scoring Leaders */}
          <div className="widget">
            <div className="w-head">🏀 Scoring Leaders</div>
            <div className="w-body">
              <div className="w-row"><span className="rank top">1</span><span className="name">Marcus Johnson</span><span className="val">2,412</span></div>
              <div className="w-row"><span className="rank">2</span><span className="name">Tyrese Maxey</span><span className="val">2,287</span></div>
              <div className="w-row"><span className="rank">3</span><span className="name">Jalen Duren</span><span className="val">2,156</span></div>
              <div className="w-row"><span className="rank">4</span><span className="name">Cam Reddish</span><span className="val">2,044</span></div>
              <div className="w-row"><span className="rank">5</span><span className="name">Dahmir Bishop</span><span className="val">1,987</span></div>
            </div>
          </div>

          {/* GOTW Widget */}
          <div className="widget">
            <div className="w-head" style={{ background: "var(--psp-blue, #3b82f6)", color: "#fff" }}>🎯 Game of the Week</div>
            <div className="w-body" style={{ padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>Vote for the biggest matchup!</div>
              <Link href="/gotw" className="btn-primary" style={{ display: "inline-block", fontSize: 12, padding: "6px 18px", textDecoration: "none", background: "var(--psp-blue, #3b82f6)", color: "#fff", borderRadius: 6 }}>
                Vote Now →
              </Link>
            </div>
          </div>

          {/* POTW Widget */}
          <div className="widget">
            <div className="w-head" style={{ background: "var(--psp-gold)", color: "#000" }}>🗳️ Player of the Week</div>
            <div className="w-body" style={{ padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>Vote for this week&apos;s top performer!</div>
              <Link href="/potw" className="btn-primary" style={{ display: "inline-block", fontSize: 12, padding: "6px 18px", textDecoration: "none" }}>
                Vote Now →
              </Link>
            </div>
          </div>

          <NewsletterSignup />
          <PSPPromo size="sidebar" variant={1} />

          {/* Quick Links */}
          <div className="widget">
            <div className="w-head">Quick Links</div>
            <div className="w-body">
              <Link href="/gotw" className="w-link">&#8594; Game of the Week</Link>
              <Link href="/potw" className="w-link">&#8594; Player of the Week</Link>
              <Link href="/our-guys" className="w-link">&#8594; Our Guys / Pro Alumni</Link>
              <Link href="/schools" className="w-link">&#8594; All Schools</Link>
              <Link href="/recruiting" className="w-link">&#8594; Recruiting</Link>
              <Link href="/compare" className="w-link">&#8594; Compare Players</Link>
              <Link href="/glossary" className="w-link">&#8594; Stats Glossary</Link>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="widget">
            <div className="w-head">Upcoming Events</div>
            <div className="w-body" style={{ padding: "10px 14px" }}>
              <div className="evt-item">
                <div className="evt-date"><div className="m">Mar</div><div className="d">15</div></div>
                <div className="evt-info"><h4>Rivals Showcase</h4><p>The Haverford School</p></div>
              </div>
              <div className="evt-item">
                <div className="evt-date"><div className="m">Mar</div><div className="d">22</div></div>
                <div className="evt-info"><h4>PCL Basketball Final</h4><p>The Palestra</p></div>
              </div>
            </div>
          </div>

          <PSPPromo size="sidebar" variant={4} />
        </aside>
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
