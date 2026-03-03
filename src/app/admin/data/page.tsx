"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type EntityType = "schools" | "players" | "team_seasons" | "championships" | "awards";

const ENTITY_TYPES: { value: EntityType; label: string; icon: string }[] = [
  { value: "schools", label: "Schools", icon: "🏫" },
  { value: "players", label: "Players", icon: "🏈" },
  { value: "team_seasons", label: "Team Seasons", icon: "📅" },
  { value: "championships", label: "Championships", icon: "🏆" },
  { value: "awards", label: "Awards", icon: "🌟" },
];

const SPORT_FILTER = [
  { value: "", label: "All Sports" },
  { value: "football", label: "Football" },
  { value: "basketball", label: "Basketball" },
  { value: "baseball", label: "Baseball" },
  { value: "track-field", label: "Track & Field" },
  { value: "lacrosse", label: "Lacrosse" },
  { value: "wrestling", label: "Wrestling" },
  { value: "soccer", label: "Soccer" },
];

const PAGE_SIZE = 25;

// Column configs per entity type
const COLUMNS: Record<EntityType, string[]> = {
  schools: ["id", "name", "short_name", "city", "state"],
  players: ["id", "name", "slug", "position"],
  team_seasons: ["id", "school_id", "season_id", "sport_id", "wins", "losses", "ties", "win_pct"],
  championships: ["id", "school_id", "season_id", "sport_id", "level", "result", "score"],
  awards: ["id", "player_id", "school_id", "season_id", "sport_id", "award_type", "category", "position"],
};

export default function DataBrowser() {
  const [entity, setEntity] = useState<EntityType>("schools");
  const [sportFilter, setSportFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Map<string, { row: number; col: string; oldVal: unknown; newVal: string }>>(new Map());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from(entity)
        .select("*", { count: "exact" })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
        .order("id", { ascending: true });

      // Apply sport filter if entity has sport_id
      if (sportFilter && entity !== "schools" && entity !== "players") {
        query = query.eq("sport_id", sportFilter);
      }

      // Apply search for name-based entities
      if (searchQuery) {
        if (entity === "schools" || entity === "players") {
          query = query.ilike("name", `%${searchQuery}%`);
        }
      }

      const { data: rows, count, error } = await query;
      if (error) throw error;

      setData(rows || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Fetch error:", err);
      setData([]);
      setTotalCount(0);
    }
    setLoading(false);
  }, [entity, sportFilter, searchQuery, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function startEdit(rowIndex: number, col: string) {
    const val = data[rowIndex][col];
    setEditingCell({ row: rowIndex, col });
    setEditValue(val?.toString() || "");
  }

  function cancelEdit() {
    setEditingCell(null);
    setEditValue("");
  }

  function applyEdit() {
    if (!editingCell) return;
    const { row, col } = editingCell;
    const oldVal = data[row][col];
    if (editValue !== oldVal?.toString()) {
      const key = `${row}-${col}`;
      setPendingChanges((prev) => {
        const next = new Map(prev);
        next.set(key, { row, col, oldVal, newVal: editValue });
        return next;
      });
      setData((prev) => {
        const next = [...prev];
        next[row] = { ...next[row], [col]: editValue };
        return next;
      });
      setHasChanges(true);
    }
    cancelEdit();
  }

  async function saveChanges() {
    const supabase = createClient();
    let savedCount = 0;

    for (const change of pendingChanges.values()) {
      const record = data[change.row];
      const id = record.id;
      const { error } = await supabase
        .from(entity)
        .update({ [change.col]: change.newVal })
        .eq("id", id as number);

      if (!error) savedCount++;
    }

    setPendingChanges(new Map());
    setHasChanges(false);
    alert(`Saved ${savedCount} changes.`);
    fetchData();
  }

  async function exportCSV() {
    const supabase = createClient();
    let query = supabase.from(entity).select("*").order("id");
    if (sportFilter && entity !== "schools" && entity !== "players") {
      query = query.eq("sport_id", sportFilter);
    }
    if (searchQuery && (entity === "schools" || entity === "players")) {
      query = query.ilike("name", `%${searchQuery}%`);
    }
    const { data: rows } = await query;
    if (!rows || rows.length === 0) return;

    const cols = Object.keys(rows[0]);
    const csv = [
      cols.join(","),
      ...rows.map((r) => cols.map((c) => `"${(r[c] ?? "").toString().replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `psp_${entity}_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const columns = COLUMNS[entity];
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--psp-navy)" }}>
            Data Browser
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--psp-gray-500)" }}>
            Search, filter, and edit records ({totalCount.toLocaleString()} total)
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-outline text-sm">
            Export CSV
          </button>
          {hasChanges && (
            <button onClick={saveChanges} className="btn-primary text-sm">
              Save Changes ({pendingChanges.size})
            </button>
          )}
        </div>
      </div>

      {/* Entity type tabs */}
      <div className="flex gap-1 mb-4">
        {ENTITY_TYPES.map((et) => (
          <button
            key={et.value}
            onClick={() => { setEntity(et.value); setPage(0); }}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              entity === et.value ? "text-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
            style={entity === et.value ? { background: "var(--psp-navy)" } : {}}
          >
            {et.icon} {et.label}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="filter-bar mb-4">
        <input
          type="text"
          placeholder={`Search ${entity}...`}
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
          className="filter-input"
        />
        {entity !== "schools" && entity !== "players" && (
          <select
            value={sportFilter}
            onChange={(e) => { setSportFilter(e.target.value); setPage(0); }}
            className="filter-select"
          >
            {SPORT_FILTER.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Data table */}
      <div className="admin-card overflow-x-auto">
        {loading ? (
          <div className="text-center py-12" style={{ color: "var(--psp-gray-400)" }}>
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12" style={{ color: "var(--psp-gray-400)" }}>
            No records found. {!sportFilter && !searchQuery && "Connect to Supabase and run migrations to populate data."}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col.replace(/_/g, " ")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col) => {
                    const isEditing = editingCell?.row === rowIndex && editingCell?.col === col;
                    const isPending = pendingChanges.has(`${rowIndex}-${col}`);

                    return (
                      <td
                        key={col}
                        className={`cursor-pointer ${isPending ? "bg-yellow-50" : ""}`}
                        onDoubleClick={() => col !== "id" && startEdit(rowIndex, col)}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={applyEdit}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") applyEdit();
                              if (e.key === "Escape") cancelEdit();
                            }}
                            autoFocus
                            className="filter-input w-full text-sm p-1"
                          />
                        ) : (
                          <span className={isPending ? "font-medium text-yellow-700" : ""}>
                            {row[col]?.toString() || "—"}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="btn-outline text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="btn-outline text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Help text */}
      <p className="text-xs mt-4" style={{ color: "var(--psp-gray-400)" }}>
        Double-click any cell to edit. Press Enter to apply, Escape to cancel. Click &quot;Save Changes&quot; to commit edits to the database.
      </p>
    </div>
  );
}
