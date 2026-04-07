"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui";

/**
 * /admin/tributes — moderation queue for legend tribute comments.
 *
 * Mirrors /admin/comments in structure. Supports filtering by status,
 * approving/rejecting single rows, and bulk-approving all pending rows.
 * The admin layout already gates by role, so no extra auth check here.
 */

type TributeStatus = "pending" | "approved" | "rejected";

interface TributeRow {
  id: number;
  legend_slug: string;
  name: string;
  affiliation: string | null;
  body: string;
  source: "user" | "ted-silary-archive";
  status: TributeStatus;
  created_at: string;
  approved_at: string | null;
  archived_date: string | null;
}

const STATUS_TABS: Array<TributeStatus | "all"> = [
  "pending",
  "approved",
  "rejected",
  "all",
];

export default function LegendTributesModeration() {
  const [rows, setRows] = useState<TributeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TributeStatus | "all">(
    "pending",
  );
  const [sourceFilter, setSourceFilter] = useState<
    "all" | "user" | "ted-silary-archive"
  >("user");

  const supabase = createClient();

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("legend_tributes")
        .select(
          "id, legend_slug, name, affiliation, body, source, status, created_at, approved_at, archived_date",
        )
        .order("created_at", { ascending: false })
        .limit(200);

      if (statusFilter !== "all") query = query.eq("status", statusFilter);
      if (sourceFilter !== "all") query = query.eq("source", sourceFilter);

      const { data, error } = await query;
      if (error) throw error;
      setRows((data ?? []) as TributeRow[]);
    } catch (err) {
      console.error("[admin/tributes] fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sourceFilter, supabase]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  async function moderate(id: number, next: TributeStatus) {
    try {
      const { error } = await supabase
        .from("legend_tributes")
        .update({
          status: next,
          approved_at: next === "approved" ? new Date().toISOString() : null,
        })
        .eq("id", id);
      if (error) throw error;
      fetchRows();
    } catch (err) {
      console.error("[admin/tributes] moderate error:", err);
    }
  }

  async function bulkApprove() {
    const pendingIds = rows
      .filter((r) => r.status === "pending")
      .map((r) => r.id);
    if (pendingIds.length === 0) return;
    if (!window.confirm(`Approve all ${pendingIds.length} pending tributes?`))
      return;
    try {
      const { error } = await supabase
        .from("legend_tributes")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
        })
        .in("id", pendingIds);
      if (error) throw error;
      fetchRows();
    } catch (err) {
      console.error("[admin/tributes] bulk approve error:", err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">
            Legend Tributes
          </h1>
          <p className="text-gray-600">
            Review user-submitted tributes and archived comments on HOF legend
            pages.
          </p>
        </div>
        {statusFilter === "pending" && rows.length > 0 && (
          <Button variant="primary" onClick={bulkApprove}>
            Approve All ({rows.length})
          </Button>
        )}
      </div>

      {/* Status filter */}
      <div className="flex gap-2">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              statusFilter === s
                ? "bg-navy text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Source filter */}
      <div className="flex gap-2 text-xs">
        <span className="self-center text-gray-500">Source:</span>
        {([
          ["user", "User submissions"],
          ["ted-silary-archive", "Archived"],
          ["all", "All"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setSourceFilter(value)}
            className={`px-3 py-1.5 rounded-full border transition ${
              sourceFilter === value
                ? "bg-navy text-white border-navy"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading tributes…</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No {statusFilter !== "all" ? statusFilter : ""} tributes to review.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center flex-wrap gap-2 mb-2 text-xs text-gray-500">
                    <span className="font-semibold text-gray-900">
                      {r.name}
                    </span>
                    {r.affiliation && (
                      <span className="text-gray-600">({r.affiliation})</span>
                    )}
                    <span>on</span>
                    <Link
                      href={`/hof/legends/${r.legend_slug}`}
                      target="_blank"
                      className="font-medium text-blue-600 hover:underline truncate"
                    >
                      {r.legend_slug}
                    </Link>
                    {r.source === "ted-silary-archive" && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider font-semibold">
                        Archived
                      </span>
                    )}
                    <span>
                      {new Date(
                        r.archived_date ?? r.created_at,
                      ).toLocaleString()}
                    </span>
                  </div>

                  {/* Body */}
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {r.body}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  {r.status === "pending" && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => moderate(r.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => moderate(r.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {r.status === "approved" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => moderate(r.id, "rejected")}
                    >
                      Remove
                    </Button>
                  )}
                  {r.status === "rejected" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => moderate(r.id, "approved")}
                    >
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
