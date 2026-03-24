'use client';
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Props { sport: string; }

interface Leader { name: string; school: string; value: number; }
interface Game {
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  date: string;
  gameType: string | null;
  playoffRound: string | null;
}
interface Ranking { school: string; rank: number; record?: string; }

interface RankingCategory {
  key: string;
  label: string;
  rankings: Ranking[];
}

// Sport-specific stat config for top performers
const SPORT_STAT_CONFIG: Record<string, { table: string; stats: { column: string; label: string; suffix: string }[] }> = {
  football: {
    table: 'football_player_seasons',
    stats: [
      { column: 'rush_yards', label: 'Rush', suffix: 'yds' },
      { column: 'pass_yards', label: 'Pass', suffix: 'yds' },
      { column: 'rec_yards', label: 'Rec', suffix: 'yds' },
    ],
  },
  basketball: {
    table: 'basketball_player_seasons',
    stats: [
      { column: 'ppg', label: 'PPG', suffix: 'ppg' },
      { column: 'rpg', label: 'RPG', suffix: 'rpg' },
      { column: 'apg', label: 'APG', suffix: 'apg' },
    ],
  },
};

// Category display config
const RANKING_CATEGORY_CONFIG: Record<string, { label: string; shortLabel: string }> = {
  city: { label: 'City Top 12', shortLabel: 'City' },
  public: { label: 'Public League Top 10', shortLabel: 'Public' },
  pcl: { label: 'Catholic League Top 5', shortLabel: 'Catholic' },
};

/** Build a short playoff badge label from game_type + playoff_round */
function getPlayoffBadge(gameType: string | null, playoffRound: string | null): string | null {
  if (!gameType) return null;
  const gt = gameType.toLowerCase();
  if (gt !== 'playoff' && gt !== 'championship' && gt !== 'postseason') return null;

  if (!playoffRound) {
    if (gt === 'championship') return 'Championship';
    return 'Playoff';
  }

  const pr = playoffRound.toLowerCase();
  if (pr === 'championship' || pr === 'finals') return 'Final';
  if (pr === 'semifinals' || pr === 'semi-finals') return 'Semifinal';
  if (pr === 'quarterfinals') return 'Quarterfinal';
  if (pr === 'second round') return '2nd Round';
  return playoffRound;
}

export default function DesignBibleSections({ sport }: Props) {
  const [leaders, setLeaders] = useState<{ items: { label: string; suffix: string; leader: Leader | null }[] }>({ items: [] });
  const [games, setGames] = useState<Game[]>([]);
  const [rankingCategories, setRankingCategories] = useState<RankingCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate ranking categories every 5 seconds
  useEffect(() => {
    if (rankingCategories.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % rankingCategories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [rankingCategories.length, isPaused]);

  const handleCategoryClick = useCallback((index: number) => {
    setActiveCategory(index);
    setIsPaused(true);
    // Resume auto-rotation after 15 seconds of inactivity
    const resume = setTimeout(() => setIsPaused(false), 15000);
    return () => clearTimeout(resume);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      try {
        // Top performers -- sport-aware
        const config = SPORT_STAT_CONFIG[sport] ?? SPORT_STAT_CONFIG.football;
        const statQueries = config.stats.map(async ({ column, label, suffix }) => {
          const db = supabase as any;
          const { data } = await db.from(config.table)
            .select('player_id, ' + column + ', players!inner(name, schools!inner(name))')
            .not(column, 'is', null)
            .order(column, { ascending: false })
            .limit(1);
          if (data?.[0]) {
            const p = Array.isArray(data[0].players) ? data[0].players[0] : data[0].players;
            const s = p?.schools ? (Array.isArray(p.schools) ? p.schools[0] : p.schools) : null;
            return { label, suffix, leader: { name: p?.name ?? 'Unknown', school: s?.name ?? '', value: data[0][column] ?? 0 } };
          }
          return { label, suffix, leader: null };
        });
        const items = await Promise.all(statQueries);
        setLeaders({ items });

        // Recent scores -- include game_type and playoff_round
        const { data: gData } = await (supabase as any).from('games')
          .select('home_score, away_score, game_date, home_school_id, away_school_id, sport_id, game_type, playoff_round')
          .eq('sport_id', sport)
          .not('home_score', 'is', null)
          .not('away_score', 'is', null)
          .gt('home_score', 0)
          .not('home_school_id', 'is', null)
          .not('away_school_id', 'is', null)
          .not('game_date', 'is', null)
          .order('game_date', { ascending: false })
          .limit(20);
        if (gData) {
          const schoolIds = new Set<number>();
          gData.forEach((g: any) => { schoolIds.add(g.home_school_id); schoolIds.add(g.away_school_id); });
          const { data: schools } = await supabase.from('school_names').select('id, name').in('id', Array.from(schoolIds));
          const sm = new Map<number, string>();
          (schools ?? []).forEach((s: any) => sm.set(s.id, s.name));
          // Show variety -- limit any single school to max 2 appearances, but allow rematches
          const schoolCount = new Map<number, number>();
          const diverseGames = gData.filter((g: any) => {
            const homeCount = schoolCount.get(g.home_school_id) ?? 0;
            const awayCount = schoolCount.get(g.away_school_id) ?? 0;
            if (homeCount >= 2 && awayCount >= 2) return false;
            schoolCount.set(g.home_school_id, homeCount + 1);
            schoolCount.set(g.away_school_id, awayCount + 1);
            return true;
          }).slice(0, 5);
          setGames(diverseGames.map((g: any) => ({
            home: sm.get(g.home_school_id) ?? 'TBD',
            away: sm.get(g.away_school_id) ?? 'TBD',
            homeScore: g.home_score, awayScore: g.away_score,
            date: g.game_date,
            gameType: g.game_type ?? null,
            playoffRound: g.playoff_round ?? null,
          })));
        }

        // Power rankings -- fetch ALL categories
        const { data: prData } = await (supabase as any).from('power_rankings')
          .select('rank_position, sport_id, school_id, ranking_category, record_display, schools!inner(name)')
          .eq('sport_id', sport)
          .order('rank_position', { ascending: true });
        if (prData && prData.length > 0) {
          // Group by ranking_category
          const categoryMap = new Map<string, Ranking[]>();
          prData.forEach((r: any) => {
            const cat = r.ranking_category ?? 'city';
            if (!categoryMap.has(cat)) categoryMap.set(cat, []);
            categoryMap.get(cat)!.push({
              school: (Array.isArray(r.schools) ? r.schools[0] : r.schools)?.name ?? 'Unknown',
              rank: r.rank_position,
              record: r.record_display ?? undefined,
            });
          });
          // Build categories in preferred order
          const preferredOrder = ['city', 'public', 'pcl'];
          const categories: RankingCategory[] = [];
          for (const key of preferredOrder) {
            if (categoryMap.has(key)) {
              const cfg = RANKING_CATEGORY_CONFIG[key] ?? { label: key, shortLabel: key };
              categories.push({ key, label: cfg.label, rankings: categoryMap.get(key)! });
            }
          }
          // Add any remaining categories not in preferred order
          for (const [key, rankings] of categoryMap) {
            if (!preferredOrder.includes(key)) {
              categories.push({ key, label: key, rankings });
            }
          }
          setRankingCategories(categories);
        }
      } catch (e) { console.error('DesignBibleSections error:', e); }
      setLoading(false);
    }
    load();
  }, [sport]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading stats...</div>;

  const headingStyle: React.CSSProperties = { fontSize: '1.25rem', color: '#0a1628', letterSpacing: '1px', marginBottom: '0.75rem' };
  const cardStyle: React.CSSProperties = { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '0.5rem' };

  const currentCategory = rankingCategories[activeCategory] ?? null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '1.5rem 0', maxWidth: '960px', margin: '0 auto' }}>
      <div>
        <h2 className="psp-h3" style={headingStyle}>TOP PERFORMERS</h2>
        {leaders.items.map(({ label, suffix, leader }) => leader && (
          <div key={label} style={cardStyle}><strong style={{ color: '#f0a500' }}>{label}:</strong> {leader.name} ({leader.value.toLocaleString()} {suffix})</div>
        ))}
        {rankingCategories.length > 0 && (
          <>
            <h2 className="psp-h3" style={{ ...headingStyle, marginTop: '1.5rem' }}>POWER RANKINGS</h2>
            {/* Category tabs */}
            {rankingCategories.length > 1 && (
              <div style={{ display: 'flex', gap: '4px', marginBottom: '0.75rem' }}>
                {rankingCategories.map((cat, i) => {
                  const isActive = i === activeCategory;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => handleCategoryClick(i)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '4px',
                        border: isActive ? '1px solid #f0a500' : '1px solid #e2e8f0',
                        background: isActive ? '#f0a500' : '#f8fafc',
                        color: isActive ? '#0a1628' : '#64748b',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {RANKING_CATEGORY_CONFIG[cat.key]?.shortLabel ?? cat.key}
                    </button>
                  );
                })}
              </div>
            )}
            {/* Active category label */}
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {currentCategory?.label}
            </div>
            {/* Rankings list */}
            {currentCategory?.rankings.map((r) => (
              <div key={`${currentCategory.key}-${r.rank}`} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ display: 'inline-block', width: '28px', height: '28px', borderRadius: '50%', background: '#f0a500', color: '#0a1628', textAlign: 'center', lineHeight: '28px', fontWeight: 700, fontSize: '14px', marginRight: '0.5rem', flexShrink: 0 }}>{r.rank}</span>
                  <span style={{ flex: 1, fontWeight: 600 }}>{r.school}</span>
                  {r.record && (
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{r.record}</span>
                  )}
                </div>
              </div>
            ))}
            {/* Rotation indicator dots */}
            {rankingCategories.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '8px' }}>
                {rankingCategories.map((_, i) => (
                  <span
                    key={i}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: i === activeCategory ? '#f0a500' : '#cbd5e1',
                      transition: 'background 0.3s ease',
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div>
        <h2 className="psp-h3" style={headingStyle}>RECENT SCORES</h2>
        {games.length === 0 && <div style={cardStyle}>No recent scores available</div>}
        {games.map((g, i) => {
          const badge = getPlayoffBadge(g.gameType, g.playoffRound);
          return (
            <div key={i} style={cardStyle}>
              {badge && (
                <div style={{
                  display: 'inline-block',
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  background: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fcd34d',
                  marginBottom: '6px',
                }}>
                  {badge}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: g.homeScore > g.awayScore ? 700 : 400, color: g.homeScore > g.awayScore ? '#0a1628' : '#64748b' }}>{g.home}</span>
                <span style={{ fontWeight: 700, color: '#f0a500' }}>{g.homeScore}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: g.awayScore > g.homeScore ? 700 : 400, color: g.awayScore > g.homeScore ? '#0a1628' : '#64748b' }}>{g.away}</span>
                <span style={{ fontWeight: 700, color: '#f0a500' }}>{g.awayScore}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
