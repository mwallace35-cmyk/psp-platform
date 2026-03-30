import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/data/common";
import {
  assignRecapTiers,
  generateSpotlightNarrative,
  generateReactiveDYK,
  formatStatLine,
  getRecapDate,
  getSpotlightSystemPrompt,
  getDYKSystemPrompt,
  type GamePerformance,
  type SpotlightPlayer,
  type HSCareerStats,
} from "@/lib/recap-engine";

export const runtime = "nodejs";
export const maxDuration = 120;

// ---------------------------------------------------------------------------
// Anthropic client
// ---------------------------------------------------------------------------

const MODEL = "claude-sonnet-4-20250514";

function getAnthropicClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// ---------------------------------------------------------------------------
// AI helper — single narrative call with fallback
// ---------------------------------------------------------------------------

async function generateNarrative(
  anthropic: Anthropic,
  systemPrompt: string,
  userPrompt: string,
  fallback: string
): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    return {
      text: text.trim() || fallback,
      inputTokens: message.usage?.input_tokens ?? 0,
      outputTokens: message.usage?.output_tokens ?? 0,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[generate-recaps] Anthropic API error:", msg);
    return { text: fallback, inputTokens: 0, outputTokens: 0 };
  }
}

// ---------------------------------------------------------------------------
// HS career stats lookup
// ---------------------------------------------------------------------------

async function fetchHSCareerStats(
  supabase: any,
  player: SpotlightPlayer
): Promise<HSCareerStats | null> {
  if (!player.highSchoolId) return null;

  try {
    // Football career stats
    const { data: fbSeasons } = await (supabase as any)
      .from("football_player_seasons")
      .select(
        "rush_yards, pass_yards, rec_yards, total_td, points"
      )
      .eq("school_id", player.highSchoolId)
      .ilike("players.name", player.playerName)
      .limit(10);

    if (fbSeasons && fbSeasons.length > 0) {
      const totals = fbSeasons.reduce(
        (acc: any, s: any) => ({
          rushYards: (acc.rushYards || 0) + (s.rush_yards || 0),
          passingYards: (acc.passingYards || 0) + (s.pass_yards || 0),
          receivingYards: (acc.receivingYards || 0) + (s.rec_yards || 0),
          totalTDs: (acc.totalTDs || 0) + (s.total_td || 0),
          points: (acc.points || 0) + (s.points || 0),
        }),
        {} as HSCareerStats
      );

      // Fetch awards
      const { data: awards } = await (supabase as any)
        .from("awards")
        .select("award_name, year")
        .eq("school_id", player.highSchoolId)
        .ilike("players.name", player.playerName)
        .limit(10);

      if (awards && awards.length > 0) {
        totals.awards = awards.map(
          (a: any) => `${a.award_name} (${a.year})`
        );
      }

      return totals;
    }

    // Basketball career stats
    const { data: bbSeasons } = await (supabase as any)
      .from("basketball_player_seasons")
      .select("points, ppg, rebounds, assists, games_played")
      .eq("school_id", player.highSchoolId)
      .ilike("players.name", player.playerName)
      .limit(10);

    if (bbSeasons && bbSeasons.length > 0) {
      const totalPoints = bbSeasons.reduce(
        (acc: number, s: any) => acc + (s.points || 0),
        0
      );
      const totalGames = bbSeasons.reduce(
        (acc: number, s: any) => acc + (s.games_played || 0),
        0
      );
      return {
        points: totalPoints,
        ppg: totalGames > 0 ? Math.round((totalPoints / totalGames) * 10) / 10 : undefined,
      };
    }

    return null;
  } catch (err) {
    console.error(
      `[generate-recaps] Error fetching HS stats for ${player.playerName}:`,
      err instanceof Error ? err.message : String(err)
    );
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main cron handler
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  // ── 1. Verify CRON_SECRET ──────────────────────────────────────────────
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const recapDate = getRecapDate();
  console.log(`[generate-recaps] Starting recap generation for ${recapDate}`);

  // Token / cost tracking
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let narrativesGenerated = 0;
  let dykGenerated = 0;
  const errors: Array<{ player: string; step: string; error: string }> = [];

  try {
    const supabase = await createClient();
    const anthropic = getAnthropicClient();

    // ── 2. Fetch performances for yesterday ──────────────────────────────
    const { data: rawPerformances, error: perfError } = await (supabase as any)
      .from("nlt_game_performances")
      .select(
        `
        id,
        nlt_id,
        game_id,
        player_name,
        team_name,
        sport,
        stats,
        team_stats,
        recap_tier,
        performance_score,
        high_school,
        high_school_id,
        game_scores_cache!game_id (
          home_team_name,
          away_team_name,
          home_score,
          away_score,
          game_date,
          league
        )
      `
      )
      .gte("created_at", `${recapDate}T00:00:00`)
      .lt("created_at", `${recapDate}T23:59:59`);

    if (perfError) {
      console.error("[generate-recaps] Query error:", perfError.message);
      return NextResponse.json(
        { error: "Failed to fetch performances", detail: perfError.message },
        { status: 500 }
      );
    }

    if (!rawPerformances || rawPerformances.length === 0) {
      console.log(`[generate-recaps] No performances found for ${recapDate}`);
      return NextResponse.json({
        ok: true,
        date: recapDate,
        message: "No performances found",
        performancesCount: 0,
      });
    }

    console.log(
      `[generate-recaps] Found ${rawPerformances.length} performances`
    );

    // ── 3. Map raw rows to GamePerformance type ──────────────────────────
    const performances: GamePerformance[] = rawPerformances.map((r: any) => ({
      id: r.id,
      nltId: r.nlt_id,
      gameId: r.game_id,
      playerName: r.player_name,
      teamName: r.team_name,
      sport: r.sport,
      stats: r.stats || {},
      teamStats: r.team_stats || null,
      recapTier: r.recap_tier || 0,
      performanceScore: r.performance_score || 0,
      highSchool: r.high_school,
      highSchoolId: r.high_school_id,
    }));

    // ── 4. Assign tiers ──────────────────────────────────────────────────
    const tiered = assignRecapTiers(performances);

    console.log(
      `[generate-recaps] Tiers: ${tiered.spotlight.length} spotlight, ` +
        `${tiered.boxScore.length} box score, ${tiered.alsoActive.length} also active`
    );

    // ── 5. Process Tier 1 (Spotlight) players ────────────────────────────
    for (const perf of tiered.spotlight) {
      const raw = rawPerformances.find((r: any) => r.id === perf.id);
      const gameInfo = raw?.game_scores_cache;

      // Derive opponent and scores from home/away structure
      // The player's team name tells us which side they're on
      const isHome =
        perf.teamName.toLowerCase() ===
        (gameInfo?.home_team_name ?? "").toLowerCase();
      const teamScore = isHome
        ? gameInfo?.home_score ?? 0
        : gameInfo?.away_score ?? 0;
      const oppScore = isHome
        ? gameInfo?.away_score ?? 0
        : gameInfo?.home_score ?? 0;
      const opponent = isHome
        ? gameInfo?.away_team_name ?? "Unknown"
        : gameInfo?.home_team_name ?? "Unknown";
      const won = teamScore > oppScore;
      const resultStr = won
        ? `W ${teamScore}-${oppScore}`
        : `L ${teamScore}-${oppScore}`;
      const league = gameInfo?.league ?? perf.sport;

      const spotlightPlayer: SpotlightPlayer = {
        ...perf,
        opponent,
        gameResult: resultStr,
        schoolName: perf.highSchool || "a Philly school",
      };

      // ── 5a. Generate spotlight narrative ────────────────────────────
      const statLine = formatStatLine(perf.stats, perf.sport);
      const fallbackNarrative = `${perf.playerName} out of ${spotlightPlayer.schoolName} put up ${statLine} in ${perf.teamName}'s ${resultStr} ${won ? "over" : "against"} ${spotlightPlayer.opponent}.`;

      const userPrompt = generateSpotlightNarrative(spotlightPlayer);

      const narrativeResult = await generateNarrative(
        anthropic,
        getSpotlightSystemPrompt(),
        userPrompt,
        fallbackNarrative
      );

      totalInputTokens += narrativeResult.inputTokens;
      totalOutputTokens += narrativeResult.outputTokens;

      // ── 5b. Insert into ai_recaps table ────────────────────────────
      try {
        const { error: insertError } = await (supabase as any)
          .from("ai_recaps")
          .insert({
            performance_id: perf.id,
            game_date: recapDate,
            league,
            recap_type: "spotlight",
            narrative: narrativeResult.text,
            model_used: MODEL,
            prompt_tokens: narrativeResult.inputTokens,
            completion_tokens: narrativeResult.outputTokens,
            cost_cents:
              (narrativeResult.inputTokens * 3) / 1_000_000 * 100 +
              (narrativeResult.outputTokens * 15) / 1_000_000 * 100,
            // Extra context columns
            player_name: perf.playerName,
            team_name: perf.teamName,
            sport: perf.sport,
            stat_line: statLine,
            game_result: resultStr,
            opponent: spotlightPlayer.opponent,
            high_school: spotlightPlayer.schoolName,
            tier: 1,
            is_fallback: narrativeResult.inputTokens === 0,
          });

        if (insertError) {
          console.error(
            `[generate-recaps] ai_recaps insert error for ${perf.playerName}:`,
            insertError.message
          );
          errors.push({
            player: perf.playerName,
            step: "ai_recaps_insert",
            error: insertError.message,
          });
        } else {
          narrativesGenerated++;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push({ player: perf.playerName, step: "ai_recaps_insert", error: msg });
      }

      // ── 5c. Fetch HS career stats ──────────────────────────────────
      const hsStats = await fetchHSCareerStats(supabase, spotlightPlayer);

      // ── 5d. Generate reactive DYK ──────────────────────────────────
      if (hsStats) {
        const dykUserPrompt = generateReactiveDYK(spotlightPlayer, hsStats);

        if (dykUserPrompt) {
          const fallbackDYK = `${perf.playerName} starred at ${spotlightPlayer.schoolName} before making the leap to the next level.`;

          const dykResult = await generateNarrative(
            anthropic,
            getDYKSystemPrompt(),
            dykUserPrompt,
            fallbackDYK
          );

          totalInputTokens += dykResult.inputTokens;
          totalOutputTokens += dykResult.outputTokens;

          // ── 5e. Insert into did_you_know table ────────────────────
          try {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            const { error: dykInsertError } = await (supabase as any)
              .from("did_you_know")
              .insert({
                fact_text: dykResult.text,
                sport: perf.sport,
                school_id: perf.highSchoolId,
                category: "reactive",
                category_type: "reactive",
                approved: true,
                expires_at: expiresAt.toISOString(),
                // Extra context columns
                player_name: perf.playerName,
                high_school: spotlightPlayer.schoolName,
                high_school_id: perf.highSchoolId,
                source_date: recapDate,
                input_tokens: dykResult.inputTokens,
                output_tokens: dykResult.outputTokens,
                model: MODEL,
                is_fallback: dykResult.inputTokens === 0,
              });

            if (dykInsertError) {
              console.error(
                `[generate-recaps] did_you_know insert error for ${perf.playerName}:`,
                dykInsertError.message
              );
              errors.push({
                player: perf.playerName,
                step: "dyk_insert",
                error: dykInsertError.message,
              });
            } else {
              dykGenerated++;
            }
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            errors.push({ player: perf.playerName, step: "dyk_insert", error: msg });
          }
        }
      }
    }

    // ── 6. Update recap_tier for ALL performances ────────────────────────
    const tierUpdates = [
      ...tiered.spotlight.map((p) => ({ id: p.id, tier: 1 })),
      ...tiered.boxScore.map((p) => ({ id: p.id, tier: 2 })),
      ...tiered.alsoActive.map((p) => ({ id: p.id, tier: 3 })),
    ];

    for (const update of tierUpdates) {
      try {
        await (supabase as any)
          .from("nlt_game_performances")
          .update({ recap_tier: update.tier })
          .eq("id", update.id);
      } catch (err) {
        console.error(
          `[generate-recaps] Tier update error for perf ${update.id}:`,
          err instanceof Error ? err.message : String(err)
        );
      }
    }

    // ── 7. Revalidate /our-guys ──────────────────────────────────────────
    revalidatePath("/our-guys");

    // ── 8. Return summary ────────────────────────────────────────────────
    const estimatedCost =
      (totalInputTokens * 3) / 1_000_000 +
      (totalOutputTokens * 15) / 1_000_000;

    const summary = {
      ok: true,
      date: recapDate,
      performancesCount: performances.length,
      tiers: {
        spotlight: tiered.spotlight.length,
        boxScore: tiered.boxScore.length,
        alsoActive: tiered.alsoActive.length,
      },
      narrativesGenerated,
      dykGenerated,
      tokens: {
        input: totalInputTokens,
        output: totalOutputTokens,
        estimatedCostUSD: Math.round(estimatedCost * 10000) / 10000,
      },
      ...(errors.length > 0 && { errors }),
    };

    console.log(
      `[generate-recaps] ${tiered.spotlight.length} spotlight, ${tiered.boxScore.length} box score, ${tiered.alsoActive.length} also active, ${narrativesGenerated} narratives`
    );

    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[generate-recaps] Fatal error for ${recapDate}:`, message);
    return NextResponse.json(
      { error: "Internal error", date: recapDate, detail: message },
      { status: 500 }
    );
  }
}
