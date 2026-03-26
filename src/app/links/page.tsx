import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Links | PhillySportsPack",
  description: "All the links to PhillySportsPack — Philadelphia's definitive high school sports database.",
};

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/phillysportspack", icon: "instagram", color: "#E4405F" },
  { label: "Twitter / X", href: "https://twitter.com/PhillySportsPK", icon: "twitter", color: "#1DA1F2" },
  { label: "TikTok", href: "https://tiktok.com/@phillysportspack", icon: "tiktok", color: "#000000" },
  { label: "YouTube", href: "https://youtube.com/@phillysportspack", icon: "youtube", color: "#FF0000" },
];

const SITE_LINKS = [
  { label: "Football Hub", href: "/football", emoji: "\uD83C\uDFC8" },
  { label: "Basketball Hub", href: "/basketball", emoji: "\uD83C\uDFC0" },
  { label: "Player Database", href: "/players", emoji: "\uD83D\uDD0D" },
  { label: "School Directory", href: "/schools", emoji: "\uD83C\uDFEB" },
  { label: "Hall of Fame", href: "/hof", emoji: "\uD83C\uDFC6" },
  { label: "Our Guys — Pros & College", href: "/our-guys", emoji: "\u2B50" },
  { label: "Articles & News", href: "/articles", emoji: "\uD83D\uDCF0" },
  { label: "Player of the Week", href: "/pulse/player-of-the-week", emoji: "\uD83D\uDD25" },
];

const PARTNER_LINKS = [
  { label: "Advertise with PSP", href: "/advertise" },
  { label: "Support PSP", href: "/support" },
  { label: "Our Story", href: "/about" },
  { label: "Contact Us", href: "mailto:info@phillysportspack.com" },
];

function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.43v-7.15a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-2-.52z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function LinksPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        background: "linear-gradient(180deg, #0a1628 0%, #0f2040 50%, #0a1628 100%)",
      }}
    >
      {/* Diagonal accent stripes */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 40px,
            var(--psp-gold) 40px,
            var(--psp-gold) 42px
          )`,
        }}
      />

      <div className="relative w-full max-w-md mx-auto px-4 py-12">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div
            className="inline-block px-6 py-3 rounded-2xl mb-4"
            style={{
              background: "rgba(240, 165, 0, 0.08)",
              border: "1px solid rgba(240, 165, 0, 0.2)",
            }}
          >
            <h1
              className="font-heading text-white"
              style={{ fontSize: "2rem", letterSpacing: "0.05em", lineHeight: 1 }}
            >
              PHILLY<span style={{ color: "var(--psp-gold)" }}>SPORTS</span>PACK
            </h1>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            The definitive Philadelphia high school sports database
          </p>
          <p className="text-xs text-gray-600 mt-1">
            57,000+ players &bull; 44,000+ games &bull; 25+ years
          </p>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-3 mb-8">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.icon}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
              style={{
                background: `${link.color}20`,
                color: link.color,
                border: `1px solid ${link.color}40`,
              }}
              aria-label={link.label}
            >
              <SocialIcon icon={link.icon} />
            </a>
          ))}
        </div>

        {/* Site Links */}
        <div className="space-y-3 mb-8">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center mb-2">
            Explore the Database
          </div>
          {SITE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 w-full px-5 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="text-lg">{link.emoji}</span>
              <span className="flex-1">{link.label}</span>
              <span className="text-gray-500 text-xs">{"\u2192"}</span>
            </Link>
          ))}
        </div>

        {/* Partner / Support Links */}
        <div className="space-y-2.5 mb-10">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center mb-2">
            Get Involved
          </div>
          {PARTNER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-center w-full px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "rgba(240, 165, 0, 0.08)",
                border: "1px solid rgba(240, 165, 0, 0.15)",
                color: "var(--psp-gold)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Beta Badge */}
        <div className="text-center mb-8">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: "rgba(240, 165, 0, 0.1)",
              color: "var(--psp-gold)",
              border: "1px solid rgba(240, 165, 0, 0.2)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--psp-gold)] animate-pulse" />
            Beta — Now Live
          </span>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-600">
          <p>Preserving Philadelphia&apos;s athletic legacy,</p>
          <p>one stat at a time.</p>
          <p className="mt-3 text-gray-700">
            &copy; 2026 PhillySportsPack.com
          </p>
        </div>
      </div>
    </div>
  );
}
