import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stats | Philadelphia High School Sports",
  description: "Statistics hub for Philadelphia high school sports.",
};

const SECTIONS = [
  { href: "/leaderboards", label: "Leaderboards", desc: "Top performers across all sports" },
  { href: "/leaderboards/trending", label: "Trending Players", desc: "Players gaining the most attention" },
  { href: "/standings", label: "Standings", desc: "Current season W-L records" },
  { href: "/football/efficiency", label: "Football Efficiency", desc: "YPC, completion %, TD:INT ratio" },
  { href: "/history", label: "PSP History", desc: "This week in Philadelphia sports history" },
  { href: "/schools", label: "Schools", desc: "Browse all 400+ Philadelphia schools" },
];

const SPORTS = [
  { href: "/football/leaderboards", label: "Football" },
  { href: "/basketball/leaderboards", label: "Basketball" },
  { href: "/baseball/leaderboards", label: "Baseball" },
  { href: "/soccer/leaderboards", label: "Soccer" },
  { href: "/lacrosse/leaderboards", label: "Lacrosse" },
  { href: "/track/leaderboards", label: "Track and Field" },
  { href: "/wrestling/leaderboards", label: "Wrestling" },
];

export default function StatsPage() {
  return (
    <main style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "2.5rem", color: "var(--psp-navy)", marginBottom: "0.25rem" }}>
        Stats Hub
      </h1>
      <p style={{ color: "var(--psp-muted)", marginBottom: "2rem" }}>
        Explore statistics, standings, and records across Philadelphia high school sports.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} style={{ display: "block", background: "var(--psp-card-bg)", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1.25rem", textDecoration: "none", color: "inherit" }}>
            <div style={{ fontFamily: "var(--font-bebas)", fontSize: "1.25rem", color: "var(--psp-navy)", marginBottom: "0.25rem" }}>{s.label}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--psp-muted)" }}>{s.desc}</div>
          </Link>
        ))}
      </div>
      <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "1.5rem", color: "var(--psp-navy)", marginBottom: "1rem" }}>
        By Sport
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        {SPORTS.map((s) => (
          <Link key={s.href} href={s.href} style={{ display: "inline-flex", alignItems: "center", background: "var(--psp-navy)", color: "#fff", padding: "0.5rem 1rem", borderRadius: "20px", textDecoration: "none", fontSize: "0.9rem" }}>
            {s.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
