"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import VideoPlayer from "./VideoPlayer";

interface MediaItem {
  id: string;
  storage_path: string;
  file_name: string;
  mime_type: string;
  media_type: "photo" | "video";
  width: number | null;
  height: number | null;
  thumbnail_path: string | null;
  caption: string | null;
  category: string | null;
  is_featured: boolean;
  created_at: string;
}

interface MediaGalleryProps {
  gameId?: number;
  schoolId?: number;
  playerId?: number;
  sport?: string;
  showUpload?: boolean;
}

const PAGE_SIZE = 12;

function getPublicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${path}`;
}

function getThumbnailUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/render/image/public/${path}?width=400&height=300&resize=cover`;
}

export default function MediaGallery({
  gameId,
  schoolId,
  playerId,
  sport,
  showUpload = false,
}: MediaGalleryProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  const fetchMedia = useCallback(
    async (pageNum: number, append = false) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("limit", String(PAGE_SIZE));
        params.set("offset", String(pageNum * PAGE_SIZE));
        params.set("status", "approved");
        if (gameId) params.set("game_id", String(gameId));
        if (schoolId) params.set("school_id", String(schoolId));
        if (playerId) params.set("player_id", String(playerId));
        if (sport) params.set("sport", sport);

        const res = await fetch(`/api/media?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch media");

        const data = await res.json();
        const fetched: MediaItem[] = data.items || [];

        setItems((prev) => (append ? [...prev, ...fetched] : fetched));
        setHasMore(fetched.length === PAGE_SIZE);
      } catch (err) {
        console.error("MediaGallery fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [gameId, schoolId, playerId, sport]
  );

  useEffect(() => {
    setPage(0);
    fetchMedia(0);
  }, [fetchMedia]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchMedia(next, true);
  };

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  // Lazy-load the uploader only when needed
  const MediaUploaderLazy = showUploader
    ? require("./MediaUploader").default
    : null;

  return (
    <div>
      {/* Header row with optional upload toggle */}
      {showUpload && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowUploader((p) => !p)}
            className="px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors"
            style={{
              background: showUploader ? "var(--psp-navy-mid)" : "var(--psp-gold)",
              color: showUploader ? "var(--psp-gold)" : "var(--psp-navy)",
            }}
          >
            {showUploader ? "Close Uploader" : "+ Add Media"}
          </button>
        </div>
      )}

      {/* Inline uploader */}
      {showUploader && MediaUploaderLazy && (
        <div
          className="rounded-xl p-5 mb-6 border border-gray-700"
          style={{ background: "var(--psp-navy)" }}
        >
          <MediaUploaderLazy
            defaultSport={sport}
            defaultSchoolId={schoolId}
            defaultGameId={gameId}
            onUploadComplete={() => {
              setShowUploader(false);
              setPage(0);
              fetchMedia(0);
            }}
          />
        </div>
      )}

      {/* Gallery grid */}
      {loading && items.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-xl animate-pulse"
              style={{ background: "var(--psp-navy-mid)" }}
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl border border-gray-700/50"
          style={{ background: "var(--psp-navy-mid)" }}
        >
          <div className="text-4xl mb-3 opacity-40">No media yet</div>
          <p className="text-gray-400 text-sm">
            Photos and videos will appear here once uploaded.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setLightbox(item)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)]"
                style={{ background: "var(--psp-navy-mid)" }}
              >
                {item.media_type === "photo" ? (
                  <Image
                    src={getThumbnailUrl(item.storage_path)}
                    alt={item.caption || item.file_name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <>
                    {item.thumbnail_path ? (
                      <Image
                        src={getPublicUrl(item.thumbnail_path)}
                        alt={item.caption || item.file_name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--psp-navy)] to-[var(--psp-navy-mid)]" />
                    )}
                    {/* Video icon overlay */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </>
                )}

                {/* Hover overlay with caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {item.caption && (
                    <p className="absolute bottom-3 left-3 right-3 text-white text-sm font-medium line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                </div>

                {/* Featured badge */}
                {item.is_featured && (
                  <div
                    className="absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-bold uppercase"
                    style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
                  >
                    Featured
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 transition-colors disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          {/* Content */}
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm font-medium z-10"
            >
              Close (Esc)
            </button>

            {/* Media display */}
            <div className="rounded-xl overflow-hidden bg-black">
              {lightbox.media_type === "photo" ? (
                <div className="relative w-full" style={{ maxHeight: "75vh" }}>
                  <img
                    src={getPublicUrl(lightbox.storage_path)}
                    alt={lightbox.caption || lightbox.file_name}
                    className="w-full h-auto max-h-[75vh] object-contain"
                  />
                </div>
              ) : (
                <VideoPlayer
                  src={getPublicUrl(lightbox.storage_path)}
                  poster={
                    lightbox.thumbnail_path
                      ? getPublicUrl(lightbox.thumbnail_path)
                      : undefined
                  }
                />
              )}
            </div>

            {/* Caption bar */}
            {lightbox.caption && (
              <div className="mt-3 text-white text-sm">
                <p>{lightbox.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
