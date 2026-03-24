import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

interface TrendingEntry {
  playerSlug: string;
  playerName: string;
  school: string;
  sport: 'Football' | 'Basketball';
  statLabel: string;
  statValue: string;
}

async function getTrendingPlayers(): Promise<TrendingEntry[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const entries: TrendingEntry[] = [];

  // Football: top rushers
  try {
    const { data: fb } = await supabase
      .from('football_player_seasons')
      .select('rush_yards, players!inner(slug, name, schools!primary_school_id(name))')
      .order('rush_yards', { ascending: false })
      .gt('rush_yards', 0)
      .limit(3);

    if (fb) {
      for (const row of fb) {
        const pRaw = row.players as unknown as {
          slug: string;
          name: string;
          schools: { name: string } | Array<{ name: string }> | null;
        } | null;
        if (!pRaw) continue;
        const schoolRaw = pRaw.schools;
        const school = Array.isArray(schoolRaw)
          ? (schoolRaw[0]?.name ?? 'Philadelphia')
          : (schoolRaw?.name ?? 'Philadelphia');
        entries.push({
          playerSlug: pRaw.slug,
          playerName: pRaw.name,
          school,
          sport: 'Football',
          statLabel: 'Rush Yds',
          statValue: ((row.rush_yards as number) ?? 0).toLocaleString(),
        });
      }
    }
  } catch {
    // silently fail
  }

  // Basketball: top scorers by ppg
  try {
    const { data: bk } = await supabase
      .from('basketball_player_seasons')
      .select('ppg, players!inner(slug, name, schools!primary_school_id(name))')
      .order('ppg', { ascending: false })
      .gt('ppg', 0)
      .limit(3);

    if (bk) {
      for (const row of bk) {
        const pRaw = row.players as unknown as {
          slug: string;
          name: string;
          schools: { name: string } | Array<{ name: string }> | null;
        } | null;
        if (!pRaw) continue;
        const schoolRaw = pRaw.schools;
        const school = Array.isArray(schoolRaw)
          ? (schoolRaw[0]?.name ?? 'Philadelphia')
          : (schoolRaw?.name ?? 'Philadelphia');
        entries.push({
          playerSlug: pRaw.slug,
          playerName: pRaw.name,
          school,
          sport: 'Basketball',
          statLabel: 'PPG',
          statValue: String((row.ppg as number) ?? 0),
        });
      }
    }
  } catch {
    // silently fail
  }

  return entries;
}

const SPORT_COLORS: Record<string, string> = {
  Football: '#1a2744',
  Basketball: '#f97316',
};

export default async function TrendingPlayersWidget() {
  const players = await getTrendingPlayers();
  if (players.length === 0) return null;

  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '1.25rem',
        }}
      >
        <h2
          className="psp-h1"
          style={{
            color: 'var(--psp-navy, #1a2744)',
            letterSpacing: '0.03em',
            margin: 0,
          }}
        >
          Trending Players
        </h2>
        <Link
          href="/leaderboards/trending"
          style={{
            color: 'var(--psp-gold, #c8a84b)',
            fontSize: '0.85rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Full Leaderboard →
        </Link>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: '0.875rem',
        }}
      >
        {players.map((p) => (
          <Link
            key={p.playerSlug}
            href={`/players/${p.playerSlug}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div
              style={{
                background: 'var(--psp-card-bg, #fff)',
                border: '1px solid var(--psp-gray-200, #e5e7eb)',
                borderRadius: '10px',
                padding: '1rem 1.1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                height: '100%',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: SPORT_COLORS[p.sport] ?? '#1a2744',
                  color: '#fff',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: 3,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase' as const,
                  alignSelf: 'flex-start',
                }}
              >
                {p.sport}
              </span>
              <span
                style={{
                  fontWeight: 700,
                  color: 'var(--psp-navy, #1a2744)',
                  fontSize: '0.95rem',
                  lineHeight: 1.2,
                }}
              >
                {p.playerName}
              </span>
              <span style={{ color: 'var(--psp-muted, #6b7280)', fontSize: '0.78rem' }}>
                {p.school}
              </span>
              <div
                style={{
                  borderTop: '1px solid var(--psp-gray-100, #f3f4f6)',
                  paddingTop: '0.5rem',
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.35rem',
                }}
              >
                <span
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: 'var(--psp-gold, #c8a84b)',
                  }}
                >
                  {p.statValue}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--psp-muted, #6b7280)' }}>
                  {p.statLabel}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
