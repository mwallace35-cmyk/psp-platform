import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const revalidate = 86400;
export const alt = 'Player Profile – Philly Sports Pack';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: PageProps) {
  const { slug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: player } = await supabase
    .from('players')
    .select(
      `name, graduation_year, positions,
       schools!primary_school_id(name),
       football_player_seasons(rush_yards, rush_tds, pass_yards, pass_tds, rec_yards, rec_tds),
       basketball_player_seasons(points, ppg, rebounds, rpg, assists),
       next_level_tracking(current_level, current_org, pro_team, pro_league, college)`
    )
    .eq('slug', slug)
    .is('deleted_at', null)
    .single();

  if (!player) {
    return new ImageResponse(
      (
        <div style={{ background: '#1a2744', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#c8a84b', fontSize: 64, fontWeight: 900 }}>Philly Sports Pack</span>
        </div>
      ),
      { ...size }
    );
  }

  const schoolRaw = player.schools as unknown as Array<{ name: string }> | null;
  const schoolName = Array.isArray(schoolRaw) && schoolRaw[0] ? schoolRaw[0].name : 'Philadelphia';

  const fbSeasons = player.football_player_seasons as unknown as Array<{
    rush_yards: number; rush_tds: number; pass_yards: number; pass_tds: number;
    rec_yards: number; rec_tds: number;
  }> | null;
  const bkSeasons = player.basketball_player_seasons as unknown as Array<{
    points: number; ppg: number; rebounds: number; rpg: number; assists: number;
  }> | null;
  const proRaw = player.next_level_tracking as unknown as Array<{
    current_level: string; current_org: string; pro_team: string;
    pro_league: string; college: string;
  }> | null;
  const proEntry = Array.isArray(proRaw) ? proRaw[0] : null;

  let sport = 'Athlete';
  let statLabel = '';
  let statValue = '';
  let accentColor = '#c8a84b';

  const hasFb = Array.isArray(fbSeasons) && fbSeasons.length > 0;
  const hasBk = Array.isArray(bkSeasons) && bkSeasons.length > 0;

  if (hasFb) {
    sport = 'Football';
    accentColor = '#c8a84b';
    const totalRush = fbSeasons!.reduce((a, s) => a + (s.rush_yards || 0), 0);
    const totalPass = fbSeasons!.reduce((a, s) => a + (s.pass_yards || 0), 0);
    const totalRushTd = fbSeasons!.reduce((a, s) => a + (s.rush_tds || 0), 0);
    const totalPassTd = fbSeasons!.reduce((a, s) => a + (s.pass_tds || 0), 0);
    if (totalRush >= totalPass && totalRush > 0) {
      statLabel = 'Career Rush Yards';
      statValue = totalRush.toLocaleString();
      if (totalRushTd > 0) statLabel += ` · ${totalRushTd} TDs`;
    } else if (totalPass > 0) {
      statLabel = 'Career Pass Yards';
      statValue = totalPass.toLocaleString();
      if (totalPassTd > 0) statLabel += ` · ${totalPassTd} TDs`;
    }
  } else if (hasBk) {
    sport = 'Basketball';
    accentColor = '#f97316';
    const latestSeason = bkSeasons![bkSeasons!.length - 1];
    if (latestSeason?.ppg) {
      statValue = String(latestSeason.ppg);
      statLabel = 'PPG';
    }
    const totalPts = bkSeasons!.reduce((a, s) => a + (s.points || 0), 0);
    if (totalPts > 0 && !statValue) {
      statValue = totalPts.toLocaleString();
      statLabel = 'Career Points';
    }
  }

  let proLine = '';
  if (proEntry) {
    if (proEntry.pro_team) proLine = proEntry.pro_team + (proEntry.pro_league ? ` (${proEntry.pro_league})` : '');
    else if (proEntry.college) proLine = proEntry.college;
  }

  const positions = Array.isArray(player.positions) ? player.positions.join(' / ') : (player.positions || '');
  const classYear = player.graduation_year ? `Class of ${player.graduation_year}` : '';

  return new ImageResponse(
    (
      <div style={{ background: 'linear-gradient(135deg, #0f1a33 0%, #1a2744 60%, #1e3060 100%)', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '56px 80px 48px', fontFamily: 'Georgia, serif', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: accentColor }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div style={{ background: accentColor, color: '#1a2744', fontSize: 20, fontWeight: 800, padding: '6px 18px', borderRadius: 4, letterSpacing: 2, textTransform: 'uppercase' as const }}>{sport}</div>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 22 }}>{schoolName}</span>
          {positions ? <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }}>· {positions}</span> : null}
        </div>
        <div style={{ fontSize: 86, fontWeight: 900, color: '#ffffff', lineHeight: 0.95, letterSpacing: -3, marginBottom: 20, maxWidth: 900 }}>{player.name}</div>
        {classYear ? <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>{classYear}</div> : <div style={{ marginBottom: 32 }} />}
        {statValue ? (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 'auto' }}>
            <span style={{ fontSize: 72, fontWeight: 900, color: accentColor, lineHeight: 1 }}>{statValue}</span>
            <span style={{ fontSize: 28, color: 'rgba(255,255,255,0.65)', fontWeight: 400 }}>{statLabel}</span>
          </div>
        ) : <div style={{ flex: 1 }} />}
        {proLine ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, marginTop: 16 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ color: '#22c55e', fontSize: 24, fontWeight: 600 }}>{proLine}</span>
          </div>
        ) : null}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 20, marginTop: proLine ? 0 : 'auto' }}>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 20 }}>phillysportspack.com</span>
          <span style={{ color: accentColor, fontSize: 24, fontWeight: 700, letterSpacing: 1 }}>PHILLY SPORTS PACK</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
