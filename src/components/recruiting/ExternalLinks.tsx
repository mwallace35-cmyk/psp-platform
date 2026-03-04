interface ExternalLinksProps {
  url_247?: string;
  url_rivals?: string;
  url_on3?: string;
  url_maxpreps?: string;
  url_hudl?: string;
}

const SITES: { key: keyof ExternalLinksProps; label: string; color: string }[] = [
  { key: "url_247", label: "247", color: "#005cb9" },
  { key: "url_rivals", label: "Rivals", color: "#ff6600" },
  { key: "url_on3", label: "On3", color: "#000" },
  { key: "url_maxpreps", label: "MaxPreps", color: "#003087" },
  { key: "url_hudl", label: "Hudl", color: "#ff6b00" },
];

export default function ExternalLinks(props: ExternalLinksProps) {
  const hasAny = SITES.some(s => props[s.key]);
  if (!hasAny) return null;

  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {SITES.filter(s => props[s.key]).map(site => (
        <a
          key={site.key}
          href={props[site.key]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "2px 7px",
            borderRadius: 3,
            background: site.color,
            color: "#fff",
            fontSize: 9,
            fontWeight: 700,
            textDecoration: "none",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {site.label}
        </a>
      ))}
    </div>
  );
}
