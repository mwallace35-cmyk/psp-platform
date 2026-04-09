import { cache } from "react";
import { createClient, withErrorHandling, withRetry } from "./common";

/**
 * Ted Silary's era-canon football selections live in the `awards` table
 * under the following award_types:
 *
 *   '30-year-team'       — Ted Silary 30-Year Team (1976-2005), 78 picks
 *   'all-decade'         — All-Decade 1970s / 80s / 90s / 2000s rosters
 *   'player-of-decade'   — 3 tiers per decade (Catholic, Public, Inter-Ac;
 *                          one of them flagged as "Overall Player of the
 *                          Decade")
 *   'coach-of-decade'    — one per decade (5 total including Catholic)
 *
 * Positions use Ted's own abbreviations: C / L / Rec. / QB / RB / MP / KR
 * / K / P (offense) and L / LB / B (defense). `player_id` is currently
 * NULL for these rows — names sit in `player_name` and the school sits
 * in `notes` as "school: <name>". A follow-up matching script can link
 * where confident, and the query helpers below gracefully render either
 * linked or unlinked picks.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DecadeSlug = "30-year" | "1970s" | "1980s" | "1990s" | "2000s";

export const DECADE_SLUGS: DecadeSlug[] = [
  "30-year",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
];

export const DECADE_META: Record<
  DecadeSlug,
  { label: string; years: string; year: number | null }
> = {
  "30-year": {
    label: "30-Year Team",
    years: "1976–2005",
    year: null,
  },
  "1970s": { label: "1970s All-Decade", years: "1970–1979", year: 1979 },
  "1980s": { label: "1980s All-Decade", years: "1980–1989", year: 1989 },
  "1990s": { label: "1990s All-Decade", years: "1990–1999", year: 1999 },
  "2000s": { label: "2000s All-Decade", years: "2000–2009", year: 2009 },
};

export type RosterTier = "First Team" | "Second Team" | "Third Team";
export type RosterCategory = "Offense" | "Defense" | "Specialist";

export interface DecadePick {
  id: number;
  position: string | null;
  tier: RosterTier;
  category: RosterCategory;
  playerName: string;
  /** Parsed from the `notes` column; falls back to empty string. */
  school: string;
  /** Two-digit class year as a string, or null if unknown. */
  classYear: string | null;
  /** Populated once name-matching links to the `players` table. */
  playerSlug: string | null;
  playerId: number | null;
  sourceUrl: string | null;
}

export interface PlayerOfDecadeEntry {
  id: number;
  tier: string; // e.g. "Overall Player of the Decade" / "Catholic League Player of the Decade"
  playerName: string;
  school: string;
  playerSlug: string | null;
  playerId: number | null;
  isOverall: boolean;
}

export interface CoachOfDecadeEntry {
  id: number;
  name: string;
  school: string;
  /** Slug of the matching `legends/[slug]` MDX if the coach has a tribute. */
  legendSlug: string | null;
}

export interface DecadeByTheNumbers {
  totalPicks: number;
  firstTeamCount: number;
  secondTeamCount: number;
  thirdTeamCount: number;
  offenseCount: number;
  defenseCount: number;
  schoolsRepresented: number;
  topSchool: { name: string; count: number } | null;
}

export interface DecadeRosterPayload {
  slug: DecadeSlug;
  label: string;
  years: string;
  picks: DecadePick[];
  playersOfDecade: PlayerOfDecadeEntry[];
  coachOfDecade: CoachOfDecadeEntry | null;
  stats: DecadeByTheNumbers;
  sourceUrl: string | null;
}

// ---------------------------------------------------------------------------
// Raw row shape from the awards table
// ---------------------------------------------------------------------------

interface AwardRow {
  id: number;
  award_type: string;
  award_name: string | null;
  award_tier: string | null;
  category: string | null;
  position: string | null;
  player_name: string | null;
  player_id: number | null;
  source_url: string | null;
  notes: string | null;
  year: number | null;
}

/**
 * Extract the "school: <name>" marker our parser writes into the notes column.
 * Returns an empty string if not present.
 */
function parseSchoolFromNotes(notes: string | null): string {
  if (!notes) return "";
  const m = notes.match(/school:\s*([^;]+)/i);
  return m ? m[1].trim() : "";
}

function parseClassYearFromNotes(notes: string | null): string | null {
  if (!notes) return null;
  const m = notes.match(/class of '?(\d{2,4})/i);
  return m ? m[1] : null;
}

function tierFromRaw(raw: string | null): RosterTier {
  if (raw === "Second Team") return "Second Team";
  if (raw === "Third Team") return "Third Team";
  return "First Team";
}

function categoryFromRaw(raw: string | null): RosterCategory {
  if (raw === "Defense") return "Defense";
  if (raw === "Specialist") return "Specialist";
  return "Offense";
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function toDecadePick(row: AwardRow): DecadePick {
  return {
    id: row.id,
    position: row.position,
    tier: tierFromRaw(row.award_tier),
    category: categoryFromRaw(row.category),
    playerName: row.player_name ?? "",
    school: parseSchoolFromNotes(row.notes),
    classYear: parseClassYearFromNotes(row.notes),
    playerSlug: null, // populated below via a batch lookup
    playerId: row.player_id,
    sourceUrl: row.source_url,
  };
}

function toPotd(row: AwardRow): PlayerOfDecadeEntry {
  const isOverall = (row.award_tier ?? "").toLowerCase().includes("overall");
  return {
    id: row.id,
    tier: row.award_tier ?? "Player of the Decade",
    playerName: row.player_name ?? "",
    school: parseSchoolFromNotes(row.notes),
    playerSlug: null,
    playerId: row.player_id,
    isOverall,
  };
}

function toCotd(row: AwardRow): CoachOfDecadeEntry {
  return {
    id: row.id,
    name: row.player_name ?? "",
    school: parseSchoolFromNotes(row.notes),
    legendSlug: null, // populated in page layer from the MDX directory
  };
}

// ---------------------------------------------------------------------------
// Player-slug enrichment
// ---------------------------------------------------------------------------

/**
 * Given a set of picks with NULL player_ids, try to link them to the
 * `players` table by (name, graduation_year) so the page can render
 * real links. Cheap best-effort — unmatched picks stay plain text.
 */
async function linkPlayerSlugs(
  picks: DecadePick[],
): Promise<DecadePick[]> {
  const unlinked = picks.filter((p) => !p.playerSlug && p.playerName);
  if (unlinked.length === 0) return picks;

  const supabase = await createClient();
  const names = Array.from(new Set(unlinked.map((p) => p.playerName)));

  const { data, error } = await supabase
    .from("players")
    .select("id, name, slug, graduation_year")
    .in("name", names);

  if (error || !data) return picks;

  // Index by lowercased name. When multiple rows share a name we disambiguate
  // by comparing the two-digit class year. The input class year is a 2-digit
  // string ('76, '84) — convert to 4-digit and compare.
  const byName = new Map<string, typeof data>();
  for (const p of data) {
    const key = p.name.toLowerCase();
    const bucket = byName.get(key) ?? [];
    bucket.push(p);
    byName.set(key, bucket);
  }

  return picks.map((pick) => {
    if (pick.playerSlug) return pick;
    const bucket = byName.get(pick.playerName.toLowerCase());
    if (!bucket || bucket.length === 0) return pick;

    // Prefer a class-year match if we have one.
    if (pick.classYear) {
      const yy = parseInt(pick.classYear, 10);
      const fullYear = yy >= 70 ? 1900 + yy : 2000 + yy;
      const match =
        bucket.find((b) => b.graduation_year === fullYear) ?? bucket[0];
      return { ...pick, playerSlug: match.slug, playerId: match.id };
    }
    // Otherwise take the first hit (unambiguous, or we can't tell).
    return { ...pick, playerSlug: bucket[0].slug, playerId: bucket[0].id };
  });
}

async function linkPotdSlugs(
  entries: PlayerOfDecadeEntry[],
): Promise<PlayerOfDecadeEntry[]> {
  const unlinked = entries.filter((e) => !e.playerSlug && e.playerName);
  if (unlinked.length === 0) return entries;

  const supabase = await createClient();
  const names = Array.from(new Set(unlinked.map((e) => e.playerName)));
  const { data, error } = await supabase
    .from("players")
    .select("id, name, slug")
    .in("name", names);

  if (error || !data) return entries;

  const byName = new Map<string, { id: number; slug: string }>();
  for (const p of data) {
    if (!byName.has(p.name.toLowerCase())) {
      byName.set(p.name.toLowerCase(), { id: p.id, slug: p.slug });
    }
  }

  return entries.map((e) => {
    const hit = byName.get(e.playerName.toLowerCase());
    return hit ? { ...e, playerId: hit.id, playerSlug: hit.slug } : e;
  });
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

function computeStats(picks: DecadePick[]): DecadeByTheNumbers {
  const schoolCounts = new Map<string, number>();
  for (const p of picks) {
    if (!p.school) continue;
    schoolCounts.set(p.school, (schoolCounts.get(p.school) ?? 0) + 1);
  }

  let topSchool: { name: string; count: number } | null = null;
  for (const [name, count] of schoolCounts) {
    if (!topSchool || count > topSchool.count) topSchool = { name, count };
  }

  return {
    totalPicks: picks.length,
    firstTeamCount: picks.filter((p) => p.tier === "First Team").length,
    secondTeamCount: picks.filter((p) => p.tier === "Second Team").length,
    thirdTeamCount: picks.filter((p) => p.tier === "Third Team").length,
    offenseCount: picks.filter((p) => p.category === "Offense").length,
    defenseCount: picks.filter((p) => p.category === "Defense").length,
    schoolsRepresented: schoolCounts.size,
    topSchool,
  };
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

const ROSTER_COLUMNS =
  "id, award_type, award_name, award_tier, category, position, player_name, player_id, source_url, notes, year";

function rosterSelector(slug: DecadeSlug) {
  if (slug === "30-year") {
    return {
      type: "30-year-team",
      awardName: "Ted Silary 30-Year Team",
    } as const;
  }
  return {
    type: "all-decade",
    awardName: `Ted Silary All-Decade ${slug}`,
  } as const;
}

/**
 * Load a single decade roster (30-year or one of the four decade teams),
 * including Player of the Decade + Coach of the Decade for the decade
 * files (the 30-year team does not have its own POTD/COTD).
 */
const EMPTY_ROSTER = (slug: DecadeSlug): DecadeRosterPayload => ({
  slug,
  label: DECADE_META[slug].label,
  years: DECADE_META[slug].years,
  picks: [],
  playersOfDecade: [],
  coachOfDecade: null,
  stats: {
    totalPicks: 0,
    firstTeamCount: 0,
    secondTeamCount: 0,
    thirdTeamCount: 0,
    offenseCount: 0,
    defenseCount: 0,
    schoolsRepresented: 0,
    topSchool: null,
  },
  sourceUrl: null,
});

export const getDecadeRoster = cache(
  async (slug: DecadeSlug): Promise<DecadeRosterPayload> => {
    return withErrorHandling(
      async () => {
        return withRetry(async () => {
          const supabase = await createClient();
          const { type, awardName } = rosterSelector(slug);

          const rosterQuery = supabase
            .from("awards")
            .select(ROSTER_COLUMNS)
            .eq("award_type", type)
            .eq("award_name", awardName);

          const potdQuery =
            slug === "30-year"
              ? Promise.resolve({ data: [] as AwardRow[], error: null })
              : supabase
                  .from("awards")
                  .select(ROSTER_COLUMNS)
                  .eq("award_type", "player-of-decade")
                  .eq("award_name", `Ted Silary ${slug} Player of the Decade`);

          const cotdQuery =
            slug === "30-year"
              ? Promise.resolve({ data: [] as AwardRow[], error: null })
              : supabase
                  .from("awards")
                  .select(ROSTER_COLUMNS)
                  .eq("award_type", "coach-of-decade")
                  .eq("award_name", `Ted Silary ${slug} Coach of the Decade`);

          const [rosterRes, potdRes, cotdRes] = await Promise.all([
            rosterQuery,
            potdQuery,
            cotdQuery,
          ]);

          if (rosterRes.error) throw rosterRes.error;

          const rawPicks = (rosterRes.data ?? []) as AwardRow[];
          const rawPotd = ((potdRes as { data: AwardRow[] | null }).data ??
            []) as AwardRow[];
          const rawCotd = ((cotdRes as { data: AwardRow[] | null }).data ??
            []) as AwardRow[];

          const picksMapped = rawPicks.map(toDecadePick);
          const potdMapped = rawPotd.map(toPotd);

          // Sort picks by tier then category then position for a stable
          // rendering order. Tier priority matches the reader's mental
          // model: First > Second > Third.
          const tierOrder: Record<RosterTier, number> = {
            "First Team": 0,
            "Second Team": 1,
            "Third Team": 2,
          };
          const catOrder: Record<RosterCategory, number> = {
            Offense: 0,
            Defense: 1,
            Specialist: 2,
          };
          picksMapped.sort((a, b) => {
            const t = tierOrder[a.tier] - tierOrder[b.tier];
            if (t !== 0) return t;
            const c = catOrder[a.category] - catOrder[b.category];
            if (c !== 0) return c;
            return (a.position ?? "").localeCompare(b.position ?? "");
          });

          // Sort POTD: Overall first, then Catholic, Public, Inter-Ac by name.
          potdMapped.sort((a, b) => {
            if (a.isOverall !== b.isOverall) return a.isOverall ? -1 : 1;
            return a.tier.localeCompare(b.tier);
          });

          const [linkedPicks, linkedPotd] = await Promise.all([
            linkPlayerSlugs(picksMapped),
            linkPotdSlugs(potdMapped),
          ]);

          const stats = computeStats(linkedPicks);

          const meta = DECADE_META[slug];
          const sourceUrl = rawPicks[0]?.source_url ?? null;

          return {
            slug,
            label: meta.label,
            years: meta.years,
            picks: linkedPicks,
            playersOfDecade: linkedPotd,
            coachOfDecade: rawCotd.length > 0 ? toCotd(rawCotd[0]) : null,
            stats,
            sourceUrl,
          } satisfies DecadeRosterPayload;
        });
      },
      EMPTY_ROSTER(slug),
      "getDecadeRoster",
      { slug },
    );
  },
);

/**
 * Summary card payload for the `/hof/decades` index page — one entry per
 * decade, with just the counts needed for tile rendering.
 */
export interface DecadeIndexEntry {
  slug: DecadeSlug;
  label: string;
  years: string;
  totalPicks: number;
  coachOfDecade: string | null;
  overallPotd: string | null;
}

export const getDecadesIndex = cache(async (): Promise<DecadeIndexEntry[]> => {
  return withErrorHandling(
    async () => {
      return withRetry(async () => {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from("awards")
          .select("award_type, award_name, player_name, award_tier")
          .in("award_type", [
            "30-year-team",
            "all-decade",
            "player-of-decade",
            "coach-of-decade",
          ]);

        if (error) throw error;
        const rows = (data ?? []) as Array<{
          award_type: string;
          award_name: string | null;
          player_name: string | null;
          award_tier: string | null;
        }>;

        return DECADE_SLUGS.map((slug) => {
          const meta = DECADE_META[slug];
          const { type, awardName } = rosterSelector(slug);
          const picks = rows.filter(
            (r) => r.award_type === type && r.award_name === awardName,
          );
          const coach =
            slug === "30-year"
              ? null
              : rows.find(
                  (r) =>
                    r.award_type === "coach-of-decade" &&
                    r.award_name === `Ted Silary ${slug} Coach of the Decade`,
                )?.player_name ?? null;
          const overallPotd =
            slug === "30-year"
              ? null
              : rows.find(
                  (r) =>
                    r.award_type === "player-of-decade" &&
                    r.award_name === `Ted Silary ${slug} Player of the Decade` &&
                    (r.award_tier ?? "").toLowerCase().includes("overall"),
                )?.player_name ?? null;

          return {
            slug,
            label: meta.label,
            years: meta.years,
            totalPicks: picks.length,
            coachOfDecade: coach,
            overallPotd,
          } satisfies DecadeIndexEntry;
        });
      });
    },
    [] as DecadeIndexEntry[],
    "getDecadesIndex",
  );
});
