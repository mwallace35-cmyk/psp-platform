import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { a, b } = await searchParams;
  if (!a || !b) return { title: 'Compare Players | PhillySportsPack' };
  return {
    title: `${a} vs ${b} | Player Comparison | PhillySportsPack`,
    description: 'Head-to-head career stat comparison for Philadelphia high school athletes.',
  };
}

interface FbSeason { rush_yards: number; rush_carries: number; rush_tds: number; pass_yards: number; pass_tds: number; pass_ints: number; rec_yards: number; rec_catches: number; rec_tds: number; }
interface BkSeason { points: number; ppg: number; rebounds: number; rpg: number; assists: number; apg: number; games_played: number; }
interface SchoolRef { name: string; slug: string; }

interface PlayerRow {
  id: string; slug: string; name: string;
  graduation_year: number | null;
  positions: string[] | null;
  schools: unknown;
  football_player_seasons: unknown;
  basketball_player_seasons: unknown;
  next_level_tracking: unknown;
}

async function getPlayer(slug: string): Promise<PlayerRow | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from('players')
    .select(`id, slug, name, graduation_year, positions, schools!primary_school_id(name, slug), football_player_seasons(rush_yards, rush_carries, rush_tds, pass_yards, pass_tds, pass_ints, rec_yards, rec_catches, rec_tds), basketball_player_seasons(points, ppg, rebounds, rpg, assists, apg, games_played), next_level_tracking(current_level, current_org, pro_team, college)`)
    .eq('slug', slug)
    .single();
  return data as PlayerRow | null;
}

function fbCareer(p: PlayerRow) {
  const seasons = (p.football_player_seasons as unknown as FbSeason[]) ?? [];
  return seasons.reduce((a, s) => ({
    rushYards: a.rushYards + (s.rush_yards ?? 0),
    rushCarries: a.rushCarries + (s.rush_carries ?? 0),
    rushTDs: a.rushTDs + (s.rush_tds ?? 0),
    passYards: a.passYards + (s.pass_yards ?? 0),
    passTDs: a.passTDs + (s.pass_tds ?? 0),
    passInts: a.passInts + (s.pass_ints ?? 0),
    recYards: a.recYards + (s.rec_yards ?? 0),
    recCatches: a.recCatches + (s.rec_catches ?? 0),
    recTDs: a.recTDs + (s.rec_tds ?? 0),
  }), { rushYards:0, rushCarries:0, rushTDs:0, passYards:0, passTDs:0, passInts:0, recYards:0, recCatches:0, recTDs:0 });
}

function bkCareer(p: PlayerRow) {
  const seasons = (p.basketball_player_seasons as unknown as BkSeason[]) ?? [];
  const totals = seasons.reduce((a, s) => ({
    points: a.points + (s.points ?? 0),
    rebounds: a.rebounds + (s.rebounds ?? 0),
    assists: a.assists + (s.assists ?? 0),
    games: a.games + (s.games_played ?? 0),
  }), { points:0, rebounds:0, assists:0, games:0 });
  const bestPpg = seasons.length ? Math.max(...seasons.map(s => s.ppg ?? 0)) : 0;
  const bestRpg = seasons.length ? Math.max(...seasons.map(s => s.rpg ?? 0)) : 0;
  const bestApg = seasons.length ? Math.max(...seasons.map(s => s.apg ?? 0)) : 0;
  return { ...totals, bestPpg, bestRpg, bestApg };
}

function sport(p: PlayerRow): 'football' | 'basketball' | 'none' {
  const fb = (p.football_player_seasons as unknown as FbSeason[]) ?? [];
  const bk = (p.basketball_player_seasons as unknown as BkSeason[]) ?? [];
  if (fb.length > 0) return 'football';
  if (bk.length > 0) return 'basketball';
  return 'none';
}

function schoolName(p: PlayerRow): string {
  const raw = p.schools;
  if (!raw) return 'Philadelphia';
  if (Array.isArray(raw)) return (raw as SchoolRef[])[0]?.name ?? 'Philadelphia';
  return (raw as SchoolRef).name ?? 'Philadelphia';
}

function proLevel(p: PlayerRow): string | null {
  type NL = { current_level: string; current_org: string; pro_team: string | null; college: string | null };
  const raw = (p.next_level_tracking as unknown as NL[]) ?? [];
  const entry = Array.isArray(raw) ? raw[0] : (raw as NL | null);
  if (!entry) return null;
  const org = entry.pro_team ?? entry.college ?? entry.current_org;
  return org ? `${entry.current_level} \u2014 ${org}` : null;
}

interface StatRow { label: string; a: number | string; b: number | string; higherWins?: boolean; }

function StatBlock({ label, a, b, higherWins = true }: StatRow) {
  const aNum = typeof a === 'number' ? a : parseFloat(String(a));
  const bNum = typeof b === 'number' ? b : parseFloat(String(b));
  const aWins = higherWins ? aNum > bNum : aNum < bNum;
  const bWins = higherWins ? bNum > aNum : bNum < aNum;
  const fmt = (v: number | string) => typeof v === 'number' ? v.toLocaleString() : v;
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', padding:'0.6rem 0', borderBottom:'1px solid #f3f4f6' }}>
      <div style={{ textAlign:'right', paddingRight:'1rem' }}>
        <span style={{ fontSize:'1.1rem', fontWeight:800, color: aWins ? '#c8a84b' : '#1a2744' }}>{fmt(a)}</span>
        {aWins && <span style={{ marginLeft:6, fontSize:'0.65rem', color:'#c8a84b', fontWeight:800 }}>WIN</span>}
      </div>
      <div style={{ textAlign:'center', fontSize:'0.72rem', color:'#6b7280', fontWeight:600, textTransform:'uppercase' as const, letterSpacing:'0.06em', minWidth:110 }}>{label}</div>
      <div style={{ textAlign:'left', paddingLeft:'1rem' }}>
        {bWins && <span style={{ marginRight:6, fontSize:'0.65rem', color:'#c8a84b', fontWeight:800 }}>WIN</span>}
        <span style={{ fontSize:'1.1rem', fontWeight:800, color: bWins ? '#c8a84b' : '#1a2744' }}>{fmt(b)}</span>
      </div>
    </div>
  );
}

export default async function ComparePage({ searchParams }: PageProps) {
  const { a: slugA, b: slugB } = await searchParams;
  const navy = '#1a2744'; const gold = '#c8a84b'; const muted = '#6b7280';

  if (!slugA || !slugB) {
    return (
      <div style={{ maxWidth:640, margin:'4rem auto', padding:'0 1rem', textAlign:'center' }}>
        <h1 style={{ fontFamily:'var(--font-bebas)', fontSize:'3rem', color:navy, margin:'0 0 0.5rem' }}>Compare Players</h1>
        <p style={{ color:muted, marginBottom:'2rem' }}>
          Add two player slugs to the URL to compare them head-to-head.<br />
          <code style={{ background:'#f3f4f6', padding:'2px 6px', borderRadius:4, fontSize:'0.85rem' }}>/players/compare?a=player-one&b=player-two</code>
        </p>
        <Link href='/players' style={{ display:'inline-block', background:navy, color:'#fff', padding:'0.7rem 1.5rem', borderRadius:8, fontWeight:700, textDecoration:'none' }}>
          Browse Players \u2192
        </Link>
      </div>
    );
  }

  const [playerA, playerB] = await Promise.all([getPlayer(slugA), getPlayer(slugB)]);

  if (!playerA || !playerB) {
    const missing = !playerA ? slugA : slugB;
    return (
      <div style={{ maxWidth:640, margin:'4rem auto', padding:'0 1rem', textAlign:'center' }}>
        <h2 style={{ fontFamily:'var(--font-bebas)', fontSize:'2rem', color:navy }}>Player not found: {missing}</h2>
        <Link href='/players' style={{ color:gold, fontWeight:700 }}>{String.fromCharCode(8592)} Back to Players</Link>
      </div>
    );
  }

  const sportA = sport(playerA);
  const sportB = sport(playerB);
  let statRows: StatRow[] = [];

  if (sportA === 'football' && sportB === 'football') {
    const fa = fbCareer(playerA); const fb = fbCareer(playerB);
    statRows = [
      { label:'Rush Yards', a:fa.rushYards, b:fb.rushYards },
      { label:'Rush TDs', a:fa.rushTDs, b:fb.rushTDs },
      { label:'Rush Carries', a:fa.rushCarries, b:fb.rushCarries },
      { label:'Pass Yards', a:fa.passYards, b:fb.passYards },
      { label:'Pass TDs', a:fa.passTDs, b:fb.passTDs },
      { label:'Interceptions', a:fa.passInts, b:fb.passInts, higherWins:false },
      { label:'Rec Yards', a:fa.recYards, b:fb.recYards },
      { label:'Receptions', a:fa.recCatches, b:fb.recCatches },
      { label:'Rec TDs', a:fa.recTDs, b:fb.recTDs },
    ];
  } else if (sportA === 'basketball' && sportB === 'basketball') {
    const ba = bkCareer(playerA); const bb = bkCareer(playerB);
    statRows = [
      { label:'Career Points', a:ba.points, b:bb.points },
      { label:'Best PPG', a:ba.bestPpg, b:bb.bestPpg },
      { label:'Career Rebounds', a:ba.rebounds, b:bb.rebounds },
      { label:'Best RPG', a:ba.bestRpg, b:bb.bestRpg },
      { label:'Career Assists', a:ba.assists, b:bb.assists },
      { label:'Best APG', a:ba.bestApg, b:bb.bestApg },
      { label:'Games Played', a:ba.games, b:bb.games },
    ];
  }

  const proA = proLevel(playerA);
  const proB = proLevel(playerB);
  const sportLabel = (s: string) => s === 'football' ? 'Football' : s === 'basketball' ? 'Basketball' : 'Multi-Sport';

  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'2rem 1rem' }}>
      <div style={{ marginBottom:'1.5rem', fontSize:'0.82rem', color:muted }}>
        <Link href='/players' style={{ color:gold, textDecoration:'none', fontWeight:600 }}>Players</Link>
        <span style={{ margin:'0 0.5rem' }}>{String.fromCharCode(8250)}</span>
        <span>Compare</span>
      </div>
      <h1 style={{ fontFamily:'var(--font-bebas)', fontSize:'2.5rem', color:navy, margin:'0 0 2rem', letterSpacing:'0.03em', textAlign:'center' }}>Head-to-Head Comparison</h1>
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:'1rem', marginBottom:'2rem', alignItems:'start' }}>
        <Link href={`/players/${playerA.slug}`} style={{ textDecoration:'none' }}>
          <div style={{ background:'#fff', border:`2px solid ${navy}`, borderRadius:12, padding:'1.25rem', textAlign:'center' }}>
            <div style={{ fontFamily:'var(--font-bebas)', fontSize:'1.6rem', color:navy, lineHeight:1.1 }}>{playerA.name}</div>
            <div style={{ color:muted, fontSize:'0.8rem', marginTop:4 }}>{schoolName(playerA)}</div>
            {playerA.graduation_year && <div style={{ color:muted, fontSize:'0.75rem' }}>Class of {playerA.graduation_year}</div>}
            {proA && <div style={{ marginTop:6, background:'#f0fdf4', color:'#15803d', fontSize:'0.72rem', fontWeight:700, padding:'3px 8px', borderRadius:4, display:'inline-block' }}>{proA}</div>}
            <div style={{ marginTop:6, background:navy, color:'#fff', fontSize:'0.6rem', fontWeight:800, padding:'2px 7px', borderRadius:3, letterSpacing:1.5, textTransform:'uppercase' as const, display:'inline-block' }}>{sportLabel(sportA)}</div>
          </div>
        </Link>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:gold, color:'#fff', fontFamily:'var(--font-bebas)', fontSize:'1.8rem', width:52, height:52, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', letterSpacing:1 }}>VS</div>
        </div>
        <Link href={`/players/${playerB.slug}`} style={{ textDecoration:'none' }}>
          <div style={{ background:'#fff', border:`2px solid ${navy}`, borderRadius:12, padding:'1.25rem', textAlign:'center' }}>
            <div style={{ fontFamily:'var(--font-bebas)', fontSize:'1.6rem', color:navy, lineHeight:1.1 }}>{playerB.name}</div>
            <div style={{ color:muted, fontSize:'0.8rem', marginTop:4 }}>{schoolName(playerB)}</div>
            {playerB.graduation_year && <div style={{ color:muted, fontSize:'0.75rem' }}>Class of {playerB.graduation_year}</div>}
            {proB && <div style={{ marginTop:6, background:'#f0fdf4', color:'#15803d', fontSize:'0.72rem', fontWeight:700, padding:'3px 8px', borderRadius:4, display:'inline-block' }}>{proB}</div>}
            <div style={{ marginTop:6, background:navy, color:'#fff', fontSize:'0.6rem', fontWeight:800, padding:'2px 7px', borderRadius:3, letterSpacing:1.5, textTransform:'uppercase' as const, display:'inline-block' }}>{sportLabel(sportB)}</div>
          </div>
        </Link>
      </div>
      {statRows.length > 0 ? (
        <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'1.25rem 1.5rem' }}>
          <h2 style={{ fontFamily:'var(--font-bebas)', fontSize:'1.5rem', color:navy, margin:'0 0 0.75rem', letterSpacing:'0.03em' }}>Career Stats</h2>
          {statRows.map((row) => <StatBlock key={row.label} {...row} />)}
        </div>
      ) : (
        <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'2rem', textAlign:'center' }}>
          <p style={{ color:muted }}>{sportA === 'none' || sportB === 'none' ? 'One or both players have no recorded stats yet.' : 'Cross-sport comparison \u2014 stats not directly comparable.'}</p>
        </div>
      )}
      <div style={{ marginTop:'2rem', display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' as const }}>
        <Link href={`/players/${playerA.slug}`} style={{ color:gold, fontWeight:700, fontSize:'0.85rem', textDecoration:'none' }}>{String.fromCharCode(8592)} {playerA.name} Profile</Link>
        <Link href={`/players/${playerB.slug}`} style={{ color:gold, fontWeight:700, fontSize:'0.85rem', textDecoration:'none' }}>{playerB.name} Profile {String.fromCharCode(8594)}</Link>
        <Link href='/players' style={{ color:muted, fontWeight:600, fontSize:'0.85rem', textDecoration:'none' }}>Browse All Players</Link>
      </div>
    </div>
  );
}
