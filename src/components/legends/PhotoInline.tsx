"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Photo } from "@/content/legends-schema";

interface Props {
  photo: Photo;
  slug: string;
  className?: string;
}

function buildUrl(slug: string, file: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (/^https?:\/\//i.test(file)) return file;
  return `${base}/storage/v1/object/public/legend-photos/${slug}/${file.replace(/^\/+/, "")}`;
}

/**
 * An inline photo inside the main narrative flow. Click to open a
 * full-screen lightbox. Esc / backdrop / close button to dismiss.
 *
 * Lazy-loaded (default for Next.js Image when not priority). Serves the
 * photo through Next.js Image optimization via the Supabase remote
 * pattern configured in next.config.ts.
 */
export default function PhotoInline({ photo, slug, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const url = buildUrl(slug, photo.file);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const width = photo.width ?? 1200;
  const height = photo.height ?? 800;

  return (
    <>
      <figure className={`my-8 ${className}`}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group block w-full overflow-hidden rounded-xl border border-[var(--psp-gray-200)] bg-[var(--psp-gray-100)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2"
          aria-label={
            photo.alt ??
            photo.caption ??
            "Open photo in full-screen lightbox"
          }
        >
          <div className="relative w-full" style={{ aspectRatio: `${width} / ${height}` }}>
            <Image
              src={url}
              alt={photo.alt ?? photo.caption ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </button>
        {(photo.caption || photo.credit) && (
          <figcaption className="mt-2 text-sm text-[var(--psp-gray-500)] italic">
            {photo.caption}
            {photo.credit && (
              <span className="ml-2 not-italic text-xs text-[var(--psp-gray-400)]">
                — {photo.credit}
              </span>
            )}
          </figcaption>
        )}
      </figure>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt ?? photo.caption ?? "Photo"}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            aria-label="Close photo"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)]"
          >
            &times;
          </button>
          <div
            className="relative max-w-[95vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={url}
              alt={photo.alt ?? photo.caption ?? ""}
              width={width}
              height={height}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
              priority
            />
            {photo.caption && (
              <p className="mt-3 text-center text-sm text-white/80 italic">
                {photo.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
