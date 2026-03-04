"use client";

interface SocialPost {
  id: number;
  platform: string;
  post_url: string;
  post_embed_html?: string;
  caption_preview?: string;
  curated_at?: string;
  next_level_tracking?: {
    person_name: string;
    current_org?: string;
    current_role?: string;
  };
}

interface SocialFeedProps {
  posts: SocialPost[];
}

const PLATFORM_ICONS: Record<string, { icon: string; color: string; label: string }> = {
  twitter: { icon: "𝕏", color: "#000", label: "X (Twitter)" },
  instagram: { icon: "📷", color: "#e1306c", label: "Instagram" },
};

export default function SocialFeed({ posts }: SocialFeedProps) {
  if (posts.length === 0) {
    return (
      <div className="widget">
        <div className="w-head">📱 Social Feed</div>
        <div className="w-body" style={{ padding: 16, textAlign: "center", color: "var(--g400)", fontSize: 12 }}>
          Social posts will appear here once curated by admins.
        </div>
      </div>
    );
  }

  return (
    <div className="widget">
      <div className="w-head">📱 Social Feed</div>
      <div className="w-body">
        {posts.map((post) => {
          const platform = PLATFORM_ICONS[post.platform] || PLATFORM_ICONS.twitter;
          return (
            <a
              key={post.id}
              href={post.post_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                padding: "10px 14px",
                borderBottom: "1px solid var(--g100)",
                textDecoration: "none",
                color: "inherit",
                transition: ".1s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14 }}>{platform.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text)" }}>
                  {post.next_level_tracking?.person_name || "Unknown"}
                </span>
                <span style={{
                  fontSize: 9, color: platform.color, fontWeight: 600,
                  marginLeft: "auto", textTransform: "uppercase",
                }}>
                  {platform.label}
                </span>
              </div>
              {post.caption_preview && (
                <p style={{
                  fontSize: 11, color: "var(--g500)", lineHeight: 1.4,
                  margin: 0,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}>
                  {post.caption_preview}
                </p>
              )}
              {post.curated_at && (
                <div style={{ fontSize: 10, color: "var(--g400)", marginTop: 4 }}>
                  {new Date(post.curated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
