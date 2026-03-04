import Link from "next/link";

const LEVEL_BADGES: Record<string, { label: string; color: string; icon: string }> = {
  pro: { label: "PRO", color: "#f0a500", icon: "🏆" },
  college: { label: "COLLEGE", color: "#3b82f6", icon: "🎓" },
  coaching: { label: "COACH", color: "#16a34a", icon: "📋" },
  staff: { label: "STAFF", color: "#7c3aed", icon: "🏫" },
};

const LEAGUE_ICONS: Record<string, string> = {
  NFL: "🏈", NBA: "🏀", MLB: "⚾", MLS: "⚽",
};

interface AlumniCardProps {
  person: {
    id: number;
    person_name: string;
    current_level: string;
    current_org?: string;
    current_role?: string;
    college?: string;
    pro_team?: string;
    pro_league?: string;
    high_school_id?: number;
    sport_id?: string;
    featured?: boolean;
    schools?: { name: string; slug: string } | null;
  };
}

export default function AlumniCard({ person }: AlumniCardProps) {
  const badge = LEVEL_BADGES[person.current_level] || LEVEL_BADGES.college;
  const leagueIcon = person.pro_league ? LEAGUE_ICONS[person.pro_league] || "🏅" : null;

  return (
    <div
      style={{
        background: "var(--psp-white)",
        border: person.featured ? "2px solid var(--psp-gold)" : "1px solid var(--g100)",
        borderRadius: 6,
        overflow: "hidden",
        transition: ".15s",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <div style={{ background: "var(--psp-navy)", padding: "14px 16px", color: "#fff", position: "relative" }}>
        {person.featured && (
          <div style={{
            position: "absolute", top: 8, right: 8,
            background: "var(--psp-gold)", color: "var(--psp-navy)",
            fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 2,
            textTransform: "uppercase", letterSpacing: 0.5,
          }}>
            FEATURED
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 20 }}>{leagueIcon || badge.icon}</span>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 0.5 }}>
            {person.person_name}
          </h3>
        </div>
        <div style={{
          display: "inline-block",
          padding: "2px 8px",
          borderRadius: 10,
          fontSize: 9,
          fontWeight: 700,
          background: badge.color,
          color: "#fff",
          letterSpacing: 0.5,
        }}>
          {badge.label}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Current Role */}
        {(person.current_org || person.current_role) && (
          <div>
            <div style={{ fontSize: 9, color: "var(--g400)", textTransform: "uppercase", fontWeight: 600, marginBottom: 2 }}>Current</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--psp-navy)" }}>
              {person.current_role || person.current_org}
            </div>
            {person.current_role && person.current_org && (
              <div style={{ fontSize: 11, color: "var(--g500)" }}>{person.current_org}</div>
            )}
          </div>
        )}

        {/* High School */}
        {person.schools && (
          <div>
            <div style={{ fontSize: 9, color: "var(--g400)", textTransform: "uppercase", fontWeight: 600, marginBottom: 2 }}>High School</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--psp-gold)" }}>
              {person.schools.name}
            </div>
          </div>
        )}

        {/* College */}
        {person.college && (
          <div>
            <div style={{ fontSize: 9, color: "var(--g400)", textTransform: "uppercase", fontWeight: 600, marginBottom: 2 }}>College</div>
            <div style={{ fontSize: 12, color: "var(--text)" }}>{person.college}</div>
          </div>
        )}
      </div>
    </div>
  );
}
