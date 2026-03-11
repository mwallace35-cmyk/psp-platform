import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META } from "@/lib/data";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageParams = { sport: string };

// Map of sport → stat categories with display labels and descriptions
const STAT_CATEGORIES: Record<string, { slug: string; label: string; description: string; icon: string }[]> = {
  football: [
    { slug: "rushing", label: "Rushing", description: "Carries, yards, yards per carry, touchdowns", icon: "🏃" },
    { slug: "passing", label: "Passing", description: "Completions, attempts, yards, touchdowns, interceptions", icon: "🎯" },
    { slug: "receiving", label: "Receiving", description: "Catches, yards, yards per catch, touchdowns", icon: "🙌" },
    { slug: "scoring", label: "Scoring", description: "Total points, touchdowns, extra points, field goals", icon: "🏆" },
  ],
  basketball: [
    { slug: "scoring", label: "Scoring", description: "Total points, points per game, field goals", icon: "🏀" },
    { slug: "ppg", label: "Points Per Game", description: "Season and career PPG leaders", icon: "📊" },
    { slug: "rebounds", label: "Rebounds", description: "Total rebounds, rebounds per game", icon: "💪" },
    { slug: "assists", label: "Assists", description: "Total assists, assists per game", icon: "🤝" },
  ],
  baseball: [
    { slug: "batting", label: "Batting", description: "Average, hits, home runs, RBI", icon: "⚾" },
    { slug: "pitching", label: "Pitching", description: "ERA, wins, strikeouts, saves", icon: "🔥" },
    { slug: "home-runs", label: "Home Runs", description: "Season and career home run leaders", icon: "💣" },
  ],
  "track-field": [
    { slug: "sprints", label: "Sprints", description: "100m, 200m, 400m event leaders", icon: "⚡" },
    { slug: "distance", label: "Distance", description: "800m, 1600m, 3200m event leaders", icon: "🏃" },
    { slug: "field", label: "Field Events", description: "Long jump, high jump, shot put, discus", icon: "🎯" },
  ],
  lacrosse: [
    { slug: "goals", label: "Goals", description: "Season and career goal leaders", icon: "🥍" },
    { slug: "assists", label: "Assists", description: "Season and career assist leaders", icon: "🤝" },
  ],
  wrestling: [
    { slug: "wins", label: "Wins", description: "Season and career win leaders", icon: "🏅" },
    { slug: "pins", label: "Pins", description: "Season and career pin leaders", icon: "📌" },
  ],
  soccer: [
    { slug: "goals", label: "Goals", description: "Season and career goal leaders", icon: "⚽" },
    { slug: "assists", label: "Assists", description: "Season and career assist leaders", icon: "🤝" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport } = await params;
  if (!isValidSport(sport)) return {};
  const meta = SPORT_META[sport];
  return {
    title: `${meta.name} Leaderboards — PhillySportsPack`,
    description: `Statistical leaderboards for Philadelphia high school ${meta.name.toLowerCase()}. Season and career leaders across all categories.`,
  };
}

export default async function LeaderboardsIndex({ params }: { params: Promise<PageParams> }) {
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();
  const meta = SPORT_META[sport];
  const categories = STAT_CATEGORIES[sport] || [];

  const uiBreadcrumbs = [
    { label: "Home", href: "/" },
    { label: meta.name, href: `/${sport}` },
    { label: "Leaderboards" },
  ];

  const jsonLdBreadcrumbs = [
    { name: "Home", url: "/" },
    { name: meta.name, url: `/${sport}` },
    { name: "Leaderboards", url: `/${sport}/leaderboards` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={jsonLdBreadcrumbs} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <Breadcrumb items={uiBreadcrumbs} />

        {/* Hero */}
        <div
          style={{
            background: "linear-gradient(135deg, var(--psp-navy) 0%, #0f2040 100%)",
            borderRadius: 12,
            padding: "32px 24px",
            marginBottom: 32,
            borderBottom: `3px solid ${meta.color}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>{meta.emoji}</span>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "2rem",
                color: "#fff",
                margin: 0,
              }}
            >
              {meta.name} Leaderboards
            </h1>
          </div>
          <p style={{ color: "#94a3b8", fontSize: "1rem", margin: 0 }}>
            Season and career statistical leaders for Philadelphia high school {meta.name.toLowerCase()}.
            Choose a category below.
          </p>
        </div>

        {/* Category Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${sport}/leaderboards/${cat.slug}`}
              style={{
                display: "block",
                background: "var(--card-bg, #111)",
                border: "1px solid #333",
                borderRadius: 8,
                padding: "20px 20px",
                textDecoration: "none",
                transition: "border-color 0.15s, transform 0.15s",
              }}
              className="hover:border-gold hover:-translate-y-0.5"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{cat.icon}</span>
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    color: "#fff",
                  }}
                >
                  {cat.label}
                </span>
              </div>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0, lineHeight: 1.5 }}>
                {cat.description}
              </p>
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  color: "var(--psp-gold)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                View Leaders &rarr;
              </div>
            </Link>
          ))}

          {/* School Leaderboard Card */}
          <Link
            href={`/${sport}/leaderboards/schools`}
            style={{
              display: "block",
              background: "var(--card-bg, #111)",
              border: "1px solid #333",
              borderRadius: 8,
              padding: "20px 20px",
              textDecoration: "none",
              transition: "border-color 0.15s, transform 0.15s",
            }}
            className="hover:border-gold hover:-translate-y-0.5"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>🏫</span>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.25rem",
                  color: "#fff",
                }}
              >
                School Rankings
              </span>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0, lineHeight: 1.5 }}>
              All-time wins, championships, and total stat production by school.
            </p>
            <div
              style={{
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: "var(--psp-gold)",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              View Schools &rarr;
            </div>
          </Link>
        </div>

        {/* Toggle hint */}
        <div
          style={{
            background: "var(--card-bg, #111)",
            border: "1px solid #333",
            borderRadius: 8,
            padding: "16px 20px",
            marginBottom: 48,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 18 }}>💡</span>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
            Each leaderboard supports <strong style={{ color: "#e2e8f0" }}>Season</strong> and{" "}
            <strong style={{ color: "#e2e8f0" }}>Career</strong> modes. Use the toggle at the top of
            any leaderboard to switch between single-season leaders and all-time career totals.
          </p>
        </div>
      </div>
    </>
  );
}
