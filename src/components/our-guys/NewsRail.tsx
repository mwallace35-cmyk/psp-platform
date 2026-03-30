import { createClient } from "@/lib/data/common";

interface PSPArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  sport: string | null;
  publishedAt: string;
}

interface ExternalNewsItem {
  id: number;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

export async function NewsRail() {
  const supabase = await createClient();

  // Fetch latest PSP articles
  const { data: pspArticles } = await supabase
    .from("articles")
    .select("id, title, slug, excerpt, sport_id, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  // Fetch external news from player_news_cache (if table exists)
  // Fallback: this may not exist yet, so handle gracefully
  let externalNews: ExternalNewsItem[] = [];
  try {
    const { data: external } = await (supabase as any)
      .from("player_news_cache")
      .select("id, title, url, source, published_at")
      .order("published_at", { ascending: false })
      .limit(5);
    if (external) {
      externalNews = external.map((n: any) => ({
        id: n.id,
        title: n.title,
        url: n.url,
        source: n.source,
        publishedAt: n.published_at,
      }));
    }
  } catch {
    // Table might not exist yet — that's OK
  }

  const articles: PSPArticle[] = (pspArticles || []).map((a: any) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    sport: a.sport_id,
    publishedAt: a.published_at,
  }));

  if (articles.length === 0 && externalNews.length === 0) return null;

  return (
    <section style={{ padding: "24px 16px" }}>
      {/* PSP Stories */}
      {articles.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: "clamp(18px, 4vw, 24px)",
            color: "#f5f0e8",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span>📰</span> PSP STORIES
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {articles.map((article) => (
              <a
                key={article.id}
                href={`/articles/${article.slug}`}
                style={{
                  display: "block",
                  background: "#111827",
                  borderRadius: "12px",
                  padding: "16px",
                  borderLeft: "3px solid #f0a500",
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
              >
                <h4 style={{
                  fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#f5f0e8",
                  marginBottom: "4px",
                  lineHeight: 1.3,
                }}>
                  {article.title}
                </h4>
                {article.excerpt && (
                  <p style={{
                    fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                    fontSize: "13px",
                    color: "#9ca3af",
                    lineHeight: 1.4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                  }}>
                    {article.excerpt}
                  </p>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* External News */}
      {externalNews.length > 0 && (
        <div>
          <h3 style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: "clamp(16px, 3.5vw, 20px)",
            color: "#9ca3af",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span>🌐</span> AROUND THE WEB
          </h3>
          <div style={{
            background: "#111827",
            borderRadius: "12px",
            overflow: "hidden",
          }}>
            {externalNews.map((item, i) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 16px",
                  borderBottom: i < externalNews.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  textDecoration: "none",
                }}
              >
                <span style={{
                  fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                  fontSize: "13px",
                  color: "#d1d5db",
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  paddingRight: "12px",
                }}>
                  {item.title}
                </span>
                <span style={{
                  fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                  fontSize: "11px",
                  color: "#6b7280",
                  flexShrink: 0,
                }}>
                  {item.source}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
