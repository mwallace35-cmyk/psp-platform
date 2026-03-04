"use client";

import StarRating from "./StarRating";
import ExternalLinks from "./ExternalLinks";

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

interface RecruitingBoardProps {
  recruits: Recruit[];
  sportColor?: string;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  unsigned: { bg: "var(--g100)", color: "var(--g500)", label: "Unsigned" },
  committed: { bg: "#16a34a", color: "#fff", label: "Committed" },
  signed: { bg: "#f0a500", color: "#0a1628", label: "Signed" },
  enrolled: { bg: "#3b82f6", color: "#fff", label: "Enrolled" },
  decommitted: { bg: "#dc2626", color: "#fff", label: "Decommitted" },
};

export default function RecruitingBoard({ recruits, sportColor = "#f0a500" }: RecruitingBoardProps) {
  if (recruits.length === 0) {
    return (
      <div style={{
        padding: 40,
        textAlign: "center",
        color: "var(--g400)",
        background: "var(--card)",
        borderRadius: 8,
        border: "1px solid var(--g100)",
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>No recruits found</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>
          Recruiting profiles will appear here once added by admins.
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hide-mobile" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${sportColor}` }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>School</th>
              <th style={thStyle}>Pos</th>
              <th style={thStyle}>Stars</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Committed To</th>
              <th style={thStyle}>Links</th>
            </tr>
          </thead>
          <tbody>
            {recruits.map((r, i) => {
              const status = STATUS_STYLES[r.status || "unsigned"] || STATUS_STYLES.unsigned;
              return (
                <tr key={r.id} style={{ borderBottom: "1px solid var(--g100)" }}>
                  <td style={{ ...tdStyle, fontWeight: 700, color: i < 3 ? sportColor : "var(--g400)" }}>
                    {i + 1}
                  </td>
                  <td style={tdStyle}>
                    <strong>{r.player_name || "Unknown"}</strong>
                    {r.height && r.weight && (
                      <div style={{ fontSize: 10, color: "var(--g400)" }}>{r.height} / {r.weight} lbs</div>
                    )}
                  </td>
                  <td style={tdStyle}>{r.school_name || "—"}</td>
                  <td style={tdStyle}>{r.position || "—"}</td>
                  <td style={tdStyle}>
                    {r.star_rating ? <StarRating rating={r.star_rating} size={12} /> : "—"}
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                      padding: "2px 6px", borderRadius: 3,
                      background: status.bg, color: status.color,
                    }}>
                      {status.label}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {r.committed_school ? (
                      <span style={{ fontWeight: 600, color: "#16a34a" }}>{r.committed_school}</span>
                    ) : "—"}
                  </td>
                  <td style={tdStyle}>
                    <ExternalLinks
                      url_247={r.url_247}
                      url_rivals={r.url_rivals}
                      url_on3={r.url_on3}
                      url_maxpreps={r.url_maxpreps}
                      url_hudl={r.url_hudl}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="show-mobile" style={{ display: "none" }}>
        {recruits.map((r, i) => {
          const status = STATUS_STYLES[r.status || "unsigned"] || STATUS_STYLES.unsigned;
          return (
            <div key={r.id} style={{
              background: "var(--card)",
              border: "1px solid var(--g100)",
              borderRadius: 8,
              padding: 14,
              marginBottom: 10,
              borderLeft: i < 3 ? `3px solid ${sportColor}` : undefined,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: i < 3 ? sportColor : "var(--g400)", marginRight: 6 }}>#{i + 1}</span>
                  <strong style={{ fontSize: 13 }}>{r.player_name || "Unknown"}</strong>
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                  padding: "2px 6px", borderRadius: 3,
                  background: status.bg, color: status.color,
                }}>
                  {status.label}
                </span>
              </div>
              <div style={{ fontSize: 11, color: "var(--g500)", lineHeight: 1.6 }}>
                {r.school_name && <div>🏫 {r.school_name}</div>}
                {r.position && <div>📍 {r.position}{r.height ? ` • ${r.height}` : ""}{r.weight ? ` / ${r.weight} lbs` : ""}</div>}
                {r.star_rating && <div style={{ marginTop: 4 }}><StarRating rating={r.star_rating} size={12} /></div>}
                {r.committed_school && (
                  <div style={{ color: "#16a34a", fontWeight: 600, marginTop: 4 }}>→ {r.committed_school}</div>
                )}
              </div>
              <div style={{ marginTop: 8 }}>
                <ExternalLinks
                  url_247={r.url_247}
                  url_rivals={r.url_rivals}
                  url_on3={r.url_on3}
                  url_maxpreps={r.url_maxpreps}
                  url_hudl={r.url_hudl}
                />
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </>
  );
}

const thStyle: React.CSSProperties = { textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 700, color: "var(--g400)", textTransform: "uppercase" };
const tdStyle: React.CSSProperties = { padding: "8px 10px", verticalAlign: "middle" };
