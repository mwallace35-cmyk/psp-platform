/**
 * Legacy Profile Auto-Qualifier
 *
 * Inserts UNPUBLISHED stubs into legacy_profiles so an editor can review
 * and flip is_published = true. Safe to run repeatedly — all inserts use
 * NOT EXISTS guards.
 *
 * Run with:
 *   npx tsx scripts/legacy/auto-qualify.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars
 * (service role bypasses RLS for the insert).
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "[auto-qualify] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

// ─────────────────────────────────────────────
// Rule 1: player + coach share a normalized name
// ─────────────────────────────────────────────
async function qualifyPlayerAndCoach() {
  console.log("[auto-qualify] Running Rule 1: player + coach name match…");

  // Fetch all players (no slug join needed — we normalize on the fly)
  const { data: players, error: pe } = await supabase
    .from("players")
    .select("id, name, slug, primary_school_id")
    .not("name", "is", null);

  if (pe || !players) {
    console.warn("[auto-qualify] Could not fetch players:", pe?.message);
    return;
  }

  const { data: coaches, error: ce } = await supabase
    .from("coaches")
    .select("id, name, slug")
    .is("deleted_at", null);

  if (ce || !coaches) {
    console.warn("[auto-qualify] Could not fetch coaches:", ce?.message);
    return;
  }

  // Build normalized name → coach map
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^a-z]/g, "");

  const coachMap = new Map<string, (typeof coaches)[0]>();
  for (const c of coaches) {
    coachMap.set(normalize(c.name), c);
  }

  // Fetch existing legacy_profiles to avoid duplicates
  const { data: existing } = await supabase
    .from("legacy_profiles")
    .select("player_id, coach_id");

  const existingPlayerIds = new Set(existing?.map((e: any) => e.player_id).filter(Boolean));
  const existingCoachIds = new Set(existing?.map((e: any) => e.coach_id).filter(Boolean));

  let insertCount = 0;
  for (const player of players) {
    const coach = coachMap.get(normalize(player.name));
    if (!coach) continue;
    if (existingPlayerIds.has(player.id) || existingCoachIds.has(coach.id)) continue;

    // Use coach.slug as legacy slug (most stable); fallback to player slug
    const legacySlug = coach.slug || player.slug;

    const { error: ie } = await supabase.from("legacy_profiles").insert({
      slug: legacySlug,
      display_name: coach.name,
      primary_school_id: player.primary_school_id ?? null,
      player_id: player.id,
      coach_id: coach.id,
      eligibility_reason: "player_and_coach",
      is_published: false,
    });

    if (ie) {
      // Slug collision — append player_id
      const fallbackSlug = `${legacySlug}-${player.id}`;
      await supabase.from("legacy_profiles").insert({
        slug: fallbackSlug,
        display_name: coach.name,
        primary_school_id: player.primary_school_id ?? null,
        player_id: player.id,
        coach_id: coach.id,
        eligibility_reason: "player_and_coach",
        is_published: false,
      });
    }
    insertCount++;
    existingPlayerIds.add(player.id);
    existingCoachIds.add(coach.id);
  }

  console.log(`[auto-qualify] Rule 1: inserted ${insertCount} stubs.`);
}

// ─────────────────────────────────────────────
// Rule 2: legend_slug + player via legend_allstar_matches
// ─────────────────────────────────────────────
async function qualifyLegendAndPlayer() {
  console.log("[auto-qualify] Running Rule 2: legend + player match…");

  const { data: matches, error } = await supabase
    .from("legend_allstar_matches")
    .select("legend_slug, player_id, match_score")
    .gte("match_score", 0.95);

  if (error || !matches) {
    console.log("[auto-qualify] Rule 2: legend_allstar_matches table not found or empty — skipping.");
    return;
  }

  const { data: existing } = await supabase
    .from("legacy_profiles")
    .select("legend_slug, player_id");
  const existingLegendSlugs = new Set(existing?.map((e: any) => e.legend_slug).filter(Boolean));
  const existingPlayerIds = new Set(existing?.map((e: any) => e.player_id).filter(Boolean));

  let insertCount = 0;
  for (const match of matches) {
    if (existingLegendSlugs.has(match.legend_slug) || existingPlayerIds.has(match.player_id)) continue;

    // Fetch player for display_name
    const { data: player } = await supabase
      .from("players")
      .select("name")
      .eq("id", match.player_id)
      .single();

    if (!player) continue;

    await supabase.from("legacy_profiles").insert({
      slug: match.legend_slug,
      display_name: player.name,
      player_id: match.player_id,
      legend_slug: match.legend_slug,
      eligibility_reason: "legend_and_player",
      is_published: false,
    });

    insertCount++;
    existingLegendSlugs.add(match.legend_slug);
    existingPlayerIds.add(match.player_id);
  }

  console.log(`[auto-qualify] Rule 2: inserted ${insertCount} stubs.`);
}

// ─────────────────────────────────────────────
// Rule 3: legend + coach via LEGEND_SLUGS map
// ─────────────────────────────────────────────
async function qualifyLegendAndCoach() {
  console.log("[auto-qualify] Running Rule 3: legend + coach via LEGEND_SLUGS…");

  // Import the LEGEND_SLUGS map from coaching-records at runtime
  // (ts-node / tsx can resolve the ESM alias)
  let LEGEND_SLUGS: Record<string, string>;
  try {
    // Dynamic import — works with tsx
    const mod = await import("../../src/lib/data/coaching-records");
    // The map is not exported directly; reconstruct from COACHES_100_WINS
    LEGEND_SLUGS = {};
    for (const c of mod.COACHES_100_WINS) {
      if (c.legendSlug) LEGEND_SLUGS[c.name] = c.legendSlug;
    }
    for (const c of mod.COACHES_BEST_PCT) {
      if (c.legendSlug) LEGEND_SLUGS[c.name] = c.legendSlug;
    }
    for (const c of mod.COACHES_MOST_YEARS) {
      if (c.legendSlug) LEGEND_SLUGS[c.name] = c.legendSlug;
    }
  } catch {
    console.log("[auto-qualify] Rule 3: could not import LEGEND_SLUGS — skipping.");
    return;
  }

  const { data: coaches } = await supabase.from("coaches").select("id, name, slug").is("deleted_at", null);
  const { data: existing } = await supabase.from("legacy_profiles").select("legend_slug, coach_id");
  const existingLegendSlugs = new Set(existing?.map((e: any) => e.legend_slug).filter(Boolean));
  const existingCoachIds = new Set(existing?.map((e: any) => e.coach_id).filter(Boolean));

  let insertCount = 0;
  for (const [coachName, legendSlug] of Object.entries(LEGEND_SLUGS)) {
    if (existingLegendSlugs.has(legendSlug)) continue;
    const coach = coaches?.find((c) => c.name === coachName);
    if (!coach || existingCoachIds.has(coach.id)) continue;

    await supabase.from("legacy_profiles").insert({
      slug: legendSlug,
      display_name: coachName,
      coach_id: coach.id,
      legend_slug: legendSlug,
      eligibility_reason: "legend_and_coach",
      is_published: false,
    });
    insertCount++;
    existingLegendSlugs.add(legendSlug);
    existingCoachIds.add(coach.id);
  }

  console.log(`[auto-qualify] Rule 3: inserted ${insertCount} stubs.`);
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
async function main() {
  console.log("[auto-qualify] Starting legacy profile auto-qualification…\n");
  await qualifyPlayerAndCoach();
  await qualifyLegendAndPlayer();
  await qualifyLegendAndCoach();
  console.log("\n[auto-qualify] Done. Review unpublished stubs in legacy_profiles WHERE is_published = false.");
}

main().catch((err) => {
  console.error("[auto-qualify] Fatal error:", err);
  process.exit(1);
});
