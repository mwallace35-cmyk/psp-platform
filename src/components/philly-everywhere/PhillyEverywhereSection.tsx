"use client";

import { useState } from "react";
import Link from "next/link";

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

interface PhillyPlayer {
  name: string;
  originSchool: string;
  currentLocation: string;
  category: "prep_circuit" | "in_league" | "already_there" | "pro" | "transfer_out";
  sport: string;
  position?: string;
  classYear?: string;
  stats?: string;
  slug?: string;
}

interface PhillyEverywhereSectionProps {
  sport: string;
  alumni?: TrackedAlumni[];
}

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  in_league: "In the Leagues",
  prep_circuit: "Prep Circuit",
  already_there: "Already There",
  transfer_out: "Transfers Out",
  pro: "Pro",
};

// Sample data by sport - will be replaced by Supabase queries
const SAMPLE_PLAYERS: Record<string, PhillyPlayer[]> = {
  football: [
    { name: "Marcus Johnson", originSchool: "Overbrook", currentLocation: "Malvern Prep", category: "prep_circuit", sport: "football", position: "RB", classYear: "Jr", stats: "1,200 rush yds" },
    { name: "DeShawn Williams", originSchool: "Frankford", currentLocation: "Blair Academy (NJ)", category: "prep_circuit", sport: "football", position: "WR", classYear: "Sr", stats: "15 TDs" },
    { name: "Jaylen Carter", originSchool: "Imhotep Charter", currentLocation: "Penn State", category: "already_there", sport: "football", position: "DL", classYear: "Fr", stats: "Started 3 games" },
    { name: "Tyree Jackson", originSchool: "Martin Luther King", currentLocation: "Temple", category: "already_there", sport: "football", position: "LB", classYear: "So", stats: "45 tackles" },
    { name: "Rasheed Davis", originSchool: "Roman Catholic", currentLocation: "Pittsburgh Steelers", category: "pro", sport: "football", position: "CB", stats: "Practice Squad" },
    { name: "Kevin Moore", originSchool: "West Catholic", currentLocation: "Germantown Academy", category: "transfer_out", sport: "football", position: "QB", classYear: "Sr", stats: "2,800 pass yds" },
  ],
  basketball: [
    { name: "Amir Thompson", originSchool: "Bartram", currentLocation: "IMG Academy (FL)", category: "prep_circuit", sport: "basketball", position: "PG", classYear: "Jr", stats: "18.5 PPG" },
    { name: "Nasir Collins", originSchool: "Neumann-Goretti", currentLocation: "Neumann-Goretti", category: "in_league", sport: "basketball", position: "SG", classYear: "Sr", stats: "Committed Villanova" },
    { name: "Malik Brown", originSchool: "West Catholic", currentLocation: "Brewster Academy (NH)", category: "prep_circuit", sport: "basketball", position: "SF", classYear: "Sr", stats: "5-star recruit" },
    { name: "Jamal Harris", originSchool: "Imhotep Charter", currentLocation: "Temple University", category: "already_there", sport: "basketball", position: "PG", classYear: "Fr", stats: "12.3 PPG" },
    { name: "Darius Mitchell", originSchool: "Roman Catholic", currentLocation: "Philadelphia 76ers", category: "pro", sport: "basketball", position: "SG", stats: "Two-way contract" },
    { name: "Chris Washington", originSchool: "Archbishop Wood", currentLocation: "Montverde Academy (FL)", category: "prep_circuit", sport: "basketball", position: "C", classYear: "Jr", stats: "6'11\" center" },
  ],
  baseball: [
    { name: "Carlos Rivera", originSchool: "Edison HS", currentLocation: "La Salle College HS", category: "transfer_out", sport: "baseball", position: "SS", classYear: "Jr", stats: ".385 AVG" },
    { name: "Miguel Santos", originSchool: "Kensington", currentLocation: "Germantown Academy", category: "transfer_out", sport: "baseball", position: "P", classYear: "Sr", stats: "1.82 ERA" },
    { name: "David Ortiz Jr.", originSchool: "Northeast HS", currentLocation: "University of Miami", category: "already_there", sport: "baseball", position: "1B", classYear: "Fr", stats: ".310 AVG" },
    { name: "Juan Ramirez", originSchool: "Olney Charter", currentLocation: "Phillies Organization", category: "pro", sport: "baseball", position: "OF", stats: "Single-A Clearwater" },
    { name: "Angel Torres", originSchool: "Roberto Clemente MS", currentLocation: "St. Joseph's Prep", category: "in_league", sport: "baseball", position: "C", classYear: "So", stats: "Summer league MVP" },
    { name: "Luis Delgado", originSchool: "Edison HS", currentLocation: "Malvern Prep", category: "prep_circuit", sport: "baseball", position: "2B", classYear: "Jr", stats: "12 SB" },
  ],
};

const SPORT_COLORS: Record<string, string> = {
  football: "#16a34a",
  basketball: "#ea580c",
  baseball: "#dc2626",
  "track-field": "#7c3aed",
  lacrosse: "#0891b2",
  wrestling: "#ca8a04",
  soccer: "#059669",
};

const CATEGORY_COLORS: Record<string, string> = {
  prep_circuit: "#7c3aed",
  in_league: "#16a34a",
  already_there: "#2563eb",
  transfer_out: "#ea580c",
  pro: "#d4a843",
};

export default function PhillyEverywhereSection({ sport, alumni }: PhillyEverywhereSectionProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const sportColor = SPORT_COLORS[sport] || "#16a34a";

  // Map tracked alumni to PhillyPlayer format
  const mappedPlayers: PhillyPlayer[] = (alumni || []).map(a => ({
    name: a.person_name,
    originSchool: a.schools?.name || "Philadelphia",
    currentLocation: a.current_org || a.college || a.pro_team || "",
    category:
      a.current_level === "college" ? "already_there" :
      a.current_level === "pro" ? "pro" :
      a.current_level === "prep" ? "prep_circuit" :
      a.current_level === "high_school" ? "in_league" :
      "in_league" as "prep_circuit" | "in_league" | "already_there" | "pro" | "transfer_out",
    sport,
    stats: a.bio_note || a.current_role,
  }));

  // Use mapped players if alumni provided, otherwise fall back to sample
  const players = alumni && alumni.length > 0 ? mappedPlayers : SAMPLE_PLAYERS[sport] || SAMPLE_PLAYERS.football;

  const filteredPlayers = activeCategory === "all"
    ? players
    : players.filter(p => p.category === activeCategory);

  // Get categories that have players for this sport
  const availableCategories = ["all", ...new Set(players.map(p => p.category))];

  // If no alumni data and no sample players, show empty state
  if ((!alumni || alumni.length === 0) && players.length === 0) {
    return (
      <section style={{ marginBottom: 24 }}>
        <div className="sec-head">
          <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🌍</span> Philly Everywhere
          </h2>
          <Link href="/philly-everywhere" className="more">Track All Athletes →</Link>
        </div>
        <div style={{
          background: "var(--psp-white)",
          border: "1px solid var(--g100)",
          borderRadius: 6,
          padding: "24px",
          textAlign: "center",
          color: "var(--g400)",
        }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>No tracked alumni yet for {sport}</div>
          <div style={{ fontSize: 12, marginTop: 8, color: "var(--g500)" }}>Check back soon as we track more athletes!</div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ marginBottom: 24 }}>
      <div className="sec-head">
        <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🌍</span> Philly Everywhere
        </h2>
        <Link href="/philly-everywhere" className="more">Track All Athletes →</Link>
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {availableCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "6px 14px",
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 20,
              border: activeCategory === cat ? "none" : "1px solid var(--g200)",
              background: activeCategory === cat ? "var(--psp-navy)" : "transparent",
              color: activeCategory === cat ? "var(--psp-gold)" : "var(--g500)",
              cursor: "pointer",
              transition: ".15s",
              textTransform: "capitalize",
            }}
          >
            {CATEGORY_LABELS[cat] || cat.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Player Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 12,
      }}>
        {filteredPlayers.map((player, i) => (
          <div
            key={i}
            style={{
              background: "var(--psp-white)",
              border: "1px solid var(--g100)",
              borderRadius: 6,
              overflow: "hidden",
              transition: ".15s",
            }}
          >
            {/* Card Header - category colored strip */}
            <div style={{
              height: 4,
              background: CATEGORY_COLORS[player.category] || sportColor,
            }} />
            <div style={{ padding: "14px 16px" }}>
              {/* Avatar + Name */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${sportColor}33, var(--psp-navy))`,
                  border: `2px solid ${sportColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 800,
                  color: sportColor,
                }}>
                  {player.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--psp-navy)" }}>
                    {player.name}
                  </div>
                  {player.position && (
                    <div style={{ fontSize: 11, color: "var(--g400)" }}>
                      {player.position}{player.classYear ? ` � ${player.classYear}` : ""}
                    </div>
                  )}
                </div>
              </div>

              {/* Origin → Current */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 11,
                marginBottom: 8,
              }}>
                <span style={{ color: "var(--g500)" }}>{player.originSchool}</span>
                <span style={{ color: "var(--psp-gold)", fontWeight: 800 }}>→</span>
                <span style={{ fontWeight: 700, color: "var(--psp-navy)" }}>{player.currentLocation}</span>
              </div>

              {/* Bottom row: category badge + stats */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{
                  display: "inline-block",
                  padding: "3px 8px",
                  borderRadius: 10,
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  background: `${CATEGORY_COLORS[player.category] || sportColor}15`,
                  color: CATEGORY_COLORS[player.category] || sportColor,
                }}>
                  {CATEGORY_LABELS[player.category] || player.category.replace(/_/g, " ")}
                </span>
                {player.stats && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: sportColor }}>
                    {player.stats}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
