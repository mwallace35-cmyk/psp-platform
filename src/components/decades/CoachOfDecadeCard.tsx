import Link from "next/link";
import type { CoachOfDecadeEntry } from "@/lib/data/decades";

interface CoachOfDecadeCardProps {
  coach: CoachOfDecadeEntry;
  decadeLabel: string;
}

export default function CoachOfDecadeCard({
  coach,
  decadeLabel,
}: CoachOfDecadeCardProps) {
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
        Coach of the Decade
      </h2>

      <div
        style={{
          background: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, var(--psp-navy-mid) 100%)",
          border: "1px solid rgba(59,130,246,0.25)",
          borderRadius: "var(--radius-lg)",
          padding: "1.75rem",
          display: "flex",
          gap: "1.5rem",
          alignItems: "flex-start",
        }}
        className="cotd-card"
      >
        {/* Icon */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(59,130,246,0.15)",
            border: "2px solid rgba(59,130,246,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              background: "rgba(59,130,246,0.12)",
              color: "#60a5fa",
              padding: "0.2rem 0.6rem",
              borderRadius: "999px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            {decadeLabel} Coach of the Decade
          </div>

          {coach.legendSlug ? (
            <Link
              href={`/hof/legends/${coach.legendSlug}`}
              style={{ textDecoration: "none" }}
            >
              <h3
                className="psp-h2"
                style={{
                  color: "#60a5fa",
                  margin: "0 0 0.25rem",
                  lineHeight: 1.2,
                }}
              >
                {coach.name}
              </h3>
            </Link>
          ) : (
            <h3
              className="psp-h2"
              style={{
                color: "#60a5fa",
                margin: "0 0 0.25rem",
                lineHeight: 1.2,
              }}
            >
              {coach.name}
            </h3>
          )}

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.875rem",
              color: "#94a3b8",
              margin: 0,
            }}
          >
            {coach.school}
          </p>

          {coach.legendSlug && (
            <Link
              href={`/hof/legends/${coach.legendSlug}`}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#60a5fa",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                marginTop: "0.75rem",
              }}
            >
              View Coach Profile
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .cotd-card { flex-direction: column; }
        }
      `}</style>
    </section>
  );
}
