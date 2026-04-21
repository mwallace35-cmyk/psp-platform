import Link from "next/link";
import type { Metadata } from "next";
import { listArchiveStories, getArchiveBylines } from "@/lib/data/stories";
import { Breadcrumb } from "@/components/ui";

export const revalidate = 3600;

type SearchParams = { year?: string; sport?: string; byline?: string; category?: string };

export const metadata: Metadata = {
  title: "The Archive — Ted Silary Stories | PhillySportsPack",
  description:
    "Browse 2,600+ stories from Ted Silary's Philadelphia high school sports archive (2001–2021). Columns, previews, and game reports from Ted, Huck, Amauro, Duck, and other local voices.",
  alternates: { canonical: "https://phillysportspack.com/stories" },
};


function formatDate(s: string | null): string {
  if (!s) return "";
  try {
    const d = new Date(s + "T12:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch { return s; }
}


export default async function StoriesIndexPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const year = sp.year ? Number(sp.year) : undefined;
  const sport = sp.sport;
  const byline = sp.byline;
  const category = sp.category;

  const [stories, bylines] = await Promise.all([
    listArchiveStories({ year, sport, byline, category, limit: 120 }),
    getArchiveBylines(sport),
  ]);

  // Year list — derived from current result set, keeps sidebar lightweight
  const years = Array.from(new Set(stories.map((s) => s.year))).sort((a, b) => b - a);

  // Group stories by year for the main column
  const byYear = new Map<number, typeof stories>();
  for (const s of stories) {
    const list = byYear.get(s.year);
    if (list) list.push(s);
    else byYear.set(s.year, [s]);
  }
  const yearsInResult = Array.from(byYear.keys()).sort((a, b) => b - a);

  return (
    <main className="min-h-screen bg-[var(--psp-navy)] text-white">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <Breadcrumb items={[{ label: "The Archive" }]} />

        <header className="mt-4 mb-8 pb-6 border-b border-gray-700/50">
          <h1 className="font-heading text-4xl md:text-6xl text-[var(--psp-gold)]">
            The Archive
          </h1>
          <p className="mt-3 text-gray-300 max-w-3xl">
            Ted Silary&apos;s Philadelphia high school sports writing, preserved
            in full with his permission. Weekly columns, game reports, previews,
            and features from Ted, Huck, Amauro, Duck, Sparky, Frog, Kevin,
            Crispy, Pulse, and the rest of the Philly voices he built around him.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-8">
          {/* Filter sidebar */}
          <aside className="space-y-5">
            <FilterSection label="Sport" options={[
              { value: "football",   label: "Football" },
              { value: "basketball", label: "Basketball" },
              { value: "baseball",   label: "Baseball" },
            ]} active={sport} param="sport" sp={sp} />

            <FilterSection label="Byline" options={bylines.slice(0, 12).map(b => ({
              value: b.byline, label: `${b.byline} (${b.count})`,
            }))} active={byline} param="byline" sp={sp} />

            <FilterSection label="Type" options={[
              { value: "game_report", label: "Game reports" },
              { value: "historical",  label: "Historical" },
              { value: "special",     label: "Special / features" },
              { value: "weekly",      label: "Weekly files" },
            ]} active={category} param="category" sp={sp} />
          </aside>

          {/* Main column */}
          <section className="space-y-8">
            {yearsInResult.length === 0 && (
              <div className="text-gray-400 italic">
                No stories match those filters.
              </div>
            )}
            {yearsInResult.map((yr) => (
              <section key={yr}>
                <h2 className="font-heading text-2xl text-[var(--psp-gold)] mb-3 pb-2 border-b border-gray-700/50">
                  {yr}
                  <span className="text-gray-500 text-sm font-normal ml-3">
                    {byYear.get(yr)!.length} {byYear.get(yr)!.length === 1 ? "story" : "stories"}
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {byYear.get(yr)!.map((s) => (
                    <Link
                      key={s.id}
                      href={`/stories/${s.year}/${s.slug}`}
                      className="block bg-[var(--psp-navy-mid)] border border-gray-700/50 rounded-lg p-4 hover:border-[var(--psp-gold)] transition-all"
                    >
                      <div className="text-[var(--psp-gold)] text-xs uppercase tracking-wider font-semibold mb-1">
                        {s.byline ?? (s.category === "weekly" ? "Weekly file" : "Archive")}
                        {s.column_name && s.column_name !== s.title && (
                          <span className="text-gray-400 font-normal normal-case tracking-normal"> · {s.column_name}</span>
                        )}
                      </div>
                      <div className="font-heading text-lg text-white leading-tight">
                        {s.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {s.published_at && <>{formatDate(s.published_at)} · </>}
                        {s.word_count ? `${s.word_count.toLocaleString()} words` : ""}
                        {s.sport_id && s.sport_id !== "football" && (
                          <span className="ml-2 opacity-70">· {s.sport_id}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}

            {stories.length === 120 && (
              <div className="text-center text-gray-400 text-sm italic">
                Showing the first 120 results. Narrow by year / byline / type to find more.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}


// ── Filter pills ────────────────────────────────────────────────────────────
function FilterSection({
  label,
  options,
  active,
  param,
  sp,
}: {
  label: string;
  options: { value: string; label: string }[];
  active: string | undefined;
  param: "year" | "sport" | "byline" | "category";
  sp: SearchParams;
}) {
  // Build href that toggles the filter while preserving the other params.
  function hrefFor(val: string | undefined): string {
    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(sp)) if (v) next[k] = v;
    if (val === undefined || next[param] === val) {
      delete next[param];
    } else {
      next[param] = val;
    }
    const qs = new URLSearchParams(next).toString();
    return qs ? `/stories?${qs}` : "/stories";
  }

  return (
    <div>
      <h3 className="font-heading text-xs uppercase tracking-wider text-gray-400 mb-2">
        {label}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        <Link
          href={hrefFor(undefined)}
          className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
            !active
              ? "bg-[var(--psp-gold)] text-[var(--psp-navy)] font-semibold"
              : "bg-[var(--psp-navy-mid)] text-gray-300 hover:bg-gray-700/50"
          }`}
        >
          All
        </Link>
        {options.map((o) => (
          <Link
            key={o.value}
            href={hrefFor(o.value)}
            className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
              active === o.value
                ? "bg-[var(--psp-gold)] text-[var(--psp-navy)] font-semibold"
                : "bg-[var(--psp-navy-mid)] text-gray-300 hover:bg-gray-700/50"
            }`}
          >
            {o.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
