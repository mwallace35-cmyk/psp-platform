import Link from "next/link";
import type { PlayerOfDecadeEntry } from "@/lib/data/decades";

interface PlayerOfDecadeCardProps {
  entries: PlayerOfDecadeEntry[];
  decadeLabel: string;
}

export default function PlayerOfDecadeCard({
  entries,
  decadeLabel,
}: PlayerOfDecadeCardProps) {
  if (!entries || entries.length === 0) return null;

  const overall = entries.find((e) => e.isOverall);
  const others = entries.filter((e) => !e.isOverall);

  return (
    <section
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 1.5rem 2rem",
      }}
    >
      <h2
        className="psp-h2"
        style={{ color: "#fff", marginBottom: "1.25rem" }}
      >
        Player of the Decade
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: overall && others.length > 0 ? "1fr 1fr" : "1fr",
          gap: "1rem",
        }}
        className="potd-grid"
      >
        {/* Overall Player of the Decade — featured */}
        {overall && (
          <div
            style={{
              background: "linear-gradient(135deg, rgba(240,165,0,0.12) 0%, var(--psp-navy-mid) 100%)",
              border: "1px solid rgba(240,165,0,0.35)",
              borderRadius: "var(--radius-lg)",
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                background: "rgba(240,165,0,0.15)",
                color: "var(--psp-gold)",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                alignSelf: "flex-start",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2 L15 8 L22 8 L17 13 L19 20 L12 16 L5 20 L7 13 L2 8 L9 8 Z" />
              </svg>
              Overall {decadeLabel} Player of the Decade
            </div>

            <div>
              {overall.playerSlug ? (
                <Link
                  href={`/football/players/${overall.playerSlug}`}
                  style={{ textDecoration: "none" }}
                >
                  <h3
                    className="psp-h2"
                    style={{
                      color: "var(--psp-gold)",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {overall.playerName}
                  </h3>
                </Link>
              ) : (
                <h3
                  className="psp-h2"
                  style={{
                    color: "var(--psp-gold)",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {overall.playerName}
                </h3>
              )}

              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.875rem",
                  color: "#94a3b8",
                  margin: "0.375rem 0 0",
                }}
              >
                {overall.school}
              </p>
            </div>

            {overall.playerSlug && (
              <Link
                href={`/football/players/${overall.playerSlug}`}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--psp-gold)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  alignSelf: "flex-start",
                  marginTop: "auto",
                }}
              >
                View Profile
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            )}
          </div>
        )}

        {/* League-specific POTD entries */}
        {others.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {others.map((entry) => (
              <div
                key={entry.id}
                style={{
                  background: "var(--psp-navy-mid)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#64748b",
                  }}
                >
                  {entry.tier}
                </span>
                {entry.playerSlug ? (
                  <Link
                    href={`/football/players/${entry.playerSlug}`}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#fff",
                      textDecoration: "none",
                    }}
                  >
                    {entry.playerName}
                  </Link>
                ) : (
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {entry.playerName}
                  </span>
                )}
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.8rem",
                    color: "#64748b",
                  }}
                >
                  {entry.school}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .potd-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
