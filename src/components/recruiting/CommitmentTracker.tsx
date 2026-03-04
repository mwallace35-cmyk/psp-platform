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

interface CommitmentTrackerProps {
  commitments: Commitment[];
}

export default function CommitmentTracker({ commitments }: CommitmentTrackerProps) {
  return (
    <div className="widget">
      <div className="w-head">🎯 Recent Commitments</div>
      <div className="w-body">
        {commitments.length === 0 ? (
          <div style={{ padding: 16, textAlign: "center", color: "var(--g400)", fontSize: 12 }}>
            No recent commitments to display.
          </div>
        ) : (
          commitments.slice(0, 8).map(c => (
            <div
              key={c.id}
              style={{
                padding: "8px 14px",
                borderBottom: "1px solid var(--g100)",
                fontSize: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: "var(--text)" }}>{c.player_name || "Unknown"}</strong>
                {c.star_rating && (
                  <span style={{ fontSize: 10, color: "#f0a500" }}>
                    {"★".repeat(c.star_rating)}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: "var(--g400)", marginTop: 2 }}>
                {c.school_name && <span>{c.school_name}</span>}
                {c.position && <span> • {c.position}</span>}
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
  );
}
