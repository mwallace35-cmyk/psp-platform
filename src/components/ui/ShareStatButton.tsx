"use client";

import { useState } from "react";

interface ShareStatButtonProps {
  url: string;
  title: string;
  statText?: string; // e.g., "Kyle McCord: 3,000+ passing yards — St. Joseph's Prep"
  type?: "player" | "school";
}

export default function ShareStatButton({
  url,
  title,
  statText,
  type = "player",
}: ShareStatButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = `https://phillysportspack.com${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);

  // Build social media share text
  const shareText = statText
    ? `Check out ${statText}\n`
    : `Check out ${title} on PhillySportsPack: `;

  const encodedText = encodeURIComponent(shareText);

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: fullUrl,
        });
        setShowMenu(false);
      } catch {
        // User cancelled
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: "Copy Link",
      icon: "🔗",
      onClick: handleCopyLink,
      label: copied ? "Copied!" : "Copy Link",
    },
    {
      name: "Twitter/X",
      icon: "𝕏",
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      label: "Share on X",
    },
    {
      name: "Facebook",
      icon: "f",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: "Share on Facebook",
    },
  ];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--psp-gold)]/10 text-[var(--psp-gold)] font-medium text-sm rounded-lg hover:bg-[var(--psp-gold)]/20 transition border border-[var(--psp-gold)]/20"
        aria-label="Share stats"
        title="Share"
      >
        <span>📤</span>
        <span className="hidden sm:inline">Share</span>
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2">
            {hasNativeShare && (
              <>
                <button
                  onClick={handleNativeShare}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition text-sm text-gray-700 font-medium"
                >
                  <span className="mr-2">↗️</span>
                  Native Share
                </button>
                <div className="border-t border-gray-100" />
              </>
            )}

            {shareOptions.map((option) => (
              <a
                key={option.name}
                href={option.url || "#"}
                onClick={(e) => {
                  if (option.onClick) {
                    e.preventDefault();
                    option.onClick();
                  } else {
                    setShowMenu(false);
                  }
                }}
                target={option.url ? "_blank" : undefined}
                rel={option.url ? "noopener noreferrer" : undefined}
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition text-sm text-gray-700 font-medium"
              >
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
