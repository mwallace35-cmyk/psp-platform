import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import PlayerReactions from '@/components/players/PlayerReactions';
import CompareButton from '@/components/players/CompareButton';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPlayerData(slug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: player, error } = await supabase
    .from('players')
    .select('id, name, slug, first_name, last_name, graduation_year, positions, primary_school_id')
    .eq('slug', slug)
    .is('deleted_at', null)
    .single();

  if (error || !player) return null;

  const [
    { data: school },
    { data: footballSeasons },
    { data: basketballSeasons },
    { data: proTracking },
    { data: mentions },
  ] = await Promise.all([
    supabase.from('schools').select('id, name, slug').eq('id', player.primary_school_id).single(),
    supabase
      .from('football_player_seasons')
      .select('player_id, season_id, rush_yards, rush_td, pass_yards, pass_td, rec_yards, rec_td, seasons(year_start, label)')
      .eq('player_id', player.id)
      .order('season_id', { ascending: false }),
    supabase
      .from('basketball_player_seasons')
      .select('player_id, season_id, points, ppg, rebounds, assists, games_played, seasons(year_start, label)')
      .eq('player_id', player.id)
      .order('season_id', { ascending: false }),
    supabase.from('next_level_tracking').select('*').eq('player_id', player.id).maybeSingle(),
    supabase
      .from('article_mentions')
      .select('article_id, articles(id, title, slug, published_at)')
      .eq('entity_type', 'player')
      .eq('entity_id', player.id)
      .limit(5),
  ]);

  return {
    player,
    school: school ?? null,
    footballSeasons: footballSeasons ?? [],
    basketballSeasons: basketballSeasons ?? [],
    proTracking: proTracking ?? null,
    articles: (mentions ?? []).map((m: any) => m.articles).filter(Boolean),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPlayerData(slug);
  if (!data) return { title: 'Player Not Found | PhillySportsPack' };
  const { player, school } = data;
  return {
    title: `${player.name} | ${school?.name ?? 'PhillySportsPack'}`,
    description: `${player.name} â ${school?.name ?? 'Philadelphia'} athlete profile. Stats, career history, and highlights. Class of ${player.graduation_year ?? 'N/A'}.`,
    openGraph: {
      title: `${player.name} | PhillySportsPack`,
      description: `${player.name} â ${school?.name ?? 'Philadelphia'}, Class of ${player.graduation_year ?? 'N/A'}`,
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
  };
}

export default async function PlayerPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPlayerData(slug);
  if (!data) notFound();

  const { player, school, footballSeasons, basketballSeasons, proTracking, articles } = data;

  const positions = Array.isArray(player.positions)
    ? player.positions
    : player.positions
    ? [player.positions]
    : [];

  const primarySport =
    footballSeasons.length > 0 ? 'football' : basketballSeasons.length > 0 ? 'basketball' : null;

  const fbTotals = footballSeasons.reduce(
    (acc: any, s: any) => ({
      rush_yards: (acc.rush_yards ?? 0) + (s.rush_yards ?? 0),
      rush_td: (acc.rush_td ?? 0) + (s.rush_td ?? 0),
      pass_yards: (acc.pass_yards ?? 0) + (s.pass_yards ?? 0),
      pass_td: (acc.pass_td ?? 0) + (s.pass_td ?? 0),
      rec_yards: (acc.rec_yards ?? 0) + (s.rec_yards ?? 0),
      rec_td: (acc.rec_td ?? 0) + (s.rec_td ?? 0),
    }),
    {}
  );

  const bkTotals = basketballSeasons.reduce(
    (acc: any, s: any) => ({
      points: (acc.points ?? 0) + (s.points ?? 0),
      rebounds: (acc.rebounds ?? 0) + (s.rebounds ?? 0),
      assists: (acc.assists ?? 0) + (s.assists ?? 0),
    }),
    {}
  );

  const navy = 'var(--psp-navy, #1a2744)';
  const gold = 'var(--psp-gold, #c8a84b)';
  const muted = 'var(--psp-muted, #6b7280)';
  const card = 'var(--psp-card-bg, #f8f9fc)';
  const bebas = 'var(--font-bebas, "Bebas Neue", sans-serif)';

  const statBox = (value: number | string, label: string) => (
    <div style={{ textAlign: 'center', background: '#fff', borderRadius: '8px', padding: '0.75rem 0.5rem' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: navy, fontFamily: bebas, letterSpacing: '0.03em' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div style={{ fontSize: '0.68rem', color: muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '0.1rem' }}>
        {label}
      </div>
    </div>
  );

  return (
    <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
      <nav style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: muted }}>
        <Link href="/" style={{ color: muted, textDecoration: 'none' }}>Home</Link>
        {' / '}
        <Link href="/players" style={{ color: muted, textDecoration: 'none' }}>Players</Link>
        {school && (
          <>
            {' / '}
            <Link href={`/schools/${school.slug}`} style={{ color: muted, textDecoration: 'none' }}>
              {school.name}
            </Link>
          </>
        )}
        {' / '}
        <span style={{ color: navy, fontWeight: 600 }}>{player.name}</span>
      </nav>

      <div style={{ background: navy, borderRadius: '12px', padding: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: bebas, fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#fff', letterSpacing: '0.05em', margin: 0, lineHeight: 1 }}>
              {player.name}
            </h1>
            {school && (
              <Link href={`/schools/${school.slug}`} style={{ color: gold, fontSize: '1.1rem', fontWeight: 600, textDecoration: 'none' }}>
                {school.name}
              </Link>
            )}
          </div>
          {proTracking && (
            <div style={{ background: gold, borderRadius: '8px', padding: '0.625rem 1rem', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: navy, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Next Level</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: navy, lineHeight: 1.2 }}>{proTracking.current_org ?? proTracking.college ?? 'Pro Athlete'}</div>
              {proTracking.current_level && <div style={{ fontSize: '0.75rem', color: navy, opacity: 0.8 }}>{proTracking.current_level}</div>}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          {positions.length > 0 && (
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem' }}>
              {positions.join(' / ')}
            </span>
          )}
          {player.graduation_year && (
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem' }}>
              Class of {player.graduation_year}
            </span>
          )}
          {primarySport && (
            <span style={{ background: 'rgba(200,168,75,0.3)', color: gold, padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', textTransform: 'capitalize' }}>
              {primarySport}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', margin: '1.25rem 0 0', flexWrap: 'wrap' as const }}>
        <CompareButton playerSlug={slug} playerName={player.name} />
      </div>
      <PlayerReactions playerSlug={slug} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {footballSeasons.length > 0 && (
          <div style={{ background: card, borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontFamily: bebas, fontSize: '1.5rem', color: navy, margin: '0 0 1rem', letterSpacing: '0.05em' }}>ð FOOTBALL CAREER</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem', marginBottom: '1.25rem' }}>
              {(fbTotals.rush_yards ?? 0) > 0 && statBox(fbTotals.rush_yards, 'Rush Yds')}
              {(fbTotals.rush_td ?? 0) > 0 && statBox(fbTotals.rush_td, 'Rush TDs')}
              {(fbTotals.pass_yards ?? 0) > 0 && statBox(fbTotals.pass_yards, 'Pass Yds')}
              {(fbTotals.pass_td ?? 0) > 0 && statBox(fbTotals.pass_td, 'Pass TDs')}
              {(fbTotals.rec_yards ?? 0) > 0 && statBox(fbTotals.rec_yards, 'Rec Yds')}
              {(fbTotals.rec_td ?? 0) > 0 && statBox(fbTotals.rec_td, 'Rec TDs')}
            </div>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.625rem' }}>By Season</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {footballSeasons.map((s: any) => (
                <div key={s.season_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#fff', borderRadius: '6px', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 600, color: navy }}>{(s.seasons as any)?.year ?? s.season_id}</span>
                  <span style={{ color: muted }}>{[s.rush_yards ? `${s.rush_yards} rush` : '', s.pass_yards ? `${s.pass_yards} pass` : '', s.rec_yards ? `${s.rec_yards} rec` : ''].filter(Boolean).join(' Â· ') || 'â'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {basketballSeasons.length > 0 && (
          <div style={{ background: card, borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontFamily: bebas, fontSize: '1.5rem', color: navy, margin: '0 0 1rem', letterSpacing: '0.05em' }}>ð BASKETBALL CAREER</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem', marginBottom: '1.25rem' }}>
              {(bkTotals.points ?? 0) > 0 && statBox(bkTotals.points, 'Points')}
              {(bkTotals.rebounds ?? 0) > 0 && statBox(bkTotals.rebounds, 'Rebounds')}
              {(bkTotals.assists ?? 0) > 0 && statBox(bkTotals.assists, 'Assists')}
            </div>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.625rem' }}>By Season</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {basketballSeasons.map((s: any) => (
                <div key={s.season_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#fff', borderRadius: '6px', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 600, color: navy }}>{(s.seasons as any)?.year ?? s.season_id}</span>
                  <span style={{ color: muted }}>{[s.ppg ? `${s.ppg} PPG` : '', ].filter(Boolean).join(' Â· ') || 'â'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {proTracking && (
          <div style={{ background: card, borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontFamily: bebas, fontSize: '1.5rem', color: navy, margin: '0 0 1rem', letterSpacing: '0.05em' }}>â­ CAREER TRAJECTORY</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {proTracking.college && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', background: '#fff', borderRadius: '8px' }}>
                  <span style={{ fontSize: '1.4rem' }}>ð</span>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>College</div>
                    <div style={{ fontWeight: 700, color: navy }}>{proTracking.college}</div>
                    {proTracking.college_sport && <div style={{ fontSize: '0.8rem', color: muted }}>{proTracking.college_sport}</div>}
                  </div>
                </div>
              )}
              {proTracking.pro_team && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', background: '#fff', borderRadius: '8px' }}>
                  <span style={{ fontSize: '1.4rem' }}>ð</span>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{proTracking.pro_league ?? 'Pro'}</div>
                    <div style={{ fontWeight: 700, color: navy }}>{proTracking.pro_team}</div>
                    {proTracking.draft_info && <div style={{ fontSize: '0.8rem', color: muted }}>{proTracking.draft_info}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {articles.length > 0 && (
          <div style={{ background: card, borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontFamily: bebas, fontSize: '1.5rem', color: navy, margin: '0 0 1rem', letterSpacing: '0.05em' }}>ð° IN THE NEWS</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {articles.map((article: any) => (
                <Link key={article.id} href={`/news/${article.slug}`} style={{ display: 'block', padding: '0.75rem', background: '#fff', borderRadius: '8px', textDecoration: 'none', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: navy }}>{article.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {footballSeasons.length === 0 && basketballSeasons.length === 0 && !proTracking && (
          <div style={{ gridColumn: '1 / -1', background: card, borderRadius: '12px', padding: '3rem', border: '1px solid #e5e7eb', textAlign: 'center' }}>
            <p style={{ color: muted, margin: 0 }}>Season statistics are being compiled for this athlete.</p>
          </div>
        )}
      </div>

      {school && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href={`/schools/${school.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: navy, fontWeight: 600, textDecoration: 'none', padding: '0.75rem 1.5rem', border: `2px solid ${navy}`, borderRadius: '8px', fontSize: '0.95rem' }}>
            â All {school.name} Athletes
          </Link>
        </div>
      )}
    </main>
  );
}
