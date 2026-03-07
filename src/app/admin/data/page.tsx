"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ToastContainer } from "@/components/ui";
import { useToast } from "@/hooks/useToast";

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

// Memoize column config lookup to prevent recalculations
const getColumnConfig = (entity: EntityType) => COLUMNS[entity] || [];
const getEntityOptions = () => ENTITY_TYPES;
const getSportOptions = () => SPORT_FILTER;

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

  // Bulk operations state
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findReplaceField, setFindReplaceField] = useState("");
  const [findValue, setFindValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [previewCount, setPreviewCount] = useState(0);

  const { toasts, removeToast, success: toastSuccess, info: toastInfo } = useToast();

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
    toastSuccess(`Saved ${savedCount} changes.`);
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

  function toggleSelectAll() {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((_, i) => i)));
    }
  }

  function toggleSelectRow(rowIndex: number) {
    const next = new Set(selectedRows);
    if (next.has(rowIndex)) {
      next.delete(rowIndex);
    } else {
      next.add(rowIndex);
    }
    setSelectedRows(next);
  }

  async function deleteSelected() {
    if (selectedRows.size === 0) return;
    if (!confirm(`Delete ${selectedRows.size} records? This sets deleted_at timestamp.`)) return;

    const supabase = createClient();
    let deletedCount = 0;

    for (const rowIdx of selectedRows) {
      const record = data[rowIdx];
      const id = record.id;
      const { error } = await supabase
        .from(entity)
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id as number);

      if (!error) deletedCount++;
    }

    setSelectedRows(new Set());
    toastInfo(`Soft-deleted ${deletedCount} records.`);
    fetchData();
  }

  async function setSportForSelected(sport: string) {
    if (selectedRows.size === 0) return;
    if (!sport) return;

    const supabase = createClient();
    let updatedCount = 0;

    for (const rowIdx of selectedRows) {
      const record = data[rowIdx];
      const id = record.id;
      const { error } = await supabase
        .from(entity)
        .update({ sport_id: sport })
        .eq("id", id as number);

      if (!error) updatedCount++;
    }

    setSelectedRows(new Set());
    toastSuccess(`Updated ${updatedCount} records with sport: ${sport}`);
    fetchData();
  }

  function updatePreviewCount() {
    if (!findReplaceField || !findValue) {
      setPreviewCount(0);
      return;
    }
    const count = data.filter((row) => {
      const cellVal = row[findReplaceField]?.toString() || "";
      return cellVal.includes(findValue);
    }).length;
    setPreviewCount(count);
  }

  async function executeFindReplace() {
    if (!findReplaceField || !findValue || previewCount === 0) return;
    if (!confirm(`Replace ${previewCount} occurrences of "${findValue}" in ${findReplaceField}?`)) return;

    const supabase = createClient();
    let replacedCount = 0;

    for (const row of data) {
      const cellVal = row[findReplaceField]?.toString() || "";
      if (cellVal.includes(findValue)) {
        const newVal = cellVal.replace(new RegExp(findValue, "g"), replaceValue);
        const { error } = await supabase
          .from(entity)
          .update({ [findReplaceField]: newVal })
          .eq("id", row.id as number);

        if (!error) replacedCount++;
      }
    }

    setShowFindReplace(false);
    setFindReplaceField("");
    setFindValue("");
    setReplaceValue("");
    setPreviewCount(0);
    toastSuccess(`Replaced ${replacedCount} values.`);
    fetchData();
  }

  useEffect(() => {
    updatePreviewCount();
  }, [findReplaceField, findValue, data]);

  const columns = COLUMNS[entity];
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <>
      <ToastContainer toasts={toasts.map(t => ({ ...t, onClose: removeToast }))} />
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

      {/* Bulk Actions Toolbar */}
      {selectedRows.size > 0 && (
        <div
          className="mb-4 p-4 rounded-lg flex items-center justify-between gap-4"
          style={{ background: "var(--psp-navy)", color: "white" }}
        >
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {selectedRows.size} row{selectedRows.size !== 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex gap-2">
            {entity !== "schools" && entity !== "players" && (
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setSportForSelected(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="filter-select text-sm"
                defaultValue=""
              >
                <option value="">Set Sport...</option>
                <option value="football">Football</option>
                <option value="basketball">Basketball</option>
                <option value="baseball">Baseball</option>
                <option value="track-field">Track & Field</option>
                <option value="lacrosse">Lacrosse</option>
                <option value="wrestling">Wrestling</option>
                <option value="soccer">Soccer</option>
              </select>
            )}
            <button
              onClick={() => setShowFindReplace(!showFindReplace)}
              className="px-3 py-1 text-sm rounded"
              style={{ background: "var(--psp-navy-mid)", color: "var(--psp-gold)" }}
            >
              Find & Replace
            </button>
            <button
              onClick={deleteSelected}
              className="px-3 py-1 text-sm rounded"
              style={{ background: "#dc2626", color: "white" }}
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Find & Replace Modal */}
      {showFindReplace && (
        <div
          className="mb-4 p-4 rounded-lg"
          style={{ background: "#f3f4f6", border: "1px solid var(--psp-gold)" }}
        >
          <div className="grid grid-cols-5 gap-3 items-end">
            <div>
              <label className="text-xs font-semibold">Field</label>
              <select
                value={findReplaceField}
                onChange={(e) => setFindReplaceField(e.target.value)}
                className="filter-select w-full text-sm mt-1"
              >
                <option value="">Choose field...</option>
                {COLUMNS[entity].map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold">Find</label>
              <input
                type="text"
                placeholder="Search text"
                value={findValue}
                onChange={(e) => setFindValue(e.target.value)}
                className="filter-input w-full text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Replace</label>
              <input
                type="text"
                placeholder="Replacement text"
                value={replaceValue}
                onChange={(e) => setReplaceValue(e.target.value)}
                className="filter-input w-full text-sm mt-1"
              />
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-600">Preview</div>
              <div style={{ color: "var(--psp-navy)", fontSize: 18, fontWeight: 700 }}>
                {previewCount}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={executeFindReplace}
                disabled={previewCount === 0}
                className="px-3 py-1 text-sm rounded text-white disabled:opacity-40"
                style={{ background: "var(--psp-navy)" }}
              >
                Execute
              </button>
              <button
                onClick={() => setShowFindReplace(false)}
                className="px-3 py-1 text-sm rounded"
                style={{ background: "white", border: "1px solid #d1d5db" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
                <th style={{ width: 40 }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.size === data.length && data.length > 0}
                    onChange={toggleSelectAll}
                    style={{ cursor: "pointer" }}
                  />
                </th>
                {columns.map((col) => (
                  <th key={col}>{col.replace(/_/g, " ")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={selectedRows.has(rowIndex) ? { background: "var(--psp-gold)", opacity: 0.15 } : {}}
                >
                  <td style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(rowIndex)}
                      onChange={() => toggleSelectRow(rowIndex)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
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
    </>
  );
}
