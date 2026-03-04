export const dynamic = 'force-dynamic';

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PSPPromo from "@/components/ads/PSPPromo";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";
import { createClient } from "@/lib/supabase/server";

const HEADLINES = [
  {
    sport: "Basketball",
    sportColor: "var(--bb)",
    tagBg: "#fff7ed",
    icon: "🏀",
    img: "/sports/basketball.svg",
    gradient: "linear-gradient(135deg,var(--bb),#7c2d12)",
    title: "Imhotep Extends Historic Win Streak to 85 Games",
    desc: "The Panthers capture a 6th consecutive Public League title and remain unbeaten.",
    time: "2h ago",
    href: "/basketball/schools/imhotep-charter",
  },
  {
    sport: "Football",
    sportColor: "var(--fb)",
    tagBg: "#f0fdf4",
    icon: "🏈",
    img: "/sports/football.svg",
    gradient: "linear-gradient(135deg,var(--fb),#0f5132)",
    title: "2025 PA All-State Selections: 11 Philly Players Earn Honors",
    desc: "PA Football Writers Association releases full rosters across all classifications.",
    time: "5h ago",
    href: "/football",
  },
  {
    sport: "Baseball",
    sportColor: "var(--base)",
    tagBg: "#fef2f2",
    icon: "⚾",
    img: "/sports/baseball.svg",
    gradient: "linear-gradient(135deg,var(--base),#7f1d1d)",
    title: "Neumann-Goretti Repeats as PIAA State Champions",
    desc: "N-G captures back-to-back titles behind a dominant pitching staff.",
    time: "1d ago",
    href: "/baseball/schools/neumann-goretti",
  },
  {
    sport: "Lacrosse",
    sportColor: "var(--lac)",
    tagBg: "#ecfeff",
    icon: "🥍",
    img: "/sports/lacrosse.svg",
    gradient: "linear-gradient(135deg,var(--lac),#155e75)",
    title: "Conestoga Wins 4th PIAA State Title",
    desc: "The Pioneers beat Garnet Valley 12-8 in the state final.",
    time: "2d ago",
    href: "/lacrosse",
  },
];

const MORE_STORIES = [
  { icon: "🤼", img: "/sports/wrestling.svg", sport: "Wrestling", color: "var(--wrest)", gradient: "linear-gradient(135deg,var(--wrest),#713f12)", title: "Malvern Prep Earns #5 National Ranking", desc: "2024 state champs continue their dominance." },
  { icon: "🏃", img: "/sports/track.svg", sport: "Track", color: "var(--track)", gradient: "linear-gradient(135deg,var(--track),#4c1d95)", title: "West Catholic Takes PIAA 2A Girls Title", desc: "Complete results from the state championship meet." },
  { icon: "🏈", img: "/sports/football.svg", sport: "Recruiting", color: "var(--fb)", gradient: "linear-gradient(135deg,#0a1628,#1a365d)", title: "Top 25 Philly Recruits: Class of 2027", desc: "D1 offers tracker and commitment updates." },
  { icon: "⚽", img: "/sports/soccer.svg", sport: "Soccer", color: "var(--soccer)", gradient: "linear-gradient(135deg,var(--soccer),#064e3b)", title: "Catholic League Soccer Preview", desc: "Breaking down the contenders for the 2025 season." },
];

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

async function getOverviewStats() {
  try {
    const supabase = await createClient();
    const [schools, players, seasons, championships] = await Promise.all([
      supabase.from("schools").select("id", { count: "exact", head: true }),
      supabase.from("players").select("id", { count: "exact", head: true }),
      supabase.from("seasons").select("id", { count: "exact", head: true }),
      supabase.from("championships").select("id", { count: "exact", head: true }),
    ]);
    return {
      schools: schools.count ?? 0,
      players: players.count ?? 0,
      seasons: seasons.count ?? 0,
      championships: championships.count ?? 0,
    };
  } catch {
    return { schools: 405, players: 10057, seasons: 76, championships: 713 };
  }
}

export default async function HomePage() {
  const stats = await getOverviewStats();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <div className="espn-container" style={{ flex: 1 }}>
        {/* Main Content */}
        <main>
          {/* Hero Card */}
          <div className="hero-card">
            <div className="hero-tag">Featured</div>
            <div
              className="hero-img"
              style={{
                background: "linear-gradient(180deg,#1a365d 0%,rgba(10,22,40,.95) 100%)",
              }}
            >
              <div>
                <h2>St. Joseph&apos;s Prep Captures 9th State Championship</h2>
                <div className="hero-sub">
                  QB Samaj Jones throws for 312 yards and 4 TDs as the Hawks dominate in the 6A title game
                </div>
              </div>
            </div>
          </div>

          {/* Top Headlines */}
          <div className="sec-head"><h2>Top Headlines</h2></div>
          <div className="headline-list">
            {HEADLINES.map((hl, i) => (
              <Link key={i} href={hl.href} className="hl-item" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="hl-img" style={{ background: `${hl.gradient}, url(${hl.img}) center/cover`, backgroundBlendMode: "overlay" }}>
                </div>
                <div className="hl-text">
                  <div className="hl-tag" style={{ background: hl.tagBg, color: hl.sportColor }}>
                    {hl.sport}
                  </div>
                  <h3>{hl.title}</h3>
                  <p>{hl.desc}</p>
                  <div className="meta">{hl.time}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Billboard Ad */}
          <PSPPromo size="billboard" variant={2} />

          {/* More Coverage */}
          <div className="sec-head"><h2>More Coverage</h2></div>
          <div className="stories">
            {MORE_STORIES.map((story, i) => (
              <div key={i} className="story">
                <div className="s-img" style={{ background: `${story.gradient}, url(${story.img}) center/cover`, backgroundBlendMode: "overlay" }}>
                </div>
                <div className="s-body">
                  <div className="s-tag" style={{ color: story.color }}>{story.sport}</div>
                  <h4>{story.title}</h4>
                  <p>{story.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Alumni Strip */}
          <div className="sec-head">
            <h2>Philly Pro Alumni</h2>
            <Link href="/search" className="more">All 72 Athletes &#8594;</Link>
          </div>
          <div className="alumni-strip">
            {ALUMNI.map((a, i) => (
              <div key={i} className="a-card">
                <div className="a-emoji">{a.emoji}</div>
                <div className="a-name">{a.name}</div>
                <div className="a-team">{a.team}</div>
                <div className="a-hs">{a.hs}</div>
              </div>
            ))}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
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

          {/* Ad Space */}
          <NewsletterSignup />
          <PSPPromo size="sidebar" variant={1} />

          {/* Quick Links */}
          <div className="widget">
            <div className="w-head">Quick Links</div>
            <div className="w-body">
              <Link href="/search" className="w-link">&#8594; Player of the Week</Link>
              <Link href="/search" className="w-link">&#8594; Hall of Fame</Link>
              <Link href="/search" className="w-link">&#8594; Archive (2000-2025)</Link>
              <Link href="/search" className="w-link">&#8594; Recruiting</Link>
              <Link href="/compare" className="w-link">&#8594; Compare Players</Link>
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
        </aside>
      </div>

      <Footer />
    </div>
  );
}
