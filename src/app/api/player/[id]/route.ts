import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { playerIdSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { apiSuccess, apiError } from "@/lib/api-response";
import { captureError } from "@/lib/error-tracking";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Get request ID from middleware for error correlation
  const requestId = request.headers.get("x-request-id") || randomUUID();

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent");
  const acceptLanguage = request.headers.get("accept-language");

  const { success, remaining, resetAt } = await rateLimit(
    ip,
    60,
    60000,
    "/api/player",
    userAgent,
    acceptLanguage
  );

  if (!success) {
    const response = apiError("Too many requests", 429, "RATE_LIMIT_EXCEEDED");
    response.headers.set("Retry-After", "60");
    response.headers.set("X-RateLimit-Remaining", "0");
    response.headers.set("x-request-id", requestId);
    if (resetAt) {
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
    }
    return response;
  }

  const { id } = await params;

  // Validate player ID with zod
  const parsed = playerIdSchema.safeParse({ id });
  if (!parsed.success) {
    const response = apiError("Invalid player ID", 400, "INVALID_PLAYER_ID");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  const playerId = parsed.data.id;

  try {
    const supabase = await createClient();

    // Get player info
    const { data: player } = await supabase
      .from("players")
      .select("id, name, slug, positions, graduation_year, college, pro_team, schools:schools!players_primary_school_id_fkey(name, slug)")
      .eq("id", playerId)
      .single();

    if (!player) {
      return apiError("Player not found", 404, "PLAYER_NOT_FOUND");
    }

    // Try each sport table to find stats
    const stats: Record<string, number | string> = {};
    let sport = "football";

    // Football
    const { data: fbStats } = await supabase
      .from("football_player_seasons")
      .select("rush_yards, rush_td, pass_yards, pass_td, rec_yards, rec_td, total_td, total_yards")
      .eq("player_id", playerId);

    if (fbStats && fbStats.length > 0) {
      sport = "football";
      stats.seasons = fbStats.length;
      stats.rush_yards = fbStats.reduce((sum, s) => sum + (s.rush_yards || 0), 0);
      stats.rush_td = fbStats.reduce((sum, s) => sum + (s.rush_td || 0), 0);
      stats.pass_yards = fbStats.reduce((sum, s) => sum + (s.pass_yards || 0), 0);
      stats.pass_td = fbStats.reduce((sum, s) => sum + (s.pass_td || 0), 0);
      stats.rec_yards = fbStats.reduce((sum, s) => sum + (s.rec_yards || 0), 0);
      stats.rec_td = fbStats.reduce((sum, s) => sum + (s.rec_td || 0), 0);
      stats.total_td = fbStats.reduce((sum, s) => sum + (s.total_td || 0), 0);
      stats.total_yards = fbStats.reduce((sum, s) => sum + (s.total_yards || 0), 0);
    } else {
      // Basketball
      const { data: bbStats } = await supabase
        .from("basketball_player_seasons")
        .select("games_played, points, ppg, rebounds, assists, steals, blocks")
        .eq("player_id", playerId);

      if (bbStats && bbStats.length > 0) {
        sport = "basketball";
        stats.seasons = bbStats.length;
        stats.games = bbStats.reduce((sum, s) => sum + (s.games_played || 0), 0);
        stats.points = bbStats.reduce((sum, s) => sum + (s.points || 0), 0);
        stats.ppg = stats.games > 0 ? Math.round(((stats.points as number) / (stats.games as number)) * 10) / 10 : 0;
        stats.rebounds = bbStats.reduce((sum, s) => sum + (s.rebounds || 0), 0);
        stats.assists = bbStats.reduce((sum, s) => sum + (s.assists || 0), 0);
        stats.steals = bbStats.reduce((sum, s) => sum + (s.steals || 0), 0);
        stats.blocks = bbStats.reduce((sum, s) => sum + (s.blocks || 0), 0);
      } else {
        // Baseball
        const { data: baseStats } = await supabase
          .from("baseball_player_seasons")
          .select("*")
          .eq("player_id", playerId);

        if (baseStats && baseStats.length > 0) {
          sport = "baseball";
          stats.seasons = baseStats.length;
        }
      }
    }

    const response = apiSuccess({ player, stats, sport });
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    response.headers.set("x-request-id", requestId);
    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    if (resetAt) {
      response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
    }
    return response;
  } catch (error) {
    captureError(error, { playerId: String(playerId), endpoint: '/api/player' }, { requestId, path: '/api/player/[id]', method: 'GET', endpoint: '/api/player' });
    const response = apiError("Failed to fetch player", 500, "PLAYER_FETCH_ERROR");
    response.headers.set("x-request-id", requestId);
    return response;
  }
}
