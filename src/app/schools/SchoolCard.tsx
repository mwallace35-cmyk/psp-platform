import Link from 'next/link';
import { SchoolLogo } from '@/components/ui';

export interface SchoolData {
  id: number;
  slug: string;
  name: string;
  city: string;
  state: string;
  league: string | null;
  colors: string | null;
  secondary_color: string | null;
  logo_url: string | null;
  championships_count: number;
  total_wins: number;
  total_losses: number;
  has_data: boolean;
  sports: string[];
  award_count: number;
  closed_year: number | null;
  player_count: number;
  pro_count: number;
  game_count: number;
  sport_count: number;
  win_pct: number | null;
}

const SPORT_EMOJI: Record<string, string> = {
  'football': '\u{1F3C8}',
  'basketball': '\u{1F3C0}',
  'baseball': '\u26BE',
  'soccer': '\u26BD',
  'lacrosse': '\u{1F94D}',
  'track-field': '\u{1F3C3}',
  'wrestling': '\u{1F93C}',
};

const LEAGUE_COLORS: Record<string, string> = {
  'Philadelphia Catholic League': '#f0a500',
  'Catholic League': '#f0a500',
  'Philadelphia Public League': '#0a1628',
  'Public League': '#0a1628',
  'Inter-Academic League': '#16a34a',
  'Inter-Ac League': '#16a34a',
  'Inter-Ac': '#16a34a',
};

export function getLeagueColor(league: string | null): string {
  if (!league) return '#64748b';
  if (LEAGUE_COLORS[league]) return LEAGUE_COLORS[league];
  const key = Object.keys(LEAGUE_COLORS).find(k => league.includes(k) || k.includes(league));
  return key ? LEAGUE_COLORS[key] : '#64748b';
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function EmptyState({ searchTerm, selectedLetter }: { searchTerm: string; selectedLetter: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--g400)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{'\u{1F50D}'}</div>
      <p style={{ fontSize: 14, margin: 0 }}>
        {searchTerm ? 'No schools match your search.' : selectedLetter ? `No schools starting with "${selectedLetter}".` : 'No schools found.'}
      </p>
    </div>
  );
}

export default function SchoolCard({ school, rank }: { school: SchoolData; rank?: number }) {
  const leagueColor = getLeagueColor(school.league);
  const primaryColor = school.colors && school.colors.startsWith('#') ? school.colors : leagueColor;
  const secondaryColor = school.secondary_color && school.secondary_color.startsWith('#') ? school.secondary_color : null;
  const isClosed = !!school.closed_year;
  const record = school.total_wins > 0 || school.total_losses > 0
    ? `${school.total_wins}-${school.total_losses}`
    : null;

  const hasRichData = school.player_count > 0 || school.game_count > 0 || school.pro_count > 0;

  return (
    <Link href={`/schools/${school.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="animate-fade-in-up" style={{
        background: 'var(--surface, #fff)',
        border: isClosed ? '1px solid #d6d3d1' : '1px solid var(--g100)',
        borderRadius: 10,
        overflow: 'hidden',
        transition: 'all .2s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        opacity: isClosed ? 0.85 : 1,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.boxShadow = '0 8px 24px rgba(0,0,0,.12)';
        el.style.transform = 'translateY(-4px)';
        el.style.opacity = '1';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.boxShadow = 'none';
        el.style.transform = 'translateY(0)';
        el.style.opacity = isClosed ? '0.85' : '1';
      }}
      >
        {/* Header */}
        <div style={{
          background: isClosed
            ? `linear-gradient(135deg, ${primaryColor}cc, ${primaryColor}88)`
            : secondaryColor
              ? `linear-gradient(135deg, ${primaryColor} 60%, ${secondaryColor})`
              : primaryColor,
          padding: '14px 14px 12px',
          color: '#fff',
          position: 'relative',
          minHeight: 54,
        }}>
          {/* Championship gold stripe */}
          {school.championships_count > 0 && (
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--psp-gold)' }} />
          )}

          {/* Rank badge */}
          {rank !== undefined && rank <= 20 && (
            <div style={{
              position: 'absolute',
              top: 8,
              left: school.championships_count > 0 ? 12 : 8,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 800,
              color: '#fff',
              backdropFilter: 'blur(4px)',
            }}>
              {rank}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {school.logo_url && (
              <SchoolLogo logoUrl={school.logo_url} name={school.name} size="sm" />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 className="psp-small" style={{
                margin: 0,
                lineHeight: 1.2,
                paddingLeft: !school.logo_url && rank !== undefined && rank <= 20 ? 28 : 0,
                paddingRight: isClosed ? 70 : 0,
                textShadow: '0 1px 2px rgba(0,0,0,.3)',
              }}>
                {school.name}
              </h3>

              <div style={{
                fontSize: 10,
                opacity: 0.85,
                marginTop: 3,
                fontWeight: 500,
                textShadow: '0 1px 1px rgba(0,0,0,.2)',
                paddingLeft: !school.logo_url && rank !== undefined && rank <= 20 ? 28 : 0,
              }}>
                {school.city}{school.city && school.state ? ', ' : ''}{school.state}
              </div>
            </div>
          </div>

          {isClosed && (
            <span style={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontSize: 8,
              fontWeight: 700,
              background: 'rgba(0,0,0,0.45)',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: 3,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}>
              Closed {school.closed_year}
            </span>
          )}

          {school.pro_count > 0 && (
            <span style={{
              position: 'absolute',
              bottom: 6,
              right: 8,
              fontSize: 9,
              fontWeight: 700,
              background: 'rgba(255,255,255,0.25)',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: 3,
              backdropFilter: 'blur(4px)',
            }}>
              {'\u2B50'} {school.pro_count} Pro{school.pro_count !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '10px 14px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* League + Sports Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: leagueColor,
              textTransform: 'uppercase',
              letterSpacing: 0.3,
              lineHeight: 1,
            }}>
              {school.league || 'Independent'}
            </div>
            {school.sports.length > 0 && (
              <div style={{ display: 'flex', gap: 3 }}>
                {school.sports.map(sport => (
                  <span key={sport} title={sport.charAt(0).toUpperCase() + sport.slice(1)} style={{ fontSize: 14 }}>
                    {SPORT_EMOJI[sport] || '\u2022'}
                  </span>
                ))}
                {school.sport_count > school.sports.length && (
                  <span style={{ fontSize: 10, color: 'var(--g400)', fontWeight: 600, lineHeight: '14px' }}>
                    +{school.sport_count - school.sports.length}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Win Percentage Bar */}
          {school.win_pct !== null && record && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: 'var(--g400)', fontWeight: 600, textTransform: 'uppercase' }}>All-Time</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--psp-navy)' }}>
                  {record} <span style={{ fontSize: 10, fontWeight: 600, color: school.win_pct >= 60 ? '#16a34a' : school.win_pct >= 50 ? 'var(--psp-navy)' : '#dc2626' }}>({school.win_pct}%)</span>
                </span>
              </div>
              <div style={{ height: 4, background: 'var(--g100)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(school.win_pct, 100)}%`,
                  background: school.win_pct >= 60 ? '#16a34a' : school.win_pct >= 50 ? 'var(--psp-blue)' : '#dc2626',
                  borderRadius: 2,
                  transition: 'width .3s',
                }} />
              </div>
            </div>
          )}

          {/* Stat Pills */}
          {hasRichData && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto', paddingTop: 6 }}>
              {school.championships_count > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  padding: '3px 8px', borderRadius: 4,
                  background: 'rgba(240, 165, 0, 0.12)',
                  fontSize: 10, fontWeight: 700, color: '#b45309',
                }}>
                  {'\u{1F3C6}'} {school.championships_count}
                </span>
              )}
              {school.player_count > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  padding: '3px 8px', borderRadius: 4,
                  background: 'rgba(59, 130, 246, 0.08)',
                  fontSize: 10, fontWeight: 700, color: 'var(--psp-blue)',
                }}>
                  {formatNumber(school.player_count)} players
                </span>
              )}
              {school.game_count > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  padding: '3px 8px', borderRadius: 4,
                  background: 'rgba(10, 22, 40, 0.06)',
                  fontSize: 10, fontWeight: 700, color: 'var(--psp-navy)',
                }}>
                  {formatNumber(school.game_count)} games
                </span>
              )}
              {school.award_count > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  padding: '3px 8px', borderRadius: 4,
                  background: 'rgba(124, 58, 237, 0.08)',
                  fontSize: 10, fontWeight: 700, color: '#7c3aed',
                }}>
                  {formatNumber(school.award_count)} awards
                </span>
              )}
            </div>
          )}

          {/* No-data fallback */}
          {!hasRichData && !record && (
            <div style={{ fontSize: 11, color: 'var(--g400)', fontStyle: 'italic', marginTop: 'auto' }}>
              Opponent record only
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
