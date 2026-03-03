import { createClient } from "@/lib/supabase/server";

interface StatCard {
  label: string;
  value: number | string;
  icon: string;
  color: string;
}

async function getStats() {
  const supabase = await createClient();

  // Fetch counts for all major entity types
  const [schools, players, teamSeasons, championships, awards, playerSeasons, conflicts] =
    await Promise.all([
      supabase.from("schools").select("id", { count: "exact", head: true }),
      supabase.from("players").select("id", { count: "exact", head: true }),
      supabase.from("team_seasons").select("id", { count: "exact", head: true }),
      supabase.from("championships").select("id", { count: "exact", head: true }),
      supabase.from("awards").select("id", { count: "exact", head: true }),
      supabase.from("player_seasons_football").select("id", { count: "exact", head: true }),
      supabase.from("data_conflicts").select("id", { count: "exact", head: true }).eq("resolution_status", "pending"),
    ]);

  return {
    schools: schools.count ?? 0,
    players: players.count ?? 0,
    teamSeasons: teamSeasons.count ?? 0,
    championships: championships.count ?? 0,
    awards: awards.count ?? 0,
    playerSeasons: playerSeasons.count ?? 0,
    pendingConflicts: conflicts.count ?? 0,
  };
}

async function getSportBreakdown() {
  const supabase = await createClient();

  const sports = ["football", "basketball", "baseball", "track-field", "lacrosse", "wrestling", "soccer"];
  const breakdown = [];

  for (const sport of sports) {
    const [players, teams, champs] = await Promise.all([
      supabase.from("player_seasons_football").select("id", { count: "exact", head: true }).eq("sport_id", sport),
      supabase.from("team_seasons").select("id", { count: "exact", head: true }).eq("sport_id", sport),
      supabase.from("championships").select("id", { count: "exact", head: true }).eq("sport_id", sport),
    ]);

    breakdown.push({
      sport,
      playerSeasons: players.count ?? 0,
      teamSeasons: teams.count ?? 0,
      championships: champs.count ?? 0,
    });
  }

  return breakdown;
}

export default async function AdminDashboard() {
  // These will fail gracefully if Supabase isn't connected yet
  let stats = {
    schools: 0, players: 0, teamSeasons: 0, championships: 0,
    awards: 0, playerSeasons: 0, pendingConflicts: 0,
  };
  let sportBreakdown: { sport: string; playerSeasons: number; teamSeasons: number; championships: number }[] = [];
  let dbConnected = true;

  try {
    stats = await getStats();
    sportBreakdown = await getSportBreakdown();
  } catch {
    dbConnected = false;
  }

  const statCards: StatCard[] = [
    { label: "Schools", value: stats.schools, icon: "🏫", color: "#3b82f6" },
    { label: "Players", value: stats.players, icon: "🏈", color: "#22c55e" },
    { label: "Team Seasons", value: stats.teamSeasons, icon: "📅", color: "#8b5cf6" },
    { label: "Championships", value: stats.championships, icon: "🏆", color: "#f0a500" },
    { label: "Awards", value: stats.awards, icon: "🌟", color: "#ec4899" },
    { label: "Player Stat Records", value: stats.playerSeasons, icon: "📊", color: "#06b6d4" },
  ];

  const sportEmoji: Record<string, string> = {
    football: "🏈",
    basketball: "🏀",
    baseball: "⚾",
    "track-field": "🏃",
    lacrosse: "🥍",
    wrestling: "🤼",
    soccer: "⚽",
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "var(--psp-navy)" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--psp-gray-500)" }}>
          PhillySportsPack.com data overview
        </p>
      </div>

      {/* Connection status */}
      {!dbConnected && (
        <div className="badge-warning p-4 rounded-lg mb-6 text-sm">
          <strong>Database not connected.</strong> Add your Supabase credentials to{" "}
          <code className="bg-yellow-100 px-1 rounded">.env.local</code> and run
          the migration to populate the database.
        </div>
      )}

      {/* Pending conflicts alert */}
      {stats.pendingConflicts > 0 && (
        <div className="badge-error p-4 rounded-lg mb-6 text-sm flex items-center justify-between">
          <span>
            <strong>{stats.pendingConflicts} pending conflicts</strong> need your
            review.
          </span>
          <a href="/admin/conflicts" className="btn-primary text-xs px-3 py-1">
            Review Now
          </a>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="admin-card text-center">
            <div className="text-2xl mb-1">{card.icon}</div>
            <div className="admin-stat" style={{ color: card.color }}>
              {typeof card.value === "number"
                ? card.value.toLocaleString()
                : card.value}
            </div>
            <div
              className="text-xs font-medium mt-1"
              style={{ color: "var(--psp-gray-500)" }}
            >
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Sport breakdown table */}
      <div className="admin-card">
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: "var(--psp-navy)" }}
        >
          Data by Sport
        </h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Sport</th>
              <th className="text-right">Player Seasons</th>
              <th className="text-right">Team Seasons</th>
              <th className="text-right">Championships</th>
            </tr>
          </thead>
          <tbody>
            {sportBreakdown.map((row) => (
              <tr key={row.sport}>
                <td className="font-medium">
                  {sportEmoji[row.sport] || "🏅"}{" "}
                  {row.sport.charAt(0).toUpperCase() +
                    row.sport.slice(1).replace("-", " & ")}
                </td>
                <td className="text-right">
                  {row.playerSeasons.toLocaleString()}
                </td>
                <td className="text-right">
                  {row.teamSeasons.toLocaleString()}
                </td>
                <td className="text-right">
                  {row.championships.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <a href="/admin/import" className="admin-card hover:shadow-md transition-shadow">
          <h3 className="font-bold mb-1" style={{ color: "var(--psp-navy)" }}>
            📥 Import Data
          </h3>
          <p className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
            Upload HTML, CSV, XLSX, or JSON files
          </p>
        </a>
        <a href="/admin/data" className="admin-card hover:shadow-md transition-shadow">
          <h3 className="font-bold mb-1" style={{ color: "var(--psp-navy)" }}>
            🔍 Browse Data
          </h3>
          <p className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
            Search, filter, and edit records
          </p>
        </a>
        <a href="/admin/conflicts" className="admin-card hover:shadow-md transition-shadow">
          <h3 className="font-bold mb-1" style={{ color: "var(--psp-navy)" }}>
            ⚠️ Resolve Conflicts
          </h3>
          <p className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
            Review and resolve data discrepancies
          </p>
        </a>
      </div>
    </div>
  );
}
