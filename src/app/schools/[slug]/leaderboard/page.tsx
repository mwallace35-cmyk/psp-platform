import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 3600;
export const dynamic = "force-dynamic";
interface PageProps { params: Promise<{ slug: string }> }

interface LeaderRow { slug: string; name: string; gradYear: number | null; value: number; }

async function getSchoolData(slug: string) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const { data: school } = await supabase
    .from('schools')
    .select('id, name, city, state')
    .eq('slug', slug)
    .single();

  if (!school) return null;

  // Cast to any for dynamic queries
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  type PlayerRow = { slug: string; name: string; graduation_year: number | null };
  type FbRow = { players: PlayerRow | null } & Record<string, number>;
  type BkRow = { players: PlayerRow | null } & Record<string, number>;

  const fbCats = [
    { key: 'rushers',   col: 'rush_yards', title: 'All-Time Rush Yards', suffix: 'yds' },
    { key: 'passers',   col: 'pass_yards', title: 'All-Time Pass Yards',  suffix: 'yds' },
    { key: 'receivers', col: 'rec_yards',  title: 'All-Time Rec Yards',   suffix: 'yds' },
    { key: 'fbTDs',     col: 'rush_tds',   title: 'All-Time Rush TDs',    suffix: 'TD'  },
  ];
  const bkCats = [
    { key: 'scorers',    col: 'points',   title: 'All-Time Points',   suffix: 'pts' },
    { key: 'rebounders', col: 'rebounds', title: 'All-Time Rebounds', suffix: 'reb' },
    { key: 'assisters',  col: 'assists',  title: 'All-Time Assists',  suffix: 'ast' },
  ];

  const fbResults: Record<string, LeaderRow[]> = {};
  for (const cat of fbCats) {
    try {
      const { data } = await db
        .from('football_player_seasons')
        .select(`${cat.col}, players!inner(slug, name, graduation_year, primary_school_id)`)
        .eq('players.primary_school_id', school.id)
        .gt(cat.col, 0)
        .order(cat.col, { ascending: false })
        .limit(5);

      // Aggregate across seasons per player
      const map = new Map<string, LeaderRow>();
      ((data ?? []) as FbRow[]).forEach(row => {
        const p = row.players;
        if (!p) return;
        const existing = map.get(p.slug);
        if (existing) { existing.value += row[cat.col] ?? 0; }
        else { map.set(p.slug, { slug: p.slug, name: p.name, gradYear: p.graduation_year, value: row[cat.col] ?? 0 }); }
      });
      fbResults[cat.key] = Array.from(map.values()).sort((a, b) => b.value - a.value).slice(0, 5);
    } catch { fbResults[cat.key] = []; }
  }

  const bkResults: Record<string, LeaderRow[]> = {};
  for (const cat of bkCats) {
    try {
      const { data } = await db
        .from('basketball_player_seasons')
        .select(`${cat.col}, players!inner(slug, name, graduation_year, primary_school_id)`)
        .eq('players.primary_school_id', school.id)
        .gt(cat.col, 0)
        .order(cat.col, { ascending: false })
        .limit(5);

      const map = new Map<string, LeaderRow>();
      ((data ?? []) as BkRow[]).forEach(row => {
        const p = row.players;
        if (!p) return;
        const existing = map.get(p.slug);
        if (existing) { existing.value += row[cat.col] ?? 0; }
        else { map.set(p.slug, { slug: p.slug, name: p.name, gradYear: p.graduation_year, value: row[cat.col] ?? 0 }); }
      });
      bkResults[cat.key] = Array.from(map.values()).sort((a, b) => b.value - a.value).slice(0, 5);
    } catch { bkResults[cat.key] = []; }
  }

  return { school, fbResults, fbCats, bkResults, bkCats };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSchoolData(slug);
  if (!data) return { title: 'School Not Found' };
  return { title: `${data.school.name} All-Time Leaders | PhillySportsPack`, description: `All-time statistical leaders from ${data.school.name} in football and basketball.` };
}

function LeaderList({ title, suffix, rows }: { title: string; suffix: string; rows: LeaderRow[] }) {
  const navy = '#1a2744'; const gold = '#c8a84b'; const muted = '#6b7280';
  return (
    <div style={{ background: 'var(--psp-card-bg, #fff)', border: '1px solid var(--psp-gray-200, #e5e7eb)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ background: navy, padding: '0.65rem 1rem' }}>
        <span className="psp-caption" style={{ color: '#fff' }}>{title}</span>
      </div>
      {rows.length === 0 ? (
        <div style={{ padding: '1rem', color: muted, fontSize: '0.82rem' }}>No data yet.</div>
      ) : rows.map((r, i) => (
        <Link key={r.slug || i} href={`/players/${r.slug}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderBottom: '1px solid var(--psp-gray-100, #f3f4f6)', textDecoration: 'none', background: i === 0 ? '#fffbf0' : 'var(--psp-card-bg, #fff)' }}>
          <span className="psp-h4" style={{ color: i === 0 ? gold : 'var(--psp-gray-light, #9ca3af)', width: 20, textAlign: 'center', flexShrink: 0 }}>{i + 1}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: navy, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{r.name}</div>
            {r.gradYear && <div style={{ fontSize: '0.72rem', color: muted }}>Class of {r.gradYear}</div>}
          </div>
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: i === 0 ? gold : navy, flexShrink: 0 }}>{r.value.toLocaleString()} <span style={{ fontWeight: 400, fontSize: '0.72rem', color: muted }}>{suffix}</span></span>
        </Link>
      ))}
    </div>
  );
}

export default async function SchoolLeaderboardPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getSchoolData(slug);
  if (!data) notFound();

  const navy = '#1a2744'; const gold = '#c8a84b'; const muted = '#6b7280';
  const { school, fbResults, fbCats, bkResults, bkCats } = data;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      <div style={{ marginBottom: '1.5rem', fontSize: '0.82rem', color: muted }}>
        <Link href={`/schools/${slug}`} style={{ color: gold, textDecoration: 'none', fontWeight: 600 }}>{school.name}</Link>
        <span style={{ margin: '0 0.5rem' }}>{String.fromCharCode(8250)}</span>
        <span>All-Time Leaders</span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h1 className="psp-h1" style={{ color: navy }}>{school.name}</h1>
        <p style={{ color: muted, fontSize: '0.88rem', margin: '0.25rem 0 0' }}>All-Time Statistical Leaders</p>
      </div>

      <h2 className="psp-h2" style={{ color: navy, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ background: navy, color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '2px 7px', borderRadius: 3, letterSpacing: 2 }}>FOOTBALL</span>
        Leaders
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {fbCats.map(cat => <LeaderList key={cat.key} title={cat.title} suffix={cat.suffix} rows={fbResults[cat.key] ?? []} />)}
      </div>

      <h2 className="psp-h2" style={{ color: navy, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ background: '#f97316', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '2px 7px', borderRadius: 3, letterSpacing: 2 }}>BASKETBALL</span>
        Leaders
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1rem' }}>
        {bkCats.map(cat => <LeaderList key={cat.key} title={cat.title} suffix={cat.suffix} rows={bkResults[cat.key] ?? []} />)}
      </div>
    </div>
  );
}
