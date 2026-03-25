import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "School Halls of Fame | PhillySportsPack.com",
  description:
    "Directory of Philadelphia-area high school athletic halls of fame -- explore the legends honored by their own school communities.",
  alternates: {
    canonical: "https://phillysportspack.com/hof/schools",
  },
  openGraph: {
    title: "School Halls of Fame | PhillySportsPack.com",
    description:
      "Directory of Philadelphia-area high school athletic halls of fame -- explore the legends honored by their own school communities.",
    url: "https://phillysportspack.com/hof/schools",
  },
};

/* ─── School HOF Data ─── */

interface SchoolHof {
  name: string;
  slug: string;
  label: string;
  colors: [string, string]; // [primary, secondary]
  website?: string; // external HOF or school site
}

const SCHOOL_DIRECTORY: SchoolHof[] = [
  {
    name: "South Philadelphia",
    slug: "south-philadelphia",
    label: "Athletic Hall of Fame",
    colors: ["#dc2626", "#f0a500"],
    website: "https://sphsalumni.com",
  },
  {
    name: "Roman Catholic",
    slug: "roman-catholic",
    label: "Athletic Hall of Fame",
    colors: ["#7c3aed", "#f0a500"],
    website: "https://www.romancatholichs.com",
  },
  {
    name: "La Salle College High School",
    slug: "la-salle-college",
    label: "Athletic Hall of Fame",
    colors: ["#1e40af", "#f0a500"],
    website: "https://www.lschs.org",
  },
  {
    name: "St. Joseph's Prep",
    slug: "st-josephs-prep",
    label: "Athletic Hall of Fame",
    colors: ["#991b1b", "#fff"],
    website: "https://www.sjprep.org",
  },
  {
    name: "Archbishop Wood",
    slug: "archbishop-wood",
    label: "Athletic Hall of Fame",
    colors: ["#15803d", "#f0a500"],
  },
  {
    name: "Northeast High School",
    slug: "northeast",
    label: "Athletic Hall of Fame",
    colors: ["#1e40af", "#dc2626"],
  },
  {
    name: "Frankford High School",
    slug: "frankford",
    label: "Athletic Hall of Fame",
    colors: ["#dc2626", "#000"],
  },
  {
    name: "West Catholic",
    slug: "west-catholic",
    label: "Athletic Hall of Fame",
    colors: ["#15803d", "#fff"],
  },
  {
    name: "Father Judge",
    slug: "father-judge",
    label: "Athletic Hall of Fame",
    colors: ["#ea580c", "#000"],
  },
  {
    name: "Cardinal Dougherty",
    slug: "cardinal-dougherty",
    label: "Athletic Hall of Fame",
    colors: ["#7c3aed", "#f0a500"],
  },
  {
    name: "Archbishop Ryan",
    slug: "archbishop-ryan",
    label: "Athletic Hall of Fame",
    colors: ["#15803d", "#f0a500"],
  },
  {
    name: "Overbrook High School",
    slug: "overbrook",
    label: "Athletic Hall of Fame",
    colors: ["#dc2626", "#1e40af"],
  },
  {
    name: "Simon Gratz",
    slug: "simon-gratz",
    label: "Athletic Hall of Fame",
    colors: ["#b91c1c", "#000"],
  },
  {
    name: "Germantown High School",
    slug: "germantown",
    label: "Athletic Hall of Fame",
    colors: ["#7c3aed", "#f0a500"],
  },
  {
    name: "Olney High School",
    slug: "olney",
    label: "Athletic Hall of Fame",
    colors: ["#dc2626", "#fff"],
  },
  {
    name: "Dobbins Tech",
    slug: "dobbins-tech",
    label: "Athletic Hall of Fame",
    colors: ["#1e40af", "#f0a500"],
  },
  {
    name: "Bonner-Prendergast",
    slug: "bonner-prendergast",
    label: "Athletic Hall of Fame",
    colors: ["#7c3aed", "#fff"],
  },
  {
    name: "Neumann-Goretti",
    slug: "neumann-goretti",
    label: "Athletic Hall of Fame",
    colors: ["#dc2626", "#f0a500"],
  },
];

export default function SchoolHallsOfFamePage() {
  return (
    <div style={{ background: "var(--psp-navy)", minHeight: "100vh" }}>
      {/* ══════════ HERO ══════════ */}
      <section
        style={{
          background:
            "linear-gradient(180deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)",
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

        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            background: "rgba(240, 165, 0, 0.15)",
            color: "#f0a500",
            padding: "0.375rem 0.875rem",
            borderRadius: "9999px",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: "1.25rem",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          SCHOOL HOF
        </div>

        <h1
          className="psp-h1-lg"
          style={{
            color: "var(--psp-gold)",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          School Halls of Fame
        </h1>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
            color: "#e2e8f0",
            maxWidth: "640px",
            margin: "1rem auto 0",
            lineHeight: 1.6,
          }}
        >
          Individual school halls of fame across Philadelphia &mdash; explore the
          legends honored by their own communities.
        </p>
      </section>

      {/* ══════════ FEATURED: SOUTH PHILLY ══════════ */}
      <section
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "3rem 1rem 0",
        }}
      >
        <div
          style={{
            background: "var(--psp-navy-mid)",
            borderRadius: "var(--radius-lg, 12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          {/* Top accent band - red/gold for Southern */}
          <div
            style={{
              height: "4px",
              background:
                "linear-gradient(90deg, #dc2626 0%, #f0a500 100%)",
            }}
          />

          <div style={{ padding: "2rem 1.5rem" }}>
            {/* Badge row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.25rem",
                flexWrap: "wrap",
              }}
            >
              {/* SOUTHERN RAM badge */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  background: "rgba(220, 38, 38, 0.15)",
                  color: "#dc2626",
                  padding: "0.375rem 0.875rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2 L15 8 L22 8 L17 13 L19 20 L12 16 L5 20 L7 13 L2 8 L9 8 Z" />
                </svg>
                SOUTHERN RAM
              </span>

              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#f0a500",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Featured
              </span>
            </div>

            <h2
              className="psp-h2"
              style={{
                color: "#fff",
                margin: "0 0 0.75rem",
              }}
            >
              South Philadelphia High School Athletic Hall of Fame
            </h2>

            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                flexWrap: "wrap",
                marginBottom: "1.25rem",
              }}
            >
              <StatPill label="Founded" value="1953" />
              <StatPill label="Athletes" value="277" />
              <StatPill label="Oldest in Philly" value="71 years" />
            </div>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.95rem",
                color: "#94a3b8",
                lineHeight: 1.7,
                margin: "0 0 1.5rem",
                maxWidth: "600px",
              }}
            >
              The oldest school athletic hall of fame in Philadelphia, founded in
              1953. The SPHS Athletic HOF has honored 277 athletes across seven
              decades, making it the most extensive individual school hall of
              fame in the city.
            </p>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(240, 165, 0, 0.1)",
                border: "1px solid rgba(240, 165, 0, 0.25)",
                borderRadius: "var(--radius-md, 8px)",
                padding: "0.75rem 1.25rem",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--psp-gold)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--psp-gold)",
                }}
              >
                Coming Soon &mdash; Full inductee database
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ SCHOOL DIRECTORY ══════════ */}
      <section
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "3rem 1rem 2rem",
        }}
      >
        <h2
          className="psp-h2"
          style={{
            color: "#fff",
            marginBottom: "0.5rem",
            textAlign: "center",
          }}
        >
          School Directory
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.9rem",
            color: "#94a3b8",
            textAlign: "center",
            marginBottom: "2rem",
            lineHeight: 1.5,
          }}
        >
          Philadelphia-area schools with known athletic halls of fame
        </p>

        <div
          className="school-hof-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {SCHOOL_DIRECTORY.map((school) => {
            const isExternal = !!school.website;
            const linkHref = school.website ?? `/schools/${school.slug}`;
            const linkLabel = isExternal
              ? "Visit School Site"
              : "View on PSP";

            const cardInner = (
              <div
                className="school-hof-card"
                style={{
                  background: "var(--psp-navy-mid)",
                  borderRadius: "var(--radius-lg, 12px)",
                  padding: "1.25rem",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderLeft: `4px solid ${school.colors[0]}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  transition:
                    "border-color 0.2s ease, box-shadow 0.2s ease",
                  height: "100%",
                }}
              >
                {/* School name */}
                <h3
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#fff",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {school.name}
                </h3>

                {/* Label */}
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: school.colors[0],
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {school.label}
                </span>

                {/* Color swatches */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.375rem",
                    marginTop: "auto",
                    paddingTop: "0.25rem",
                  }}
                >
                  {school.colors.map((color, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        background: color,
                        border:
                          color === "#fff" || color === "#000"
                            ? "1px solid rgba(255,255,255,0.2)"
                            : "none",
                      }}
                    />
                  ))}
                </div>

                {/* Link label */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--psp-gold)",
                    marginTop: "0.25rem",
                  }}
                >
                  {linkLabel}
                  {isExternal ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </span>
              </div>
            );

            if (isExternal) {
              return (
                <a
                  key={school.slug}
                  href={linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", display: "block" }}
                >
                  {cardInner}
                </a>
              );
            }

            return (
              <Link
                key={school.slug}
                href={linkHref}
                style={{ textDecoration: "none", display: "block" }}
              >
                {cardInner}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ══════════ BOTTOM CTA ══════════ */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "3rem 1rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "1rem",
            color: "#94a3b8",
            marginBottom: "1rem",
            lineHeight: 1.6,
          }}
        >
          Know about a school Hall of Fame we&rsquo;re missing?
        </p>
        <Link
          href="/support"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "var(--psp-gold)",
            textDecoration: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "var(--radius-md, 8px)",
            border: "1px solid rgba(240, 165, 0, 0.3)",
            transition: "background 0.2s ease",
          }}
        >
          Contact Us
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </section>

      {/* ══════════ SCOPED STYLES ══════════ */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .school-hof-card:hover {
              border-color: var(--psp-gold) !important;
              box-shadow: 0 0 16px rgba(240, 165, 0, 0.08);
            }
          `,
        }}
      />
    </div>
  );
}

/* ─── Stat Pill ─── */
function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
      <span
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "1.25rem",
          color: "var(--psp-gold)",
          letterSpacing: "0.03em",
          lineHeight: 1.2,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.7rem",
          fontWeight: 600,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>
    </div>
  );
}
