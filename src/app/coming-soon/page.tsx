import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PhillySportsPack.com — Coming Soon",
  description: "The most comprehensive Philadelphia high school sports database is launching soon.",
};

const SPORTS = [
  { emoji: "🏈", name: "Football" },
  { emoji: "🏀", name: "Basketball" },
  { emoji: "⚾", name: "Baseball" },
  { emoji: "🏃", name: "Track & Field" },
  { emoji: "🥍", name: "Lacrosse" },
  { emoji: "🤼", name: "Wrestling" },
  { emoji: "⚽", name: "Soccer" },
];

const STATS = [
  { value: "10,000+", label: "Players" },
  { value: "400+", label: "Schools" },
  { value: "25", label: "Years" },
  { value: "72", label: "Pro Alumni" },
];

export default function ComingSoonPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a1628 0%, #0f2040 40%, #1a2d4a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
        color: "#fff",
        padding: "24px",
        textAlign: "center",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            fontSize: 36,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            marginBottom: 4,
          }}
        >
          PHILLY<span style={{ color: "#f0a500" }}>SPORTS</span>PACK
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#f0a500",
          }}
        >
          Philadelphia High School Sports
        </div>
      </div>

      {/* Sport Icons */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 40,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {SPORTS.map((sport) => (
          <div
            key={sport.name}
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
            title={sport.name}
          >
            {sport.emoji}
          </div>
        ))}
      </div>

      {/* Main Message */}
      <h1
        style={{
          fontSize: 48,
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: 16,
          maxWidth: 600,
        }}
      >
        Something Big
        <br />
        Is Coming
      </h1>

      <p
        style={{
          fontSize: 16,
          color: "rgba(255,255,255,0.6)",
          maxWidth: 520,
          lineHeight: 1.6,
          marginBottom: 40,
        }}
      >
        The most comprehensive Philadelphia high school sports database ever built.
        Every stat. Every champion. Every player. Decades of history — all in one place.
      </p>

      {/* Stats Strip */}
      <div
        style={{
          display: "flex",
          gap: 32,
          marginBottom: 48,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {STATS.map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#f0a500",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* CTA / Status */}
      <div
        style={{
          background: "rgba(240,165,0,0.1)",
          border: "1px solid rgba(240,165,0,0.3)",
          borderRadius: 8,
          padding: "16px 32px",
          marginBottom: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            justifyContent: "center",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#10b981",
              display: "inline-block",
              animation: "pulse 2s ease infinite",
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#f0a500" }}>
            Launching Spring 2026
          </span>
        </div>
      </div>

      {/* Credit */}
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
        Data compiled by <strong style={{ color: "rgba(255,255,255,0.4)" }}>Ted Silary</strong>
        &nbsp;&mdash;&nbsp;Philadelphia&apos;s high school sports historian
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
