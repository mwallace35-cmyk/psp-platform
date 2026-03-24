import Link from "next/link";
import { getMilestoneAlerts } from "@/lib/data/milestones";

export default async function MilestoneTracker() {
  const milestones = await getMilestoneAlerts(undefined, 3);

  if (milestones.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(240, 165, 0, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
        border: "1px solid rgba(240, 165, 0, 0.3)",
        borderRadius: "8px",
        padding: "1.25rem",
        marginBottom: "1.5rem",
      }}
    >
      <h3
        style={{
          fontSize: "0.95rem",
          fontWeight: 700,
          color: "var(--psp-gold)",
          marginBottom: "1rem",
          marginTop: 0,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span aria-hidden="true">🎯</span> Watch These Milestones
      </h3>

      <div style={{ display: "grid", gap: "0.75rem" }}>
        {milestones.map((milestone) => {
          const percentComplete =
            ((milestone.current_value - 0) /
              (milestone.milestone_target - 0)) *
            100;
          const statLabel =
            milestone.stat_type === "rush_yards"
              ? "Rushing Yards"
              : milestone.stat_type === "rec_yards"
              ? "Receiving Yards"
              : milestone.stat_type === "pass_yards"
              ? "Passing Yards"
              : milestone.stat_type === "points"
              ? "Points"
              : milestone.stat_type;

          return (
            <Link
              key={milestone.id}
              href={`/football/players/${(milestone.players as any)?.slug || ""}`}
              style={{
                display: "block",
                padding: "0.75rem",
                borderRadius: "6px",
                background: "rgba(10, 22, 40, 0.5)",
                border: "1px solid rgba(240, 165, 0, 0.2)",
                textDecoration: "none",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as any).style.background =
                  "rgba(10, 22, 40, 0.7)";
                (e.currentTarget as any).style.borderColor =
                  "rgba(240, 165, 0, 0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as any).style.background =
                  "rgba(10, 22, 40, 0.5)";
                (e.currentTarget as any).style.borderColor =
                  "rgba(240, 165, 0, 0.2)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "0.4rem",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#ccc",
                  }}
                >
                  {(milestone.players as any)?.name || "Unknown"}
                </p>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--psp-gold)",
                    fontWeight: 700,
                  }}
                >
                  {milestone.remaining.toFixed(0)} to go
                </span>
              </div>

              <p
                style={{
                  margin: "0 0 0.4rem 0",
                  fontSize: "0.8rem",
                  color: "#999",
                }}
              >
                {statLabel} ({Math.floor(milestone.current_value)}/
                {milestone.milestone_target})
              </p>

              {/* Progress bar */}
              <div
                style={{
                  height: "6px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(percentComplete, 100)}%`,
                    background: "linear-gradient(90deg, var(--psp-gold) 0%, #d99c0d 100%)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              {milestone.projected_games_to_reach && (
                <p
                  style={{
                    margin: "0.4rem 0 0 0",
                    fontSize: "0.75rem",
                    color: "#666",
                  }}
                >
                  ~{milestone.projected_games_to_reach} game
                  {(milestone.projected_games_to_reach ?? 0) > 1 ? "s" : ""} away
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
