import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllRivalries, SPORT_META } from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import { SportIcon } from "@/components/ui";

export const revalidate = 3600;

export const metadata = {
  title: "Rivalries — PhillySportsPack",
  description: "Explore the greatest rivalries in Philadelphia high school sports. Head-to-head records, game history, and legendary matchups.",
};

interface RivalryCardProps {
  rivalry: any;
}

function RivalryCard({ rivalry }: RivalryCardProps) {
  const sportMeta = (SPORT_META as any)[rivalry.sport_id];

  return (
    <Link href={`/rivalries/${rivalry.slug}`}>
      <div className="group relative bg-navy border border-navy-mid rounded-lg overflow-hidden hover:border-gold transition-all duration-300 hover:shadow-lg h-full">
        {/* Sport badge */}
        {sportMeta && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-navy-mid/80 backdrop-blur px-2 py-1 rounded-full text-xs font-semibold text-white">
            <span>{sportMeta.emoji}</span>
            <span>{sportMeta.name}</span>
          </div>
        )}

        {/* Featured badge */}
        {rivalry.featured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block bg-gold text-navy px-2.5 py-1 rounded-full text-xs font-bold">
              Featured
            </span>
          </div>
        )}

        {/* Main content */}
        <div className="p-6 space-y-4 h-full flex flex-col justify-between">
          {/* Schools */}
          <div className="space-y-3">
            {/* School A */}
            <div className="flex items-center gap-3">
              {rivalry.school_a?.logo_url && (
                <img
                  src={rivalry.school_a.logo_url}
                  alt={rivalry.school_a.name}
                  className="w-12 h-12 object-contain"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{rivalry.school_a?.name}</div>
                {rivalry.school_a?.short_name && (
                  <div className="text-xs text-gray-400">{rivalry.school_a.short_name}</div>
                )}
              </div>
            </div>

            {/* VS */}
            <div className="flex justify-center py-2">
              <div className="text-lg font-bold text-gold">VS</div>
            </div>

            {/* School B */}
            <div className="flex items-center gap-3">
              {rivalry.school_b?.logo_url && (
                <img
                  src={rivalry.school_b.logo_url}
                  alt={rivalry.school_b.name}
                  className="w-12 h-12 object-contain"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{rivalry.school_b?.name}</div>
                {rivalry.school_b?.short_name && (
                  <div className="text-xs text-gray-400">{rivalry.school_b.short_name}</div>
                )}
              </div>
            </div>
          </div>

          {/* Rivalry name */}
          <div className="space-y-1 border-t border-navy-mid pt-3">
            <div className="font-bold text-white text-center line-clamp-2">{rivalry.display_name}</div>
            {rivalry.subtitle && (
              <div className="text-xs text-gray-400 text-center line-clamp-1">{rivalry.subtitle}</div>
            )}
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}

export default async function RivalriesPage() {
  const allRivalries = await getAllRivalries();

  if (!allRivalries || allRivalries.length === 0) {
    return (
      <main className="min-h-screen bg-navy">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Breadcrumb items={[{ label: "Rivalries" }]} className="mb-8" />
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-white mb-2">No Rivalries Found</h1>
            <p className="text-gray-400">Check back soon for rival matchups.</p>
          </div>
        </div>
      </main>
    );
  }

  // Separate featured and non-featured
  const featured = allRivalries.filter((r: any) => r.featured);
  const nonFeatured = allRivalries.filter((r: any) => !r.featured);

  return (
    <main className="min-h-screen bg-navy">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: "Rivalries" }]} />

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold font-bebas text-white tracking-tight">Rivalries</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Explore the greatest rivalries in Philadelphia high school sports. Head-to-head records,
            legendary games, and the history that defines these matchups.
          </p>
        </div>

        {/* Featured Section */}
        {featured.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-bebas text-white">Featured Rivalries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((rivalry: any) => (
                <RivalryCard key={rivalry.id} rivalry={rivalry} />
              ))}
            </div>
          </section>
        )}

        {/* All Rivalries Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold font-bebas text-white">
            {featured.length > 0 ? "All Rivalries" : "Rivalries"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nonFeatured.map((rivalry: any) => (
              <RivalryCard key={rivalry.id} rivalry={rivalry} />
            ))}
          </div>
        </section>

        {/* Stats section */}
        <section className="mt-12 p-8 bg-navy-mid rounded-lg border border-navy-mid">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-gold">{allRivalries.length}</div>
              <div className="text-sm text-gray-400 mt-2">Rivalries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold">
                {new Set(allRivalries.map((r: any) => r.sport_id)).size}
              </div>
              <div className="text-sm text-gray-400 mt-2">Sports</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold">{featured.length}</div>
              <div className="text-sm text-gray-400 mt-2">Featured</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold">
                {new Set(allRivalries.flatMap((r: any) => [r.school_a?.id, r.school_b?.id])).size}
              </div>
              <div className="text-sm text-gray-400 mt-2">Schools</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
