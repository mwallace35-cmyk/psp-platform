import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META, getTeamsWithRecords } from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import TeamsGroupToggle from "./TeamsGroupToggle";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport } = await params;
  if (!isValidSport(sport)) return {};
  const meta = SPORT_META[sport];
  return {
    title: `${meta.name} Teams — PhillySportsPack`,
    description: `All Philadelphia area ${meta.name.toLowerCase()} teams — browse by league, division, or PIAA classification.`,
  };
}

export default async function TeamsPage({ params }: { params: Promise<PageParams> }) {
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();

  const meta = SPORT_META[sport];
  const teams = await getTeamsWithRecords(sport);

  // Count unique leagues for header
  const leagueSet = new Set(teams.map((t: any) => t.league));

  return (
    <>
      {/* Header */}
      <Breadcrumb items={[{ label: meta.name, href: `/${sport}` }, { label: "Teams" }]} />

      <div
        style={{
          background: `linear-gradient(135deg, var(--psp-navy) 0%, #0f2040 60%, ${meta.color}22 100%)`,
          padding: "28px 20px",
          color: "#fff",
          borderBottom: "3px solid var(--psp-gold)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: `${meta.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
            {meta.emoji}
          </div>
          <div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, margin: 0, letterSpacing: 0.5 }}>
              {meta.name} Teams
            </h1>
            <p style={{ fontSize: 13, opacity: 0.6, margin: "4px 0 0" }}>
              {teams.length} teams across {leagueSet.size} leagues
            </p>
          </div>
        </div>
      </div>

      <PSPPromo size="banner" variant={1} />

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>
          {/* Main: Toggle + Teams */}
          <div>
            <TeamsGroupToggle teams={teams} sport={sport} sportEmoji={meta.emoji} />

            {teams.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{meta.emoji}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>No teams found</h3>
                <p style={{ fontSize: 13, color: "var(--g400)" }}>Team data for {meta.name.toLowerCase()} is being compiled.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside style={{ paddingTop: 48 }}>
            <div className="widget" style={{ marginBottom: 16 }}>
              <div className="w-head">{meta.emoji} {meta.name} Database</div>
              <div className="w-body" style={{ padding: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ background: "var(--g50)", borderRadius: 6, padding: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{teams.length}</div>
                    <div style={{ fontSize: 10, color: "var(--g400)", textTransform: "uppercase" }}>Teams</div>
                  </div>
                  <div style={{ background: "var(--g50)", borderRadius: 6, padding: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{leagueSet.size}</div>
                    <div style={{ fontSize: 10, color: "var(--g400)", textTransform: "uppercase" }}>Leagues</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="widget" style={{ marginBottom: 16 }}>
              <div className="w-head">Quick Links</div>
              <div className="w-body">
                <Link href={`/${sport}/leaderboards/${sport === "football" ? "rushing" : "scoring"}`} className="w-link">Leaderboards</Link>
                <Link href={`/${sport}/championships`} className="w-link">Championships</Link>
                <Link href={`/${sport}/records`} className="w-link">Records</Link>
                <Link href={`/${sport}`} className="w-link">← {meta.name} Hub</Link>
              </div>
            </div>

            <PSPPromo size="sidebar" variant={2} />
          </aside>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${meta.name} Teams`,
            url: `https://phillysportspack.com/${sport}/teams`,
            description: `Philadelphia area ${meta.name.toLowerCase()} teams directory`,
            numberOfItems: teams.length,
          }),
        }}
      />
    </>
  );
}
