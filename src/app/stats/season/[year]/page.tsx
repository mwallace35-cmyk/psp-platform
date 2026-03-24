import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 3600;
export const dynamic = "force-dynamic";
interface PageProps { params: Promise<{ year: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  return { title: `${year} Season Leaders | PhillySportsPack`, description: `Top Philadelphia high school statistical leaders for the ${year} season.`, alternates: { canonical: `https://phillysportspack.com/stats/season/${year}` } };
}

interface LeaderRow { slug: string; name: string; school: string; value: number; }

async function getSeasonLeaders(year: string) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: season } = await supabase.from('seasons').select('id, year_start').eq('year_start', parseInt(year)).single();
  if (!season) return null;

  type PlayerJoin = { slug: string; name: string; schools: { name: string } | Array<{ name: string }> | null };
  const getSchool = (p: PlayerJoin) => {
    const s = p.schools;
    if (!s) return 'Philadelphia';
    return Array.isArray(s) ? (s[0]?.name ?? 'Philadelphia') : (s.name ?? 'Philadelphia');
  };

  const fbCols = [
    { key: 'rushers',   col: 'rush_yards', title: 'Rush Yards' },
    { key: 'passers',   col: 'pass_yards', title: 'Pass Yards' },
    { key: 'receivers', col: 'rec_yards',  title: 'Rec Yards'  },
    { key: 'fbTDs',     col: 'rush_td',   title: 'Rush TDs'   },
  ];
  const bkCols = [
    { key: 'scorers',    col: 'points',   title: 'Points'   },
    { key: 'ppgLeaders', col: 'ppg',      title: 'PPG'      },
    { key: 'rebounders', col: 'rebounds', title: 'Rebounds' },
    { key: 'assisters',  col: 'assists',  title: 'Assists'  },
  ];

  // Cast to any to bypass Supabase TypeScript parser for dynamic column names in template literals
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;
  type DynRow = { players: PlayerJoin | null } & Record<string, number>;

  const fbResults: Record<string, LeaderRow[]> = {};
  for (const cat of fbCols) {
    try {
      const { data } = await db
        .from('football_player_seasons')
        .select(`${cat.col}, players!inner(slug, name, schools!primary_school_id(name))`)
        .eq('season_id', season.id)
        .gt(cat.col, 0)
        .order(cat.col, { ascending: false })
        .limit(5);
      fbResults[cat.key] = ((data ?? []) as DynRow[]).map(row => ({
        slug:   row.players?.slug  ?? '',
        name:   row.players?.name  ?? '',
        school: getSchool(row.players ?? { slug: '', name: '', schools: null }),
        value:  row[cat.col] ?? 0,
      }));
    } catch { fbResults[cat.key] = []; }
  }

  const bkResults: Record<string, LeaderRow[]> = {};
  for (const cat of bkCols) {
    try {
      const { data } = await db
        .from('basketball_player_seasons')
        .select(`${cat.col}, players!inner(slug, name, schools!primary_school_id(name))`)
        .eq('season_id', season.id)
        .gt(cat.col, 0)
        .order(cat.col, { ascending: false })
        .limit(5);
      bkResults[cat.key] = ((data ?? []) as DynRow[]).map(row => ({
        slug:   row.players?.slug  ?? '',
        name:   row.players?.name  ?? '',
        school: getSchool(row.players ?? { slug: '', name: '', schools: null }),
        value:  row[cat.col] ?? 0,
      }));
    } catch { bkResults[cat.key] = []; }
  }

  return { season, fbResults, bkResults, fbCols, bkCols };
}

async function getAvailableYears(): Promise<number[]> {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data } = await supabase.from('seasons').select('year_start').order('year_start', { ascending: false }).limit(20);
    return (data ?? []).map(s => s.year_start as number);
  } catch { return []; }
}

function LeaderList({ title, rows }: { title: string; rows: LeaderRow[] }) {
  const navy = '#1a2744'; const gold = '#c8a84b'; const muted = '#6b7280';
  return (
    <div style={{ background: 'var(--psp-card-bg, #fff)', border: '1px solid var(--psp-gray-200, #e5e7eb)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ background: navy, padding: '0.65rem 1rem' }}>
        <span className="psp-h4" style={{ color: '#fff' }}>{title}</span>
      </div>
      {rows.length === 0 ? (
        <div style={{ padding: '1rem', color: muted, fontSize: '0.82rem' }}>No data for this season.</div>
      ) : rows.map((r, i) => (
        <Link key={r.slug || i} href={`/players/${r.slug}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderBottom: '1px solid var(--psp-gray-100, #f3f4f6)', textDecoration: 'none', background: i === 0 ? '#fffbf0' : 'var(--psp-card-bg, #fff)' }}>
          <span className="psp-h4" style={{ color: i === 0 ? gold : 'var(--psp-gray-light, #9ca3af)', width: 20, textAlign: 'center', flexShrink: 0 }}>{i + 1}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: navy, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{r.name}</div>
            <div style={{ fontSize: '0.75rem', color: muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{r.school}</div>
          </div>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: i === 0 ? gold : navy, flexShrink: 0 }}>{r.value.toLocaleString()}</span>
        </Link>
      ))}
    </div>
  );
}

export default async function SeasonLeadersPage({ params }: PageProps) {
  const { year } = await params;
  const navy = '#1a2744'; const gold = '#c8a84b'; const muted = '#6b7280';
  const [data, years] = await Promise.all([getSeasonLeaders(year), getAvailableYears()]);

  if (!data) {
    return (
      <div style={{ maxWidth: 640, margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
        <h2 className="psp-h1" style={{ color: navy }}>No data for season {year}</h2>
        <Link href="/stats" style={{ color: gold, fontWeight: 700 }}>{String.fromCharCode(8592)} Back to Stats</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '1.5rem', fontSize: '0.82rem', color: muted }}>
        <Link href="/stats" style={{ color: gold, textDecoration: 'none', fontWeight: 600 }}>Stats</Link>
        <span style={{ margin: '0 0.5rem' }}>{String.fromCharCode(8250)}</span>
        <span>Season Leaders</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap' as const, gap: '1rem' }}>
        <h1 className="psp-h1" style={{ color: navy, margin: 0 }}>{year} Season Leaders</h1>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' as const }}>
          {years.slice(0, 8).map(y => (
            <Link key={y} href={`/stats/season/${y}`}
              style={{ padding: '0.35rem 0.85rem', borderRadius: 9999, fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none', background: String(y) === year ? navy : 'transparent', color: String(y) === year ? '#fff' : '#475569', border: String(y) === year ? 'none' : '1.5px solid #e2e8f0', transition: 'all 0.15s' }}>
              {y}
            </Link>
          ))}
        </div>
      </div>

      <h2 className="psp-h2" style={{ color: navy, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ background: '#1a2744', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: 3, letterSpacing: 2 }}>FOOTBALL</span>
        Leaders
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {data.fbCols.map(cat => <LeaderList key={cat.key} title={cat.title} rows={data.fbResults[cat.key] ?? []} />)}
      </div>

      <h2 className="psp-h2" style={{ color: navy, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ background: '#f97316', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: 3, letterSpacing: 2 }}>BASKETBALL</span>
        Leaders
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1rem' }}>
        {data.bkCols.map(cat => <LeaderList key={cat.key} title={cat.title} rows={data.bkResults[cat.key] ?? []} />)}
      </div>
    </div>
  );
}
