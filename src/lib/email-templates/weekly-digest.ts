import { createClient } from '@/lib/supabase/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://phillysportspack.com';

interface GameRecord {
  id: string;
  school_name: string;
  opponent_name: string;
  final_score_home: number | null;
  final_score_away: number | null;
  sport_name: string;
  game_date: string;
  result: 'W' | 'L' | 'T' | null;
}

interface PlayerPerformance {
  player_name: string;
  school_name: string;
  sport_name: string;
  achievement: string;
  stat_value: string;
}

interface DigestData {
  gameResults: GameRecord[];
  topPerformances: PlayerPerformance[];
  potwWinner: {
    player_name: string;
    school_name: string;
    sport_name: string;
    vote_count: number;
  } | null;
  recentArticles: Array<{
    title: string;
    slug: string;
    excerpt: string;
    sport_id: string;
  }>;
  trendingPlayers: Array<{
    name: string;
    slug: string;
    school: string;
  }>;
  trendingSchools: Array<{
    name: string;
    slug: string;
    sport_id: string;
  }>;
}

export async function generateWeeklyDigestData(userId: string): Promise<DigestData> {
  const supabase = await createClient();

  // Get user's bookmarked schools
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('bookmarked_schools')
    .eq('id', userId)
    .single();

  const bookmarkedSchools = (profile?.bookmarked_schools as string[]) || [];

  // Fetch game results from the past week
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  let gameResults: GameRecord[] = [];
  if (bookmarkedSchools.length > 0) {
    const { data: games } = await supabase
      .from('games')
      .select(
        `
        id,
        home_school:schools!games_home_school_id_fkey(name),
        away_school:schools!games_away_school_id_fkey(name),
        final_score_home,
        final_score_away,
        sport:sports(name),
        game_date
      `
      )
      .gte('game_date', oneWeekAgo)
      .or(
        `home_school_id.in.(${bookmarkedSchools.join(',')}),away_school_id.in.(${bookmarkedSchools.join(',')})`
      )
      .limit(5);

    gameResults = games?.map((g: any) => ({
      id: g.id,
      school_name: g.home_school?.name || 'Unknown',
      opponent_name: g.away_school?.name || 'Unknown',
      final_score_home: g.final_score_home,
      final_score_away: g.final_score_away,
      sport_name: g.sport?.name || 'Unknown',
      game_date: g.game_date,
      result: g.final_score_home > g.final_score_away ? 'W' : g.final_score_home < g.final_score_away ? 'L' : 'T',
    })) || [];
  }

  // Fetch recent articles
  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, excerpt, sport_id')
    .gte('created_at', oneWeekAgo)
    .order('created_at', { ascending: false })
    .limit(5);

  const recentArticles = articles || [];

  // Fetch POTW winner
  const { data: potwData } = await supabase
    .from('gotw_nominees')
    .select(`
      nominee_name,
      school:schools(name),
      sport:sports(name),
      votes:gotw_votes(count)
    `)
    .gte('created_at', oneWeekAgo)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const potwWinner = potwData
    ? {
        player_name: potwData.nominee_name,
        school_name: (potwData.school as any)?.[0]?.name || 'Unknown',
        sport_name: (potwData.sport as any)?.[0]?.name || 'Unknown',
        vote_count: Array.isArray(potwData.votes) ? potwData.votes.length : 0,
      }
    : null;

  // Fetch trending players (based on profile views)
  const { data: trendingPlayers } = await supabase
    .from('players')
    .select('name, slug, primary_school:schools(name)')
    .order('profile_views', { ascending: false })
    .limit(5);

  // Fetch trending schools
  const { data: trendingSchools } = await supabase
    .from('schools')
    .select('name, slug, sport_id')
    .order('profile_views', { ascending: false })
    .limit(5);

  return {
    gameResults,
    topPerformances: [],
    potwWinner,
    recentArticles: recentArticles as any[],
    trendingPlayers: (trendingPlayers || []).map((p: any) => ({
      name: p.name,
      slug: p.slug,
      school: p.primary_school?.name || 'Unknown',
    })),
    trendingSchools: (trendingSchools || []).map((s: any) => ({
      name: s.name,
      slug: s.slug,
      sport_id: s.sport_id,
    })),
  };
}

export function renderWeeklyDigestHTML(data: DigestData, unsubscribeToken: string): string {
  const gameResultsHtml = data.gameResults
    .map(
      (game) => `
    <div style="margin-bottom: 16px; padding: 12px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #f0a500;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div>
          <p style="font-weight: bold; color: #0a1628; margin: 0;">${game.school_name} vs ${game.opponent_name}</p>
          <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0;">${game.sport_name} • ${new Date(game.game_date).toLocaleDateString()}</p>
        </div>
        <div style="text-align: right;">
          <p style="font-weight: bold; color: #0a1628; font-size: 18px; margin: 0;">${game.final_score_home} - ${game.final_score_away}</p>
          <p style="color: ${game.result === 'W' ? '#22c55e' : game.result === 'L' ? '#ef4444' : '#f59e0b'}; font-weight: bold; margin: 4px 0 0;">${game.result === 'W' ? 'WIN' : game.result === 'L' ? 'LOSS' : 'TIE'}</p>
        </div>
      </div>
    </div>
  `
    )
    .join('');

  const articlesHtml = data.recentArticles
    .map(
      (article) => `
    <div style="margin-bottom: 16px; padding: 12px; background: #f9fafb; border-radius: 8px;">
      <a href="${SITE_URL}/articles/${article.slug}" style="color: #0a1628; font-weight: 600; text-decoration: none; font-size: 16px;">
        ${article.title}
      </a>
      <p style="color: #6b7280; font-size: 14px; margin: 6px 0 0;">${article.excerpt || ''}</p>
    </div>
  `
    )
    .join('');

  const potwHtml = data.potwWinner
    ? `
    <div style="background: #fef3c7; border: 2px solid #f0a500; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
      <div style="font-size: 28px; margin-bottom: 8px;">🏆</div>
      <h3 style="color: #0a1628; margin: 0 0 8px;">Player of the Week</h3>
      <p style="font-size: 18px; font-weight: bold; color: #0a1628; margin: 0;">${data.potwWinner.player_name}</p>
      <p style="color: #4b5563; margin: 4px 0 0;">${data.potwWinner.school_name} — ${data.potwWinner.sport_name}</p>
      <p style="color: #f0a500; font-weight: bold; margin: 8px 0 0;">${data.potwWinner.vote_count} votes</p>
    </div>
  `
    : '';

  const trendingPlayersHtml = data.trendingPlayers
    .slice(0, 3)
    .map(
      (player) => `
    <div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
      <a href="${SITE_URL}/football/players/${player.slug}" style="color: #0a1628; font-weight: 600; text-decoration: none;">
        ${player.name}
      </a>
      <p style="color: #6b7280; font-size: 12px; margin: 2px 0 0;">${player.school}</p>
    </div>
  `
    )
    .join('');

  const unsubscribeUrl = `${SITE_URL}/api/email/unsubscribe?token=${unsubscribeToken}`;

  return `
    <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <!-- Header -->
      <div style="background: #0a1628; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: #f0a500; font-size: 28px; margin: 0; font-family: 'Bebas Neue', Impact, sans-serif; letter-spacing: 2px;">
          PSP WEEKLY ROUNDUP
        </h1>
        <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0;">Your Week in Philly High School Sports</p>
      </div>

      <!-- Content -->
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
        <!-- POTW -->
        ${potwHtml}

        <!-- Your Schools This Week -->
        ${data.gameResults.length > 0 ? `
          <h2 style="color: #0a1628; font-size: 18px; margin: 24px 0 16px;">📅 Your Schools This Week</h2>
          ${gameResultsHtml}
        ` : ''}

        <!-- Top Performances -->
        <h2 style="color: #0a1628; font-size: 18px; margin: 24px 0 16px;">⭐ Top Performances</h2>
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <p style="color: #6b7280; margin: 0;">Check out the hottest performances from this week on the site.</p>
          <a href="${SITE_URL}" style="color: #f0a500; font-weight: bold; text-decoration: none; display: inline-block; margin-top: 12px;">
            View All Highlights →
          </a>
        </div>

        <!-- Articles -->
        ${data.recentArticles.length > 0 ? `
          <h2 style="color: #0a1628; font-size: 18px; margin: 24px 0 16px;">📰 Latest Articles</h2>
          ${articlesHtml}
        ` : ''}

        <!-- Trending -->
        ${data.trendingPlayers.length > 0 ? `
          <h2 style="color: #0a1628; font-size: 18px; margin: 24px 0 16px;">🔥 Trending Players</h2>
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px;">
            ${trendingPlayersHtml}
          </div>
        ` : ''}

        <!-- CTA -->
        <div style="text-align: center; margin-top: 24px;">
          <a href="${SITE_URL}" style="background: #f0a500; color: #0a1628; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Visit PhillySportsPack
          </a>
        </div>

        <!-- Footer -->
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 11px; text-align: center; margin: 0;">
          <a href="${SITE_URL}/settings/notifications" style="color: #9ca3af;">Manage Preferences</a> •
          <a href="${unsubscribeUrl}" style="color: #9ca3af;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `;
}
