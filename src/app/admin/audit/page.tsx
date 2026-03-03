"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface AuditEntry {
  id: number;
  entity_type: string;
  entity_id: number;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  changed_by: string;
  change_source: string | null;
  created_at: string;
}

const PAGE_SIZE = 50;

export default function AuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from("audit_log")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (entityFilter) {
        query = query.eq("entity_type", entityFilter);
      }
      if (dateFrom) {
        query = query.gte("created_at", `${dateFrom}T00:00:00Z`);
      }
      if (dateTo) {
        query = query.lte("created_at", `${dateTo}T23:59:59Z`);
      }

      const { data, count, error } = await query;
      if (error) throw error;
      setEntries(data || []);
      setTotalCount(count || 0);
    } catch {
      setEntries([]);
      setTotalCount(0);
    }
    setLoading(false);
  }, [entityFilter, dateFrom, dateTo, page]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const changeColor = (oldVal: string | null, newVal: string | null) => {
    if (!oldVal && newVal) return "text-green-700"; // Created
    if (oldVal && !newVal) return "text-red-700"; // Deleted
    return "text-yellow-700"; // Modified
  };

  const changeLabel = (oldVal: string | null, newVal: string | null) => {
    if (!oldVal && newVal) return "CREATE";
    if (oldVal && !newVal) return "DELETE";
    return "UPDATE";
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "var(--psp-navy)" }}>
          Audit Log
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--psp-gray-500)" }}>
          Track every change — who, what, when ({totalCount.toLocaleString()} entries)
        </p>
      </div>

      {/* Filters */}
      <div className="filter-bar mb-6">
        <select
          value={entityFilter}
          onChange={(e) => { setEntityFilter(e.target.value); setPage(0); }}
          className="filter-select"
        >
          <option value="">All Entity Types</option>
          <option value="schools">Schools</option>
          <option value="players">Players</option>
          <option value="team_seasons">Team Seasons</option>
          <option value="championships">Championships</option>
          <option value="awards">Awards</option>
          <option value="player_seasons_football">Football Stats</option>
          <option value="player_seasons_basketball">Basketball Stats</option>
        </select>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium" style={{ color: "var(--psp-gray-500)" }}>From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(0); }}
            className="filter-input"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium" style={{ color: "var(--psp-gray-500)" }}>To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(0); }}
            className="filter-input"
          />
        </div>
      </div>

      {/* Audit entries */}
      <div className="admin-card">
        {loading ? (
          <div className="text-center py-12" style={{ color: "var(--psp-gray-400)" }}>
            Loading audit log...
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--psp-navy)" }}>
              No audit entries yet
            </h2>
            <p className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
              Changes to the database will be logged here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-4 py-3 border-b"
                style={{ borderColor: "var(--psp-gray-100)" }}
              >
                <div className="flex-shrink-0">
                  <span
                    className={`admin-badge ${
                      changeLabel(entry.old_value, entry.new_value) === "CREATE"
                        ? "badge-success"
                        : changeLabel(entry.old_value, entry.new_value) === "DELETE"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {changeLabel(entry.old_value, entry.new_value)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">
                    <span className="font-medium">{entry.entity_type}</span>
                    <span style={{ color: "var(--psp-gray-400)" }}> #{entry.entity_id} </span>
                    <span className="font-mono text-xs" style={{ color: "var(--psp-gray-500)" }}>
                      .{entry.field_name}
                    </span>
                  </div>
                  <div className={`text-xs font-mono mt-0.5 ${changeColor(entry.old_value, entry.new_value)}`}>
                    {entry.old_value && (
                      <span className="line-through opacity-60 mr-2">{entry.old_value}</span>
                    )}
                    {entry.new_value && <span>{entry.new_value}</span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs" style={{ color: "var(--psp-gray-500)" }}>
                    {entry.changed_by}
                  </div>
                  <div className="text-xs" style={{ color: "var(--psp-gray-400)" }}>
                    {new Date(entry.created_at).toLocaleString()}
                  </div>
                  {entry.change_source && (
                    <div className="text-xs font-mono" style={{ color: "var(--psp-gray-400)" }}>
                      via {entry.change_source}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
}
