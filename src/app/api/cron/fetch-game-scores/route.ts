import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  fetchScoreboard,
  fetchBoxScore,
  matchPhillyPlayers,
  cacheScoreboard,
  cacheBoxScore,
  cachePerformances,
  type LeagueId,
} from "@/lib/data/espn-provider";
import {
  getActiveNLTEntries,
  getTeamMappings,
} from "@/lib/data/player-matcher";
import { createClient } from "@/lib/data/common";

export const runtime = "nodejs";
export const maxDuration = 60;

const VALID_LEAGUES: LeagueId[] = ["NFL", "NBA", "MLB", "CFB", "CBB"];

/**
 * Look up the game_scores_cache primary key by ESPN event ID.
 * Returns null if the row doesn't exist yet (race condition / cache miss).
 */
async function getGameCacheId(espnEventId: string): Promise<number | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from("game_scores_cache")
      .select("id")
      .eq("espn_event_id", espnEventId)
      .single();
    if (error || !data) return null;
    return data.id;
  } catch {
    return null;
  }
}

/**
 * Cron job: Fetch ESPN scores for a given league, match Philly players,
 * and cache everything in Supabase.
 *
 * Called daily by Vercel Cron with ?league=NFL (or NBA, CFB, CBB, MLB).
 * Vercel sends the CRON_SECRET header automatically.
 */
export async function GET(request: NextRequest) {
  // ── 1. Verify CRON_SECRET ────────────────────────────────────────────
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 2. Validate league param ─────────────────────────────────────────
  const league = request.nextUrl.searchParams
    .get("league")
    ?.toUpperCase() as LeagueId;

  if (!league || !VALID_LEAGUES.includes(league)) {
    return NextResponse.json(
      {
        error: `Invalid league. Must be one of: ${VALID_LEAGUES.join(", ")}`,
      },
      { status: 400 }
    );
  }

  // ── 3. Calculate date (YYYYMMDD) ─────────────────────────────────────
  // Default: yesterday. Override with ?date=YYYYMMDD for testing.
  const dateOverride = request.nextUrl.searchParams.get("date");
  let dateStr: string;
  if (dateOverride && /^\d{8}$/.test(dateOverride)) {
    dateStr = dateOverride;
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    dateStr = yesterday.toISOString().slice(0, 10).replace(/-/g, "");
  }

  console.log(`[cron/fetch-game-scores] Starting ${league} for ${dateStr}`);

  try {
    // ── 4. Fetch scoreboard from ESPN ──────────────────────────────────
    const games = await fetchScoreboard(league, dateStr);

    if (games.length === 0) {
      console.log(`[cron/fetch-game-scores] No ${league} games on ${dateStr}`);
      return NextResponse.json({
        ok: true,
        league,
        date: dateStr,
        message: "No games found",
        gamesCount: 0,
      });
    }

    console.log(
      `[cron/fetch-game-scores] Found ${games.length} ${league} games`
    );

    // ── 5. Load NLT entries + team mappings for player matching ────────
    const [nltEntries, teamMappings] = await Promise.all([
      getActiveNLTEntries(),
      getTeamMappings(),
    ]);

    console.log(
      `[cron/fetch-game-scores] Loaded ${nltEntries.length} NLT entries, ` +
        `${teamMappings.length} team mappings`
    );

    // ── 6. Flag games with Philly connections ─────────────────────────
    // Build a set of ESPN team IDs that have at least one Philly player/coach
    const leagueMappings = teamMappings.filter((m) => m.league === league);
    const espnTeamIds = new Set(leagueMappings.map((m) => m.espn_team_id));

    // Also build a set of org names that have NLT entries
    const nltOrgNames = new Set(
      nltEntries
        .map((e) => e.current_org?.toLowerCase())
        .filter(Boolean) as string[]
    );

    // A game has a Philly connection if any team in the game has NLT players
    for (const game of games) {
      const homeMapping = leagueMappings.find((m) => m.espn_team_id === game.homeTeam.id);
      const awayMapping = leagueMappings.find((m) => m.espn_team_id === game.awayTeam.id);

      const homeHasPhilly = homeMapping && nltOrgNames.has(homeMapping.psp_org_name.toLowerCase());
      const awayHasPhilly = awayMapping && nltOrgNames.has(awayMapping.psp_org_name.toLowerCase());

      if (homeHasPhilly || awayHasPhilly) {
        game.hasPhillyConnection = true;
      }
    }

    // ── 7. Cache the scoreboard (with Philly flags set) ───────────────
    await cacheScoreboard(games);

    // ── 8. Process games with a Philly connection ──────────────────────
    const phillyGames = games.filter((g) => g.hasPhillyConnection);
    let matchedPlayers = 0;
    let processedGames = 0;
    const errors: Array<{ gameId: string; error: string }> = [];

    for (const game of phillyGames) {
      try {
        // Fetch full box score from ESPN
        const boxScore = await fetchBoxScore(league, game.id);
        if (!boxScore) {
          console.warn(
            `[cron/fetch-game-scores] No box score for game ${game.id}`
          );
          continue;
        }

        // Cache the box score
        await cacheBoxScore(boxScore);

        // Match Philly players in this game
        const matches = await matchPhillyPlayers(boxScore, nltEntries);

        if (matches.length > 0) {
          // Look up the game_scores_cache DB id for FK reference
          const dbId = await getGameCacheId(game.id);
          if (dbId) {
            await cachePerformances(dbId, matches);
            matchedPlayers += matches.length;
          } else {
            console.warn(
              `[cron/fetch-game-scores] Could not resolve DB id for ` +
                `ESPN event ${game.id} — ${matches.length} matches lost`
            );
          }
        }

        processedGames++;
      } catch (gameError) {
        const message =
          gameError instanceof Error ? gameError.message : String(gameError);
        console.error(
          `[cron/fetch-game-scores] Error processing game ${game.id}:`,
          message
        );
        errors.push({ gameId: game.id, error: message });
      }
    }

    // ── 9. Revalidate the /our-guys page so it picks up new data ──────
    revalidatePath("/our-guys");

    console.log(
      `[fetch-game-scores] ${league}: ${games.length} games, ${phillyGames.length} with Philly connections, ${matchedPlayers} players matched`
    );

    return NextResponse.json({
      ok: true,
      league,
      date: dateStr,
      gamesCount: games.length,
      phillyGamesCount: phillyGames.length,
      processedGames,
      matchedPlayers,
      ...(errors.length > 0 && { errors }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      `[cron/fetch-game-scores] Fatal error for ${league} ${dateStr}:`,
      message
    );
    return NextResponse.json(
      { error: "Internal error", league, date: dateStr, detail: message },
      { status: 500 }
    );
  }
}
