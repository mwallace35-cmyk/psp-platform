import type { Metadata } from 'next';
import Link from 'next/link';
import { getFootballLeaders, getBasketballLeaders } from '@/lib/data';
import {
  LeaderRow,
  LeaderBoardCard,
  ClassYearStrip,
  EmptyBoard,
} from '@/components/leaderboards';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Leaderboards | Philadelphia High School Sports Stats',
  description:
    'Top statistical leaders across all Philadelphia high school sports – football, basketball, baseball, soccer, lacrosse, track & field, and wrestling.',
  alternates: { canonical: 'https://phillysportspack.com/leaderboards' },
  openGraph: {
    title: 'Leaderboards | PhillySportsPack.com',
    description: 'Top statistical leaders across all Philadelphia high school sports.',
    images: [{ url: 'https://www.phillysportspack.com/opengraph-image', width: 1200, height: 630 }],
  },
};

interface SportConfig {
  name: string;
  slug: string;
  color: string;
  inSeason: boolean;
  href: string;
}

const SPORTS: SportConfig[] = [
  { name: 'Baseball',      slug: 'baseball',    color: 'var(--base)',   inSeason: true,  href: '/baseball/leaderboards' },
  { name: 'Soccer',        slug: 'soccer',      color: 'var(--soccer)', inSeason: false, href: '/soccer/leaderboards' },
  { name: 'Lacrosse',      slug: 'lacrosse',    color: 'var(--lac)',    inSeason: true,  href: '/lacrosse/leaderboards' },
  { name: 'Track & Field', slug: 'track-field', color: 'var(--track)',  inSeason: true,  href: '/track-field/leaderboards' },
  { name: 'Wrestling',     slug: 'wrestling',   color: 'var(--wrest)',  inSeason: false, href: '/wrestling/leaderboards' },
];

interface LeaderRowData {
  players?: {
    name?: string | null;
    slug?: string | null;
    schools?: { name?: string | null; slug?: string | null } | null;
  } | null;
  schools?: { name?: string | null; slug?: string | null } | null;
  rush_yards?: number | null;
  ppg?: number | string | null;
}

function playerName(row: LeaderRowData): string {
  return row.players?.name ?? 'Unknown';
}
function schoolName(row: LeaderRowData): string {
  return row.players?.schools?.name ?? row.schools?.name ?? '—';
}

export default async function LeaderboardsPage() {
  const [fbRaw, bbRaw] = await Promise.all([
    (getFootballLeaders('rushing', 5) as Promise<unknown[]>).catch(() => [] as unknown[]),
    (getBasketballLeaders('ppg', 5) as Promise<unknown[]>).catch(() => [] as unknown[]),
  ]);

  const fbRows = (fbRaw as LeaderRowData[]).slice(0, 5);
  const bbRows = (bbRaw as LeaderRowData[]).slice(0, 5);

  return (
    <div className="bg-[var(--psp-navy)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        {/* Page Head */}
        <header className="mb-2 pb-2">
          <p className="text-[11px] uppercase tracking-widest psp-cream-muted mb-3">
            <Link href="/" className="text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)] transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>Leaderboards</span>
          </p>
          <h1 className="psp-h1 psp-cream mb-3">
            The <em className="not-italic" style={{ color: 'var(--psp-gold)', fontStyle: 'italic', fontVariationSettings: "'SOFT' 60, 'WONK' 1" }}>Stat Board.</em>
          </h1>
          <p className="psp-cream-muted text-base max-w-[60ch] leading-relaxed">
            Top statistical leaders across all Philadelphia high school sports. Class-year filters, sport tabs, ranked, sourced, and updated within the hour.
          </p>
        </header>

        <ClassYearStrip activeYear="all" />

        {/* Boards grid */}
        <section className="grid gap-6 md:gap-10 md:grid-cols-2 mt-8 mb-10">
          {/* Football */}
          <LeaderBoardCard
            sport="football"
            sportName="Football"
            sportColor="var(--fb)"
            statLabel="Rush Yards Leaders"
            isLive={fbRows.length > 0}
            freshnessLabel={fbRows.length > 0 ? 'Top 5 by season total · Updated hourly' : undefined}
            href="/football/leaderboards"
          >
            {fbRows.length > 0 ? (
              fbRows.map((row, i) => (
                <LeaderRow
                  key={i}
                  rank={i + 1}
                  playerName={playerName(row)}
                  schoolName={schoolName(row)}
                  statValue={row.rush_yards != null ? Number(row.rush_yards).toLocaleString() : '—'}
                  statUnit="yards"
                  sportColor="var(--fb)"
                />
              ))
            ) : (
              <EmptyBoard reason="Football season ended. Final stats are archived." />
            )}
          </LeaderBoardCard>

          {/* Basketball */}
          <LeaderBoardCard
            sport="basketball"
            sportName="Basketball"
            sportColor="var(--bb)"
            statLabel="PPG Leaders"
            isLive={bbRows.length > 0}
            freshnessLabel={bbRows.length > 0 ? 'Season averages · Updated hourly' : undefined}
            href="/basketball/leaderboards"
          >
            {bbRows.length > 0 ? (
              bbRows.map((row, i) => (
                <LeaderRow
                  key={i}
                  rank={i + 1}
                  playerName={playerName(row)}
                  schoolName={schoolName(row)}
                  statValue={row.ppg != null ? String(row.ppg) : '—'}
                  statUnit="ppg"
                  sportColor="var(--bb)"
                />
              ))
            ) : (
              <EmptyBoard reason="Basketball season ended. Final stats are archived." />
            )}
          </LeaderBoardCard>

          {/* Other sports — empty boards with honest off-season state */}
          {SPORTS.map((sport) => (
            <LeaderBoardCard
              key={sport.slug}
              sport={sport.slug}
              sportName={sport.name}
              sportColor={sport.color}
              statLabel={sport.inSeason ? 'In Season' : 'Off Season'}
              href={sport.href}
            >
              <EmptyBoard
                reason={
                  sport.inSeason
                    ? `${sport.name} stats are reporting now — full leaderboards open at the link below.`
                    : `${sport.name} season is out of session. Last season's archive is available below.`
                }
              />
            </LeaderBoardCard>
          ))}
        </section>

        {/* All-Time Records callout */}
        <div className="bg-[var(--psp-cream)] text-[var(--psp-navy)] rounded-xl p-6 sm:p-8 grid sm:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <p className="text-[11px] uppercase tracking-widest font-bold opacity-60 mb-2">
              All-Time Records
            </p>
            <h3 className="psp-h3 mb-2 text-[var(--psp-navy)]">
              The city&apos;s greatest single-game and career performances.
            </h3>
            <p className="text-sm leading-relaxed text-[rgba(10,22,40,0.72)] max-w-[52ch]">
              From Wilt&apos;s 90-point nights to Leroy Kelly&apos;s rushing marks — the PSP all-time board tracks every recorded statistical peak in Philadelphia high school history.
            </p>
          </div>
          <Link
            href="/records-explorer"
            className="inline-block text-[11px] font-extrabold uppercase tracking-widest border-2 border-[var(--psp-navy)] px-6 py-3 hover:bg-[var(--psp-navy)] hover:text-[var(--psp-cream)] transition-colors whitespace-nowrap"
          >
            Browse Records →
          </Link>
        </div>
      </div>
    </div>
  );
}
