"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DECADE_SLUGS, DECADE_META, type DecadeSlug } from "@/lib/data/decades";

const NAV_ITEMS = DECADE_SLUGS.map((slug) => ({
  slug,
  label: slug === "30-year" ? "30-Year" : slug,
  href: slug === "30-year" ? "/hof/decades#thirty-year" : `/hof/decades/${slug}`,
}));

export default function DecadeNav({ current }: { current: DecadeSlug | "index" }) {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(10,22,40,0.97)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(240,165,0,0.2)",
        padding: "0 1.5rem",
      }}
      aria-label="All-Decade navigation"
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          gap: "0",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {/* Hub link */}
        <Link
          href="/hof/decades"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0.75rem 1rem",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
            whiteSpace: "nowrap",
            borderBottom:
              current === "index"
                ? "2px solid var(--psp-gold)"
                : "2px solid transparent",
            color: current === "index" ? "var(--psp-gold)" : "#94a3b8",
            transition: "color 0.15s",
          }}
        >
          All Decades
        </Link>

        <div
          style={{
            width: "1px",
            background: "rgba(255,255,255,0.08)",
            margin: "0.5rem 0",
          }}
        />

        {NAV_ITEMS.map((item) => {
          const isActive =
            item.slug === current ||
            (item.slug === "30-year" && pathname === "/hof/decades");
          const meta = DECADE_META[item.slug];
          return (
            <Link
              key={item.slug}
              href={item.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0.5rem 1rem",
                fontFamily: "'DM Sans', sans-serif",
                textDecoration: "none",
                whiteSpace: "nowrap",
                borderBottom: isActive
                  ? "2px solid var(--psp-gold)"
                  : "2px solid transparent",
                color: isActive ? "var(--psp-gold)" : "#94a3b8",
                transition: "color 0.15s",
                gap: "0.125rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </span>
              <span style={{ fontSize: "0.6rem", opacity: 0.6 }}>{meta.years}</span>
            </Link>
          );
        })}
      </div>

      <style>{`
        nav::-webkit-scrollbar { display: none; }
      `}</style>
    </nav>
  );
}
