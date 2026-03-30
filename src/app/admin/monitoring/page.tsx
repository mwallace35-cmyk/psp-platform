export const dynamic = "force-dynamic";

import { createClient } from "@/lib/data/common";

// ============================================================================
// Types
// ============================================================================

interface CronLog {
  id: number;
  cron_name: string;
  league: string | null;
  run_date: string | null;
  status: string;
  games_fetched: number;
  philly_games: number;
  players_matched: number;
  narratives_generated: number;
  dyk_generated: number;
  input_tokens: number;
  output_tokens: number;
  cost_cents: number;
  errors: unknown[];
  duration_ms: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface AiRecap {
  id: number;
  league: string | null;
  recap_type: string | null;
  model_used: string | null;
  prompt_tokens: number;
  completion_tokens: number;
  cost_cents: number;
  created_at: string;
}

// ============================================================================
// Data Fetching
// ============================================================================

async function getCronLogs() {
  const supabase = await createClient();
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  // Recent 20 runs
  const { data: recentRuns } = await (supabase as any)
    .from("cron_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  // Summary stats (last 7 days)
  const { data: weekRuns } = await (supabase as any)
    .from("cron_logs")
    .select("*")
    .gte("created_at", sevenDaysAgo)
    .order("created_at", { ascending: false });

  // Error runs (last 30 days)
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();
  const { data: errorRuns } = await (supabase as any)
    .from("cron_logs")
    .select("*")
    .gte("created_at", thirtyDaysAgo)
    .neq("status", "success")
    .order("created_at", { ascending: false })
    .limit(20);

  return {
    recentRuns: (recentRuns || []) as CronLog[],
    weekRuns: (weekRuns || []) as CronLog[],
    errorRuns: (errorRuns || []) as CronLog[],
  };
}

async function getAiCosts() {
  const supabase = await createClient();
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: recaps } = await (supabase as any)
    .from("ai_recaps")
    .select(
      "id, league, recap_type, model_used, prompt_tokens, completion_tokens, cost_cents, created_at"
    )
    .gte("created_at", sevenDaysAgo)
    .order("created_at", { ascending: false });

  return (recaps || []) as AiRecap[];
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatDuration(ms: number | null): string {
  if (!ms) return "--";
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

function formatCost(cents: number): string {
  if (cents < 1) return `<1c`;
  if (cents < 100) return `${cents.toFixed(1)}c`;
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

// ============================================================================
// Page Component
// ============================================================================

export default async function MonitoringDashboard() {
  let cronData = { recentRuns: [] as CronLog[], weekRuns: [] as CronLog[], errorRuns: [] as CronLog[] };
  let aiRecaps: AiRecap[] = [];
  let dbError = false;

  try {
    [cronData, aiRecaps] = await Promise.all([getCronLogs(), getAiCosts()]);
  } catch {
    dbError = true;
  }

  const { recentRuns, weekRuns, errorRuns } = cronData;

  // Summary calculations
  const totalRuns = weekRuns.length;
  const successRuns = weekRuns.filter((r) => r.status === "success").length;
  const successRate = totalRuns > 0 ? ((successRuns / totalRuns) * 100).toFixed(1) : "0";
  const totalCronCost = weekRuns.reduce((s, r) => s + Number(r.cost_cents || 0), 0);
  const totalAiCost = aiRecaps.reduce((s, r) => s + Number(r.cost_cents || 0), 0);
  const totalCost = totalCronCost + totalAiCost;
  const avgDuration =
    weekRuns.length > 0
      ? weekRuns.reduce((s, r) => s + (r.duration_ms || 0), 0) / weekRuns.length
      : 0;

  // AI cost breakdowns
  const totalTokens = aiRecaps.reduce(
    (s, r) => s + (r.prompt_tokens || 0) + (r.completion_tokens || 0),
    0
  );
  const costByLeague: Record<string, number> = {};
  const costByDay: Record<string, number> = {};
  for (const r of aiRecaps) {
    const league = r.league || "unknown";
    costByLeague[league] = (costByLeague[league] || 0) + Number(r.cost_cents || 0);
    const day = new Date(r.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    costByDay[day] = (costByDay[day] || 0) + Number(r.cost_cents || 0);
  }

  // ============================================================================
  // Styles
  // ============================================================================

  const styles = {
    page: {
      fontFamily: "'DM Sans', sans-serif",
      color: "#e2e8f0",
    } as React.CSSProperties,
    heading: {
      fontFamily: "'Bebas Neue', cursive",
      letterSpacing: "0.05em",
    } as React.CSSProperties,
    card: {
      background: "#0f2040",
      borderRadius: "12px",
      border: "1px solid rgba(240, 165, 0, 0.15)",
      padding: "20px",
    } as React.CSSProperties,
    summaryCard: {
      background: "#0f2040",
      borderRadius: "12px",
      border: "1px solid rgba(240, 165, 0, 0.15)",
      padding: "20px 24px",
      flex: "1",
      minWidth: "180px",
    } as React.CSSProperties,
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
      fontSize: "14px",
    } as React.CSSProperties,
    th: {
      textAlign: "left" as const,
      padding: "10px 12px",
      borderBottom: "1px solid rgba(240, 165, 0, 0.2)",
      color: "#f0a500",
      fontWeight: 600,
      fontSize: "12px",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
    } as React.CSSProperties,
    td: {
      padding: "10px 12px",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    } as React.CSSProperties,
    badge: (status: string) => ({
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 600,
      background:
        status === "success"
          ? "rgba(34, 197, 94, 0.15)"
          : status === "partial"
            ? "rgba(234, 179, 8, 0.15)"
            : "rgba(239, 68, 68, 0.15)",
      color:
        status === "success"
          ? "#22c55e"
          : status === "partial"
            ? "#eab308"
            : "#ef4444",
    }) as React.CSSProperties,
    sectionTitle: {
      fontFamily: "'Bebas Neue', cursive",
      fontSize: "22px",
      color: "#f0a500",
      letterSpacing: "0.05em",
      marginBottom: "16px",
    } as React.CSSProperties,
    errorBlock: {
      background: "rgba(239, 68, 68, 0.08)",
      border: "1px solid rgba(239, 68, 68, 0.2)",
      borderRadius: "8px",
      padding: "12px 16px",
      marginBottom: "12px",
      fontSize: "13px",
    } as React.CSSProperties,
    muted: {
      color: "#94a3b8",
      fontSize: "13px",
    } as React.CSSProperties,
  };

  // ============================================================================
  // Render
  // ============================================================================

  if (dbError) {
    return (
      <div style={styles.page}>
        <h1 style={{ ...styles.heading, fontSize: "32px", color: "#f0a500" }}>
          SYSTEM MONITORING
        </h1>
        <div style={{ ...styles.card, marginTop: "24px", textAlign: "center", padding: "60px 20px" }}>
          <p style={{ fontSize: "18px", color: "#ef4444" }}>
            Could not connect to database
          </p>
          <p style={styles.muted}>
            Check that cron_logs and ai_recaps tables exist in Supabase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Page Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            ...styles.heading,
            fontSize: "32px",
            color: "#f0a500",
            margin: 0,
          }}
        >
          SYSTEM MONITORING
        </h1>
        <p style={{ ...styles.muted, marginTop: "4px" }}>
          Cron jobs, AI costs, and system health -- last 7 days
        </p>
      </div>

      {/* ================================================================== */}
      {/* Summary Cards */}
      {/* ================================================================== */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "32px",
        }}
      >
        {/* Total Runs */}
        <div style={styles.summaryCard}>
          <div style={{ ...styles.muted, marginBottom: "4px" }}>
            Cron Runs (7d)
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#fff",
              ...styles.heading,
            }}
          >
            {totalRuns}
          </div>
        </div>

        {/* Success Rate */}
        <div style={styles.summaryCard}>
          <div style={{ ...styles.muted, marginBottom: "4px" }}>
            Success Rate
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color:
                Number(successRate) >= 90
                  ? "#22c55e"
                  : Number(successRate) >= 70
                    ? "#eab308"
                    : "#ef4444",
              ...styles.heading,
            }}
          >
            {successRate}%
          </div>
        </div>

        {/* Total AI Cost */}
        <div style={styles.summaryCard}>
          <div style={{ ...styles.muted, marginBottom: "4px" }}>
            Total AI Cost (7d)
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#f0a500",
              ...styles.heading,
            }}
          >
            {formatCost(totalCost)}
          </div>
        </div>

        {/* Avg Duration */}
        <div style={styles.summaryCard}>
          <div style={{ ...styles.muted, marginBottom: "4px" }}>
            Avg Duration
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#fff",
              ...styles.heading,
            }}
          >
            {formatDuration(Math.round(avgDuration))}
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Recent Cron Runs Table */}
      {/* ================================================================== */}
      <div style={{ ...styles.card, marginBottom: "32px" }}>
        <h2 style={styles.sectionTitle}>RECENT CRON RUNS</h2>
        {recentRuns.length === 0 ? (
          <p style={styles.muted}>No cron runs recorded yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Cron</th>
                  <th style={styles.th}>League</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Games</th>
                  <th style={styles.th}>Matched</th>
                  <th style={styles.th}>Narratives</th>
                  <th style={styles.th}>Duration</th>
                  <th style={styles.th}>Cost</th>
                  <th style={styles.th}>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentRuns.map((run) => (
                  <tr
                    key={run.id}
                    style={{
                      transition: "background 0.15s",
                    }}
                  >
                    <td style={{ ...styles.td, fontWeight: 600, color: "#fff" }}>
                      {run.cron_name}
                    </td>
                    <td style={styles.td}>{run.league || "--"}</td>
                    <td style={styles.td}>
                      <span style={styles.badge(run.status)}>{run.status}</span>
                    </td>
                    <td style={styles.td}>{run.games_fetched}</td>
                    <td style={styles.td}>{run.players_matched}</td>
                    <td style={styles.td}>{run.narratives_generated}</td>
                    <td style={styles.td}>{formatDuration(run.duration_ms)}</td>
                    <td style={styles.td}>{formatCost(Number(run.cost_cents || 0))}</td>
                    <td style={{ ...styles.td, ...styles.muted }}>
                      {formatDate(run.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* AI Cost Breakdown */}
      {/* ================================================================== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {/* Cost Summary */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>AI COST SUMMARY (7D)</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div>
              <div style={styles.muted}>Total Tokens</div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#fff", ...styles.heading }}>
                {formatNumber(totalTokens)}
              </div>
            </div>
            <div>
              <div style={styles.muted}>Total Cost</div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#f0a500", ...styles.heading }}>
                {formatCost(totalAiCost)}
              </div>
            </div>
            <div>
              <div style={styles.muted}>Recaps Generated</div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#fff", ...styles.heading }}>
                {aiRecaps.length}
              </div>
            </div>
            <div>
              <div style={styles.muted}>Avg Cost/Recap</div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#fff", ...styles.heading }}>
                {aiRecaps.length > 0
                  ? formatCost(totalAiCost / aiRecaps.length)
                  : "--"}
              </div>
            </div>
          </div>
        </div>

        {/* Cost by League */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>COST BY LEAGUE</h2>
          {Object.keys(costByLeague).length === 0 ? (
            <p style={styles.muted}>No AI recap data in the last 7 days.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {Object.entries(costByLeague)
                .sort((a, b) => b[1] - a[1])
                .map(([league, cost]) => {
                  const maxCost = Math.max(...Object.values(costByLeague));
                  const pct = maxCost > 0 ? (cost / maxCost) * 100 : 0;
                  return (
                    <div key={league}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "4px",
                        }}
                      >
                        <span style={{ fontWeight: 600, color: "#fff", textTransform: "capitalize" }}>
                          {league}
                        </span>
                        <span style={{ color: "#f0a500", fontWeight: 600 }}>
                          {formatCost(cost)}
                        </span>
                      </div>
                      <div
                        style={{
                          height: "6px",
                          background: "rgba(255,255,255,0.08)",
                          borderRadius: "3px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: "#f0a500",
                            borderRadius: "3px",
                            transition: "width 0.3s",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Cost by Day */}
      <div style={{ ...styles.card, marginBottom: "32px" }}>
        <h2 style={styles.sectionTitle}>DAILY AI SPEND (LAST 7 DAYS)</h2>
        {Object.keys(costByDay).length === 0 ? (
          <p style={styles.muted}>No AI spend data in the last 7 days.</p>
        ) : (
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-end",
              height: "160px",
              paddingTop: "20px",
            }}
          >
            {Object.entries(costByDay)
              .reverse()
              .map(([day, cost]) => {
                const maxDay = Math.max(...Object.values(costByDay));
                const pct = maxDay > 0 ? (cost / maxDay) * 100 : 0;
                return (
                  <div
                    key={day}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#f0a500",
                        fontWeight: 600,
                      }}
                    >
                      {formatCost(cost)}
                    </span>
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "60px",
                        height: `${Math.max(pct, 4)}%`,
                        background:
                          "linear-gradient(to top, #f0a500, rgba(240, 165, 0, 0.5))",
                        borderRadius: "4px 4px 0 0",
                        minHeight: "4px",
                      }}
                    />
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                      {day}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* Error Log */}
      {/* ================================================================== */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>ERROR LOG (LAST 30 DAYS)</h2>
        {errorRuns.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
            }}
          >
            <span style={{ fontSize: "24px" }}>All clear</span>
            <p style={styles.muted}>
              No errors or partial failures in the last 30 days.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {errorRuns.map((run) => (
              <div key={run.id} style={styles.errorBlock}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, color: "#fff" }}>
                      {run.cron_name}
                    </span>
                    <span style={styles.badge(run.status)}>{run.status}</span>
                    {run.league && (
                      <span style={{ ...styles.muted, textTransform: "capitalize" }}>
                        {run.league}
                      </span>
                    )}
                  </div>
                  <span style={styles.muted}>{formatDate(run.created_at)}</span>
                </div>
                {Array.isArray(run.errors) && run.errors.length > 0 && (
                  <pre
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "#fca5a5",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      lineHeight: 1.5,
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    {JSON.stringify(run.errors, null, 2)}
                  </pre>
                )}
                {run.duration_ms && (
                  <div style={{ ...styles.muted, marginTop: "6px" }}>
                    Duration: {formatDuration(run.duration_ms)} | Games
                    fetched: {run.games_fetched} | Cost:{" "}
                    {formatCost(Number(run.cost_cents || 0))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
