import Link from "next/link";

export const revalidate = 3600;

/* ─── HOF Card Data ─── */

/* Top row: PSP-built pages (featured, prominent) */
const FEATURED_HOF_CARDS = [
  {
    id: "public-league",
    org: "PSP Public League Hall of Fame",
    type: "Sports",
    badge: "PUBLIC LEAGUE LEGEND",
    badgeColor: "#ea580c",
    badgeIcon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 L15 8 L22 8 L17 13 L19 20 L12 16 L5 20 L7 13 L2 8 L9 8 Z" />
      </svg>
    ),
    accent: "#f0a500",
    description:
      "Honoring the legends of Philadelphia Public League athletics, curated by PhillySportsPack from Ted Silary's lifetime of coverage.",
    href: "/hof/public-league",
    external: false,
    cta: "View Inductees",
  },
  {
    id: "city-allstar",
    org: "PA Sports HOF City All Star Chapter",
    type: "Multi-Discipline",
    badge: "CITY ALL STAR",
    badgeColor: "#f0a500",
    badgeIcon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    accent: "#7c3aed",
    description:
      "The City All Star Chapter of the Pennsylvania Sports Hall of Fame, celebrating multi-sport excellence across Philadelphia.",
    href: "/hof/city-all-star",
    external: false,
    cta: "View Inductees",
  },
];

/* Bottom row: secondary / external */
const SECONDARY_HOF_CARDS = [
  {
    id: "schools",
    org: "School Halls of Fame",
    type: "Sports",
    badge: "SCHOOL HOF",
    badgeColor: "#f0a500",
    badgeIcon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    accent: "#f0a500",
    description:
      "Individual school halls of fame across Philadelphia -- explore the legends honored by their own communities.",
    href: "/hof/schools",
    external: false,
    cta: "Browse Schools",
  },
  {
    id: "philly-hof",
    org: "Philadelphia Sports Hall of Fame",
    type: "Multi-Discipline",
    badge: "PHILLY LEGEND",
    badgeColor: "#7c3aed",
    badgeIcon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    accent: "#7c3aed",
    description:
      "The premier hall honoring the greatest athletes, coaches, and contributors across all Philadelphia sports.",
    href: "https://www.philadelphiasportshalloffame.org/",
    external: true,
    cta: "Visit philadelphiasportshalloffame.org",
  },
  {
    id: "pa-state",
    org: "Pennsylvania Sports Hall of Fame",
    type: "Multi-Discipline",
    badge: "PA STATE",
    badgeColor: "#3b82f6",
    badgeIcon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 L16 10 L12 18 L8 10 Z" />
        <line x1="12" y1="2" x2="12" y2="18" />
      </svg>
    ),
    accent: "#7c3aed",
    description:
      "The statewide hall of fame recognizing outstanding athletes and contributors from across the Commonwealth of Pennsylvania.",
    href: "https://pasportshof.org",
    external: true,
    cta: "Visit pasportshof.org",
  },
];

/* ─── Featured Athletes ─── */
const FEATURED_ATHLETES = [
  { name: "Wilt Chamberlain", school: "Overbrook HS", sport: "Basketball", slug: null },
  { name: "Leroy Kelly", school: "Simon Gratz HS", sport: "Football", slug: null },
  { name: "Dawn Staley", school: "Dobbins Tech", sport: "Basketball", slug: null },
  { name: "Jahri Evans", school: "Frankford HS", sport: "Football", slug: null },
  { name: "Herb Adderley", school: "Northeast HS", sport: "Football", slug: null },
];

/* ─── Shared card renderer ─── */
function HofCard({
  card,
  featured,
}: {
  card: (typeof FEATURED_HOF_CARDS)[number];
  featured?: boolean;
}) {
  const cardContent = (
    <div
      style={{
        background: "var(--psp-navy-mid)",
        borderRadius: "var(--radius-lg)",
        padding: featured ? "2rem" : "1.25rem",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        display: "flex",
        flexDirection: "column" as const,
        gap: featured ? "1rem" : "0.5rem",
        cursor: "pointer",
        height: "100%",
      }}
      className="hof-card"
    >
      {/* Badge row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            background: `${card.badgeColor}20`,
            color: card.badgeColor,
            padding: featured ? "0.3rem 0.75rem" : "0.2rem 0.5rem",
            borderRadius: "var(--radius-full)",
            fontSize: featured ? "0.75rem" : "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase" as const,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {card.badgeIcon}
          {card.badge}
        </span>

        <span
          style={{
            fontSize: featured ? "0.7rem" : "0.6rem",
            fontWeight: 600,
            color: card.type === "Multi-Discipline" ? "#a78bfa" : "#f0a500",
            textTransform: "uppercase" as const,
            letterSpacing: "0.08em",
            fontFamily: "'DM Sans', sans-serif",
            marginLeft: "auto",
          }}
        >
          {card.type}
        </span>
      </div>

      {/* Org name */}
      <h3
        className={featured ? "psp-h3" : undefined}
        style={{
          color: "#fff",
          margin: 0,
          fontFamily: featured ? undefined : "'DM Sans', sans-serif",
          fontSize: featured ? undefined : "1rem",
          fontWeight: featured ? undefined : 700,
          lineHeight: 1.3,
        }}
      >
        {card.org}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: featured ? "0.9rem" : "0.8rem",
          color: "#94a3b8",
          lineHeight: 1.6,
          margin: 0,
          flex: 1,
        }}
      >
        {card.description}
      </p>

      {/* CTA */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: featured ? "0.95rem" : "0.8rem",
          fontWeight: 700,
          color: "var(--psp-gold)",
          marginTop: featured ? "0.5rem" : "0.25rem",
        }}
      >
        {card.cta}
        {card.external ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </span>
    </div>
  );

  if (card.external) {
    return (
      <a
        href={card.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", display: "block" }}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={card.href} style={{ textDecoration: "none", display: "block" }}>
      {cardContent}
    </Link>
  );
}

export default function HallOfFamePage() {
  return (
    <div style={{ background: "var(--psp-navy)", minHeight: "100vh" }}>
      {/* ══════════ HERO ══════════ */}
      <section
        style={{
          background: "linear-gradient(180deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)",
          position: "relative",
          padding: "4rem 1.5rem 3rem",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Gold accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "var(--psp-gold)",
          }}
        />

        <h1
          className="psp-h1-lg"
          style={{
            color: "var(--psp-gold)",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          The Ted Silary Hall of Fame
        </h1>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "#e2e8f0",
            maxWidth: "600px",
            margin: "1rem auto 0",
            lineHeight: 1.6,
          }}
        >
          Honoring the greatest athletes in Philadelphia high school sports
        </p>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.875rem",
            color: "#94a3b8",
            maxWidth: "500px",
            margin: "1.5rem auto 0",
            letterSpacing: "0.02em",
          }}
        >
          A living tribute to Ted Silary, Philadelphia Daily News, 1977-2013
        </p>
      </section>

      {/* ══════════ HOF DIRECTORY ══════════ */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "3rem 1.5rem",
        }}
      >
        <h2
          className="psp-h2"
          style={{
            color: "#fff",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Hall of Fame Directory
        </h2>

        {/* ── Top row: 2 featured PSP-built cards ── */}
        <div
          className="hof-featured-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {FEATURED_HOF_CARDS.map((card) => (
            <HofCard key={card.id} card={card} featured />
          ))}
        </div>

        {/* ── Bottom row: 3 secondary / external cards ── */}
        <div
          className="hof-secondary-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
          }}
        >
          {SECONDARY_HOF_CARDS.map((card) => (
            <HofCard key={card.id} card={card} />
          ))}
        </div>
      </section>

      {/* ══════════ FEATURED ATHLETES STRIP ══════════ */}
      <section
        style={{
          background: "var(--psp-navy-mid)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "2.5rem 1.5rem",
        }}
      >
        <h2
          className="psp-h2"
          style={{
            color: "#fff",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Featured Legends
        </h2>

        <div style={{ position: "relative", maxWidth: "1100px", margin: "0 auto" }}>
          {/* Left fade */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "40px",
              background: "linear-gradient(to right, var(--psp-navy-mid), transparent)",
              zIndex: 1,
              pointerEvents: "none",
              borderRadius: "var(--radius-md) 0 0 var(--radius-md)",
            }}
          />
          {/* Right fade */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "40px",
              background: "linear-gradient(to left, var(--psp-navy-mid), transparent)",
              zIndex: 1,
              pointerEvents: "none",
              borderRadius: "0 var(--radius-md) var(--radius-md) 0",
            }}
          />
        <div
          style={{
            display: "flex",
            gap: "1rem",
            overflowX: "auto",
            paddingBottom: "0.5rem",
            scrollSnapType: "x mandatory",
          }}
          className="hof-scroll-strip"
        >
          {FEATURED_ATHLETES.map((athlete) => (
            <div
              key={athlete.name}
              style={{
                flex: "1 1 220px",
                minWidth: "200px",
                maxWidth: "280px",
                scrollSnapAlign: "start",
                background: "var(--psp-navy)",
                border: "1px solid rgba(240,165,0,0.15)",
                borderRadius: "var(--radius-md)",
                padding: "1.25rem 1rem",
                textAlign: "center",
                transition: "border-color 0.2s ease",
              }}
              className="hof-athlete-card"
            >
              {/* Initials circle */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "var(--psp-gold)",
                  color: "var(--psp-navy)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.25rem",
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  margin: "0 auto 0.75rem",
                }}
              >
                {athlete.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <h3
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 0.25rem",
                }}
              >
                {athlete.name}
              </h3>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.8rem",
                  color: "#94a3b8",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {athlete.school}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "var(--psp-gold)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  margin: "0.375rem 0 0",
                }}
              >
                {athlete.sport}
              </p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ══════════ TED SILARY QUOTE ══════════ */}
      <section
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "4rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "3px",
            background: "var(--psp-gold)",
            margin: "0 auto 2rem",
            borderRadius: "2px",
          }}
        />

        <blockquote
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)",
            fontStyle: "italic",
            color: "#e2e8f0",
            lineHeight: 1.7,
            margin: 0,
            padding: 0,
            borderLeft: "none",
          }}
        >
          &ldquo;He went to every game, remembered every name, and made every kid feel like they mattered.&rdquo;
        </blockquote>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.8rem",
            color: "#64748b",
            marginTop: "1.5rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          On Ted Silary (1977-2013)
        </p>
      </section>

      {/* ══════════ SCOPED STYLES ══════════ */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 768px) {
              .hof-featured-grid {
                grid-template-columns: 1fr !important;
              }
              .hof-secondary-grid {
                grid-template-columns: 1fr !important;
              }
            }
            @media (min-width: 769px) and (max-width: 960px) {
              .hof-secondary-grid {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
            .hof-card:hover {
              border-color: var(--psp-gold) !important;
              box-shadow: 0 0 20px rgba(240, 165, 0, 0.08);
            }
            .hof-athlete-card:hover {
              border-color: rgba(240, 165, 0, 0.4) !important;
            }
            .hof-scroll-strip {
              scrollbar-width: thin;
              scrollbar-color: rgba(240,165,0,0.3) transparent;
            }
            .hof-scroll-strip::-webkit-scrollbar {
              height: 4px;
            }
            .hof-scroll-strip::-webkit-scrollbar-thumb {
              background: rgba(240,165,0,0.3);
              border-radius: 4px;
            }
            .hof-scroll-strip::-webkit-scrollbar-track {
              background: transparent;
            }
          `,
        }}
      />
    </div>
  );
}
