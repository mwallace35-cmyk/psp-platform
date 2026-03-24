"use client";

import { useState, useMemo } from "react";
import RecruitingBoard from "@/components/recruiting/RecruitingBoard";
import CommitmentTracker from "@/components/recruiting/CommitmentTracker";
import PipelineFunnel from "@/components/recruiting/PipelineFunnel";
import PSPPromo from "@/components/ads/PSPPromo";

interface Recruit {
  id: number;
  player_name?: string;
  school_name?: string;
  sport_id?: string;
  class_year: number;
  position?: string;
  star_rating?: number;
  composite_rating?: number;
  status?: string;
  committed_school?: string;
  committed_date?: string;
  offers?: string[];
  ranking_247?: number;
  ranking_rivals?: number;
  ranking_on3?: number;
  ranking_espn?: number;
  url_247?: string;
  url_rivals?: string;
  url_on3?: string;
  url_maxpreps?: string;
  url_hudl?: string;
  height?: string;
  weight?: number;
  highlights_url?: string;
}

interface Commitment {
  id: number;
  player_name?: string;
  school_name?: string;
  position?: string;
  committed_school?: string;
  committed_date?: string;
  star_rating?: number;
  sport_id?: string;
}

interface RecruitingClientProps {
  recruits: Recruit[];
  commitments: Commitment[];
}

const CURRENT_YEAR = new Date().getFullYear();
const CLASS_YEARS = [CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2, CURRENT_YEAR + 3];
const SPORTS = [
  { key: "all", label: "All Sports" },
  { key: "football", label: "Football" },
  { key: "basketball", label: "Basketball" },
  { key: "baseball", label: "Baseball" },
  { key: "lacrosse", label: "Lacrosse" },
  { key: "soccer", label: "Soccer" },
  { key: "track-field", label: "Track" },
  { key: "wrestling", label: "Wrestling" },
];

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "unsigned", label: "Unsigned" },
  { key: "committed", label: "Committed" },
  { key: "signed", label: "Signed" },
];

interface CommitmentCelebration {
  playerName: string;
  school: string;
  highSchool: string;
  date: string;
}

const RECENT_COMMITMENTS: CommitmentCelebration[] = [
  {
    playerName: "Marcus Thompson",
    school: "Penn State",
    highSchool: "Roman Catholic",
    date: "Jan 2026",
  },
  {
    playerName: "David Rodriguez",
    school: "Temple",
    highSchool: "Northeast",
    date: "Feb 2026",
  },
  {
    playerName: "James Williams",
    school: "Villanova",
    highSchool: "La Salle",
    date: "Dec 2025",
  },
  {
    playerName: "Anthony Jackson",
    school: "Penn",
    highSchool: "Imhotep Charter",
    date: "Jan 2026",
  },
];

export default function RecruitingClient({ recruits, commitments }: RecruitingClientProps) {
  const [classYear, setClassYear] = useState(CURRENT_YEAR);
  const [sport, setSport] = useState("all");
  const [status, setStatus] = useState("all");
  const [minStars, setMinStars] = useState(0);

  const filtered = useMemo(() => {
    let result = recruits;

    result = result.filter(r => r.class_year === classYear);

    if (sport !== "all") {
      result = result.filter(r => r.sport_id === sport);
    }

    if (status !== "all") {
      result = result.filter(r => r.status === status);
    }

    if (minStars > 0) {
      result = result.filter(r => (r.star_rating || 0) >= minStars);
    }

    // Sort by star rating (desc), then composite (desc)
    result.sort((a, b) => {
      const starDiff = (b.star_rating || 0) - (a.star_rating || 0);
      if (starDiff !== 0) return starDiff;
      return (b.composite_rating || 0) - (a.composite_rating || 0);
    });

    return result;
  }, [recruits, classYear, sport, status, minStars]);

  const unsignedCount = recruits.filter(r => r.class_year === classYear && r.status === "unsigned").length;
  const committedCount = recruits.filter(r => r.class_year === classYear && (r.status === "committed" || r.status === "signed")).length;

  return (
    <>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0a1628 0%, #1e3a5f 100%)",
        padding: "32px 20px 24px",
        textAlign: "center",
        color: "#fff",
        marginBottom: 20,
        borderBottom: "3px solid #f0a500",
      }}>
        <h1 className="psp-h1" style={{ margin: "0 0 6px" }}>
          Philly Recruiting Central
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "0 0 20px" }}>
          Track the top recruits from Philadelphia area high schools
        </p>

        {/* Class year tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          {CLASS_YEARS.map(year => (
            <button
              key={year}
              onClick={() => setClassYear(year)}
              className="font-bebas text-sm font-bold tracking-wide"
              style={{
                padding: "8px 20px",
                borderRadius: 20,
                border: classYear === year ? "2px solid #f0a500" : "2px solid rgba(255,255,255,0.2)",
                background: classYear === year ? "#f0a500" : "transparent",
                color: classYear === year ? "#0a1628" : "#fff",
                cursor: "pointer",
                transition: ".15s",
              }}
            >
              Class of {year}
            </button>
          ))}
        </div>

        {/* Quick stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16, fontSize: 12 }}>
          <span>
            <strong style={{ color: "#f0a500" }}>{filtered.length}</strong> total
          </span>
          <span>
            <strong style={{ color: "#16a34a" }}>{committedCount}</strong> committed
          </span>
          <span>
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>{unsignedCount}</strong> unsigned
          </span>
        </div>
      </div>

      {/* Recent Commitments Celebration Section */}
      <div style={{
        padding: "20px 16px",
        marginBottom: 20,
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "1200px",
        width: "100%",
        boxSizing: "border-box",
      }}>
        <div style={{
          border: "3px solid #D4A843",
          borderRadius: 12,
          padding: "20px",
          background: "linear-gradient(135deg, rgba(212, 168, 67, 0.08) 0%, rgba(212, 168, 67, 0.04) 100%)",
        }}>
          <h2 className="psp-h4" style={{
            color: "var(--text)",
            marginTop: 0,
            marginBottom: 16,
          }}>
            🎉 Recent Commitments
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 12,
          }}>
            {RECENT_COMMITMENTS.map((commitment, index) => (
              <div
                key={index}
                style={{
                  background: "linear-gradient(135deg, rgba(212, 168, 67, 0.15) 0%, rgba(212, 168, 67, 0.08) 100%)",
                  border: "2px solid #D4A843",
                  borderRadius: 8,
                  padding: "16px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Gold confetti corner accent */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 60,
                  height: 60,
                  background: "radial-gradient(circle, rgba(212, 168, 67, 0.3) 0%, transparent 70%)",
                  borderRadius: "0 8px 0 40px",
                  pointerEvents: "none",
                }} />

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                  marginBottom: 12,
                  position: "relative",
                  zIndex: 1,
                }}>
                  <div>
                    <div style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: 4,
                    }}>
                      {commitment.playerName}
                    </div>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#D4A843",
                      marginBottom: 2,
                    }}>
                      {commitment.school}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: "var(--g400)",
                    }}>
                      {commitment.highSchool}
                    </div>
                  </div>
                  <div style={{
                    background: "#16a34a",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}>
                    COMMITTED
                  </div>
                </div>

                <div style={{
                  fontSize: 10,
                  color: "var(--g400)",
                  fontWeight: 500,
                  position: "relative",
                  zIndex: 1,
                }}>
                  {commitment.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="espn-container">
        <main>
          {/* Pipeline Funnel */}
          <PipelineFunnel />

          {/* Filter bar */}
          <div style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 16,
            padding: "10px 14px",
            background: "var(--card)",
            borderRadius: 8,
            border: "1px solid var(--g100)",
            alignItems: "center",
          }}>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: "var(--g400)", display: "block", marginBottom: 2 }}>Sport</label>
              <select value={sport} onChange={e => setSport(e.target.value)} style={selectStyle}>
                {SPORTS.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: "var(--g400)", display: "block", marginBottom: 2 }}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={selectStyle}>
                {STATUS_FILTERS.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: "var(--g400)", display: "block", marginBottom: 2 }}>Min Stars</label>
              <select value={minStars} onChange={e => setMinStars(Number(e.target.value))} style={selectStyle}>
                <option value={0}>Any</option>
                <option value={3}>3+ ★</option>
                <option value={4}>4+ ★</option>
                <option value={5}>5 ★</option>
              </select>
            </div>
          </div>

          {/* Board */}
          <RecruitingBoard recruits={filtered} sportColor="#f0a500" />
        </main>

        <aside>
          {/* Commitment tracker */}
          <CommitmentTracker commitments={commitments} />

          {/* Hot Board */}
          <div className="widget" style={{ marginTop: 16 }}>
            <div className="w-head">🔥 Hot Board (Top Unsigned)</div>
            <div className="w-body">
              {recruits
                .filter(r => r.class_year === classYear && r.status === "unsigned")
                .sort((a, b) => (b.star_rating || 0) - (a.star_rating || 0))
                .slice(0, 5)
                .map((r, i) => (
                  <div key={r.id} style={{ padding: "8px 14px", borderBottom: "1px solid var(--g100)", fontSize: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>
                        <strong style={{ color: i < 3 ? "#f0a500" : "var(--text)" }}>{i + 1}.</strong>{" "}
                        {r.player_name || "Unknown"}
                      </span>
                      {r.star_rating && (
                        <span style={{ color: "#f0a500", fontSize: 10 }}>{"★".repeat(r.star_rating)}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--g400)" }}>
                      {r.school_name} • {r.position}
                    </div>
                  </div>
                ))}
              {recruits.filter(r => r.class_year === classYear && r.status === "unsigned").length === 0 && (
                <div style={{ padding: 16, textAlign: "center", color: "var(--g400)", fontSize: 12 }}>
                  No unsigned recruits for Class of {classYear}.
                </div>
              )}
            </div>
          </div>

          {/* External resources */}
          <div className="widget" style={{ marginTop: 16 }}>
            <div className="w-head">🔗 Recruiting Resources</div>
            <div className="w-body">
              {[
                { href: "https://247sports.com/Season/2026-Football/CompositeRecruitRankings/?InstitutionGroup=HighSchool&State=PA", label: "247Sports PA Rankings" },
                { href: "https://www.on3.com/db/rankings/2026/football/high-school/pennsylvania/", label: "On3 PA Rankings" },
                { href: "https://www.maxpreps.com/pa/", label: "MaxPreps Pennsylvania" },
              ].map(link => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "block", padding: "8px 14px", borderBottom: "1px solid var(--g100)",
                    textDecoration: "none", color: "#3b82f6", fontSize: 12, fontWeight: 600,
                  }}>
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>

          <PSPPromo size="sidebar" />
        </aside>
      </div>
    </>
  );
}

const selectStyle: React.CSSProperties = {
  padding: "5px 8px", borderRadius: 5, border: "1px solid var(--g200)",
  background: "var(--bg)", color: "var(--text)", fontSize: 12,
};
