/**
 * BilingualHeader Component
 * Renders English text with Spanish subtitle for bilingual support
 * Currently used for baseball sport pages to honor the sport's cultural significance
 */

interface BilingualHeaderProps {
  english: string;
  spanish?: string;
}

export default function BilingualHeader({ english, spanish }: BilingualHeaderProps) {
  // If no Spanish translation provided, render English only
  if (!spanish) {
    return <h2>{english}</h2>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>{english}</h2>
      <p
        style={{
          fontSize: "12px",
          fontStyle: "italic",
          color: "var(--g400)",
          margin: 0,
          fontWeight: 500,
        }}
      >
        {spanish}
      </p>
    </div>
  );
}
