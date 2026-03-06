import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import { isValidSport, SPORT_META } from "@/lib/sports";
import {
  computeEloRatings,
  computeSchoolPowerIndex,
  computePythagoreanWins,
  type EloRating,
  type SchoolPowerIndex,
  type PythagoreanStats,
} from "@/lib/derived-stats";
import type { Metadata } from "next";

export const revalidate = 86400; // ISR: daily

type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport } = await params;
  if (!isValidSport(sport)) return {};
  return {
    title: `Analytics — ${SPORT_META[sport].name} — PhillySportsPack`,
    description: `Advanced analytics and power rankings for Philadelphia high school ${SPORT_META[sport].name.toLowerCase()}.`,
  };
}

// ============================================================================
// TABLE COMPONENTS
// ============================================================================

function EloRatingsTable({ data }: { data: EloRating[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No Elo data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "2px solid var(--psp-navy)" }}>
            <th className="text-left py-3 px-4 font-bold" style={{ color: "var(--psp-navy)" }}>
              Rank
            </th>
            <th className="text-left py-3 px-4 font-bold" style={{ color: "var(--psp-navy)" }}>
              School
            </th>
            <th className="text-center py-3 px-4 font-bold" style={{ color: "var(--psp-navy)" }}>
              Elo Rating
            </th>
            <th className="text-center py-3 px-4 font-bold" style={{ color: "var(--psp-navy)" }}>
              Record
            </th>
            <th className="text-center py-3 px-4 font-bold" style={{ color: "var(--psp-navy)" }}>
              Games
            </th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 25).map((school, idx) => (
            <tr key={school.schoolId} style={{ borderBottom: "1px solid var(--psp-gray-200)" }}>
              <td className="py-3 px-4 font-bold" style={{ color: "var(--psp-gold)" }}>
                #{idx + 1}
              </td>
              <td className="py-3 px-4">
                <Link href={`/${location.pathname.split("/")[1]}/schools/${school.schoolSlug}`} className="hover:underline" style={{ color: "var(--psp-navy)" }}>
                  {school.schoolName}
                </Link>
              </td>
              <td className="py-3 px-4 text-center font-mono font-bold text-lg" style={{ color: "var(--psp-blue)" }}>
                {school.elo}
              </td>
              <td className="py-3 px-4 text-center font-mono">
                {school.wins}-{school.losses}
                {school.ties ? `-${school.ties}` : ""}
              </td>
              <td className="py-3 px-4 text-center text-gray-600">{school.gamesPlayed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PowerIndexTable({ data }: { data: SchoolPowerIndex[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No power index data available</p>
      </div>
    );
  }

  const maxIndex = data[0]?.powerIndex || 1;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "2px solid var(--psp-navy)" }}>
            <th className="text-left py-3 px-4 font-bold" style={{ color: "var(--psp-navy)" }}>
              Rank
            </th>
            <th className="text-left py-3 px-4 font-bold" style={{ color: "var(--psp-navy)" }}>
              School
            </th>
            <th className="text-center py-3 px-4 font-bold" style={{ color: "var(--psp-navy)" }}>
              Power Index
            </th>
            <th className="text-center py-3 px-4 font-bold text-xs" style={{ color: "var(--psp-navy)" }}>
              Champs
            </th>
            <th className="text-center py-3 px-4 font-bold text-xs" style={{ color: "var(--psp-navy)" }}>
              W%
            </th>
            <th className="text-center py-3 px-4 font-bold text-xs" style={{ color: "var(--psp-navy)" }}>
              Recent
            </th>
            <th className="text-center py-3 px-4 font-bold text-xs" style={{ color: "var(--psp-navy)" }}>
              Pro
            </th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 25).map((school, idx) => {
            const barWidth = (school.powerIndex / maxIndex) * 100;
            return (
              <tr key={school.schoolId} style={{ borderBottom: "1px solid var(--psp-gray-200)" }}>
                <td className="py-3 px-4 font-bold" style={{ color: "var(--psp-gold)" }}>
                  #{idx + 1}
                </td>
                <td className="py-3 px-4">
                  <Link href={`/${location.pathname.split("/")[1]}/schools/${school.schoolSlug}`} className="hover:underline" style={{ color: "var(--psp-navy)" }}>
                    {school.schoolName}
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded h-6 overflow-hidden">
                      <div
                        className="h-full flex items-center justify-end pr-2 text-white font-bold text-xs transition-all"
                        style={{ width: `${barWidth}%`, background: "linear-gradient(90deg, var(--psp-blue) 0%, var(--psp-gold) 100%)" }}
                      >
                        {school.powerIndex > maxIndex * 0.3 && school.powerIndex}
                      </div>
                    </div>
                    {school.powerIndex <= maxIndex * 0.3 && <span className="font-bold text-sm">{school.powerIndex}</span>}
                  </div>
                </td>
                <td className="py-3 px-4 text-center text-sm font-medium" style={{ color: "var(--psp-navy)" }}>
                  {school.components.champPoints}
                </td>
                <td className="py-3 px-4 text-center text-sm font-medium" style={{ color: "var(--psp-navy)" }}>
                  {school.components.winPctScore}
                </td>
                <td className="py-3 px-4 text-center text-sm font-medium" style={{ color: "var(--psp-navy)" }}>
                  {Math.round(school.components.recentScore / 2)}
                </td>
                <td className="py-3 px-4 text-center text-sm font-medium" style={{ color: "var(--psp-blue)" }}>
                  {school.components.proAlumni}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PythagoreanTable({ data }: { data: PythagoreanStats[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No Pythagorean data available</p>
      </div>
    );
  }

  // Separate over/under-performing
  const overPerformers = data.filter((d) => d.luck > 0).slice(0, 15);
  const underPerformers = data.filter((d) => d.luck < 0).slice(0, 15);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-bold mb-4" style={{ color: "var(--psp-navy)" }}>
          🔥 Best Luck (Over-Performing)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "2px solid var(--psp-gold)" }}>
                <th className="text-left py-2 px-3 font-bold" style={{ color: "var(--psp-gold)" }}>
                  School
                </th>
                <th className="text-center py-2 px-3 font-bold text-xs" style={{ color: "var(--psp-gold)" }}>
                  Actual
                </th>
                <th className="text-center py-2 px-3 font-bold text-xs" style={{ color: "var(--psp-gold)" }}>
                  Expected
                </th>
                <th className="text-center py-2 px-3 font-bold text-xs" style={{ color: "var(--psp-gold)" }}>
                  Luck
                </th>
              </tr>
            </thead>
            <tbody>
              {overPerformers.map((school) => (
                <tr key={school.schoolId} style={{ borderBottom: "1px solid var(--psp-gray-200)" }}>
                  <td className="py-2 px-3">
                    <Link href={`/${location.pathname.split("/")[1]}/schools/${school.schoolSlug}`} className="hover:underline" style={{ color: "var(--psp-navy)" }}>
                      {school.schoolName}
                    </Link>
                  </td>
                  <td className="py-2 px-3 text-center font-mono text-sm">{school.actualWins}</td>
                  <td className="py-2 px-3 text-center font-mono text-sm">{school.expectedWins.toFixed(1)}</td>
                  <td className="py-2 px-3 text-center font-bold" style={{ color: "var(--psp-green)" }}>
                    +{school.luck.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4" style={{ color: "var(--psp-navy)" }}>
          ❄️ Worst Luck (Under-Performing)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "2px solid var(--psp-red)" }}>
                <th className="text-left py-2 px-3 font-bold" style={{ color: "var(--psp-red)" }}>
                  School
                </th>
                <th className="text-center py-2 px-3 font-bold text-xs" style={{ color: "var(--psp-red)" }}>
                  Actual
                </th>
                <th className="text-center py-2 px-3 font-bold text-xs" style={{ color: "var(--psp-red)" }}>
                  Expected
                </th>
                <th className="text-center py-2 px-3 font-bold text-xs" style={{ color: "var(--psp-red)" }}>
                  Luck
                </th>
              </tr>
            </thead>
            <tbody>
              {underPerformers.map((school) => (
                <tr key={school.schoolId} style={{ borderBottom: "1px solid var(--psp-gray-200)" }}>
                  <td className="py-2 px-3">
                    <Link href={`/${location.pathname.split("/")[1]}/schools/${school.schoolSlug}`} className="hover:underline" style={{ color: "var(--psp-navy)" }}>
                      {school.schoolName}
                    </Link>
                  </td>
                  <td className="py-2 px-3 text-center font-mono text-sm">{school.actualWins}</td>
                  <td className="py-2 px-3 text-center font-mono text-sm">{school.expectedWins.toFixed(1)}</td>
                  <td className="py-2 px-3 text-center font-bold" style={{ color: "var(--psp-red)" }}>
                    {school.luck.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default async function AnalyticsPage({ params }: { params: Promise<PageParams> }) {
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();

  const meta = SPORT_META[sport];

  // Fetch analytics data
  const [eloRatings, powerIndex, pythagorean] = await Promise.all([
    computeEloRatings(sport),
    computeSchoolPowerIndex(sport),
    computePythagoreanWins(sport),
  ]);

  return (
    <>
      {/* HERO SECTION */}
      <section className="py-10" style={{ background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: meta.name, href: `/${sport}` }, { label: "Analytics" }]} />
          <div className="flex items-center gap-3 mt-4">
            <span className="text-5xl">{meta.emoji}</span>
            <div>
              <h1 className="text-4xl md:text-5xl text-white tracking-wider" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                {meta.name} Analytics
              </h1>
              <p className="text-sm text-gray-300 mt-1">Advanced rankings & insights powered by machine learning</p>
            </div>
          </div>
        </div>
      </section>

      <PSPPromo size="banner" variant={1} />

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* ELO POWER RANKINGS */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}>
              ⚡ Elo Power Rankings
            </h2>
            <p className="text-sm text-gray-600">
              Strength ratings based on head-to-head game results. Higher ratings indicate stronger teams. K-factor adjusts for regular season (32) vs. playoff (48) games.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <EloRatingsTable data={eloRatings} />
          </div>
        </section>

        <PSPPromo size="banner" variant={3} />

        {/* SCHOOL POWER INDEX */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}>
              👑 School Power Index
            </h2>
            <p className="text-sm text-gray-600">
              Composite ranking combining championships (weighted 3x), all-time win percentage (2x), recent 5-year success (3x), and pro athlete pipeline. Scale: 0–1000.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <PowerIndexTable data={powerIndex} />
          </div>
        </section>

        <PSPPromo size="banner" variant={2} />

        {/* PYTHAGOREAN LUCK */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}>
              📊 Pythagorean Expectation
            </h2>
            <p className="text-sm text-gray-600">
              Expected wins based on points for/against using sport-specific exponents (Football: 2.37, Basketball: 13.91, Baseball: 1.83). Positive luck = overperforming; negative = underperforming.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <PythagoreanTable data={pythagorean} />
          </div>
        </section>

        {/* METHODOLOGY */}
        <section style={{ background: "var(--psp-gray-50)", padding: "24px", borderRadius: "8px" }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: "var(--psp-navy)" }}>
            📚 Methodology
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <strong style={{ color: "var(--psp-navy)" }}>Elo Ratings:</strong> Each school starts at 1500. Ratings adjust based on game outcomes and opponent strength. Uses
              K-factor of 32 for regular season and 48 for playoffs.
            </div>
            <div>
              <strong style={{ color: "var(--psp-navy)" }}>Power Index:</strong> Multi-factor composite score emphasizing recent success (50%), championships (30%), historical
              win percentage (15%), and pro pipeline (5%).
            </div>
            <div>
              <strong style={{ color: "var(--psp-navy)" }}>Pythagorean Expectation:</strong> Statistical model predicting wins from points scored. Luck = Actual Wins −
              Expected Wins. Positive values suggest strong execution; negative suggests poor luck or efficiency.
            </div>
          </div>
        </section>
      </div>

      <PSPPromo size="banner" variant={4} />
    </>
  );
}
