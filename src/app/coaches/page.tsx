import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import { createStaticClient } from "@/lib/supabase/static";
import CoachesDirectory from "@/components/coaches/CoachesDirectory";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Coaches Directory — PhillySportsPack",
  description:
    "Browse current head coaches across the Catholic League, Public League, and Inter-Ac League for Philadelphia high school sports.",
  alternates: { canonical: "https://phillysportspack.com/coaches" },
};

/* ── Types ── */

interface CoachRow {
  id: number;
  name: string;
  slug: string;
  bio: string | null;
  coaching_stints: {
    sport_id: string;
    start_year: number;
    end_year: number | null;
    role: string;
    record_wins: number;
    record_losses: number;
    record_ties: number;
    championships: number;
    schools: { id: number; name: string; slug: string; league_id: string | null; colors: Record<string, string> | null };
    sports: { name: string };
  }[];
}

interface LeagueRow {
  id: string;
  name: string;
}

/* ── Page ── */

export default async function CoachesPage() {
  const supabase = createStaticClient();

  const [coachesRes, leaguesRes] = await Promise.all([
    supabase
      .from("coaches")
      .select(
        "id, name, slug, bio, coaching_stints(sport_id, start_year, end_year, role, record_wins, record_losses, record_ties, championships, schools(id, name, slug, league_id, colors), sports(name))"
      )
      .is("deleted_at", null)
      .order("name")
      .limit(200),
    supabase
      .from("leagues")
      .select("id, name")
      .in("name", [
        "Philadelphia Catholic League",
        "Philadelphia Public League",
        "Inter-Academic League",
      ]),
  ]);

  const rawCoaches = (coachesRes.data ?? []) as unknown as CoachRow[];
  const leagues = (leaguesRes.data ?? []) as LeagueRow[];

  // Build league ID → display name map
  const leagueMap: Record<string, string> = {};
  for (const l of leagues) {
    leagueMap[l.id] = l.name;
  }

  // Transform coaches into a flat list with league info
  const coaches = rawCoaches
    .filter((c) => c.coaching_stints && c.coaching_stints.length > 0)
    .map((c) => {
      const stint = c.coaching_stints[0];
      const school = Array.isArray(stint.schools) ? stint.schools[0] : stint.schools;
      const sport = Array.isArray(stint.sports) ? stint.sports[0] : stint.sports;
      const leagueId = school?.league_id ?? null;
      const leagueName = leagueId ? leagueMap[leagueId] ?? null : null;

      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        school_name: school?.name ?? "Unknown",
        school_slug: school?.slug ?? "",
        school_colors: school?.colors ?? null,
        league_id: leagueId,
        league_name: leagueName,
        sport_id: stint.sport_id,
        sport_name: sport?.name ?? stint.sport_id,
        start_year: stint.start_year,
        end_year: stint.end_year,
        role: stint.role ?? "Head Coach",
        record_wins: stint.record_wins,
        record_losses: stint.record_losses,
        record_ties: stint.record_ties,
        championships: stint.championships,
      };
    });

  // Stats
  const totalCoaches = coaches.length;
  const footballCount = coaches.filter((c) => c.sport_id === "football").length;
  const basketballCount = coaches.filter((c) => c.sport_id === "basketball").length;

  return (
    <main id="main-content" className="min-h-screen bg-gray-50">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://phillysportspack.com" },
          { name: "Coaches", url: "https://phillysportspack.com/coaches" },
        ]}
      />
      <Breadcrumb items={[{ label: "Coaches" }]} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-navy via-navy-mid to-navy py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="psp-h1 text-white mb-2">
            Coaches Directory
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Current head coaches across the Philadelphia Catholic League, Public League, and
            Inter-Ac League.
          </p>
          <div className="flex flex-wrap gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gold font-bold text-xl">{totalCoaches}</span>
              <span className="text-gray-300">Coaches</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold font-bold text-xl">{footballCount}</span>
              <span className="text-gray-300">Football</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold font-bold text-xl">{basketballCount}</span>
              <span className="text-gray-300">Basketball</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold font-bold text-xl">3</span>
              <span className="text-gray-300">Leagues</span>
            </div>
          </div>
        </div>
      </div>

      {/* Directory */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <CoachesDirectory coaches={coaches} />
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Coaches Directory",
            url: "https://phillysportspack.com/coaches",
            description:
              "Philadelphia high school sports coaches directory across all leagues.",
            numberOfItems: totalCoaches,
            isPartOf: {
              "@type": "WebSite",
              name: "PhillySportsPack",
              url: "https://phillysportspack.com",
            },
          }),
        }}
      />
    </main>
  );
}
