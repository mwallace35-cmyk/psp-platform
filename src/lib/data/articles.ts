import {
  createClient,
  withErrorHandling,
  withRetry,
} from "./common";

/**
 * Get featured articles, optionally filtered by sport
 */
export async function getFeaturedArticles(sportId?: string, limit = 5) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          let query = supabase
            .from("articles")
            .select("id, slug, title, excerpt, author_name, sport_id, featured_image_url, published_at, featured_at, schools(name, slug), players(name, slug)")
            .eq("status", "published")
            .is("deleted_at", null)
            .order("featured_at", { ascending: false, nullsFirst: false })
            .order("published_at", { ascending: false })
            .limit(limit);
          if (sportId) query = query.eq("sport_id", sportId);
          const { data } = await query;
          return data ?? [];
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_FEATURED_ARTICLES",
    { sportId, limit }
  );
}

/**
 * Get a single article by slug
 */
export async function getArticleBySlug(slug: string) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("articles")
            .select("*, schools(name, slug), players(name, slug), championships(level, score, seasons(label))")
            .eq("slug", slug)
            .eq("status", "published")
            .is("deleted_at", null)
            .single();
          return data;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    null,
    "DATA_ARTICLE_BY_SLUG",
    { slug }
  );
}

/**
 * Article mention type from article_mentions join with articles
 */
interface ArticleMention {
  articles: {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    sport_id: string;
    published_at: string;
    featured_image_url: string | null;
  } | null;
}

/**
 * Get articles that mention a specific entity (player, school, etc.)
 */
export async function getArticlesForEntity(entityType: string, entityId: number, limit = 10) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          // Use a single query with JOIN to avoid N+1 problem
          // PostgreSQL JSON selection returns the full related records
          const { data } = await supabase
            .from("article_mentions")
            .select("articles(id, slug, title, excerpt, sport_id, published_at, featured_image_url)", { count: "exact" })
            .eq("entity_type", entityType)
            .eq("entity_id", entityId)
            .eq("articles.status", "published")
            .is("articles.deleted_at", null)
            .order("articles(published_at)", { ascending: false })
            .limit(limit);

          if (!data?.length) return [];
          // Extract articles from the mentions - filter out nulls
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (data as any[])
            .map((m) => m.articles)
            .filter(Boolean)
            .slice(0, limit);
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_ARTICLES_FOR_ENTITY",
    { entityType, entityId, limit }
  );
}
