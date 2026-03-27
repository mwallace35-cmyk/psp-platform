interface SpotlightAlumni {
  id: number;
  person_name: string;
  current_level: string;
  current_org?: string;
  current_role?: string;
  college?: string;
  pro_team?: string;
  pro_league?: string;
  draft_info?: string;
  bio_note?: string;
  high_school_name?: string;
  social_twitter?: string;
  social_instagram?: string;
}

interface SpotlightHeroProps {
  alumni: SpotlightAlumni | null;
  latestPost?: {
    platform: string;
    post_url: string;
    caption_preview?: string;
  } | null;
}

const LEVEL_LABELS: Record<string, string> = {
  pro: "Professional",
  college: "Collegiate",
  coaching: "Coaching",
  staff: "Staff",
};

export default function SpotlightHero({ alumni, latestPost }: SpotlightHeroProps) {
  if (!alumni) return null;

  return (
    <div style={{
      background: "linear-gradient(135deg, #0a1628 0%, #1a2744 60%, #0f2040 100%)",
      borderRadius: 8,
      padding: "28px 24px",
      marginBottom: 20,
      color: "#fff",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "linear-gradient(90deg, #f0a500, #3b82f6, #f0a500)",
      }} />

      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#f0a500", marginBottom: 12 }}>
        ⭐ Featured Alumni
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Avatar placeholder */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "linear-gradient(135deg, #f0a500, #e69500)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 700, color: "#0a1628",
          flexShrink: 0,
        }}>
          {alumni.person_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <h2 className="psp-h2" style={{ margin: "0 0 4px" }}>
            {alumni.person_name}
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, textTransform: "uppercase",
              background: alumni.current_level === "pro" ? "#f0a500" : alumni.current_level === "coaching" ? "#3b82f6" : "#16a34a",
              color: alumni.current_level === "pro" ? "#0a1628" : "#fff",
              padding: "2px 8px", borderRadius: 3,
            }}>
              {LEVEL_LABELS[alumni.current_level] || alumni.current_level}
            </span>
            {alumni.pro_league && (
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                {alumni.pro_league}
              </span>
            )}
          </div>

          {/* Current role */}
          {(alumni.current_org || alumni.current_role) && (
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", marginBottom: 6 }}>
              {alumni.current_role && <span style={{ fontWeight: 600 }}>{alumni.current_role}</span>}
              {alumni.current_role && alumni.current_org && " — "}
              {alumni.current_org && <span>{alumni.current_org}</span>}
            </div>
          )}

          {/* High school + college */}
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
            {alumni.high_school_name && <div>🏫 {alumni.high_school_name}</div>}
            {alumni.college && <div>🎓 {alumni.college}</div>}
            {alumni.draft_info && <div>📋 {alumni.draft_info}</div>}
          </div>

          {/* Bio note */}
          {alumni.bio_note && (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 10, lineHeight: 1.5, fontStyle: "italic" }}>
              &ldquo;{alumni.bio_note}&rdquo;
            </p>
          )}

          {/* Social links */}
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {alumni.social_twitter && (
              <a href={`https://twitter.com/${alumni.social_twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, color: "#f0a500", textDecoration: "none", fontWeight: 600 }}>
                𝕏 @{alumni.social_twitter.replace("@", "")}
              </a>
            )}
            {alumni.social_instagram && (
              <a href={`https://instagram.com/${alumni.social_instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, color: "#e1306c", textDecoration: "none", fontWeight: 600 }}>
                📷 @{alumni.social_instagram.replace("@", "")}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Latest social post teaser */}
      {latestPost && (
        <a href={latestPost.post_url} target="_blank" rel="noopener noreferrer"
          style={{
            display: "block", marginTop: 16, padding: "10px 14px",
            background: "rgba(255,255,255,0.08)", borderRadius: 6,
            textDecoration: "none", color: "inherit", transition: ".15s",
          }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#f0a500", marginBottom: 4 }}>
            Latest on {latestPost.platform === "twitter" ? "𝕏" : "📷 Instagram"}
          </div>
          {latestPost.caption_preview && (
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>
              {latestPost.caption_preview}
            </div>
          )}
        </a>
      )}
    </div>
  );
}
