/**
 * PowerRankings — drop-in component for sport hubs.
 *
 * Solves audit SH-2: the existing rankings list rendered just rank + school
 * name. This component adds league/class metadata, record_display from the DB,
 * movement (computed from previous_rank), and a methodology footer.
 *
 * Phase 4b. Schema does NOT include last_result columns yet — those would
 * require a separate join on the games table. Initial release shows record
 * + movement; "last result" can be added in a follow-up commit.
 */

import Link from "next/link";
import { createStaticClient } from "@/lib/supabase/static";
import SportIcon from "@/components/ui/SportIcon";

interface PowerRankingsProps {
  sport: string; // 'football', 'basketball', etc.
  sportColor: string; // CSS variable e.g. 'var(--fb)'
  limit?: number;
}

interface SchoolRow {
  id: number;
  name: string | null;
  slug: string | null;
  city: string | null;
  piaa_class: string | null;
  league: { name: string | null } | null;
}

interface RankingRow {
  rank_position: number;
  previous_rank: number | null;
  record_display: string | null;
  blurb: string | null;
  schools: SchoolRow | SchoolRow[] | null;
}

const SPORT_NAMES: Record<string, string> = {
  football: "Football",
  basketball: "Boys Basketball",
  "boys-basketball": "Boys Basketball",
  "girls-basketball": "Girls Basketball",
  baseball: "Baseball",
  "track-field": "Track & Field",
  lacrosse: "Lacrosse",
  wrestling: "Wrestling",
  soccer: "Soccer",
};

function getMovement(rank: number, previous: number | null) {
  if (previous == null) return { kind: "even" as const, label: "—" };
  const diff = previous - rank; // positive = moved up
  if (diff === 0) return { kind: "even" as const, label: "—" };
  if (diff > 0) return { kind: "up" as const, label: `▲ ${diff}` };
  return { kind: "down" as const, label: `▼ ${-diff}` };
}

export default async function PowerRankings({ sport, sportColor, limit = 10 }: PowerRankingsProps) {
  const supabase = await createStaticClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("power_rankings")
    .select(`
      rank_position,
      previous_rank,
      record_display,
      blurb,
      schools (
        id, name, slug, city, piaa_class,
        league:leagues(name)
      )
    `)
    .eq("sport_id", sport)
    .order("rank_position", { ascending: true })
    .limit(limit);

  if (error || !data || data.length === 0) {
    return (
      <section className="bg-[var(--psp-navy-mid)] border border-[var(--psp-rule-strong)] rounded-xl overflow-hidden">
        <div className="h-1" style={{ background: sportColor }} />
        <div className="p-6 text-center">
          <p className="psp-cream-muted text-sm">
            Power rankings for {SPORT_NAMES[sport] || sport} are coming soon.
          </p>
        </div>
      </section>
    );
  }

  const rows = data as RankingRow[];
  const sportName = SPORT_NAMES[sport] || sport;

  return (
    <section className="bg-[var(--psp-navy-mid)] border border-[var(--psp-rule-strong)] rounded-xl overflow-hidden">
      {/* Sport-color top stripe */}
      <div className="h-1" style={{ background: sportColor }} />

      {/* Header */}
      <header className="flex items-center gap-3 p-5 border-b border-[var(--psp-rule)]">
        <div style={{ color: sportColor }}>
          <SportIcon sport={sport} size="sm" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="psp-h3 psp-cream m-0">
            {sportName} Power Rankings
          </h2>
          <div className="text-[11px] uppercase tracking-widest psp-cream-muted font-medium mt-0.5">
            Top {rows.length} · 2025–26 Season
          </div>
        </div>
        <div className="text-[11px] uppercase tracking-widest psp-cream-dim font-semibold hidden sm:block">
          Updated <span className="text-[var(--psp-gold)]">hourly</span>
        </div>
      </header>

      {/* Column headers */}
      <div
        className="hidden md:grid items-center gap-4 px-5 py-2.5 text-[10px] uppercase tracking-widest font-bold psp-cream-dim border-b border-[var(--psp-rule)]"
        style={{ gridTemplateColumns: "3ch 1fr 9ch 5ch" }}
      >
        <div>#</div>
        <div>School</div>
        <div className="text-right">Record</div>
        <div className="text-right">Mv</div>
      </div>

      {/* Rows */}
      <ol className="list-none p-0 m-0">
        {rows.map((row) => {
          const school = (
            Array.isArray(row.schools) ? row.schools[0] : row.schools
          ) as SchoolRow | null;
          if (!school) return null;
          const isTop3 = row.rank_position <= 3;
          const movement = getMovement(row.rank_position, row.previous_rank);
          const movementClass =
            movement.kind === "up"
              ? "text-[var(--fb)]"
              : movement.kind === "down"
              ? "text-[var(--psp-live)]"
              : "psp-cream-dim";

          // League name unwrap (Supabase can return array)
          const leagueRaw = (school as unknown as { league?: { name: string } | { name: string }[] }).league;
          const leagueName =
            leagueRaw && Array.isArray(leagueRaw)
              ? leagueRaw[0]?.name
              : leagueRaw?.name;

          return (
            <li
              key={row.rank_position}
              className="border-b border-[var(--psp-rule)] last:border-b-0 transition-colors hover:bg-white/[0.02]"
              style={{
                boxShadow: isTop3 ? "inset 3px 0 0 var(--psp-gold)" : undefined,
              }}
            >
              <Link
                href={school.slug ? `/${sport}/schools/${school.slug}` : "#"}
                className="grid items-center gap-4 px-5 py-4"
                style={{
                  gridTemplateColumns: "3ch 1fr 9ch 5ch",
                }}
              >
                <div
                  className="font-display font-extrabold tabular-nums leading-none"
                  style={{
                    fontSize: isTop3 ? "1.5rem" : "1.125rem",
                    color: isTop3 ? "var(--psp-gold)" : "var(--psp-text-cream-muted)",
                  }}
                >
                  {row.rank_position}
                </div>
                <div className="min-w-0">
                  <div className="psp-cream font-bold text-base leading-tight truncate">
                    {school.name}
                  </div>
                  <div className="text-[10px] psp-cream-muted uppercase tracking-wider mt-1 truncate">
                    {leagueName && (
                      <span className="text-[var(--psp-gold)] font-bold mr-1.5">
                        {leagueName}
                      </span>
                    )}
                    {school.piaa_class && <span>PIAA {school.piaa_class}</span>}
                    {school.city && (
                      <span className="psp-cream-dim ml-1.5">
                        · {school.city}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right font-bold text-base psp-cream tabular-nums">
                  {row.record_display || "—"}
                </div>
                <div className={`text-right text-xs font-extrabold tabular-nums ${movementClass}`}>
                  {movement.label}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>

      {/* Methodology footer */}
      <footer className="flex items-center justify-between gap-3 px-5 py-3 border-t border-[var(--psp-rule)] text-[10px] uppercase tracking-widest psp-cream-muted">
        <span className="psp-cream-dim hidden sm:inline">
          Ranked by record · strength of schedule · expert input
        </span>
        <Link
          href={`/${sport}/rankings`}
          className="text-[var(--psp-gold)] font-bold hover:text-[var(--psp-gold-light)] transition-colors ml-auto"
        >
          Full Rankings →
        </Link>
      </footer>
    </section>
  );
}
