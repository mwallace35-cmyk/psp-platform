"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RecruitingBoard from "@/components/recruiting/RecruitingBoard";
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
    <div className="hub-dashboard">
      {/* ════════ CLASS YEAR SUB-NAV ════════ */}
      <nav className="hub-subnav">
        {CLASS_YEARS.map(year => (
          <button
            key={year}
            onClick={() => setClassYear(year)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: classYear === year ? "var(--psp-gold)" : "inherit",
              fontWeight: classYear === year ? 700 : 500,
              borderBottom: classYear === year ? "2px solid var(--psp-gold)" : "2px solid transparent",
              padding: "8px 14px", fontSize: 13,
              fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5,
            }}
          >
            Class of {year}
          </button>
        ))}
        <span style={{
          marginLeft: "auto", fontSize: 11, display: "flex", gap: 12, alignItems: "center",
          color: "var(--g500)", padding: "8px 0",
        }}>
          <span><strong style={{ color: "var(--psp-gold)" }}>{filtered.length}</strong> total</span>
          <span><strong style={{ color: "#16a34a" }}>{committedCount}</strong> committed</span>
          <span><strong style={{ color: "var(--g400)" }}>{unsignedCount}</strong> unsigned</span>
        </span>
      </nav>

      {/* ════════ MAIN 2-COL LAYOUT ════════ */}
      <div className="hub-body">
        {/* ── LEFT: MAIN CONTENT ── */}
        <div className="hub-main">

          {/* FILTER BAR */}
          <div style={{
            display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16,
            padding: "10px 14px", background: "var(--card)", borderRadius: 8,
            border: "1px solid var(--g100)", alignItems: "center",
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

          {/* RECRUITING BOARD */}
          <RecruitingBoard recruits={filtered} sportColor="#3b82f6" />

          <PSPPromo size="banner" variant={1} />

        </div>

        {/* ── RIGHT: SIDEBAR ── */}
        <aside className="hub-sidebar">
          {/* Recent Commitments */}
          <div className="hub-widget">
            <div className="hub-wh" style={{ background: "#16a34a" }}>🎯 Recent Commitments</div>
            <div className="hub-wb hub-wb-tight">
              {commitments.length === 0 ? (
                <div style={{ padding: 16, textAlign: "center", color: "var(--g400)", fontSize: 12 }}>
                  No recent commitments to display.
                </div>
              ) : (
                commitments.slice(0, 8).map(c => (
                  <div key={c.id} style={{ padding: "8px 14px", borderBottom: "1px solid var(--g100)", fontSize: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong>{c.player_name || "Unknown"}</strong>
                      {c.star_rating && (
                        <span style={{ fontSize: 10, color: "#f0a500" }}>{"★".repeat(c.star_rating)}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--g400)", marginTop: 2 }}>
                      {c.school_name && <span>{c.school_name}</span>}
                      {c.position && <span> · {c.position}</span>}
                    </div>
                    {c.committed_school && (
                      <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 600, marginTop: 2 }}>
                        → {c.committed_school}
                        {c.committed_date && (
                          <span style={{ fontWeight: 400, color: "var(--g400)", marginLeft: 6 }}>
                            {new Date(c.committed_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Hot Board */}
          <div className="hub-widget">
            <div className="hub-wh" style={{ background: "#dc2626" }}>🔥 Hot Board (Top Unsigned)</div>
            <div className="hub-wb hub-wb-tight">
              {recruits
                .filter(r => r.class_year === classYear && r.status === "unsigned")
                .sort((a, b) => (b.star_rating || 0) - (a.star_rating || 0))
                .slice(0, 5)
                .map((r, i) => (
                  <div key={r.id} style={{ padding: "8px 14px", borderBottom: "1px solid var(--g100)", fontSize: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>
                        <strong style={{ color: i < 3 ? "#3b82f6" : "var(--text)" }}>{i + 1}.</strong>{" "}
                        {r.player_name || "Unknown"}
                      </span>
                      {r.star_rating && (
                        <span style={{ color: "#f0a500", fontSize: 10 }}>{"★".repeat(r.star_rating)}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--g400)" }}>
                      {r.school_name} · {r.position}
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

          {/* Quick Links */}
          <div className="hub-widget">
            <div className="hub-wh">Quick Links</div>
            <div className="hub-wb">
              <Link href="/our-guys" className="hub-ql">→ Our Guys</Link>
              <Link href="/search" className="hub-ql">→ Search Players</Link>
              <Link href="/compare" className="hub-ql">→ Compare Players</Link>
              <Link href="/coaches" className="hub-ql">→ Coaches Directory</Link>
            </div>
          </div>

          <PSPPromo size="sidebar" variant={2} />

          {/* External Resources */}
          <div className="hub-widget">
            <div className="hub-wh" style={{ background: "#3b82f6" }}>🔗 Recruiting Resources</div>
            <div className="hub-wb hub-wb-tight">
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

          <PSPPromo size="sidebar" variant={4} />
        </aside>
      </div>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  padding: "5px 8px", borderRadius: 5, border: "1px solid var(--g200)",
  background: "var(--bg)", color: "var(--text)", fontSize: 12,
};
