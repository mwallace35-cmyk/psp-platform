import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 3600;

interface PageProps { params: Promise<{ year: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  return { title: `${year} Season Leaders | PhillySportsPack`, description: `Top Philadelphia high school football and basketball statistical leaders for the ${year} season.` };
}

interface LeaderRow { slug: string; name: string; school: string; value: number; }

async function getSeasonLeaders(year: string) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  // Get season id for this year
  const { data: season } = await supabase.from('seasons').select('id, year').eq('year', parseInt(year)).single();
  if (!season) return null;

  type PlayerJoin = { slug: string; name: string; schools: { name: string } | Array<{ name: string }> | null };

  const getSchool = (p: PlayerJoin) => {
    const s = p.schools;
    if (!s) return 'Philadelphia';
    return Array.isArray(s) ? (s[0]?.name ?? 'Philadelphia') : (s.name ?? 'Philadelphia');
  };

  // Football leaders
  const fbCats = [
    { key: 'rushers', stat: 'rush_yards', label: 'Rush Yards', col: 'rush_yards' },
    { key: 'passers', stat: 'pass_yards', label: 'Pass Yards', col: 'pass_yards' },
    { key: 'receivers', stat: 'rec_yards', label: 'Rec Yards', col: 'rec_yards' },
    { key: 'fbTDs', stat: 'rush_tds', label: 'Rush TDs', col: 'rush_tds' },
  ];

  const fbResults: Record<string, LeaderRow[]> = {};
  for (const cat of fbCats) {
    try {
      const { data } = await supabase
        .from('football_player_seasons')
        .select(`${cat.col}, players!inner(slug, name, schools!primary_school_id(name))`)
        .eq('season_id', season.id)
        .gt(cat.col, 0)
        .order(cat.col, { ascending: false })
        .limit(5);
      if (data) {
        fbResults[cat.key] = data.map(row => {
          const p = row.players as unknown as PlayerJoin;
          return { slug: p?.slug ?? '', name: p?.name ?? '', school: getSchool(p ?? { slug:'', name:'', schools:null }), value: (row as Record<string, number>)[cat.col] ?? 0 };
        });
      }
    } catch { fbResults[cat.key] = []; }
  }

  // Basketball leaders
  const bkCats = [
    { key: 'scorers', stat: 'points', label: 'Points', col: 'points' },
    { key: 'ppg', stat: 'ppg', label: 'PPG', col: 'ppg' },
    { key: 'rebounders', stat: 'rebounds', label: 'Rebounds', col: 'rebounds' },
    { key: 'assisters', stat: 'assists', label: 'Assists', col: 'assists' },
  ];
  const bkResults: Record<string, LeaderRow[]> = {};
  for (const cat of bkCats) {
    try {
      const { data } = await supabase
        .from('basketball_player_seasons')
        .select(`${cat.col}, players!inner(slug, name, schools!primary_school_id(name))`)
        .eq('season_id', season.id)
        .gt(cat.col, 0)
        .order(cat.col, { ascending: false })
        .limit(5);
      if (data) {
        bkResults[cat.key] = data.map(row => {
          const p = row.players as unknown as PlayerJoin;
          return { slug: p?.slug ?? '', name: p?.name ?? '', school: getSchool(p ?? { slug:'', name:'', schools:null }), value: (row as Record<string, number>)[cat.col] ?? 0 };
        });
      }
    } catch { bkResults[cat.key] = []; }
  }

  return { season, fbResults, bkResults };
}

async function getAvailableYears(): Promise<number[]> {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data } = await supabase.from('seasons').select('year').order('year', { ascending: false }).limit(20);
    return (data ?? []).map(s => s.year as number);
  } catch { return []; }
}

function LeaderList({ title, rows, stat }: { title: string; rows: LeaderRow[]; stat: string }) {
  const navy = '#1a2744'; const gold = '#c8a84b'; const muted = '#6b7280';
  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, overflow:'hidden' }}>
      <div style={{ background:navy, padding:'0.65rem 1rem' }}>
        <span style={{ fontFamily:'var(--font-bebas)', fontSize:'1rem', color:'#fff', letterSpacing:'0.05em' }}>{title}</span>
      </div>
      {rows.length === 0 ? (
        <div style={{ padding:'1rem', color:muted, fontSize:'0.82rem' }}>No data for this season.</div>
      ) : rows.map((r, i) => (
        <Link key={r.slug || i} href={`/players/${r.slug}`} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.6rem 1rem', borderBottom:'1px solid #f3f4f6', textDecoration:'none', background: i===0 ? '#fffbf0' : '#fff' }}
          onMouseEnter={()=>{}} onMouseLeave={()=>{}}>
          <span style={{ fontFamily:'var(--font-bebas)', fontSize:'1.1rem', color: i===0 ? gold : '#9ca3af', width:20, textAlign:'center', flexShrink:0 }}>{i+1}</span>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:700, color:navy, fontSize:'0.88rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{r.name}</div>
            <div style={{ fontSize:'0.72rem', color:muted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{r.school}</div>
          </div>
          <span style={{ fontWeight:800, fontSize:'1rem', color: i===0 ? gold : navy, flexShrink:0 }}>{r.value.toLocaleString()}</span>
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
      <div style={{ maxWidth:640, margin:'4rem auto', padding:'0 1rem', textAlign:'center' }}>
        <h2 style={{ fontFamily:'var(--font-bebas)', fontSize:'2rem', color:navy }}>No data for season {year}</h2>
        <Link href='/stats' style={{ color:gold, fontWeight:700 }}>{String.fromCharCode(8592)} Back to Stats</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'2rem 1rem' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom:'1.5rem', fontSize:'0.82rem', color:muted }}>
        <Link href='/stats' style={{ color:gold, textDecoration:'none', fontWeight:600 }}>Stats</Link>
        <span style={{ margin:'0 0.5rem' }}>{String.fromCharCode(8250)}</span>
        <span>Season Leaders</span>
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2rem', flexWrap:'wrap' as const, gap:'1rem' }}>
        <h1 style={{ fontFamily:'var(--font-bebas)', fontSize:'2.8rem', color:navy, margin:0, letterSpacing:'0.03em' }}>{year} Season Leaders</h1>
        {/* Year picker */}
        <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' as const }}>
          {years.slice(0, 8).map(y => (
            <Link key={y} href={`/stats/season/${y}`} style={{ padding:'0.35rem 0.7rem', borderRadius:6, fontWeight:700, fontSize:'0.82rem', textDecoration:'none', background: String(y)===year ? navy : '#f3f4f6', color: String(y)===year ? '#fff' : '#374151' }}>{y}</Link>
          ))}
        </div>
      </div>

      {/* Football section */}
      <h2 style={{ fontFamily:'var(--font-bebas)', fontSize:'1.8rem', color:navy, letterSpacing:'0.03em', marginBottom:'1rem', display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ background:'#1a2744', color:'#fff', fontSize:'0.65rem', fontWeight:800, padding:'3px 8px', borderRadius:3, letterSpacing:2 }}>FOOTBALL</span>
        Leaders
      </h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))', gap:'1rem', marginBottom:'2.5rem' }}>
        <LeaderList title='Rush Yards' rows={data.fbResults.rushers ?? []} stat='rush_yards' />
        <LeaderList title='Pass Yards' rows={data.fbResults.passers ?? []} stat='pass_yards' />
        <LeaderList title='Rec Yards' rows={data.fbResults.receivers ?? []} stat='rec_yards' />
        <LeaderList title='Rush TDs' rows={data.fbResults.fbTDs ?? []} stat='rush_tds' />
      </div>

      {/* Basketball section */}
      <h2 style={{ fontFamily:'var(--font-bebas)', fontSize:'1.8rem', color:navy, letterSpacing:'0.03em', marginBottom:'1rem', display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ background:'#f97316', color:'#fff', fontSize:'0.65rem', fontWeight:800, padding:'3px 8px', borderRadius:3, letterSpacing:2 }}>BASKETBALL</span>
        Leaders
      </h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))', gap:'1rem' }}>
        <LeaderList title='Points' rows={data.bkResults.scorers ?? []} stat='points' />
        <LeaderList title='PPG' rows={data.bkResults.ppg ?? []} stat='ppg' />
        <LeaderList title='Rebounds' rows={data.bkResults.rebounders ?? []} stat='rebounds' />
        <LeaderList title='Assists' rows={data.bkResults.assisters ?? []} stat='assists' />
      </div>
    </div>
  );
}
