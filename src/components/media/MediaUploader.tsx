"use client";

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from "react";
import { Button, ToastContainer } from "@/components/ui";
import { useToast } from "@/hooks/useToast";
import { useMediaUpload } from "@/hooks/useMediaUpload";

const SPORTS = [
  "football",
  "basketball",
  "baseball",
  "track-field",
  "soccer",
  "lacrosse",
  "wrestling",
] as const;

const CATEGORIES = [
  "game-action",
  "celebration",
  "team-photo",
  "portrait",
  "facility",
  "highlight-reel",
  "behind-the-scenes",
  "other",
] as const;

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,video/mp4,video/webm";

interface MediaUploaderProps {
  onUploadComplete?: (media: any) => void;
  defaultSport?: string;
  defaultSchoolId?: number;
  defaultGameId?: number;
}

export default function MediaUploader({
  onUploadComplete,
  defaultSport,
  defaultSchoolId,
  defaultGameId,
}: MediaUploaderProps) {
  const { upload, uploading, error: uploadError, reset: resetUpload } = useMediaUpload();
  const { toasts, removeToast, success: toastSuccess, error: toastError } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [caption, setCaption] = useState("");
  const [sport, setSport] = useState<string>(defaultSport || "");
  const [gameId, setGameId] = useState<string>(defaultGameId ? String(defaultGameId) : "");
  const [schoolId, setSchoolId] = useState<string>(defaultSchoolId ? String(defaultSchoolId) : "");
  const [playerId, setPlayerId] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo = file?.type.startsWith("video/");

  const handleFile = useCallback((f: File) => {
    setFile(f);
    resetUpload();

    // Generate preview
    if (f.type.startsWith("image/") || f.type.startsWith("video/")) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    }
  }, [resetUpload]);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const clearFile = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    resetUpload();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [preview, resetUpload]);

  const handleUpload = async () => {
    if (!file) return;

    try {
      const result = await upload(file, {
        category,
        caption,
        sport: sport || undefined,
        game_id: gameId ? Number(gameId) : undefined,
        school_id: schoolId ? Number(schoolId) : undefined,
        player_id: playerId ? Number(playerId) : undefined,
      });

      toastSuccess("Media uploaded successfully!");
      clearFile();
      setCaption("");
      onUploadComplete?.(result);
    } catch {
      toastError(uploadError || "Upload failed");
    }
  };

  return (
    <div className="space-y-5">
      <ToastContainer toasts={toasts.map(t => ({ ...t, onClose: removeToast }))} />

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !file && fileInputRef.current?.click()}
        className={`
          relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
          ${
            dragOver
              ? "border-[var(--psp-gold)] bg-[var(--psp-gold)]/5 scale-[1.01]"
              : file
                ? "border-[var(--psp-blue)]/40 bg-[var(--psp-navy-mid)]"
                : "border-gray-600 hover:border-gray-400 bg-[var(--psp-navy-mid)]"
          }
        `}
      >
        {file && preview ? (
          <div className="relative p-4">
            {/* Close button */}
            <button
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label="Remove file"
            >
              X
            </button>

            {isVideo ? (
              <video
                src={preview}
                className="w-full max-h-64 rounded-lg object-contain bg-black"
                controls={false}
                muted
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 rounded-lg object-contain"
              />
            )}

            <div className="mt-2 flex items-center gap-3 text-sm text-gray-300">
              <span className="font-medium truncate">{file.name}</span>
              <span className="text-gray-500">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </span>
              {isVideo && (
                <span
                  className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                  style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
                >
                  Video
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="text-5xl mb-3">
              {dragOver ? "+" : ""}
            </div>
            <p className="text-gray-300 font-medium text-lg mb-1">
              {dragOver ? "Drop it here!" : "Drag & drop media here"}
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Photos (JPEG, PNG, WebP up to 10MB) or Videos (MP4, WebM up to 100MB)
            </p>
            <Button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse Files
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Metadata Form */}
      {file && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white border border-gray-600 focus:border-[var(--psp-gold)] focus:outline-none transition-colors"
              style={{ background: "var(--psp-navy)" }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Sport */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Sport
            </label>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white border border-gray-600 focus:border-[var(--psp-gold)] focus:outline-none transition-colors"
              style={{ background: "var(--psp-navy)" }}
            >
              <option value="">-- Select sport --</option>
              {SPORTS.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Caption */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Caption *
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={2}
              placeholder="Describe this media..."
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white border border-gray-600 focus:border-[var(--psp-gold)] focus:outline-none transition-colors resize-none placeholder:text-gray-500"
              style={{ background: "var(--psp-navy)" }}
            />
          </div>

          {/* Entity IDs */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Game ID
            </label>
            <input
              type="number"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white border border-gray-600 focus:border-[var(--psp-gold)] focus:outline-none transition-colors placeholder:text-gray-500"
              style={{ background: "var(--psp-navy)" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              School ID
            </label>
            <input
              type="number"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white border border-gray-600 focus:border-[var(--psp-gold)] focus:outline-none transition-colors placeholder:text-gray-500"
              style={{ background: "var(--psp-navy)" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Player ID
            </label>
            <input
              type="number"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white border border-gray-600 focus:border-[var(--psp-gold)] focus:outline-none transition-colors placeholder:text-gray-500"
              style={{ background: "var(--psp-navy)" }}
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {uploadError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {uploadError}
        </div>
      )}

      {/* Upload Button */}
      {file && (
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={uploading || !caption.trim()}
            className="
              relative px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            "
            style={{
              background: uploading ? "var(--psp-gold-light)" : "var(--psp-gold)",
              color: "var(--psp-navy)",
            }}
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Uploading...
              </span>
            ) : (
              "Upload Media"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
