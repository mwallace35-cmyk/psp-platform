interface DecadeIntroProps {
  /** Raw markdown body text (no MDX component calls — just prose). */
  body: string;
  headline?: string;
  pullQuote?: string;
}

/**
 * Renders the editorial intro for a decade page.
 * Body is stored as plain markdown but we receive it pre-parsed as HTML
 * from the MDX loader — we render it safely with dangerouslySetInnerHTML
 * since all content comes from our own vetted MDX files.
 */
export default function DecadeIntro({ body, headline, pullQuote }: DecadeIntroProps) {
  if (!body && !headline) return null;

  return (
    <section
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2.5rem 1.5rem",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "1.5rem",
      }}
    >
      <div
        style={{
          background: "var(--psp-navy-mid)",
          border: "1px solid rgba(240,165,0,0.12)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
        }}
      >
        {/* Pull quote callout above prose */}
        {pullQuote && (
          <div
            style={{
              background: "rgba(240,165,0,0.06)",
              borderLeft: "4px solid var(--psp-gold)",
              padding: "1rem 1.25rem",
              borderRadius: "0 var(--radius-md) var(--radius-md) 0",
              marginBottom: "1.5rem",
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.95rem",
                fontStyle: "italic",
                color: "#e2e8f0",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              &ldquo;{pullQuote}&rdquo;
            </p>
          </div>
        )}

        {/* Prose body */}
        {body && (
          <div
            className="decade-intro-prose"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}
      </div>

      <style>{`
        .decade-intro-prose h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          color: #fff;
          margin: 1.5rem 0 0.75rem;
          letter-spacing: 0.04em;
        }
        .decade-intro-prose h2:first-child {
          margin-top: 0;
        }
        .decade-intro-prose p {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: #cbd5e1;
          line-height: 1.75;
          margin: 0 0 1rem;
        }
        .decade-intro-prose p:last-child {
          margin-bottom: 0;
        }
        .decade-intro-prose strong {
          color: #fff;
          font-weight: 700;
        }
      `}</style>
    </section>
  );
}
