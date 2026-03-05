import { createClient } from '@/lib/supabase/server';
import { generatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SPORT_META } from '@/lib/sports';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PSPPromo from '@/components/ads/PSPPromo';
import PotwVoteButton from '@/components/potw/PotwVoteButton';

export const metadata: Metadata = generatePageMetadata({ pageType: 'potw' });

export const revalidate = 60;

// Determine sport ordering based on current month (in-season sport first)
function getSportOrder(): Array<{ id: string; label: string; emoji: string; color: string; season: string }> {
  const month = new Date().getMonth(); // 0-indexed
  const sports = [
    { id: 'football', label: 'Football', emoji: '🏈', color: '#16a34a', season: 'Fall' },
    { id: 'basketball', label: 'Basketball', emoji: '🏀', color: '#ea580c', season: 'Winter' },
    { id: 'baseball', label: 'Baseball', emoji: '⚾', color: '#dc2626', season: 'Spring' },
  ];

  // Football: Aug-Nov (7-10), Basketball: Nov-Mar (10-2), Baseball: Mar-Jun (2-5)
  if (month >= 2 && month <= 5) {
    // Mar-Jun: Baseball first, then Basketball, then Football
    return [sports[2], sports[1], sports[0]];
  } else if (month >= 7 && month <= 10) {
    // Aug-Nov: Football first, then Basketball, then Baseball
    return [sports[0], sports[1], sports[2]];
  } else {
    // Nov-Feb: Basketball first, then Football, then Baseball
    return [sports[1], sports[0], sports[2]];
  }
}

export default async function PotwPage() {
  const supabase = await createClient();

  // Fetch current nominees (all sports)
  const { data: nominees } = await supabase
    .from('potw_nominees')
    .select('*')
    .order('vote_count', { ascending: false });

  // Fetch past winners (recent 20)
  const { data: winners } = await supabase
    .from('potw_winners')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  const sportOrder = getSportOrder();
  const allNominees = nominees || [];
  const allWinners = winners || [];

  // Group nominees by sport
  const nomineesBySport: Record<string, typeof allNominees> = {};
  for (const sport of sportOrder) {
    nomineesBySport[sport.id] = allNominees.filter(n => n.sport_id === sport.id);
  }

  // Total votes across all sports
  const totalVotes = allNominees.reduce((sum, n) => sum + (n.vote_count || 0), 0);

  // Active sport count (sports with nominees)
  const activeSports = sportOrder.filter(s => (nomineesBySport[s.id]?.length || 0) > 0).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumb items={[{ label: 'Player of the Week' }]} />

      {/* ════════ HEADER BAR ════════ */}
      <div className="sport-hub-header" style={{ '--shh-color': 'var(--psp-gold, #f0a500)' } as React.CSSProperties}>
        <div className="shh-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 28 }}>🏆</span>
            <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
              Player of the Week
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
            Vote for the top performers in Philadelphia high school sports — one vote per week.
          </p>
          {totalVotes > 0 && (
            <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: 20 }}>
                {totalVotes.toLocaleString()} total votes this week
              </span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: 20 }}>
                {activeSports} active polls
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ════════ SUB-NAV ════════ */}
      <nav className="hub-subnav">
        <Link href="/potw" style={{ color: 'var(--psp-gold)' }}>Current Voting</Link>
        <Link href="/community">Community</Link>
        <Link href="/articles">Latest News</Link>
        <Link href="/football/leaderboards/rushing">Leaderboards</Link>
      </nav>

      {/* ════════ MAIN 2-COL LAYOUT ════════ */}
      <div className="hub-body">
        <div className="hub-main">

          {/* ──── SPORT POLL SECTIONS ──── */}
          {sportOrder.map((sport) => {
            const sportNominees = nomineesBySport[sport.id] || [];
            const sportVotes = sportNominees.reduce((sum, n) => sum + (n.vote_count || 0), 0);
            const hasNominees = sportNominees.length > 0;

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

                {/* Nominees List */}
                <div style={{
                  border: '1px solid var(--psp-gray-200, #e5e7eb)',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  overflow: 'hidden',
                }}>
                  {!hasNominees ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '28px 20px',
                      background: 'var(--psp-gray-50, #f9fafb)',
                    }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>🗳️</div>
                      <p style={{ fontSize: 13, color: 'var(--psp-gray-500, #6b7280)', fontWeight: 500 }}>
                        No {sport.label.toLowerCase()} nominees this week
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--psp-gray-400, #9ca3af)', marginTop: 4 }}>
                        Check back soon for this week&apos;s candidates!
                      </p>
                    </div>
                  ) : (
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
                            padding: '14px 16px',
                            background: isLeading
                              ? 'rgba(240, 165, 0, 0.06)'
                              : idx % 2 === 0 ? '#fff' : 'var(--psp-gray-50, #f9fafb)',
                            borderBottom: idx < sportNominees.length - 1
                              ? '1px solid var(--psp-gray-200, #e5e7eb)'
                              : 'none',
                            transition: 'background 0.15s',
                          }}
                        >
                          {/* Rank */}
                          <div style={{
                            width: 32,
                            height: 32,
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

                          {/* Player Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                              <span style={{
                                fontFamily: 'Barlow Condensed, sans-serif',
                                fontSize: 15,
                                fontWeight: 700,
                                color: 'var(--psp-navy, #0a1628)',
                              }}>
                                {nominee.player_name}
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
                                  Leading
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--psp-gray-500, #6b7280)', marginTop: 1 }}>
                              {nominee.school_name}
                            </div>
                            {nominee.stat_line && (
                              <div style={{
                                fontSize: 11,
                                color: sport.color,
                                fontWeight: 600,
                                marginTop: 3,
                              }}>
                                📊 {nominee.stat_line}
                              </div>
                            )}
                          </div>

                          {/* Vote bar + count */}
                          <div style={{ width: 100, textAlign: 'right', flexShrink: 0 }}>
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
                            {/* Mini progress bar */}
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
                            <PotwVoteButton nomineeId={nominee.id} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}

          {/* ──── PAST WINNERS TABLE ──── */}
          <div style={{ marginTop: 12 }}>
            <div className="hub-sec-head">
              <h3>Past Winners</h3>
            </div>

            {allWinners.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 20px', background: 'var(--psp-gray-50, #f9fafb)', borderRadius: 8, border: '1px solid var(--psp-gray-200, #e5e7eb)' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🏆</div>
                <p style={{ fontSize: 13, color: 'var(--psp-gray-500, #6b7280)' }}>No past winners yet. Vote to help crown the first!</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Player', 'School', 'Sport', 'Week', 'Votes'].map((h, i) => (
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
                              {winner.player_name}
                            </div>
                          </td>
                          <td style={{
                            padding: '10px 14px',
                            fontSize: 12,
                            color: 'var(--psp-gray-600, #4b5563)',
                            background: idx % 2 === 0 ? 'var(--psp-gray-50, #f9fafb)' : '#fff',
                          }}>
                            {winner.school_name}
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
          {/* How Voting Works */}
          <div className="hub-widget">
            <div className="hub-wh" style={{ background: 'var(--psp-gold, #f0a500)', color: 'var(--psp-navy, #0a1628)' }}>How Voting Works</div>
            <div className="hub-wb">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { step: '1', text: 'Nominees are added weekly by PSP editors based on top performances.' },
                  { step: '2', text: 'Cast your vote — one per week across all sports.' },
                  { step: '3', text: 'The player with the most votes wins POTW honors.' },
                  { step: '4', text: 'Winners are archived and featured in our community section.' },
                ].map((item) => (
                  <div key={item.step} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: 'var(--psp-gold, #f0a500)',
                      color: 'var(--psp-navy, #0a1628)',
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

          {/* Recent Winners (sidebar mini) */}
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
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--psp-navy, #0a1628)', fontFamily: 'Barlow Condensed, sans-serif' }}>
                          {winner.player_name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--psp-gray-500, #6b7280)' }}>
                          {winner.school_name} · Wk {winner.week}
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
            <div className="hub-wb" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { href: '/community', label: '👥 Community Hub' },
                { href: '/football/leaderboards/rushing', label: '🏈 Football Leaders' },
                { href: '/basketball/leaderboards/scoring', label: '🏀 Basketball Leaders' },
                { href: '/search', label: '🔍 Search Database' },
                { href: '/compare', label: '📊 Compare Players' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: 13, color: 'var(--psp-navy)', textDecoration: 'none', padding: '4px 0', borderBottom: '1px solid var(--psp-gray-100)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* In-Season Badge */}
          <div style={{
            background: 'var(--psp-navy, #0a1628)',
            borderRadius: 10,
            padding: 20,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>
              {sportOrder[0].emoji}
            </div>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--psp-gold, #f0a500)',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}>
              {sportOrder[0].label} Season
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
              Currently in season — featured first
            </div>
          </div>

          <PSPPromo size="sidebar" variant={2} />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
