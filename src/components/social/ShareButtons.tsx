"use client";

import { useState } from "react";
import { toast } from "sonner";
import { shareImage } from "@/lib/share-image";
import InstagramShareModal from "./InstagramShareModal";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  /**
   * Absolute or relative URL of a 1080x1920 IG-story image for this page.
   * When provided, an Instagram button is shown. On mobile it uses the
   * native share sheet (files); on desktop it opens a fallback modal with
   * download + copy-caption.
   */
  igImageUrl?: string;
  /**
   * Caption used for Instagram shares (copied to clipboard on desktop,
   * passed as `text` to navigator.share on mobile).
   */
  igCaption?: string;
}

export default function ShareButtons({
  url,
  title,
  description,
  igImageUrl,
  igCaption,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [igModalOpen, setIgModalOpen] = useState(false);
  const [igBusy, setIgBusy] = useState(false);

  const fullUrl = `https://phillysportspack.com${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description || title, url: fullUrl });
      } catch {
        // User cancelled or error — fall back silently
      }
    }
  };

  const handleInstagramShare = async () => {
    if (!igImageUrl) return;
    const resolvedCaption = igCaption ?? `${title}\n\n${fullUrl}`;
    const absoluteImageUrl = igImageUrl.startsWith("http")
      ? igImageUrl
      : `${typeof window !== "undefined" ? window.location.origin : "https://phillysportspack.com"}${igImageUrl}`;

    setIgBusy(true);
    try {
      const result = await shareImage({
        imageUrl: absoluteImageUrl,
        caption: resolvedCaption,
        title,
        filename: "phillysportspack.png",
      });
      if (result === "unsupported") {
        setIgModalOpen(true);
      } else if (result === "error") {
        toast.error("Couldn't share. Try downloading instead.");
        setIgModalOpen(true);
      } else if (result === "shared") {
        toast.success("Shared!");
      }
      // "cancelled" = silent
    } finally {
      setIgBusy(false);
    }
  };

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const shareLinks = [
    {
      name: "Twitter/X",
      icon: "𝕏",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      bg: "#000",
    },
    {
      name: "Facebook",
      icon: "f",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bg: "#1877F2",
    },
    {
      name: "Copy Link",
      icon: "🔗",
      href: "#",
      bg: "#6B7280",
      onClick: () => {
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
  ];

  const absoluteIgUrl = igImageUrl
    ? igImageUrl.startsWith("http")
      ? igImageUrl
      : `https://phillysportspack.com${igImageUrl}`
    : "";
  const resolvedCaption = igCaption ?? `${title}\n\n${`https://phillysportspack.com${url}`}`;

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">Share</span>
        {hasNativeShare && (
          <button
            onClick={handleNativeShare}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity"
            style={{ background: "#10B981" }}
            aria-label="Share"
            title="Share"
          >
            ↗
          </button>
        )}
        {igImageUrl && (
          <button
            onClick={handleInstagramShare}
            disabled={igBusy}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity disabled:opacity-60"
            style={{
              background:
                "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            }}
            aria-label="Share to Instagram"
            title="Share to Instagram"
          >
            IG
          </button>
        )}
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={link.onClick ? (e) => { e.preventDefault(); link.onClick(); } : undefined}
            target={link.onClick ? undefined : "_blank"}
            rel={link.onClick ? undefined : "noopener noreferrer"}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity"
            style={{ background: link.bg }}
            aria-label={`Share on ${link.name}`}
            title={`Share on ${link.name}`}
          >
            {link.name === "Copy Link" && copied ? "✓" : link.icon}
          </a>
        ))}
      </div>
      {igImageUrl && (
        <InstagramShareModal
          open={igModalOpen}
          onClose={() => setIgModalOpen(false)}
          imageUrl={absoluteIgUrl}
          caption={resolvedCaption}
        />
      )}
    </>
  );
}
