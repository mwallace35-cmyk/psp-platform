import Link from "next/link";
import Image from "next/image";
import NoteFromTed from "@/components/ui/NoteFromTed";
import type { TeamDetail, DBArticle } from "./team-utils";
import { timeAgo } from "./team-utils";

interface TeamOverviewTabProps {
  team: TeamDetail;
  articles: DBArticle[];
  tedNotes?: { notes: string[]; sourceUrl?: string | null } | null;
}

export default function TeamOverviewTab({ team, articles, tedNotes }: TeamOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Ted Silary Notes */}
      {tedNotes && tedNotes.notes.length > 0 && (
        <NoteFromTed notes={tedNotes.notes} sourceUrl={tedNotes.sourceUrl} />
      )}

      {/* Season Summary Card */}
      <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-6">
        <h2
          className="psp-h3 mb-4" style={{ color: "var(--psp-navy)" }}
        >
          Season Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: "var(--psp-navy)" }}>
              {team.currentRecord.wins}
            </div>
            <div className="text-sm text-gray-400 mt-1">Wins</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: "var(--psp-navy)" }}>
              {team.currentRecord.losses}
            </div>
            <div className="text-sm text-gray-400 mt-1">Losses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: "var(--psp-gold)" }}>
              {team.pointsFor}
            </div>
            <div className="text-sm text-gray-400 mt-1">Points For</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: "#ef4444" }}>
              {team.pointsAgainst}
            </div>
            <div className="text-sm text-gray-400 mt-1">Points Against</div>
          </div>
        </div>
      </div>

      {/* Recent News */}
      <div>
        <h2
          className="psp-h3 mb-4" style={{ color: "var(--psp-navy)" }}
        >
          Latest News
        </h2>
        {articles && articles.length > 0 ? (
          <div className="space-y-4">
            {articles.slice(0, 3).map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="flex gap-4 bg-white rounded-lg border border-[var(--psp-gray-200)] p-4 hover:shadow-md transition-shadow"
              >
                {article.featured_image_url && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image
                      src={article.featured_image_url}
                      alt={article.title}
                      width={96}
                      height={96}
                      sizes="96px"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-bold text-sm truncate"
                    style={{ color: "var(--psp-navy)" }}
                  >
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {article.excerpt}
                    </p>
                  )}
                  <p className="text-xs text-gray-300 mt-2">
                    {timeAgo(article.published_at)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-6 text-center">
            <p className="text-sm text-gray-400">No articles yet for this team.</p>
          </div>
        )}
      </div>
    </div>
  );
}
