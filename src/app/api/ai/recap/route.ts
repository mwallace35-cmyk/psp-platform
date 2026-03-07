import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { generateGameRecap } from '@/lib/anthropic';
import { rateLimit } from '@/lib/rate-limit';
import { validateCsrfToken, CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from '@/lib/csrf';
import { aiRecapSchema } from '@/lib/validation';
import { captureError } from '@/lib/error-tracking';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  // Get request ID from middleware for error correlation
  const requestId = request.headers.get("x-request-id") || randomUUID();

  // CSRF validation
  const csrfToken = request.headers.get(CSRF_HEADER_NAME);
  const csrfCookie = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  if (!csrfToken || !csrfCookie || !validateCsrfToken(csrfToken, csrfCookie)) {
    const response = apiError("Invalid CSRF token", 403, "CSRF_VALIDATION_FAILED");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent");
  const acceptLanguage = request.headers.get("accept-language");

  const { success } = await rateLimit(
    ip,
    5,
    60000,
    "/api/ai/recap",
    userAgent,
    acceptLanguage
  );

  if (!success) {
    const response = apiError("Too many requests", 429, "RATE_LIMIT_EXCEEDED");
    response.headers.set("Retry-After", "60");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  // Check auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const response = apiError('Unauthorized', 401, "UNAUTHORIZED");
    response.headers.set("x-request-id", requestId);
    return response;
  }

  try {
    const body = await request.json();

    // Validate request body with Zod
    const parsed = aiRecapSchema.safeParse(body);
    if (!parsed.success) {
      const response = apiError('Invalid request: gameIds must be an array of numeric IDs', 400, 'INVALID_REQUEST');
      response.headers.set("x-request-id", requestId);
      return response;
    }

    const { gameIds } = parsed.data;

    // Fetch games with team info
    const { data: games, error } = await supabase
      .from('games')
      .select(`
        id, home_score, away_score, game_date,
        home_team:schools!games_home_team_id_fkey(name),
        away_team:schools!games_away_team_id_fkey(name),
        sport:sports!games_sport_id_fkey(name),
        season:seasons!games_season_id_fkey(label)
      `)
      .in('id', gameIds);

    if (error) {
      captureError(error, { gameIds: gameIds.join(','), endpoint: '/api/ai/recap' }, { requestId, userId: user.id, path: '/api/ai/recap', method: 'POST', endpoint: '/api/ai/recap' });
      throw error;
    }
    if (!games || games.length === 0) {
      const response = apiError('No games found', 404, 'NO_GAMES_FOUND');
      response.headers.set("x-request-id", requestId);
      return response;
    }

    const results = [];

    for (const game of games) {
      try {
        const recap = await generateGameRecap({
          homeTeam: (game.home_team as any)?.name || 'Home Team',
          awayTeam: (game.away_team as any)?.name || 'Away Team',
          homeScore: game.home_score || 0,
          awayScore: game.away_score || 0,
          sport: (game.sport as any)?.name || 'Sports',
          date: game.game_date || '',
          season: (game.season as any)?.label || '',
        });

        // Create draft article
        const slug = recap.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        const { data: article, error: insertError } = await supabase
          .from('articles')
          .insert({
            title: recap.title,
            slug: `${slug}-${Date.now()}`,
            body: recap.body,
            content: recap.body,
            excerpt: recap.excerpt,
            author_name: 'PSP AI',
            status: 'draft',
            sport_id: (game.sport as any)?.id,
          })
          .select('id, slug')
          .single();

        if (insertError) {
          captureError(insertError, { gameId: String(game.id), endpoint: '/api/ai/recap' }, { requestId, userId: user.id, path: '/api/ai/recap', method: 'POST', endpoint: '/api/ai/recap' });
          results.push({ gameId: game.id, error: 'Failed to create article draft' });
        } else {
          results.push({ gameId: game.id, article });
        }
      } catch (err: any) {
        captureError(err, { gameId: String(game.id), endpoint: '/api/ai/recap' }, { requestId, userId: user.id, path: '/api/ai/recap', method: 'POST', endpoint: '/api/ai/recap' });
        results.push({ gameId: game.id, error: 'Failed to generate recap' });
      }
    }

    const response = apiSuccess({ results });
    response.headers.set("x-request-id", requestId);
    return response;
  } catch (error: any) {
    captureError(error, { endpoint: '/api/ai/recap' }, { requestId, userId: user?.id, path: '/api/ai/recap', method: 'POST', endpoint: '/api/ai/recap' });
    const response = apiError('Failed to generate recaps', 500, 'RECAP_GENERATION_ERROR');
    response.headers.set("x-request-id", requestId);
    return response;
  }
}
