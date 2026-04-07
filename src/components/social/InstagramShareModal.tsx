"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { downloadShareImage } from "@/lib/share-image";

interface Props {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  caption: string;
  filename?: string;
}

/**
 * Fallback modal for desktop browsers (and any environment that doesn't
 * support navigator.canShare({ files })). Shows a preview of the IG-sized
 * image, lets the user download it, copy the caption, and gives a short
 * "open Instagram on your phone" instruction.
 */
export default function InstagramShareModal({
  open,
  onClose,
  imageUrl,
  caption,
  filename = "phillysportspack.png",
}: Props) {
  const [downloading, setDownloading] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  async function handleDownload() {
    try {
      setDownloading(true);
      await downloadShareImage(imageUrl, filename);
      toast.success("Image downloaded");
    } catch {
      toast.error("Couldn't download image. Try again?");
    } finally {
      setDownloading(false);
    }
  }

  async function handleCopyCaption() {
    try {
      await navigator.clipboard.writeText(caption);
      toast.success("Caption copied");
    } catch {
      toast.error("Couldn't copy caption");
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Share to Instagram"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-3xl flex-col gap-4 overflow-hidden rounded-2xl bg-[var(--psp-navy,_#0a1628)] p-6 text-white shadow-2xl sm:flex-row"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lg text-white transition hover:bg-white/20"
        >
          ×
        </button>

        {/* Image preview — 9:16 */}
        <div className="flex flex-shrink-0 items-center justify-center sm:w-1/2">
          <div className="relative w-full max-w-[260px] overflow-hidden rounded-xl border border-white/10 bg-black shadow-lg" style={{ aspectRatio: "9 / 16" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Instagram share preview"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-1 flex-col justify-center gap-4 pt-4 sm:pt-0">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--psp-gold,_#f0a500)]">
              Share to Instagram
            </div>
            <h2 className="mt-1 text-xl font-bold">Post this to your story</h2>
            <p className="mt-2 text-sm text-white/70">
              Download the image, then open Instagram on your phone and upload
              it as a Story. Paste the caption for hashtags and the PSP link.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center justify-center gap-2 rounded-lg bg-[var(--psp-gold,_#f0a500)] px-4 py-3 text-sm font-bold text-[var(--psp-navy,_#0a1628)] transition hover:opacity-90 disabled:opacity-60"
            >
              {downloading ? "Downloading…" : "⬇  Download Image"}
            </button>
            <button
              onClick={handleCopyCaption}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              ⧉  Copy Caption
            </button>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">
              Caption
            </div>
            <p className="mt-1 max-h-32 overflow-y-auto whitespace-pre-wrap text-xs text-white/80">
              {caption}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
