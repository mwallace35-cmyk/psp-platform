"use client";

import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = `https://phillysportspack.com${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description || "");

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description || title, url: fullUrl });
      } catch {
        // User cancelled or error — fall back silently
      }
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

  return (
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
  );
}
