import Link from "next/link";
import { User, School, GraduationCap, ChevronRight } from "lucide-react";
import type { SearchResult } from "@/lib/data";

const ENTITY_STYLES: Record<string, { icon: typeof User; bg: string; text: string; border: string }> = {
  player: { icon: User, bg: "bg-blue-500/10", text: "text-blue-600", border: "group-hover:border-l-blue-500" },
  school: { icon: School, bg: "bg-emerald-500/10", text: "text-emerald-600", border: "group-hover:border-l-emerald-500" },
  coach: { icon: GraduationCap, bg: "bg-purple-500/10", text: "text-purple-600", border: "group-hover:border-l-purple-500" },
};

const SPORT_FROM_PATH: Record<string, { label: string; color: string }> = {
  football: { label: "Football", color: "#16a34a" },
  basketball: { label: "Basketball", color: "#3b82f6" },
  baseball: { label: "Baseball", color: "#dc2626" },
  "track-field": { label: "Track", color: "#7c3aed" },
  lacrosse: { label: "Lacrosse", color: "#0891b2" },
  wrestling: { label: "Wrestling", color: "#ca8a04" },
  soccer: { label: "Soccer", color: "#059669" },
};

function detectSport(urlPath: string) {
  const segment = urlPath.split("/")[1]; // e.g., "/football/schools/..." -> "football"
  return SPORT_FROM_PATH[segment] || null;
}

export default function SearchResultCard({ result }: { result: SearchResult }) {
  const entityType = result.entity_type || "player";
  const style = ENTITY_STYLES[entityType] || ENTITY_STYLES.player;
  const Icon = style.icon;
  const sport = result.url_path ? detectSport(result.url_path) : null;

  return (
    <Link
      href={result.url_path || "#"}
      className={`group flex items-center gap-3 bg-white rounded-lg border border-gray-100 px-4 py-3 transition-all hover:shadow-sm hover:border-gray-200 border-l-2 border-l-transparent ${style.border}`}
    >
      {/* Entity icon circle */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${style.bg}`}
      >
        <Icon size={16} className={style.text} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div
          className="font-semibold text-sm truncate"
          style={{ color: "var(--psp-navy)" }}
        >
          {result.display_name}
        </div>
        {result.context && (
          <div className="text-xs mt-0.5 truncate" style={{ color: "var(--psp-gray-500)" }}>
            {result.context}
          </div>
        )}
      </div>

      {/* Sport badge */}
      {sport && (
        <span
          className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: sport.color }}
        >
          {sport.label}
        </span>
      )}

      {/* Arrow */}
      <ChevronRight size={16} className="flex-shrink-0 text-gray-300 group-hover:text-gray-500 transition-colors" />
    </Link>
  );
}
