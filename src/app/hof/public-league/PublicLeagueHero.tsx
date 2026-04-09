export default function PublicLeagueHero() {
  return (
    <>
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
            background: "rgba(234, 88, 12, 0.15)",
            color: "#ea580c",
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
            <path d="M12 2 L15 8 L22 8 L17 13 L19 20 L12 16 L5 20 L7 13 L2 8 L9 8 Z" />
          </svg>
          PUBLIC LEAGUE LEGEND
        </div>

        <h1
          className="psp-h1-lg"
          style={{
            color: "var(--psp-gold)",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          Public League Hall of Fame
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
          Built on the original Hall of Fame created by Jon &ldquo;Duck&rdquo;
          Gray and maintained by Ted Silary
        </p>
      </section>

      {/* ══════════ TED SILARY TRIBUTE CARD ══════════ */}
      <section
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "2.5rem 1rem 0",
        }}
      >
        <div
          style={{
            background: "var(--psp-navy-mid)",
            border: "1px solid rgba(240, 165, 0, 0.25)",
            borderRadius: "var(--radius-lg, 12px)",
            padding: "2rem 1.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
              color: "var(--psp-gold)",
              letterSpacing: "0.04em",
              margin: "0 0 0.5rem",
            }}
          >
            Ted Silary
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.85rem",
              color: "#94a3b8",
              margin: "0 0 1.25rem",
              lineHeight: 1.5,
            }}
          >
            Philadelphia Daily News, 1977&ndash;2013 &mdash; City All Star
            Chapter Inductee 1993
          </p>

          <div
            style={{
              width: "40px",
              height: "2px",
              background: "var(--psp-gold)",
              margin: "0 auto 1.25rem",
              borderRadius: "2px",
            }}
          />

          <blockquote
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              fontStyle: "italic",
              color: "#e2e8f0",
              lineHeight: 1.7,
              margin: 0,
              padding: 0,
              borderLeft: "none",
              maxWidth: "520px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            &ldquo;He went to every game, remembered every name, and made every
            kid feel like they mattered.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* ══════════ ATTRIBUTION ══════════ */}
      <section
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "2rem 1rem 0",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.9rem",
            color: "#94a3b8",
            lineHeight: 1.7,
            textAlign: "left",
            maxWidth: "640px",
            margin: "0 auto",
            borderLeft: "3px solid var(--psp-gold)",
            paddingLeft: "1rem",
          }}
        >
          The PSP Public League Hall of Fame is built on the original Hall of
          Fame created by Jon &ldquo;Duck&rdquo; Gray and maintained by
          legendary Philadelphia Daily News sportswriter Ted Silary.
        </p>
      </section>
    </>
  );
}
