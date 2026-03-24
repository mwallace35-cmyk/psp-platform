import Link from "next/link";
import Image from "next/image";
import { TeamArticle } from "@/lib/data/team-page";

interface ArticlesTabProps {
  articles: TeamArticle[];
  schoolName: string;
}

export function ArticlesTab({ articles, schoolName }: ArticlesTabProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-600">
          No articles about {schoolName} found yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Layout */}
      <div className="hidden md:block space-y-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="flex gap-4 bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow group"
          >
            {article.featured_image_url && (
              <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src={article.featured_image_url}
                  alt={article.title}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base text-[var(--psp-navy)] group-hover:text-[var(--psp-gold)] transition-colors">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {article.excerpt}
                </p>
              )}
              {article.created_at && (
                <p className="text-xs text-gray-300 mt-3">
                  {new Date(article.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {article.featured_image_url && (
              <div className="w-full h-40 rounded-t-lg overflow-hidden bg-gray-200">
                <Image
                  src={article.featured_image_url}
                  alt={article.title}
                  width={400}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-sm text-[var(--psp-navy)]">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                  {article.excerpt}
                </p>
              )}
              {article.created_at && (
                <p className="text-xs text-gray-300 mt-2">
                  {new Date(article.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center pt-4">
        <Link
          href={`/articles?search=${encodeURIComponent(schoolName)}`}
          className="text-sm font-bold text-[var(--psp-navy)] hover:text-[var(--psp-gold)]"
        >
          View all articles about {schoolName} →
        </Link>
      </div>
    </div>
  );
}
