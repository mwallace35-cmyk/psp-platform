import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateGameRecap } from '@/lib/anthropic';

export async function POST(request: NextRequest) {
  // Check auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { gameIds } = await request.json();

    if (!gameIds || !Array.isArray(gameIds) || gameIds.length === 0) {
      return NextResponse.json({ error: 'gameIds array is required' }, { status: 400 });
    }

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

    if (error) throw error;
    if (!games || games.length === 0) {
      return NextResponse.json({ error: 'No games found' }, { status: 404 });
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
          results.push({ gameId: game.id, error: insertError.message });
        } else {
          results.push({ gameId: game.id, article });
        }
      } catch (err: any) {
        results.push({ gameId: game.id, error: err.message });
      }
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('AI recap error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate recaps' },
      { status: 500 }
    );
  }
}
