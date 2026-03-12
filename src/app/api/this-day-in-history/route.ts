import { NextRequest, NextResponse } from 'next/server';
import { createStaticClient } from '@/lib/supabase/static';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const day = searchParams.get('day');

    if (!month || !day) {
      return NextResponse.json(
        { error: 'month and day parameters required' },
        { status: 400 }
      );
    }

    const supabase = createStaticClient();

    // Try to find championships on this date
    const { data: championship } = await supabase
      .from('championships')
      .select(
        `id,
         year,
         league_id,
         school_id,
         sport_id,
         schools!championships_school_id_fkey(name, slug),
         leagues!championships_league_id_fkey(name),
         sports!championships_sport_id_fkey(name, id)`
      )
      .filter(
        'championship_date',
        'ilike',
        `%-${month}-${day}%`
      )
      .limit(1)
      .single();

    if (championship) {
      const schoolsRaw = championship.schools as unknown;
      const schoolName = Array.isArray(schoolsRaw)
        ? (schoolsRaw as Array<{ name: string }>)[0]?.name
        : (schoolsRaw as { name: string } | null)?.name;

      const leaguesRaw = championship.leagues as unknown;
      const leagueName = Array.isArray(leaguesRaw)
        ? (leaguesRaw as Array<{ name: string }>)[0]?.name
        : (leaguesRaw as { name: string } | null)?.name;

      const sportsRaw = championship.sports as unknown;
      const sport = Array.isArray(sportsRaw)
        ? (sportsRaw as Array<{ name: string; id: string }>)[0]
        : (sportsRaw as { name: string; id: string } | null);

      const title = `${schoolName} Wins ${leagueName} ${sport?.name || 'Championship'}`;
      const description = `On this date in ${championship.year}, ${schoolName} captured the ${leagueName} ${sport?.name || 'championship'} title, adding to the school's storied athletic tradition.`;

      return NextResponse.json({
        date: `${month}-${day}`,
        title,
        description,
        sport: sport?.name || 'Sports',
        sportSlug: sport?.id || 'football',
        year: championship.year,
      });
    }

    // If no championship found, try games on this date
    const { data: games } = await supabase
      .from('games')
      .select(
        `id,
         game_date,
         home_score,
         away_score,
         sport_id,
         schools!games_home_team_id_fkey(name, slug),
         away_schools:schools!games_away_team_id_fkey(name, slug),
         sports!games_sport_id_fkey(name, id)`
      )
      .filter('game_date', 'ilike', `%-${month}-${day}%`)
      .order('game_date', { ascending: false })
      .limit(1);

    if (games && games.length > 0) {
      const game = games[0];
      const homeRaw = game.schools as unknown;
      const homeName = Array.isArray(homeRaw)
        ? (homeRaw as Array<{ name: string }>)[0]?.name
        : (homeRaw as { name: string } | null)?.name;
      const awayRaw = game.away_schools as unknown;
      const awayName = Array.isArray(awayRaw)
        ? (awayRaw as Array<{ name: string }>)[0]?.name
        : (awayRaw as { name: string } | null)?.name;
      const sportRaw = game.sports as unknown;
      const sport = Array.isArray(sportRaw)
        ? (sportRaw as Array<{ name: string; id: string }>)[0]
        : (sportRaw as { name: string; id: string } | null);

      const year = new Date(game.game_date).getFullYear();
      const title = `${homeName} vs ${awayName}`;
      const description = `On this date in ${year}, ${homeName} defeated ${awayName} ${game.home_score}-${game.away_score} in a memorable ${sport?.name || 'game'}. Relive the glory days.`;

      return NextResponse.json({
        date: `${month}-${day}`,
        title,
        description,
        sport: sport?.name || 'Sports',
        sportSlug: sport?.id || 'football',
        year,
      });
    }

    // Fallback to a generic historical message
    return NextResponse.json({
      date: `${month}-${day}`,
      title: 'Philadelphia High School Sports Legacy',
      description:
        'On this day in Philadelphia sports history, countless athletes have stepped onto fields and courts to compete for their schools, their leagues, and their legacies. Explore the database to discover the champions and heroes from your neighborhood.',
      sport: 'Sports',
      sportSlug: 'football',
      year: new Date().getFullYear(),
    });
  } catch (error) {
    console.error('Error fetching historical event:', error);
    return NextResponse.json(
      {
        date: 'error',
        title: 'Philadelphia High School Sports Legacy',
        description:
          'Discover the rich history of Philadelphia high school athletics. Search our comprehensive database for players, schools, and championships dating back nearly a century.',
        sport: 'Sports',
        sportSlug: 'football',
        year: new Date().getFullYear(),
      },
      { status: 200 }
    );
  }
}
