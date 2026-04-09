import type { DecadeByTheNumbers } from "@/lib/data/decades";

interface DecadeByTheNumbersProps {
  stats: DecadeByTheNumbers;
}

export default function DecadeByTheNumbers({ stats }: DecadeByTheNumbersProps) {
  const items: { label: string; value: string | number; sub?: string }[] = [
    { label: "Total Picks", value: stats.totalPicks },
    { label: "First Team", value: stats.firstTeamCount },
    ...(stats.secondTeamCount > 0
      ? [{ label: "Second Team", value: stats.secondTeamCount }]
      : []),
    ...(stats.thirdTeamCount > 0
      ? [{ label: "Third Team", value: stats.thirdTeamCount }]
      : []),
    { label: "Schools", value: stats.schoolsRepresented },
    { label: "Offense", value: stats.offenseCount },
    { label: "Defense", value: stats.defenseCount },
    ...(stats.topSchool
      ? [
          {
            label: "Most Represented",
            value: stats.topSchool.count,
            sub: stats.topSchool.name,
          },
        ]
      : []),
  ];

  return (
    <section
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 1.5rem 2.5rem",
      }}
    >
      <h2
        className="psp-h2"
        style={{ color: "#fff", marginBottom: "1.25rem" }}
      >
        By the Numbers
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              background: "var(--psp-navy-mid)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "2rem",
                lineHeight: 1,
                color: "var(--psp-gold)",
                letterSpacing: "0.02em",
              }}
            >
              {item.value}
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#94a3b8",
              }}
            >
              {item.label}
            </span>
            {item.sub && (
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.7rem",
                  color: "#64748b",
                  lineHeight: 1.3,
                }}
              >
                {item.sub}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
