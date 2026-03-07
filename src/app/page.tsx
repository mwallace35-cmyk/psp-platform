export const revalidate = 3600;

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { SkeletonText } from "@/components/ui/Skeleton";
import { BillboardPromo, NewsletterWidget, SidebarPromo } from "@/components/home/HomeClientContent";
import { createClient } from "@/lib/supabase/server";
import { getFootballLeaders, getBasketballLeaders } from "@/lib/data";
import { captureError } from "@/lib/error-tracking";
import type { FootballLeaderRowData, BasketballLeaderRowData } from "@/lib/data/events";

// Helper function to format time ago
function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Helper function to get emoji for sport
function getSportEmoji(sportId?: string): string {
  const emojiMap: Record<string, string> = {
    basketball: "🏀",
    football: "🏈",
    baseball: "⚾",
    soccer: "⚽",
    lacrosse: "🥍",
    wrestling: "🤼",
    track: "🏃",
  };
  return emojiMap[sportId?.toLowerCase() || ""] || "🏅";
}

// Fallback headlines (used if database query returns empty)
const FALLBACK_HEADLINES = [
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

// Fallback more stories (used if database query returns empty)
const FALLBACK_MORE_STORIES = [
  { icon: "🤼", img: "/sports/wrestling.svg", sport: "Wrestling", color: "var(--wrest)", gradient: "linear-gradient(135deg,var(--wrest),#713f12)", title: "Malvern Prep Earns #5 National Ranking", desc: "2024 state champs continue their dominance." },
  { icon: "🏃", img: "/sports/track.svg", sport: "Track", color: "var(--track)", gradient: "linear-gradient(135deg,var(--track),#4c1d95)", title: "West Catholic Takes PIAA 2A Girls Title", desc: "Complete results from the state championship meet." },
  { icon: "🏈", img: "/sports/football.svg", sport: "Recruiting", color: "var(--fb)", gradient: "linear-gradient(135deg,#0a1628,#1a365d)", title: "Top 25 Philly Recruits: Class of 2027", desc: "D1 offers tracker and commitment updates." },
  { icon: "⚽", img: "/sports/soccer.svg", sport: "Soccer", color: "var(--soccer)", gradient: "linear-gradient(135deg,var(--soccer),#064e3b)", title: "Catholic League Soccer Preview", desc: "Breaking down the contenders for the 2025 season." },
];

// Fallback alumni (used if database query returns empty)
const FALLBACK_ALUMNI = [
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
    // Fetch all counts in parallel
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
  } catch (error) {
    captureError(error, { function: "getOverviewStats", context: "data_fetching" });
    console.error("[PSP] Failed to fetch overview stats:", error instanceof Error ? error.message : String(error));
    return { schools: 405, players: 10057, seasons: 76, championships: 713 };
  }
}

async function getRecentHeadlines() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("articles")
      .select("slug, title, excerpt, sport_id, featured_image_url, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(4);
    return data || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    captureError(error, { function: "getRecentHeadlines", context: "data_fetching" });
    console.error("[PSP] Failed to fetch recent headlines:", errorMessage);
    return [];
  }
}

async function getFeaturedAlumni() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("next_level_tracking")
      .select(
        `person_name,
         current_org,
         current_role,
         sport_id,
         high_school_id,
         schools!next_level_tracking_high_school_id_fkey(name)`
      )
      .eq("featured", true)
      .eq("status", "active")
      .limit(8);
    return data || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    captureError(error, { function: "getFeaturedAlumni", context: "data_fetching" });
    console.error("[PSP] Failed to fetch featured alumni:", errorMessage);
    return [];
  }
}

async function getUpcomingEvents() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("events")
      .select("title, location, start_date")
      .eq("status", "upcoming")
      .gte("start_date", new Date().toISOString())
      .order("start_date", { ascending: true })
      .limit(3);
    return data || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    captureError(error, { function: "getUpcomingEvents", context: "data_fetching" });
    console.error("[PSP] Failed to fetch upcoming events:", errorMessage);
    return [];
  }
}

interface Headline {
  slug: string;
  title: string;
  excerpt: string | null;
  sport_id: string;
  featured_image_url: string | null;
  published_at: string;
}

interface FeaturedAlumni {
  person_name: string;
  current_org: string;
  current_role: string | null;
  sport_id: string;
  high_school_id: number;
  schools: { name: string }[] | { name: string } | null;
}

interface UpcomingEvent {
  title: string;
  location: string | null;
  start_date: string;
}

export default async function HomePage() {
  // Wrap all data fetching in try/catch to prevent full page crash
  let stats = { schools: 405, players: 10057, seasons: 76, championships: 713 };
  let rushingLeaders: FootballLeaderRowData[] = [];
  let scoringLeaders: BasketballLeaderRowData[] = [];
  let headlines: Headline[] = [];
  let featuredAlumni: FeaturedAlumni[] = [];
  let upcomingEvents: UpcomingEvent[] = [];

  try {
    // Use Promise.allSettled to prevent one failure from crashing the page
    const results = await Promise.allSettled([
      getOverviewStats(),
      getFootballLeaders("rushing", 5),
      getBasketballLeaders("scoring", 5),
      getRecentHeadlines(),
      getFeaturedAlumni(),
      getUpcomingEvents(),
    ]);

    // Process results safely
    const [statsResult, rushingResult, scoringResult, headlinesResult, alumniResult, eventsResult] = results;

    if (statsResult.status === "fulfilled") stats = statsResult.value;
    if (rushingResult.status === "fulfilled") rushingLeaders = rushingResult.value;
    if (scoringResult.status === "fulfilled") scoringLeaders = scoringResult.value;
    if (headlinesResult.status === "fulfilled") headlines = headlinesResult.value;
    if (alumniResult.status === "fulfilled") featuredAlumni = alumniResult.value;
    if (eventsResult.status === "fulfilled") upcomingEvents = eventsResult.value;

    // Log any failures that occurred during data fetching
    if (statsResult.status === "rejected") {
      captureError(statsResult.reason, { function: "HomePage", fetch: "getOverviewStats" });
    }
    if (rushingResult.status === "rejected") {
      captureError(rushingResult.reason, { function: "HomePage", fetch: "getFootballLeaders" });
    }
    if (scoringResult.status === "rejected") {
      captureError(scoringResult.reason, { function: "HomePage", fetch: "getBasketballLeaders" });
    }
    if (headlinesResult.status === "rejected") {
      captureError(headlinesResult.reason, { function: "HomePage", fetch: "getRecentHeadlines" });
    }
    if (alumniResult.status === "rejected") {
      captureError(alumniResult.reason, { function: "HomePage", fetch: "getFeaturedAlumni" });
    }
    if (eventsResult.status === "rejected") {
      captureError(eventsResult.reason, { function: "HomePage", fetch: "getUpcomingEvents" });
    }
  } catch (error) {
    captureError(error, { function: "HomePage", context: "data_fetching" });
    // Page will degrade gracefully with fallback data already set above
  }

  // Map headlines from database or use fallback
  const displayHeadlines = headlines.length > 0 ? headlines.map((h) => ({
    sport: h.sport_id || "News",
    sportColor: "var(--psp-navy)",
    tagBg: "#f0f4ff",
    icon: "📰",
    img: h.featured_image_url || "/sports/football.svg",
    gradient: "linear-gradient(135deg,var(--psp-navy),#1a365d)",
    title: h.title,
    desc: h.excerpt || "",
    time: h.published_at ? formatTimeAgo(h.published_at) : "",
    href: `/articles/${h.slug}`,
  })) : FALLBACK_HEADLINES;

  // Map alumni from database or use fallback
  const displayAlumni = featuredAlumni.length > 0 ? featuredAlumni.map((person) => {
    const schoolName = person.schools
      ? Array.isArray(person.schools)
        ? person.schools[0]?.name
        : person.schools.name
      : undefined;
    return {
      emoji: getSportEmoji(person.sport_id),
      name: person.person_name,
      team: `${person.current_org}${person.current_role ? ` (${person.current_role})` : ""}`,
      hs: schoolName || "Unknown",
    };
  }) : FALLBACK_ALUMNI;

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PhillySportsPack",
    url: "https://phillysportspack.com",
    description: "Comprehensive database of Philadelphia high school sports statistics, players, coaches, and records across football, basketball, baseball, and more.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://phillysportspack.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <Header />

      <div className="espn-container" style={{ flex: 1 }}>
        {/* Main Content */}
        <main id="main-content">
          {/* Accessibility: aria-live region for content updates */}
          <div id="content-updates" aria-live="polite" aria-atomic="true" className="sr-only"></div>
          {/* Hero Card */}
          {/* TODO: Migrate to database — fetch from articles/featured_content table */}
          <div className="hero-card">
            <div className="hero-tag">Featured</div>
            <div
              className="hero-img"
              style={{
                background: "linear-gradient(180deg,#1a365d 0%,rgba(10,22,40,.95) 100%)",
              }}
            >
              <div>
                <h1>St. Joseph&apos;s Prep Captures 9th State Championship</h1>
                <div className="hero-sub">
                  QB Samaj Jones throws for 312 yards and 4 TDs as the Hawks dominate in the 6A title game
                </div>
              </div>
            </div>
          </div>

          {/* Top Headlines */}
          <div className="sec-head"><h2>Top Headlines</h2></div>
          <div className="headline-list">
            {displayHeadlines.map((hl, i) => (
              <Link key={i} href={hl.href} className="hl-item" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="hl-img" style={{ background: `${hl.gradient}, url(${hl.img}) center/cover`, backgroundBlendMode: "overlay", position: "relative" }}>
                  {hl.img && hl.img.endsWith('.svg') ? (
                    <Image
                      src={hl.img}
                      alt={`${hl.sport} - ${hl.title}`}
                      fill
                      priority={i === 0}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                      style={{ opacity: 0.3 }}
                    />
                  ) : null}
                </div>
                <div className="hl-text">
                  <div className="hl-tag" style={{ background: hl.tagBg, color: hl.sportColor }}>
                    {hl.icon && <span role="img" aria-hidden="true">{hl.icon} </span>}
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
          <BillboardPromo />

          {/* More Coverage */}
          <div className="sec-head"><h2>More Coverage</h2></div>
          <div className="stories">
            {FALLBACK_MORE_STORIES.map((story, i) => (
              <div key={i} className="story">
                <div className="s-img" style={{ background: story.gradient, backgroundBlendMode: "overlay", position: "relative" }}>
                  {story.img && story.img.endsWith('.svg') ? (
                    <Image
                      src={story.img}
                      alt={`${story.sport} - ${story.title}`}
                      fill
                      loading="lazy"
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      style={{ opacity: 0.3 }}
                    />
                  ) : null}
                </div>
                <div className="s-body">
                  <div className="s-tag" style={{ color: story.color }}>
                    {story.icon && <span role="img" aria-hidden="true">{story.icon} </span>}
                    {story.sport}
                  </div>
                  <h3>{story.title}</h3>
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
            {displayAlumni.map((a, i) => (
              <div key={i} className="a-card">
                <div className="a-emoji" role="img" aria-label={`${a.name} - ${a.team}`}>{a.emoji}</div>
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
          <Suspense fallback={
            <div className="widget">
              <div className="w-head"><span role="img" aria-label="football">🏈</span> Rushing Leaders</div>
              <div className="w-body" style={{ padding: "10px 14px" }}>
                <SkeletonText lines={5} />
              </div>
            </div>
          }>
            <div className="widget">
              <div className="w-head"><span role="img" aria-label="football">🏈</span> Rushing Leaders</div>
              <div className="w-body">
                {rushingLeaders && rushingLeaders.length > 0 ? (
                  rushingLeaders.map((leader: any, idx: number) => (
                    <div key={idx} className="w-row">
                      <span className={`rank ${idx === 0 ? 'top' : ''}`}>{idx + 1}</span>
                      <Link href={`/football/players/${leader.players?.slug}`} className="name" style={{ textDecoration: "none", color: "inherit" }}>
                        {leader.players?.name || "Unknown"}
                      </Link>
                      <span className="val">{leader.rush_yards?.toLocaleString() || 0}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "10px 0", color: "#999" }}>No data available</div>
                )}
              </div>
            </div>
          </Suspense>

          {/* Scoring Leaders */}
          <Suspense fallback={
            <div className="widget">
              <div className="w-head"><span role="img" aria-label="basketball">🏀</span> Scoring Leaders</div>
              <div className="w-body" style={{ padding: "10px 14px" }}>
                <SkeletonText lines={5} />
              </div>
            </div>
          }>
            <div className="widget">
              <div className="w-head"><span role="img" aria-label="basketball">🏀</span> Scoring Leaders</div>
              <div className="w-body">
                {scoringLeaders && scoringLeaders.length > 0 ? (
                  scoringLeaders.map((leader: any, idx: number) => (
                    <div key={idx} className="w-row">
                      <span className={`rank ${idx === 0 ? 'top' : ''}`}>{idx + 1}</span>
                      <Link href={`/basketball/players/${leader.players?.slug}`} className="name" style={{ textDecoration: "none", color: "inherit" }}>
                        {leader.players?.name || "Unknown"}
                      </Link>
                      <span className="val">{leader.points?.toLocaleString() || 0}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "10px 0", color: "#999" }}>No data available</div>
                )}
              </div>
            </div>
          </Suspense>

          {/* Ad Space */}
          <NewsletterWidget />
          <SidebarPromo />

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
          <Suspense fallback={
            <div className="widget">
              <div className="w-head">Upcoming Events</div>
              <div className="w-body" style={{ padding: "10px 14px" }}>
                <SkeletonText lines={4} />
              </div>
            </div>
          }>
            <div className="widget">
              <div className="w-head">Upcoming Events</div>
              <div className="w-body" style={{ padding: "10px 14px" }}>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((evt: any, i: number) => {
                    const eventDate = new Date(evt.start_date);
                    const monthAbr = eventDate.toLocaleString("en-US", { month: "short" });
                    const day = eventDate.getDate();
                    return (
                      <div key={i} className="evt-item">
                        <div className="evt-date"><div className="m">{monthAbr}</div><div className="d">{day}</div></div>
                        <div className="evt-info"><h4>{evt.title}</h4><p>{evt.location || "Location TBA"}</p></div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="evt-item">
                      <div className="evt-date"><div className="m">Mar</div><div className="d">15</div></div>
                      <div className="evt-info"><h4>Rivals Showcase</h4><p>The Haverford School</p></div>
                    </div>
                    <div className="evt-item">
                      <div className="evt-date"><div className="m">Mar</div><div className="d">22</div></div>
                      <div className="evt-info"><h4>PCL Basketball Final</h4><p>The Palestra</p></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Suspense>
        </aside>
      </div>

      <OrganizationJsonLd />
      <Footer />
    </div>
  );
}
