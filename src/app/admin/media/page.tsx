"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, ToastContainer } from "@/components/ui";
import { useToast } from "@/hooks/useToast";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface MediaRow {
  id: string;
  storage_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  media_type: "photo" | "video";
  width: number | null;
  height: number | null;
  thumbnail_path: string | null;
  status: string;
  moderated_by: string | null;
  moderated_at: string | null;
  rejection_reason: string | null;
  game_id: number | null;
  school_id: number | null;
  season_id: number | null;
  sport: string | null;
  player_id: number | null;
  category: string | null;
  caption: string | null;
  tags: string[] | null;
  uploaded_by: string | null;
  is_featured: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

type TabKey = "all" | "pending" | "rejected";

const SPORTS = ["football", "basketball", "baseball", "track-field", "soccer", "lacrosse", "wrestling"];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getPublicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${path}`;
}

function getThumbnailUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/render/image/public/${path}?width=200&height=150&resize=cover`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  approved: { bg: "#16a34a20", text: "#4ade80" },
  pending: { bg: "#f0a50020", text: "#f0a500" },
  rejected: { bg: "#ef444420", text: "#f87171" },
};

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function MediaAdmin() {
  const supabase = createClient();
  const { toasts, removeToast, error: toastError, success: toastSuccess } = useToast();

  const [items, setItems] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("all");
  const [filterType, setFilterType] = useState<string>("");
  const [filterSport, setFilterSport] = useState<string>("");
  const [searchSchool, setSearchSchool] = useState<string>("");

  // Selection for bulk actions
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Detail panel
  const [detail, setDetail] = useState<MediaRow | null>(null);

  // Rejection reason input (per item)
  const [rejectInputId, setRejectInputId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  /* ---------------------------------------------------------------- */
  /*  Data Fetching                                                    */
  /* ---------------------------------------------------------------- */

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("media")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      // Tab filter
      if (tab === "pending") {
        query = query.eq("status", "pending");
      } else if (tab === "rejected") {
        query = query.eq("status", "rejected");
      }

      // Type filter
      if (filterType) {
        query = query.eq("media_type", filterType);
      }

      // Sport filter
      if (filterSport) {
        query = query.eq("sport", filterSport);
      }

      const { data, error } = await query;
      if (error) throw error;

      let filtered = (data || []) as MediaRow[];

      // Client-side school search (would need join in production, doing simple filter here)
      if (searchSchool.trim()) {
        const term = searchSchool.toLowerCase();
        filtered = filtered.filter(
          (m) =>
            m.file_name.toLowerCase().includes(term) ||
            m.caption?.toLowerCase().includes(term)
        );
      }

      setItems(filtered);
      setSelected(new Set());
    } catch (err) {
      console.error("Failed to fetch media:", err);
      toastError("Failed to load media");
    } finally {
      setLoading(false);
    }
  }, [tab, filterType, filterSport, searchSchool]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  /* ---------------------------------------------------------------- */
  /*  Actions                                                          */
  /* ---------------------------------------------------------------- */

  async function approveItem(id: string) {
    const { error } = await supabase
      .from("media")
      .update({ status: "approved", moderated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toastError("Failed to approve");
      return;
    }
    toastSuccess("Media approved");
    fetchMedia();
  }

  async function rejectItem(id: string, reason: string) {
    const { error } = await supabase
      .from("media")
      .update({
        status: "rejected",
        rejection_reason: reason,
        moderated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toastError("Failed to reject");
      return;
    }
    setRejectInputId(null);
    setRejectReason("");
    toastSuccess("Media rejected");
    fetchMedia();
  }

  async function deleteItem(id: string) {
    // Delete from storage first
    const item = items.find((m) => m.id === id);
    if (item) {
      await supabase.storage.from("media").remove([item.storage_path.replace("media/", "")]);
      if (item.thumbnail_path) {
        await supabase.storage.from("media").remove([item.thumbnail_path.replace("media/", "")]);
      }
    }

    const { error } = await supabase.from("media").delete().eq("id", id);
    if (error) {
      toastError("Failed to delete");
      return;
    }
    setDeleteConfirmId(null);
    setDetail(null);
    toastSuccess("Media deleted");
    fetchMedia();
  }

  async function bulkApprove() {
    if (selected.size === 0) return;

    const ids = Array.from(selected);
    const { error } = await supabase
      .from("media")
      .update({ status: "approved", moderated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) {
      toastError("Bulk approve failed");
      return;
    }
    toastSuccess(`${ids.length} items approved`);
    fetchMedia();
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((m) => m.id)));
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: "all", label: "All Media" },
    { key: "pending", label: "Pending Review" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts.map(t => ({ ...t, onClose: removeToast }))} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide" style={{ fontFamily: "var(--font-heading, 'Bebas Neue', sans-serif)" }}>
            Media Manager
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Review, approve, and manage uploaded photos and videos
          </p>
        </div>

        {/* Bulk approve button */}
        {tab === "pending" && selected.size > 0 && (
          <button
            onClick={bulkApprove}
            className="px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider"
            style={{ background: "#16a34a", color: "white" }}
          >
            Approve {selected.size} Selected
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--psp-navy)" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`
              px-5 py-2.5 rounded-md text-sm font-bold uppercase tracking-wider transition-all
              ${
                tab === t.key
                  ? "text-[var(--psp-navy)] shadow-md"
                  : "text-gray-400 hover:text-white"
              }
            `}
            style={tab === t.key ? { background: "var(--psp-gold)" } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm text-white border border-gray-600 focus:border-[var(--psp-gold)] focus:outline-none"
          style={{ background: "var(--psp-navy)" }}
        >
          <option value="">All Types</option>
          <option value="photo">Photos</option>
          <option value="video">Videos</option>
        </select>

        <select
          value={filterSport}
          onChange={(e) => setFilterSport(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm text-white border border-gray-600 focus:border-[var(--psp-gold)] focus:outline-none"
          style={{ background: "var(--psp-navy)" }}
        >
          <option value="">All Sports</option>
          {SPORTS.map((s) => (
            <option key={s} value={s}>
              {s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={searchSchool}
          onChange={(e) => setSearchSchool(e.target.value)}
          placeholder="Search file name or caption..."
          className="flex-1 min-w-[200px] rounded-lg px-3 py-2 text-sm text-white border border-gray-600 focus:border-[var(--psp-gold)] focus:outline-none placeholder:text-gray-500"
          style={{ background: "var(--psp-navy)" }}
        />
      </div>

      {/* Select all checkbox for pending tab */}
      {tab === "pending" && items.length > 0 && (
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={selected.size === items.length}
            onChange={selectAll}
            className="rounded border-gray-600"
          />
          Select all ({items.length})
        </label>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl h-64 animate-pulse"
              style={{ background: "var(--psp-navy-mid)" }}
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl border border-gray-700/50"
          style={{ background: "var(--psp-navy-mid)" }}
        >
          <p className="text-gray-400 text-lg">
            {tab === "pending"
              ? "No media pending review"
              : tab === "rejected"
                ? "No rejected media"
                : "No media uploaded yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden border border-gray-700/50 group hover:border-gray-500/50 transition-colors"
              style={{ background: "var(--psp-navy-mid)" }}
            >
              {/* Thumbnail */}
              <button
                onClick={() => setDetail(item)}
                className="relative w-full aspect-[4/3] overflow-hidden"
              >
                {item.media_type === "photo" ? (
                  <Image
                    src={getThumbnailUrl(item.storage_path)}
                    alt={item.caption || item.file_name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <>
                    {item.thumbnail_path ? (
                      <Image
                        src={getPublicUrl(item.thumbnail_path)}
                        alt={item.file_name}
                        fill
                        sizes="25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--psp-navy)] to-gray-900 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </>
                )}

                {/* Checkbox overlay for pending tab */}
                {tab === "pending" && (
                  <div
                    className="absolute top-2 left-2 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(item.id);
                    }}
                  >
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                        selected.has(item.id)
                          ? "bg-[var(--psp-gold)] border-[var(--psp-gold)]"
                          : "border-white/50 bg-black/40 hover:border-white"
                      }`}
                    >
                      {selected.has(item.id) && (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="var(--psp-navy)" stroke="var(--psp-navy)" strokeWidth="3">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                )}
              </button>

              {/* Card info */}
              <div className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-white font-medium truncate flex-1">
                    {item.file_name}
                  </p>
                  <span
                    className="shrink-0 px-2 py-0.5 rounded text-xs font-bold uppercase"
                    style={{
                      background: STATUS_COLORS[item.status]?.bg || "#333",
                      color: STATUS_COLORS[item.status]?.text || "#aaa",
                    }}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  {item.category && (
                    <span className="px-1.5 py-0.5 rounded bg-white/5">
                      {item.category.replace(/-/g, " ")}
                    </span>
                  )}
                  <span>{formatBytes(item.file_size)}</span>
                  <span>{formatDate(item.created_at)}</span>
                </div>

                {/* Pending actions */}
                {item.status === "pending" && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => approveItem(item.id)}
                      className="flex-1 py-1.5 rounded-md text-xs font-bold uppercase bg-green-600 hover:bg-green-500 text-white transition-colors"
                    >
                      Approve
                    </button>

                    {rejectInputId === item.id ? (
                      <div className="flex-1 flex gap-1">
                        <input
                          type="text"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Reason..."
                          className="flex-1 px-2 py-1.5 rounded-md text-xs border border-gray-600 text-white focus:outline-none"
                          style={{ background: "var(--psp-navy)" }}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && rejectReason.trim()) {
                              rejectItem(item.id, rejectReason);
                            }
                            if (e.key === "Escape") {
                              setRejectInputId(null);
                              setRejectReason("");
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            if (rejectReason.trim()) rejectItem(item.id, rejectReason);
                          }}
                          className="px-2 py-1.5 rounded-md text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors"
                        >
                          Go
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setRejectInputId(item.id);
                          setRejectReason("");
                        }}
                        className="flex-1 py-1.5 rounded-md text-xs font-bold uppercase bg-red-600/20 hover:bg-red-600/40 text-red-400 transition-colors"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Side Panel / Modal */}
      {detail && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          onClick={() => setDetail(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div
            className="relative w-full max-w-lg h-full overflow-y-auto border-l border-gray-700"
            style={{ background: "var(--psp-navy)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setDetail(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Preview */}
            <div className="aspect-video bg-black">
              {detail.media_type === "photo" ? (
                <img
                  src={getPublicUrl(detail.storage_path)}
                  alt={detail.caption || detail.file_name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={getPublicUrl(detail.storage_path)}
                  controls
                  className="w-full h-full"
                  poster={detail.thumbnail_path ? getPublicUrl(detail.thumbnail_path) : undefined}
                />
              )}
            </div>

            {/* Details */}
            <div className="p-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white">{detail.file_name}</h2>
                {detail.caption && (
                  <p className="text-gray-300 mt-1">{detail.caption}</p>
                )}
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Status</span>
                  <p
                    className="font-bold capitalize mt-0.5"
                    style={{ color: STATUS_COLORS[detail.status]?.text }}
                  >
                    {detail.status}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Type</span>
                  <p className="text-white mt-0.5 capitalize">{detail.media_type}</p>
                </div>
                <div>
                  <span className="text-gray-500">Size</span>
                  <p className="text-white mt-0.5">{formatBytes(detail.file_size)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Dimensions</span>
                  <p className="text-white mt-0.5">
                    {detail.width && detail.height ? `${detail.width} x ${detail.height}` : "N/A"}
                  </p>
                </div>
                {detail.sport && (
                  <div>
                    <span className="text-gray-500">Sport</span>
                    <p className="text-white mt-0.5 capitalize">{detail.sport.replace(/-/g, " ")}</p>
                  </div>
                )}
                {detail.category && (
                  <div>
                    <span className="text-gray-500">Category</span>
                    <p className="text-white mt-0.5 capitalize">{detail.category.replace(/-/g, " ")}</p>
                  </div>
                )}
                {detail.game_id && (
                  <div>
                    <span className="text-gray-500">Game ID</span>
                    <p className="text-white mt-0.5">{detail.game_id}</p>
                  </div>
                )}
                {detail.school_id && (
                  <div>
                    <span className="text-gray-500">School ID</span>
                    <p className="text-white mt-0.5">{detail.school_id}</p>
                  </div>
                )}
                {detail.player_id && (
                  <div>
                    <span className="text-gray-500">Player ID</span>
                    <p className="text-white mt-0.5">{detail.player_id}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Uploaded</span>
                  <p className="text-white mt-0.5">{formatDate(detail.created_at)}</p>
                </div>
                {detail.uploaded_by && (
                  <div>
                    <span className="text-gray-500">Uploaded By</span>
                    <p className="text-white mt-0.5 truncate">{detail.uploaded_by}</p>
                  </div>
                )}
              </div>

              {/* Tags */}
              {detail.tags && detail.tags.length > 0 && (
                <div>
                  <span className="text-gray-500 text-sm">Tags</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {detail.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection reason */}
              {detail.rejection_reason && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                  <span className="text-xs font-bold uppercase text-red-400">Rejection Reason</span>
                  <p className="text-sm text-red-300 mt-1">{detail.rejection_reason}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t border-gray-700">
                {detail.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        approveItem(detail.id);
                        setDetail(null);
                      }}
                      className="flex-1 py-2.5 rounded-lg text-sm font-bold uppercase bg-green-600 hover:bg-green-500 text-white transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setRejectInputId(detail.id);
                        setRejectReason("");
                      }}
                      className="flex-1 py-2.5 rounded-lg text-sm font-bold uppercase bg-red-600/20 hover:bg-red-600/40 text-red-400 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}

                {/* Delete with confirmation */}
                {deleteConfirmId === detail.id ? (
                  <div className="flex-1 flex gap-2">
                    <button
                      onClick={() => deleteItem(detail.id)}
                      className="flex-1 py-2.5 rounded-lg text-sm font-bold uppercase bg-red-600 text-white hover:bg-red-500 transition-colors"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-4 py-2.5 rounded-lg text-sm font-bold uppercase border border-gray-600 text-gray-300 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(detail.id)}
                    className="px-4 py-2.5 rounded-lg text-sm font-bold uppercase border border-red-600/30 text-red-400 hover:bg-red-600/10 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* Inline rejection reason for detail panel */}
              {rejectInputId === detail.id && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                    className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-600 text-white focus:outline-none focus:border-[var(--psp-gold)]"
                    style={{ background: "var(--psp-navy-mid)" }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && rejectReason.trim()) {
                        rejectItem(detail.id, rejectReason);
                        setDetail(null);
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (rejectReason.trim()) {
                        rejectItem(detail.id, rejectReason);
                        setDetail(null);
                      }
                    }}
                    disabled={!rejectReason.trim()}
                    className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
