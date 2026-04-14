import { createClient } from "@/lib/data/common";

interface PSPArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  sport: string | null;
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

  const articles: PSPArticle[] = (pspArticles || []).map((a: any) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    sport: a.sport_id,
    publishedAt: a.published_at,
  }));

  if (articles.length === 0) return null;

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

    </section>
  );
}
