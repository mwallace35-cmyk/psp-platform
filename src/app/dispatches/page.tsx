import Link from "next/link";
import type { Metadata } from "next";
import {
  listDispatches,
  getDispatchYears,
  getDispatchCategories,
} from "@/lib/data/dispatches";
import { Breadcrumb } from "@/components/ui";

export const revalidate = 3600;

type SearchParams = { year?: string; category?: string };

const CATEGORY_LABELS: Record<string, string> = {
  commit: "Commits",
  memoriam: "In memoriam",
  record: "Records",
  tedbit: "Tedbits",
  scrimmage: "Scrimmages",
  coaching: "Coaching",
  tournament: "Tournaments",
  game_report: "Game reports",
  other: "Other",
};

const CATEGORY_COLORS: Record<string, string> = {
  commit: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  memoriam: "bg-slate-500/20 text-slate-300 border-slate-500/40",
  record: "bg-[var(--psp-gold)]/20 text-[var(--psp-gold)] border-[var(--psp-gold)]/40",
  tedbit: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  scrimmage: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  coaching: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  tournament: "bg-rose-500/20 text-rose-300 border-rose-500/40",
  game_report: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  other: "bg-gray-600/20 text-gray-400 border-gray-600/40",
};

export const metadata: Metadata = {
  title: "Dispatches — From Ted Silary's Homepage | PhillySportsPack",
  description:
    "Date-addressable dispatches from Ted Silary's rolling homepage (2005–2013): college commits, in-memoriam entries, school records, Tedbits, scrimmage coverage, and every Philly HS sports alert Ted filed day-by-day.",
  alternates: { canonical: "https://phillysportspack.com/dispatches" },
};

function formatDate(s: string | null): string {
  if (!s) return "undated";
  try {
    const d = new Date(s + "T12:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return s;
  }
}

export default async function DispatchesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const year = sp.year ? Number(sp.year) : undefined;
  const category = sp.category;

  const [dispatches, years, categories] = await Promise.all([
    listDispatches({ year, category, limit: 100 }),
    getDispatchYears(),
    getDispatchCategories(),
  ]);

  // Group dispatches by month for readability
  const byMonth = new Map<string, typeof dispatches>();
  for (const d of dispatches) {
    const key = d.dispatch_date
      ? d.dispatch_date.slice(0, 7)   // YYYY-MM
      : "undated";
    const list = byMonth.get(key);
    if (list) list.push(d);
    else byMonth.set(key, [d]);
  }
  const monthOrder = Array.from(byMonth.keys()).sort((a, b) => b.localeCompare(a));

  return (
    <main className="min-h-screen bg-[var(--psp-navy)] text-white">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <Breadcrumb items={[
          { label: "The Archive", href: "/stories" },
          { label: "Dispatches" },
        ]} />

        <header className="mt-4 mb-8 pb-6 border-b border-gray-700/50">
          <h1 className="font-heading text-4xl md:text-6xl text-[var(--psp-gold)]">
            Dispatches
          </h1>
          <p className="mt-3 text-gray-300 max-w-3xl">
            Date-addressable entries pulled from Ted Silary&apos;s rolling homepage
            — every commit, record, memoriam, Tedbit, and scrimmage alert he filed
            between 2005 and 2013.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-8">
          {/* Filter sidebar */}
          <aside className="space-y-5">
            <FilterSection
              label="Category"
              param="category"
              active={category}
              options={categories.map((c) => ({
                value: c.category,
                label: `${CATEGORY_LABELS[c.category] ?? c.category} (${c.count})`,
              }))}
              sp={sp}
            />
            <FilterSection
              label="Year"
              param="year"
              active={year ? String(year) : undefined}
              options={years.map((y) => ({
                value: String(y.year),
                label: `${y.year} (${y.count})`,
              }))}
              sp={sp}
            />
          </aside>

          {/* Main column — timeline */}
          <section className="space-y-8">
            {monthOrder.length === 0 && (
              <div className="text-gray-400 italic">
                No dispatches match those filters.
              </div>
            )}

            {monthOrder.map((mk) => {
              const entries = byMonth.get(mk)!;
              const monthLabel =
                mk === "undated"
                  ? "Undated"
                  : new Date(mk + "-15T12:00:00").toLocaleDateString("en-US", {
                      month: "long", year: "numeric",
                    });
              return (
                <section key={mk}>
                  <h2 className="font-heading text-2xl text-[var(--psp-gold)] mb-3 pb-2 border-b border-gray-700/50">
                    {monthLabel}
                    <span className="text-gray-500 text-sm font-normal ml-3">
                      {entries.length} {entries.length === 1 ? "entry" : "entries"}
                    </span>
                  </h2>
                  <div className="space-y-3">
                    {entries.map((d) => {
                      const cat = d.category ?? "other";
                      const colorClasses = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.other;
                      return (
                        <article
                          key={d.id}
                          className="bg-[var(--psp-navy-mid)] border border-gray-700/50 rounded-lg p-4 hover:border-[var(--psp-gold)]/30 transition"
                          id={`d-${d.id}`}
                        >
                          <div className="flex items-baseline justify-between gap-3 mb-2">
                            <div className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                              {formatDate(d.dispatch_date)}
                            </div>
                            <span
                              className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${colorClasses}`}
                            >
                              {CATEGORY_LABELS[cat] ?? cat}
                            </span>
                          </div>
                          {d.title && (
                            <div className="font-heading text-lg leading-tight text-white">
                              {d.title}
                            </div>
                          )}
                          <p className="text-sm text-gray-300 mt-2 leading-relaxed line-clamp-4">
                            {d.body_text.replace(/\s+/g, " ").trim()}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {dispatches.length === 100 && (
              <div className="text-center text-gray-400 text-sm italic">
                Showing the first 100 dispatches. Narrow by year or category to find more.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}


// ── Filter pills (same pattern as /stories) ─────────────────────────────────
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
  param: "year" | "category";
  sp: SearchParams;
}) {
  function hrefFor(val: string | undefined): string {
    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(sp)) if (v) next[k] = v;
    if (val === undefined || next[param] === val) {
      delete next[param];
    } else {
      next[param] = val;
    }
    const qs = new URLSearchParams(next).toString();
    return qs ? `/dispatches?${qs}` : "/dispatches";
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
