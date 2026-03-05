import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isValidSport, SPORT_META } from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageParams = { sport: string };

const SPORT_COLORS_HEX: Record<string, string> = {
  football: "#16a34a",
  basketball: "#ea580c",
  baseball: "#dc2626",
  "flag-football": "#ec4899",
  "girls-basketball": "#f59e0b",
  "track-field": "#7c3aed",
  lacrosse: "#0891b2",
  wrestling: "#ca8a04",
  soccer: "#059669",
};

const ARTICLES_PER_PAGE = 12;

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport } = await params;
  if (!isValidSport(sport)) return {};
  const meta = SPORT_META[sport];
  return {
    title: `${meta.name} News — PhillySportsPack`,
    description: `Latest ${meta.name.toLowerCase()} news and stories from Philadelphia high school sports.`,
  };
}

export async function generateStaticParams() {
  return [
    { sport: "football" },
    { sport: "basketball" },
    { sport: "baseball" },
    { sport: "flag-football" },
    { sport: "girls-basketball" },
    { sport: "track-field" },
    { sport: "lacrosse" },
    { sport: "wrestling" },
    { sport: "soccer" },
  ];
}

interface SearchParams {
  page?: string;
}

export default async function SportNewsPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<SearchParams>;
}) {
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();

  const meta = SPORT_META[sport];
  const sportColor = SPORT_COLORS_HEX[sport] || "#16a34a";
  const sp = await searchParams;
  const currentPage = Math.max(1, parseInt(sp.page || "1"));
  const offset = (currentPage - 1) * ARTICLES_PER_PAGE;

  const supabase = await createClient();

  const { data: articles, count } = await supabase
    .from("articles")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .eq("sport_id", sport)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(offset, offset + ARTICLES_PER_PAGE - 1);

  const totalPages = Math.ceil((count || 0) / ARTICLES_PER_PAGE);

  function buildUrl(page: number) {
    return page > 1 ? `/${sport}/news?page=${page}` : `/${sport}/news`;
  }

  return (
    <>
      <Breadcrumb items={[{ label: meta.name, href: `/${sport}` }, { label: "News" }]} />

      {/* Sport Header */}
      <div className="sport-hub-header" style={{ "--sport-color": sportColor } as React.CSSProperties}>
        <div className="shh-inner">
          <span className="shh-emoji">{meta.emoji}</span>
          <h1 className="shh-title">{meta.name} News</h1>
          {count !== null && (
            <div className="shh-pills">
              <div className="shh-pill"><strong>{count}</strong> article{count !== 1 ? "s" : ""}</div>
            </div>
          )}
        </div>
      </div>

      <PSPPromo size="banner" variant={3} />

      {/* Content */}
      <div className="psp-container" style={{ padding: "32px 16px" }}>
        {!articles || articles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📰</div>
            <p style={{ color: "var(--text-muted)", fontSize: 18, marginBottom: 8 }}>
              No {meta.name.toLowerCase()} articles yet.
            </p>
            <Link href={`/${sport}`} style={{ color: "var(--psp-gold)", fontSize: 14, fontWeight: 600 }}>
              Back to {meta.name} &rarr;
            </Link>
          </div>
        ) : (
          <>
            <div className="article-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}>
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="article-card"
                  style={{ textDecoration: "none" }}
                >
                  <article className="card" style={{ height: "100%", overflow: "hidden" }}>
                    {article.featured_image_url && (
                      <div style={{ width: "100%", height: 192, background: "var(--bg-muted)", overflow: "hidden" }}>
                        <img
                          src={article.featured_image_url}
                          alt={article.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <div style={{ padding: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: 18 }}>{meta.emoji}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--psp-gold)", textTransform: "uppercase" as const, letterSpacing: 1 }}>
                          {meta.name}
                        </span>
                      </div>
                      <h2 style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: 8,
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as const,
                        overflow: "hidden",
                      }}>
                        {article.title}
                      </h2>
                      <p style={{
                        fontSize: 14,
                        color: "var(--text-secondary)",
                        marginBottom: 16,
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as const,
                        overflow: "hidden",
                      }}>
                        {article.excerpt || "Click to read article..."}
                      </p>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: 12,
                        borderTop: "1px solid var(--border)",
                        fontSize: 12,
                        color: "var(--text-muted)",
                      }}>
                        <span>{article.author}</span>
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 48 }}>
                {currentPage > 1 && (
                  <Link href={buildUrl(currentPage - 1)} className="btn btn-secondary" style={{ fontSize: 14 }}>
                    &larr; Previous
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Link
                    key={page}
                    href={buildUrl(page)}
                    className={page === currentPage ? "btn btn-primary" : "btn btn-secondary"}
                    style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}
                  >
                    {page}
                  </Link>
                ))}
                {currentPage < totalPages && (
                  <Link href={buildUrl(currentPage + 1)} className="btn btn-secondary" style={{ fontSize: 14 }}>
                    Next &rarr;
                  </Link>
                )}
              </div>
            )}

            <PSPPromo size="banner" variant={5} />
          </>
        )}
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${meta.name} News — PhillySportsPack`,
            description: `Latest ${meta.name.toLowerCase()} news from Philadelphia high school sports.`,
            url: `https://phillysportspack.com/${sport}/news`,
            isPartOf: { "@type": "WebSite", name: "PhillySportsPack", url: "https://phillysportspack.com" },
          }),
        }}
      />
    </>
  );
}
