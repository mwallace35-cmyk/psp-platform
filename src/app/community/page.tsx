import { createClient } from '@/lib/supabase/server';
import { getDatabaseStats } from '@/lib/data';
import Link from 'next/link';
import { SPORT_META, type SportId } from '@/lib/sports';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PSPPromo from '@/components/ads/PSPPromo';
import NewsletterSignup from '@/components/newsletter/NewsletterSignup';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Community — PhillySportsPack',
  description: 'The story of TedSilary.com, the legacy of Philly HS sports data, and how PhillySportsPack is carrying it forward. For the community, by the community.',
};

export default async function CommunityPage() {
  const supabase = await createClient();

  const [stats, winnersRes] = await Promise.all([
    getDatabaseStats(),
    supabase.from('potw_winners').select('*').order('created_at', { ascending: false }).limit(6),
  ]);

  const winners = winnersRes.data || [];

  // Pro athletes spotlight — verified from enrichment data
  const LEGENDS = [
    { name: 'Wilt Chamberlain', school: 'Overbrook HS', sport: 'basketball', accolade: 'NBA Hall of Fame', emoji: '🏀' },
    { name: 'Kobe Bryant', school: 'Lower Merion HS', sport: 'basketball', accolade: 'NBA Hall of Fame', emoji: '🏀' },
    { name: 'Mike Piazza', school: 'Phoenixville HS', sport: 'baseball', accolade: 'MLB Hall of Fame', emoji: '⚾' },
    { name: 'Reggie Jackson', school: 'Cheltenham HS', sport: 'baseball', accolade: 'MLB Hall of Fame', emoji: '⚾' },
    { name: 'Earl Monroe', school: 'Bartram HS', sport: 'basketball', accolade: 'NBA Hall of Fame', emoji: '🏀' },
    { name: 'Tom Gola', school: 'La Salle HS', sport: 'basketball', accolade: 'NBA Hall of Fame', emoji: '🏀' },
    { name: 'Marvin Harrison Jr.', school: 'St. Joseph\'s Prep', sport: 'football', accolade: 'NFL Star', emoji: '🏈' },
    { name: 'Kyle Lowry', school: 'Cardinal Dougherty', sport: 'basketball', accolade: 'NBA Champion', emoji: '🏀' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumb items={[{ label: 'Community' }]} />

      {/* ════════ HEADER BAR ════════ */}
      <div className="sport-hub-header" style={{ '--shh-color': 'var(--psp-gold, #f0a500)' } as React.CSSProperties}>
        <div className="shh-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 28 }}>🤝</span>
            <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
              PSP Community
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
            For the community, by the community. Preserving and building on 25 years of Philadelphia high school sports history.
          </p>
        </div>
      </div>

      {/* ════════ SUB-NAV ════════ */}
      <nav className="hub-subnav">
        <Link href="/community" style={{ color: 'var(--psp-gold)' }}>Community</Link>
        <Link href="/potw">Player of the Week</Link>
        <Link href="/events">Events</Link>
        <Link href="/articles">Articles</Link>
        <Link href="/signup">Join Us</Link>
      </nav>

      {/* ════════ MAIN 2-COL LAYOUT ════════ */}
      <div className="hub-body">
        <div className="hub-main">

          {/* ──── THE LEGACY OF TEDSILARY.COM ──── */}
          <div style={{ marginBottom: 32 }}>
            <div className="hub-sec-head">
              <h3>The Legacy of TedSilary.com</h3>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, var(--psp-navy, #0a1628) 0%, #0f2040 100%)',
              borderRadius: 10,
              padding: '28px 24px',
              color: '#fff',
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 28 }}>📜</span>
                <span style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'var(--psp-gold, #f0a500)',
                  letterSpacing: 0.5,
                }}>
                  Where It All Started
                </span>
              </div>

              <div style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
                <p style={{ marginBottom: 14 }}>
                  Before PhillySportsPack existed, there was <strong style={{ color: 'var(--psp-gold, #f0a500)' }}>TedSilary.com</strong> — a labor of love built by one man who cared deeply about Philadelphia high school sports.
                </p>
                <p style={{ marginBottom: 14 }}>
                  Ted Silary spent years compiling comprehensive statistics for <strong style={{ color: '#fff' }}>65+ Philadelphia-area high school programs</strong>. Working page by page in Microsoft FrontPage, he created over <strong style={{ color: '#fff' }}>7,000 hand-built HTML pages</strong> documenting everything: career rushing leaders, single-game records, city-wide records, perfect seasons, coaching records, all-city selections, and season-by-season stats for every school he could get his hands on.
                </p>
                <p style={{ marginBottom: 14 }}>
                  His data spans from the <strong style={{ color: '#fff' }}>early 1900s through 2020</strong> — more than a century of Philadelphia high school football, basketball, baseball, and beyond. He tracked it all: the Catholic League dynasties, the Public League powerhouses, the Inter-Ac traditions, the suburban contenders. Every stat, every champion, every record-breaker.
                </p>
                <p style={{ marginBottom: 14 }}>
                  Ted didn&apos;t do this for money or fame. He did it because these kids, these coaches, these schools <strong style={{ color: 'var(--psp-gold, #f0a500)' }}>deserved to have their stories told and their achievements remembered</strong>. He did it for the senior who broke a 40-year-old rushing record. For the coach who built a program from nothing. For the family that wanted to look up where dad played in 1985.
                </p>
                <p>
                  His work helped countless players, coaches, parents, and fans connect with the history of their schools and their sport. Many of the records and statistics on TedSilary.com existed nowhere else — if Ted hadn&apos;t collected them, they would have been lost forever.
                </p>
              </div>
            </div>

            {/* Continuing the Legacy */}
            <div style={{
              border: '2px solid var(--psp-gold, #f0a500)',
              borderRadius: 10,
              padding: '24px',
              background: 'rgba(240, 165, 0, 0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 24 }}>🔥</span>
                <span style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--psp-navy, #0a1628)',
                  letterSpacing: 0.5,
                }}>
                  Continuing the Legacy
                </span>
              </div>

              <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--psp-gray-700, #374151)' }}>
                <p style={{ marginBottom: 12 }}>
                  <strong>PhillySportsPack</strong> was built to make sure Ted Silary&apos;s work lives on — and grows. We took his original archive of 7,011 FrontPage pages and transformed it into a modern, searchable database covering <strong>7 sports, 25 seasons, and 1,800+ schools</strong>.
                </p>
                <p style={{ marginBottom: 12 }}>
                  But we&apos;re not just preserving the past. We&apos;re pushing Philadelphia high school sports forward — adding new data every season, tracking today&apos;s players, covering recruiting, and building tools that make it easy for anyone to explore the rich history of Philly sports.
                </p>
                <p>
                  This platform belongs to the community. If you played, coached, covered, or cheered for a Philly high school team — this is your site. Your corrections make the data better. Your votes crown the Player of the Week. Your stories keep the tradition alive. <strong style={{ color: 'var(--psp-navy, #0a1628)' }}>For the community, by the community.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* ──── BY THE NUMBERS ──── */}
          <div style={{ marginBottom: 32 }}>
            <div className="hub-sec-head">
              <h3>By The Numbers</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
              {[
                { value: '7,011', label: 'Archive Pages', sub: 'Original FrontPage files' },
                { value: '25', label: 'Years', sub: 'Of coverage (2000-2025)' },
                { value: (stats.schools || 1836).toLocaleString(), label: 'Schools', sub: 'Tracked in database' },
                { value: (stats.players || 48254).toLocaleString(), label: 'Players', sub: 'Individual records' },
                { value: '72', label: 'Pro Athletes', sub: 'NFL + NBA + MLB' },
                { value: '8', label: 'Hall of Famers', sub: 'From Philly schools' },
              ].map((stat) => (
                <div key={stat.label} style={{
                  background: 'var(--psp-navy, #0a1628)',
                  borderRadius: 8,
                  padding: '16px 12px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 26,
                    fontWeight: 700,
                    color: 'var(--psp-gold, #f0a500)',
                    lineHeight: 1,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#fff',
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                    marginTop: 4,
                  }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ──── PHILLY LEGENDS ──── */}
          <div style={{ marginBottom: 32 }}>
            <div className="hub-sec-head">
              <h3>Philly Legends</h3>
            </div>
            <p style={{ fontSize: 13, color: 'var(--psp-gray-500, #6b7280)', marginBottom: 14 }}>
              Hall of Famers and pro stars who came through Philadelphia high school sports — all documented in our archive.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
              {LEGENDS.map((legend) => {
                const sportMeta = SPORT_META[legend.sport as SportId];
                return (
                  <div key={legend.name} style={{
                    border: '1px solid var(--psp-gray-200, #e5e7eb)',
                    borderRadius: 8,
                    padding: '12px',
                    background: '#fff',
                    transition: 'box-shadow 0.15s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 18 }}>{legend.emoji}</span>
                      <span style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontSize: 14,
                        fontWeight: 700,
                        color: 'var(--psp-navy, #0a1628)',
                      }}>
                        {legend.name}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--psp-gray-500, #6b7280)' }}>
                      {legend.school}
                    </div>
                    <div style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: sportMeta?.color || '#f0a500',
                      marginTop: 4,
                    }}>
                      {legend.accolade}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ──── GET INVOLVED ──── */}
          <div style={{ marginBottom: 28 }}>
            <div className="hub-sec-head">
              <h3>Get Involved</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {[
                {
                  emoji: '🗳️',
                  title: 'Vote for POTW',
                  desc: 'Cast your weekly vote for the top performer across football, basketball, and baseball.',
                  href: '/potw',
                  color: '#f0a500',
                },
                {
                  emoji: '✏️',
                  title: 'Submit a Correction',
                  desc: 'See a stat that doesn\'t look right? Help us keep the data accurate — every correction matters.',
                  href: '/search',
                  color: '#3b82f6',
                },
                {
                  emoji: '💬',
                  title: 'Join the Conversation',
                  desc: 'Create an account to comment on articles, share memories, and connect with the community.',
                  href: '/signup',
                  color: '#16a34a',
                },
                {
                  emoji: '📰',
                  title: 'Read & Share',
                  desc: 'Stay up to date with the latest articles, recaps, and features on Philly HS sports.',
                  href: '/articles',
                  color: '#7c3aed',
                },
              ].map((card) => (
                <Link key={card.title} href={card.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    border: '1px solid var(--psp-gray-200, #e5e7eb)',
                    borderRadius: 10,
                    padding: '18px 16px',
                    background: '#fff',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                    height: '100%',
                    borderTop: `3px solid ${card.color}`,
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{card.emoji}</div>
                    <div style={{
                      fontFamily: 'Barlow Condensed, sans-serif',
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'var(--psp-navy, #0a1628)',
                      marginBottom: 6,
                    }}>
                      {card.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--psp-gray-600, #4b5563)', lineHeight: 1.5 }}>
                      {card.desc}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ──── POTW WINNERS ──── */}
          {winners.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div className="hub-sec-head">
                <h3>Player of the Week Winners</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                {winners.map((w: any, idx: number) => {
                  const sportMeta = w.sport_id ? SPORT_META[w.sport_id as SportId] : null;
                  return (
                    <div key={w.id} style={{
                      border: '1px solid var(--psp-gold, #f0a500)',
                      borderRadius: 8,
                      padding: '14px',
                      background: 'rgba(240, 165, 0, 0.04)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{
                          fontFamily: 'Barlow Condensed, sans-serif',
                          fontSize: 15,
                          fontWeight: 700,
                          color: 'var(--psp-navy, #0a1628)',
                        }}>
                          {idx === 0 && '👑 '}{w.player_name}
                        </span>
                        <span style={{ fontSize: 16 }}>{sportMeta?.emoji || '🏅'}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--psp-gray-500, #6b7280)' }}>{w.school_name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--psp-gray-400, #9ca3af)' }}>
                        <span>Week {w.week}, {w.year}</span>
                        <span style={{ fontWeight: 700, color: 'var(--psp-gold, #f0a500)' }}>{w.vote_count} votes</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ textAlign: 'center', marginTop: 14 }}>
                <Link href="/potw" style={{
                  display: 'inline-block',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  background: 'var(--psp-gold, #f0a500)',
                  color: 'var(--psp-navy, #0a1628)',
                  padding: '8px 24px',
                  borderRadius: 6,
                  textDecoration: 'none',
                }}>
                  Vote for This Week&apos;s POTW →
                </Link>
              </div>
            </div>
          )}

          <PSPPromo size="banner" variant={4} />
        </div>

        {/* ── RIGHT: SIDEBAR ── */}
        <aside className="hub-sidebar">
          {/* Newsletter */}
          <NewsletterSignup />

          {/* Explore the Data */}
          <div className="hub-widget">
            <div className="hub-wh" style={{ background: 'var(--psp-gold, #f0a500)', color: 'var(--psp-navy, #0a1628)' }}>
              Explore the Data
            </div>
            <div className="hub-wb" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { href: '/search', label: '🔍 Search Database' },
                { href: '/compare', label: '📊 Compare Players' },
                { href: '/football/leaderboards/rushing', label: '🏈 Football Leaders' },
                { href: '/basketball/leaderboards/scoring', label: '🏀 Basketball Leaders' },
                { href: '/football/championships', label: '🏆 Championships' },
                { href: '/glossary', label: '📖 Stats Glossary' },
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

          {/* POTW Quick Vote */}
          <div className="hub-widget">
            <div className="hub-wh">Player of the Week</div>
            <div className="hub-wb" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🗳️</div>
              <p style={{ fontSize: 13, color: 'var(--psp-gray-600, #4b5563)', marginBottom: 12 }}>
                Cast your weekly vote for the top performer in Philly HS sports.
              </p>
              <Link href="/potw" style={{
                display: 'inline-block',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                background: 'var(--psp-gold, #f0a500)',
                color: 'var(--psp-navy, #0a1628)',
                padding: '7px 18px',
                borderRadius: 6,
                textDecoration: 'none',
              }}>
                Vote Now →
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="hub-widget">
            <div className="hub-wh">Quick Links</div>
            <div className="hub-wb" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { href: '/events', label: '📅 Events Calendar' },
                { href: '/recruiting', label: '📋 Recruiting Board' },
                { href: '/our-guys', label: '🎓 Our Guys' },
                { href: '/articles', label: '📰 Latest Articles' },
                { href: '/signup', label: '👤 Create Account' },
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

          {/* Ted Silary Edition Badge */}
          <div style={{
            background: 'var(--psp-navy, #0a1628)',
            borderRadius: 10,
            padding: 20,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>📜</div>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--psp-gold, #f0a500)',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}>
              Ted Silary Edition
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
              Built on 7,011 original archive pages
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>
              For the community, by the community
            </div>
          </div>

          <PSPPromo size="sidebar" variant={2} />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
