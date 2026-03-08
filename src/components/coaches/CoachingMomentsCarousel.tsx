'use client';

interface CoachingMoment {
  id: number;
  emoji: string;
  year: string;
  title: string;
  coach: string;
  milestone: string;
}

interface CoachingMomentsCarouselProps {
  moments: CoachingMoment[];
}

export default function CoachingMomentsCarousel({ moments }: CoachingMomentsCarouselProps) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-scroll, minmax(220px, 1fr))",
      gap: 12,
      overflowX: "auto",
      paddingBottom: 8,
      scrollBehavior: "smooth",
    }}>
      {moments.map((moment) => (
        <div
          key={moment.id}
          style={{
            background: "#fff",
            border: "1px solid var(--g100)",
            borderRadius: 6,
            padding: "16px",
            minWidth: "220px",
            transition: ".15s",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(0,0,0,.08)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>
            {moment.emoji}
          </div>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--psp-gold)",
            textTransform: "uppercase",
            marginBottom: 4,
            letterSpacing: 0.5,
          }}>
            {moment.year}
          </div>
          <h3 style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--psp-navy)",
            margin: "0 0 6px 0",
          }}>
            {moment.title}
          </h3>
          <div style={{
            fontSize: 11,
            color: "var(--g400)",
            marginBottom: 8,
          }}>
            {moment.coach}
          </div>
          <p style={{
            fontSize: 12,
            color: "var(--text)",
            lineHeight: 1.5,
            margin: 0,
          }}>
            {moment.milestone}
          </p>
        </div>
      ))}
    </div>
  );
}
