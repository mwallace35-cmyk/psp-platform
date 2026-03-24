import Link from "next/link";

interface NewsArticle {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  featured_image_url?: string | null;
  published_at?: string | null;
}

interface SportHubNewsProps {
  sport: string;
  sportName: string;
  sportColorHex: string;
  articles: NewsArticle[];
}

export default function SportHubNews({
  sport,
  sportName,
  sportColorHex,
  articles,
}: SportHubNewsProps) {
  if (articles.length === 0) return null;

  return (
    <section className="py-8 px-4" aria-label={`Latest ${sportName} news`}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="psp-h2 text-white flex items-center gap-2">
            <span
              className="inline-block w-1 h-6 rounded-full"
              style={{ background: sportColorHex }}
            />
            Latest {sportName} News
          </h2>
          <Link
            href={`/articles?sport=${sport}`}
            className="text-xs font-semibold uppercase tracking-wider hover:underline"
            style={{ color: sportColorHex }}
          >
            View All Articles &#8594;
          </Link>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => {
            const publishDate = article.published_at
              ? new Date(article.published_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : null;

            return (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group block rounded-lg overflow-hidden border border-white/10 bg-[var(--psp-navy-mid)] hover:border-white/20 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:outline-none"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {/* Thumbnail */}
                <div
                  className="h-36 w-full"
                  style={{
                    background: article.featured_image_url
                      ? `url(${article.featured_image_url}) center/cover no-repeat`
                      : `linear-gradient(135deg, ${sportColorHex}33, var(--psp-navy))`,
                  }}
                />

                {/* Content */}
                <div className="p-4">
                  {/* Date tag */}
                  {publishDate && (
                    <div
                      className="text-[10px] font-bold uppercase tracking-wider mb-2"
                      style={{ color: sportColorHex }}
                    >
                      {publishDate}
                    </div>
                  )}

                  {/* Headline */}
                  <h3
                    className="text-sm font-bold text-white leading-snug mb-2 group-hover:text-[var(--psp-gold)] transition-colors"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  {article.excerpt && (
                    <p
                      className="text-xs text-white/50 leading-relaxed"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
