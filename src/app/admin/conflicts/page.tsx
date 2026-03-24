"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Conflict {
  id: number;
  entity_type: string;
  entity_id: number;
  field_name: string;
  our_value: string | null;
  external_value: string | null;
  source_name: string;
  confidence: string;
  severity: string;
  sport_id: string | null;
  status: string;
  resolved_value: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  notes: string | null;
  created_at: string;
}

type FilterStatus = "pending" | "resolved" | "all";

export default function ConflictManager() {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("pending");
  const [sportFilter, setSportFilter] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [resolveValue, setResolveValue] = useState("");
  const [resolveNotes, setResolveNotes] = useState("");

  const fetchConflicts = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from("data_conflicts")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (sportFilter) {
        query = query.eq("sport_id", sportFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setConflicts(data || []);
    } catch {
      setConflicts([]);
    }
    setLoading(false);
  }, [statusFilter, sportFilter]);

  useEffect(() => {
    fetchConflicts();
  }, [fetchConflicts]);

  async function resolveConflict(
    conflictId: number,
    action: "accept_ours" | "accept_theirs" | "custom"
  ) {
    const conflict = conflicts.find((c) => c.id === conflictId);
    if (!conflict) return;

    let resolvedVal: string | null;
    switch (action) {
      case "accept_ours":
        resolvedVal = conflict.our_value;
        break;
      case "accept_theirs":
        resolvedVal = conflict.external_value;
        break;
      case "custom":
        resolvedVal = resolveValue;
        break;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("data_conflicts")
      .update({
        status: "resolved",
        resolved_value: resolvedVal,
        resolved_by: "mike",
        resolved_at: new Date().toISOString(),
        notes: resolveNotes || `Resolved: ${action}`,
      })
      .eq("id", conflictId);

    if (!error) {
      setExpandedId(null);
      setResolveValue("");
      setResolveNotes("");
      fetchConflicts();
    }
  }

  async function batchResolve(action: "accept_ours" | "accept_theirs") {
    const pending = conflicts.filter((c) => c.status === "pending");
    if (pending.length === 0) return;
    if (!confirm(`Resolve all ${pending.length} pending conflicts by ${action === "accept_ours" ? "keeping our data" : "accepting external data"}?`)) return;

    const supabase = createClient();
    for (const conflict of pending) {
      const resolvedVal = action === "accept_ours" ? conflict.our_value : conflict.external_value;
      await supabase
        .from("data_conflicts")
        .update({
          status: "resolved",
          resolved_value: resolvedVal,
          resolved_by: "mike",
          resolved_at: new Date().toISOString(),
          notes: `Batch resolved: ${action}`,
        })
        .eq("id", conflict.id);
    }
    fetchConflicts();
  }

  const pendingCount = conflicts.filter((c) => c.status === "pending").length;

  const severityColor = (confidence: string) => {
    switch (confidence?.toLowerCase()) {
      case "high": return "badge-error";
      case "medium": return "badge-warning";
      default: return "badge-info";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--psp-navy)" }}>
            Conflict Manager
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--psp-gray-500)" }}>
            Review and resolve data discrepancies ({pendingCount} pending)
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => batchResolve("accept_ours")}
              className="btn-outline text-sm"
            >
              Accept All Ours
            </button>
            <button
              onClick={() => batchResolve("accept_theirs")}
              className="btn-primary text-sm"
            >
              Accept All External
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="filter-bar mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
          className="filter-select"
        >
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="all">All</option>
        </select>
        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Sports</option>
          <option value="football">Football</option>
          <option value="basketball">Basketball</option>
          <option value="baseball">Baseball</option>
          <option value="track-field">Track & Field</option>
          <option value="lacrosse">Lacrosse</option>
        </select>
      </div>

      {/* Conflicts list */}
      {loading ? (
        <div className="admin-card text-center py-12" style={{ color: "var(--psp-gray-400)" }}>
          Loading conflicts...
        </div>
      ) : conflicts.length === 0 ? (
        <div className="admin-card text-center py-12">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--psp-navy)" }}>
            {statusFilter === "pending" ? "No pending conflicts!" : "No conflicts found."}
          </h2>
          <p className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
            {statusFilter === "pending"
              ? "All data discrepancies have been resolved."
              : "Import data and run verification to detect conflicts."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {conflicts.map((conflict) => (
            <div key={conflict.id} className="admin-card">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() =>
                  setExpandedId(expandedId === conflict.id ? null : conflict.id)
                }
              >
                <div className="flex items-center gap-3">
                  <span className={`admin-badge ${severityColor(conflict.confidence)}`}>
                    {conflict.confidence}
                  </span>
                  <span className="admin-badge badge-info">{conflict.sport_id}</span>
                  <span className="font-medium text-sm">
                    {conflict.entity_type}.{conflict.field_name}
                  </span>
                  <span className="text-xs" style={{ color: "var(--psp-gray-400)" }}>
                    (ID: {conflict.entity_id})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {conflict.status === "resolved" && (
                    <span className="admin-badge badge-success">Resolved</span>
                  )}
                  <span className="text-gray-300">{expandedId === conflict.id ? "▲" : "▼"}</span>
                </div>
              </div>

              {expandedId === conflict.id && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--psp-gray-200)" }}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div
                      className="p-3 rounded-lg"
                      style={{ background: "var(--psp-gray-50)" }}
                    >
                      <div className="text-xs font-medium mb-1" style={{ color: "var(--psp-gray-500)" }}>
                        Our Value
                      </div>
                      <div className="font-mono text-sm">
                        {conflict.our_value || "—"}
                      </div>
                    </div>
                    <div
                      className="p-3 rounded-lg"
                      style={{ background: "#eff6ff" }}
                    >
                      <div className="text-xs font-medium mb-1 text-blue-600">
                        External Value ({conflict.source_name})
                      </div>
                      <div className="font-mono text-sm">
                        {conflict.external_value || "—"}
                      </div>
                    </div>
                  </div>

                  {conflict.status === "pending" ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--psp-gray-500)" }}>
                          Custom value (optional)
                        </label>
                        <input
                          type="text"
                          value={resolveValue}
                          onChange={(e) => setResolveValue(e.target.value)}
                          placeholder="Enter custom value..."
                          className="filter-input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--psp-gray-500)" }}>
                          Notes
                        </label>
                        <input
                          type="text"
                          value={resolveNotes}
                          onChange={(e) => setResolveNotes(e.target.value)}
                          placeholder="Resolution notes..."
                          className="filter-input w-full"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => resolveConflict(conflict.id, "accept_ours")}
                          className="btn-outline text-sm"
                        >
                          Keep Ours
                        </button>
                        <button
                          onClick={() => resolveConflict(conflict.id, "accept_theirs")}
                          className="btn-primary text-sm"
                        >
                          Accept External
                        </button>
                        {resolveValue && (
                          <button
                            onClick={() => resolveConflict(conflict.id, "custom")}
                            className="btn-secondary text-sm"
                          >
                            Use Custom
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg" style={{ background: "#f0fdf4" }}>
                      <div className="text-xs font-medium text-green-600 mb-1">
                        Resolved by {conflict.resolved_by} on{" "}
                        {conflict.resolved_at ? new Date(conflict.resolved_at).toLocaleDateString() : "—"}
                      </div>
                      <div className="font-mono text-sm">
                        Value: {conflict.resolved_value || "—"}
                      </div>
                      {conflict.notes && (
                        <div className="text-xs mt-1" style={{ color: "var(--psp-gray-500)" }}>
                          {conflict.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
