import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SPORT_META } from '@/lib/sports';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PSPPromo from '@/components/ads/PSPPromo';
import GotwVoteButton from '@/components/gotw/GotwVoteButton';

export const metadata: Metadata = {
  title: 'Game of the Week — PhillySportsPack',
  description: 'Vote for the biggest game of the week in Philadelphia high school sports. Football, basketball, baseball — you decide which matchup matters most.',
  openGraph: {
    title: 'Game of the Week — PhillySportsPack',
    description: 'Vote for the biggest game of the week in Philadelphia high school sports.',
  },
};

export const revalidate = 60;

// Determine sport ordering based on current month (in-season sport first)
function getSportOrder(): Array<{ id: string; label: string; emoji: string; color: string; season: string }> {
  const month = new Date().getMonth();
  const sports = [
    { id: 'football', label: 'Football', emoji: '🏈', color: '#16a34a', season: 'Fall' },
    { id: 'basketball', label: 'Basketball', emoji: '🏀', color: '#ea580c', season: 'Winter' },
    { id: 'baseball', label: 'Baseball', emoji: '⚾', color: '#dc2626', season: 'Spring' },
  ];

  if (month >= 2 && month <= 5) {
    return [sports[2], sports[1], sports[0]];
  } else if (month >= 7 && month <= 10) {
    return [sports[0], sports[1], sports[2]];
  } else {
    return [sports[1], sports[0], sports[2]];
  }
}

function getSeasonLabel(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 5) return 'Spring';
  if (month >= 6 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Fall';
  return 'Winter';
}

// Hardcoded featured matchups when no DB nominees exist
function getFeaturedMatchups() {
  const month = new Date().getMonth();

  const football = [
    { home: 'St. Joseph\'s Prep', away: 'La Salle College HS', context: 'Catholic League Rivalry', venue: 'Cardinal O\'Hara Stadium', gameDate: 'TBD', sport: 'football' },
    { home: 'Imhotep Charter', away: 'MLK HS', context: 'Public League Showdown', venue: 'Northeast HS', gameDate: 'TBD', sport: 'football' },
    { home: 'Archbishop Wood', away: 'Neumann-Goretti', context: 'PCL Crossover', venue: 'Archbishop Wood', gameDate: 'TBD', sport: 'football' },
  ];

  const basketball = [
    { home: 'Neumann-Goretti', away: 'Roman Catholic', context: 'Catholic League Classic', venue: 'The Palestra', gameDate: 'TBD', sport: 'basketball' },
    { home: 'Imhotep Charter', away: 'Math Civics & Sciences', context: 'Public League Battle', venue: 'Imhotep Charter', gameDate: 'TBD', sport: 'basketball' },
    { home: 'Archbishop Wood', away: 'La Salle College HS', context: 'PCL Matchup', venue: 'Archbishop Wood', gameDate: 'TBD', sport: 'basketball' },
  ];

  const baseball = [
    { home: 'La Salle College HS', away: 'St. Joseph\'s Prep', context: 'Catholic League Rivalry', venue: 'La Salle HS Field', gameDate: 'TBD', sport: 'baseball' },
    { home: 'Neumann-Goretti', away: 'Father Judge', context: 'PCL Showdown', venue: 'Neumann-Goretti', gameDate: 'TBD', sport: 'baseball' },
    { home: 'Malvern Prep', away: 'Episcopal Academy', context: 'Inter-Ac Battle', venue: 'Malvern Prep', gameDate: 'TBD', sport: 'baseball' },
  ];

  return { football, basketball, baseball };
}

export default async function GotwPage() {
  const supabase = await createClient();

  // Fetch current nominees (all sports)
  const { data: nominees } = await supabase
    .from('gotw_nominees')
    .select('*')
    .order('vote_count', { ascending: false });

  // Fetch past winners (recent 20)
  const { data: winners } = await supabase
    .from('gotw_winners')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  const sportOrder = getSportOrder();
  const allNominees = nominees || [];
  const allWinners = winners || [];
  const seasonLabel = getSeasonLabel();
  const featured = getFeaturedMatchups();

  // Group nominees by sport
  const nomineesBySport: Record<string, typeof allNominees> = {};
  for (const sport of sportOrder) {
    nomineesBySport[sport.id] = allNominees.filter(n => n.sport_id === sport.id);
  }

  const totalVotes = allNominees.reduce((sum, n) => sum + (n.vote_count || 0), 0);
  const activeSports = sportOrder.filter(s => (nomineesBySport[s.id]?.length || 0) > 0).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumb items={[{ label: 'Game of the Week' }]} />

      {/* ════════ HEADER BAR ════════ */}
      <div className="sport-hub-header" style={{ '--shh-color': 'var(--psp-blue, #3b82f6)' } as React.CSSProperties}>
        <div className="shh-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 28 }}>🎯</span>
            <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
              Game of the Week
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
            Vote for the biggest matchup of the week in Philadelphia high school sports — one vote per week.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
            {totalVotes > 0 && (
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: 20 }}>
                {totalVotes.toLocaleString()} total votes this week
              </span>
            )}
            {activeSports > 0 && (
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: 20 }}>
                {activeSports} active polls
              </span>
            )}
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: 20 }}>
              {seasonLabel} Season
            </span>
          </div>
        </div>
      </div>

      {/* ════════ SUB-NAV ════════ */}
      <nav className="hub-subnav">
        <Link href="/gotw" style={{ color: 'var(--psp-gold)' }}>Current Voting</Link>
        <Link href="/potw">Player of the Week</Link>
        <Link href="/events">Events</Link>
        <Link href="/community">Community</Link>
      </nav>

      {/* ════════ MAIN 2-COL LAYOUT ════════ */}
      <div className="hub-body">
        <div className="hub-main">

          {/* ──── SPORT POLL SECTIONS ──── */}
          {sportOrder.map((sport) => {
            const sportNominees = nomineesBySport[sport.id] || [];
            const sportVotes = sportNominees.reduce((sum, n) => sum + (n.vote_count || 0), 0);
            const hasNominees = sportNominees.length > 0;
            const featuredGames = featured[sport.id as keyof typeof featured] || [];

            return (
              <div key={sport.id} style={{ marginBottom: 28 }}>
                {/* Sport Section Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: sport.color,
                  borderRadius: '8px 8px 0 0',
                  color: '#fff',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{sport.emoji}</span>
                    <span style={{
                      fontFamily: 'Barlow Condensed, sans-serif',
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                    }}>
                      {sport.label}
                    </span>
                    <span style={{
                      fontSize: 10,
                      background: 'rgba(255,255,255,0.2)',
                      padding: '2px 8px',
                      borderRadius: 10,
                      fontWeight: 600,
                    }}>
                      {sport.season} Season
                    </span>
                  </div>
                  {hasNominees && (
                    <span style={{ fontSize: 11, opacity: 0.8 }}>
                      {sportVotes} vote{sportVotes !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Matchup Cards */}
                <div style={{
                  border: '1px solid var(--psp-gray-200, #e5e7eb)',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  overflow: 'hidden',
                }}>
                  {hasNominees ? (
                    // Real DB nominees
                    sportNominees.map((nominee, idx) => {
                      const isLeading = idx === 0 && (nominee.vote_count || 0) > 0;
                      const pct = sportVotes > 0 ? Math.round(((nominee.vote_count || 0) / sportVotes) * 100) : 0;

                      return (
                        <div
                          key={nominee.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            padding: '16px',
                            background: isLeading
                              ? 'rgba(240, 165, 0, 0.06)'
                              : idx % 2 === 0 ? '#fff' : 'var(--psp-gray-50, #f9fafb)',
                            borderBottom: idx < sportNominees.length - 1
                              ? '1px solid var(--psp-gray-200, #e5e7eb)'
                              : 'none',
                          }}
                        >
                          {/* Matchup Number */}
                          <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'Barlow Condensed, sans-serif',
                            fontSize: 15,
                            fontWeight: 700,
                            color: isLeading ? '#fff' : 'var(--psp-navy, #0a1628)',
                            background: isLeading ? sport.color : 'var(--psp-gray-100, #f3f4f6)',
                            flexShrink: 0,
                          }}>
                            {idx + 1}
                          </div>

                          {/* Matchup Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                              <span style={{
                                fontFamily: 'Barlow Condensed, sans-serif',
                                fontSize: 16,
                                fontWeight: 700,
                                color: 'var(--psp-navy, #0a1628)',
                              }}>
                                {nominee.home_team}
                              </span>
                              <span style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: 'var(--psp-gray-400, #9ca3af)',
                                padding: '0 4px',
                              }}>
                                vs
                              </span>
                              <span style={{
                                fontFamily: 'Barlow Condensed, sans-serif',
                                fontSize: 16,
                                fontWeight: 700,
                                color: 'var(--psp-navy, #0a1628)',
                              }}>
                                {nominee.away_team}
                              </span>
                              {isLeading && (
                                <span style={{
                                  fontSize: 9,
                                  fontWeight: 700,
                                  background: 'var(--psp-gold, #f0a500)',
                                  color: 'var(--psp-navy, #0a1628)',
                                  padding: '1px 7px',
                                  borderRadius: 10,
                                  letterSpacing: 0.5,
                                  textTransform: 'uppercase',
                                }}>
                                  Top Pick
                                </span>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 3, flexWrap: 'wrap' }}>
                              {nominee.context && (
                                <span style={{ fontSize: 11, color: sport.color, fontWeight: 600 }}>
                                  {nominee.context}
                                </span>
                              )}
                              {nominee.venue && (
                                <span style={{ fontSize: 11, color: 'var(--psp-gray-500, #6b7280)' }}>
                                  📍 {nominee.venue}
                                </span>
                              )}
                              {nominee.game_date && (
                                <span style={{ fontSize: 11, color: 'var(--psp-gray-500, #6b7280)' }}>
                                  📅 {new Date(nominee.game_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                  {nominee.game_time && ` · ${nominee.game_time}`}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Vote bar + count */}
                          <div style={{ width: 80, textAlign: 'right', flexShrink: 0 }}>
                            <div style={{
                              fontFamily: 'Barlow Condensed, sans-serif',
                              fontSize: 20,
                              fontWeight: 700,
                              color: isLeading ? sport.color : 'var(--psp-navy, #0a1628)',
                            }}>
                              {pct}%
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--psp-gray-500, #6b7280)' }}>
                              {nominee.vote_count || 0} vote{(nominee.vote_count || 0) !== 1 ? 's' : ''}
                            </div>
                            <div style={{
                              marginTop: 4,
                              height: 4,
                              borderRadius: 2,
                              background: 'var(--psp-gray-200, #e5e7eb)',
                              overflow: 'hidden',
                            }}>
                              <div style={{
                                width: `${pct}%`,
                                height: '100%',
                                borderRadius: 2,
                                background: sport.color,
                                transition: 'width 0.3s ease',
                              }} />
                            </div>
                          </div>

                          {/* Vote Button */}
                          <div style={{ flexShrink: 0 }}>
                            <GotwVoteButton nomineeId={nominee.id} sportColor={sport.color} />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    // Featured matchups when no DB nominees
                    <div>
                      <div style={{
                        textAlign: 'center',
                        padding: '14px 20px 8px',
                        background: 'var(--psp-gray-50, #f9fafb)',
                      }}>
                        <p style={{ fontSize: 12, color: 'var(--psp-gray-500, #6b7280)', fontWeight: 500, fontStyle: 'italic' }}>
                          Voting opens soon — here are the matchups we&apos;re watching
                        </p>
                      </div>
                      {featuredGames.map((game, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            padding: '14px 16px',
                            background: idx % 2 === 0 ? '#fff' : 'var(--psp-gray-50, #f9fafb)',
                            borderBottom: idx < featuredGames.length - 1
                              ? '1px solid var(--psp-gray-200, #e5e7eb)'
                              : 'none',
                          }}
                        >
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'Barlow Condensed, sans-serif',
                            fontSize: 14,
                            fontWeight: 700,
                            color: 'var(--psp-navy, #0a1628)',
                            background: 'var(--psp-gray-100, #f3f4f6)',
                            flexShrink: 0,
                          }}>
                            {idx + 1}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                              <span style={{
                                fontFamily: 'Barlow Condensed, sans-serif',
                                fontSize: 15,
                                fontWeight: 700,
                                color: 'var(--psp-navy, #0a1628)',
                              }}>
                                {game.home}
                              </span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--psp-gray-400, #9ca3af)' }}>vs</span>
                              <span style={{
                                fontFamily: 'Barlow Condensed, sans-serif',
                                fontSize: 15,
                                fontWeight: 700,
                                color: 'var(--psp-navy, #0a1628)',
                              }}>
                                {game.away}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 3 }}>
                              <span style={{ fontSize: 11, color: sport.color, fontWeight: 600 }}>
                                {game.context}
                              </span>
                              {game.venue && (
                                <span style={{ fontSize: 11, color: 'var(--psp-gray-500, #6b7280)' }}>
                                  📍 {game.venue}
                                </span>
                              )}
                            </div>
                          </div>

                          <div style={{
                            padding: '6px 14px',
                            borderRadius: 8,
                            background: 'var(--psp-gray-100, #f3f4f6)',
                            color: 'var(--psp-gray-400, #9ca3af)',
                            fontSize: 11,
                            fontWeight: 600,
                            fontFamily: 'Barlow Condensed, sans-serif',
                            letterSpacing: 0.5,
                            textTransform: 'uppercase' as const,
                          }}>
                            Coming Soon
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* ──── PAST WINNERS TABLE ──── */}
          <div style={{ marginTop: 12 }}>
            <div className="hub-sec-head">
              <h3>Past Games of the Week</h3>
            </div>

            {allWinners.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 20px', background: 'var(--psp-gray-50, #f9fafb)', borderRadius: 8, border: '1px solid var(--psp-gray-200, #e5e7eb)' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🎯</div>
                <p style={{ fontSize: 13, color: 'var(--psp-gray-500, #6b7280)' }}>No past winners yet. Vote to help crown the first Game of the Week!</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Matchup', 'Score', 'Sport', 'Week', 'Votes'].map((h, i) => (
                        <th key={h} style={{
                          textAlign: i === 4 ? 'center' : 'left',
                          padding: '10px 14px',
                          background: 'var(--psp-navy, #0a1628)',
                          color: '#fff',
                          fontFamily: 'Barlow Condensed, sans-serif',
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: 0.5,
                          textTransform: 'uppercase',
                          borderRadius: i === 0 ? '6px 0 0 0' : i === 4 ? '0 6px 0 0' : undefined,
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allWinners.map((winner, idx) => {
                      const sportMeta = SPORT_META[winner.sport_id as keyof typeof SPORT_META];
                      return (
                        <tr key={winner.id} style={{ borderBottom: '1px solid var(--psp-gray-200, #e5e7eb)' }}>
                          <td style={{
                            padding: '10px 14px',
                            fontWeight: 700,
                            fontSize: 13,
                            color: 'var(--psp-navy, #0a1628)',
                            fontFamily: 'Barlow Condensed, sans-serif',
                            background: idx % 2 === 0 ? 'var(--psp-gray-50, #f9fafb)' : '#fff',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {idx === 0 && <span style={{ fontSize: 14 }}>👑</span>}
                              {winner.home_team} vs {winner.away_team}
                            </div>
                          </td>
                          <td style={{
                            padding: '10px 14px',
                            fontSize: 13,
                            fontWeight: 700,
                            fontFamily: 'Barlow Condensed, sans-serif',
                            color: 'var(--psp-navy, #0a1628)',
                            background: idx % 2 === 0 ? 'var(--psp-gray-50, #f9fafb)' : '#fff',
                          }}>
                            {winner.home_score !== null && winner.away_score !== null
                              ? `${winner.home_score}-${winner.away_score}`
                              : '—'
                            }
                          </td>
                          <td style={{
                            padding: '10px 14px',
                            fontSize: 12,
                            background: idx % 2 === 0 ? 'var(--psp-gray-50, #f9fafb)' : '#fff',
                          }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              background: sportMeta ? `${sportMeta.color}18` : '#f3f4f6',
                              color: sportMeta?.color || '#6b7280',
                              padding: '2px 8px',
                              borderRadius: 10,
                              fontSize: 11,
                              fontWeight: 600,
                            }}>
                              {sportMeta?.emoji} {sportMeta?.name || winner.sport_id}
                            </span>
                          </td>
                          <td style={{
                            padding: '10px 14px',
                            fontSize: 12,
                            color: 'var(--psp-gray-500, #6b7280)',
                            background: idx % 2 === 0 ? 'var(--psp-gray-50, #f9fafb)' : '#fff',
                          }}>
                            Week {winner.week}, {winner.year}
                          </td>
                          <td style={{
                            padding: '10px 14px',
                            textAlign: 'center',
                            fontWeight: 700,
                            fontSize: 14,
                            fontFamily: 'Barlow Condensed, sans-serif',
                            color: 'var(--psp-gold, #f0a500)',
                            background: idx % 2 === 0 ? 'var(--psp-gray-50, #f9fafb)' : '#fff',
                          }}>
                            {winner.vote_count}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <PSPPromo size="banner" variant={3} />
        </div>

        {/* ── RIGHT: SIDEBAR ── */}
        <aside className="hub-sidebar">
          {/* How It Works */}
          <div className="hub-widget">
            <div className="hub-wh" style={{ background: 'var(--psp-blue, #3b82f6)', color: '#fff' }}>How It Works</div>
            <div className="hub-wb">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { step: '1', text: 'PSP editors select the top matchups of the week across football, basketball, and baseball.' },
                  { step: '2', text: 'Cast your vote for the game you think is the biggest of the week — one vote per week.' },
                  { step: '3', text: 'The matchup with the most votes is crowned Game of the Week.' },
                  { step: '4', text: 'Winners are archived with final scores after the game is played.' },
                ].map((item) => (
                  <div key={item.step} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: 'var(--psp-blue, #3b82f6)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {item.step}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--psp-gray-600, #4b5563)', lineHeight: 1.4 }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* POTW Quick Vote */}
          <div className="hub-widget">
            <div className="hub-wh" style={{ background: 'var(--psp-gold, #f0a500)', color: 'var(--psp-navy, #0a1628)' }}>🗳️ Player of the Week</div>
            <div className="hub-wb" style={{ textAlign: 'center', padding: '14px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--psp-navy, #0a1628)' }}>
                Don&apos;t forget to vote for POTW too!
              </div>
              <Link href="/potw" style={{
                display: 'inline-block',
                padding: '6px 18px',
                background: 'var(--psp-gold, #f0a500)',
                color: 'var(--psp-navy, #0a1628)',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                textDecoration: 'none',
                fontFamily: 'Barlow Condensed, sans-serif',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}>
                Vote POTW →
              </Link>
            </div>
          </div>

          {/* Recent Winners Mini */}
          {allWinners.length > 0 && (
            <div className="hub-widget">
              <div className="hub-wh">Recent Winners</div>
              <div className="hub-wb" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {allWinners.slice(0, 5).map((winner) => {
                  const sportMeta = SPORT_META[winner.sport_id as keyof typeof SPORT_META];
                  return (
                    <div key={winner.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 0',
                      borderBottom: '1px solid var(--psp-gray-100, #f3f4f6)',
                    }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--psp-navy, #0a1628)', fontFamily: 'Barlow Condensed, sans-serif' }}>
                          {winner.home_team} vs {winner.away_team}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--psp-gray-500, #6b7280)' }}>
                          {winner.home_score !== null ? `${winner.home_score}-${winner.away_score}` : ''} · Wk {winner.week}
                        </div>
                      </div>
                      <span style={{ fontSize: 16 }}>{sportMeta?.emoji || '🏅'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="hub-widget">
            <div className="hub-wh">Quick Links</div>
            <div className="hub-wb">
              <Link href="/potw" className="hub-link" style={{ display: 'block', padding: '5px 0', fontSize: 12, color: 'var(--psp-blue, #3b82f6)', textDecoration: 'none' }}>→ Player of the Week</Link>
              <Link href="/events" className="hub-link" style={{ display: 'block', padding: '5px 0', fontSize: 12, color: 'var(--psp-blue, #3b82f6)', textDecoration: 'none' }}>→ Upcoming Events</Link>
              <Link href="/community" className="hub-link" style={{ display: 'block', padding: '5px 0', fontSize: 12, color: 'var(--psp-blue, #3b82f6)', textDecoration: 'none' }}>→ Community Hub</Link>
              <Link href="/football" className="hub-link" style={{ display: 'block', padding: '5px 0', fontSize: 12, color: 'var(--psp-blue, #3b82f6)', textDecoration: 'none' }}>→ Football Hub</Link>
              <Link href="/basketball" className="hub-link" style={{ display: 'block', padding: '5px 0', fontSize: 12, color: 'var(--psp-blue, #3b82f6)', textDecoration: 'none' }}>→ Basketball Hub</Link>
              <Link href="/baseball" className="hub-link" style={{ display: 'block', padding: '5px 0', fontSize: 12, color: 'var(--psp-blue, #3b82f6)', textDecoration: 'none' }}>→ Baseball Hub</Link>
            </div>
          </div>

          {/* Badge */}
          <div style={{
            background: 'var(--psp-navy, #0a1628)',
            borderRadius: 10,
            padding: '18px 16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🎯</div>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--psp-blue, #3b82f6)',
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}>
              Game of the Week
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
              Every vote shapes the conversation
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              For the community, by the community
            </div>
          </div>

          <PSPPromo size="sidebar" variant={5} />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
