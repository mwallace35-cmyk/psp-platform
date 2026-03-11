import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProAthleteBySlug, type ProAthleteDetail } from "@/lib/data";
import { parseProAthleteSlug } from "@/lib/slug-utils";
import { Breadcrumb } from "@/components/ui";
import AdPlaceholder from "@/components/ads/AdPlaceholder";
import ShareButtons from "@/components/social/ShareButtons";
import { PersonJsonLd } from "@/components/seo/JsonLd";
import { buildOgImageUrl } from "@/lib/og-utils";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageParams = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = parseProAthleteSlug(slug);

  if (!id) return {};

  const athlete = await getProAthleteBySlug(id.toString());
  if (!athlete) return {};

  const schoolName = athlete.schools?.name || "Philadelphia high school";
  const description = `${athlete.person_name} career stats and profile. ${athlete.schools?.name || ""} → ${athlete.college || athlete.pro_team || "Tracking"}. PhillySportsPack.com`;

  const ogImageUrl = buildOgImageUrl({
    title: athlete.person_name,
    subtitle: `${athlete.pro_league || athlete.college || "Pro Athlete"} — Next Level Profile`,
    sport: (athlete.sport_id || "football") as "football" | "basketball" | "baseball" | "track-field" | "lacrosse" | "wrestling" | "soccer",
    type: "player",
  });

  return {
    title: `${athlete.person_name} — ${schoolName} to ${athlete.pro_team || athlete.college || "Pro"} — PhillySportsPack`,
    description,
    alternates: {
      canonical: `https://phillysportspack.com/next-level/${slug}`,
    },
    openGraph: {
      title: `${athlete.person_name} — ${schoolName} to Pro — PhillySportsPack`,
      description,
      url: `https://phillysportspack.com/next-level/${slug}`,
      type: "profile",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${athlete.person_name} profile` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${athlete.person_name} — Next Level Profile`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ProAthleteProfilePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const id = parseProAthleteSlug(slug);

  if (!id) notFound();

  const athlete = await getProAthleteBySlug(id.toString());
  if (!athlete) notFound();

  // Calculate career totals if stats exist
  const footballTotals = athlete.football_stats && athlete.football_stats.length > 0 ? {
    rushYards: athlete.football_stats.reduce((sum: number, s: any) => sum + (s.rush_yards || 0), 0),
    rushTd: athlete.football_stats.reduce((sum: number, s: any) => sum + (s.rush_td || 0), 0),
    passYards: athlete.football_stats.reduce((sum: number, s: any) => sum + (s.pass_yards || 0), 0),
    passTd: athlete.football_stats.reduce((sum: number, s: any) => sum + (s.pass_td || 0), 0),
    recYards: athlete.football_stats.reduce((sum: number, s: any) => sum + (s.rec_yards || 0), 0),
    recTd: athlete.football_stats.reduce((sum: number, s: any) => sum + (s.rec_td || 0), 0),
  } : null;

  const basketballTotals = athlete.basketball_stats && athlete.basketball_stats.length > 0 ? {
    points: athlete.basketball_stats.reduce((sum: number, s: any) => sum + (s.points || 0), 0),
    rebounds: athlete.basketball_stats.reduce((sum: number, s: any) => sum + (s.rebounds || 0), 0),
    assists: athlete.basketball_stats.reduce((sum: number, s: any) => sum + (s.assists || 0), 0),
    games: athlete.basketball_stats.length,
  } : null;

  // Get sports emoji
  const sportEmojis: Record<string, string> = {
    football: "🏈",
    basketball: "🏀",
    baseball: "⚾",
    soccer: "⚽",
    lacrosse: "🥍",
  };
  const sportEmoji = sportEmojis[athlete.sport_id?.toLowerCase() || ""] || "🏆";

  // Get league badge color
  const leagueColors: Record<string, string> = {
    NFL: "#003da5",
    NBA: "#c4122e",
    MLB: "#002d72",
    WNBA: "#552583",
  };
  const leagueColor = athlete.pro_league ? leagueColors[athlete.pro_league] || "#0a1628" : "#0a1628";

  return (
    <div className="espn-container" style={{ flex: 1 }}>
      <PersonJsonLd
        name={athlete.person_name}
        url={`https://phillysportspack.com/next-level/${slug}`}
        school={athlete.schools?.name}
        college={athlete.college || undefined}
        proTeam={athlete.pro_team || undefined}
      />

      <main>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Next Level", href: "/next-level" },
            { label: athlete.person_name },
          ]}
        />

        {/* Hero Section */}
        <div className="sport-header" style={{ borderColor: leagueColor }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 40 }}>{sportEmoji}</span>
            <div>
              <h1 style={{ margin: "0 0 8px 0", fontSize: 40 }}>
                {athlete.person_name}
              </h1>
              {athlete.status && (
                <div
                  style={{
                    display: "inline-block",
                    background:
                      athlete.status === "active"
                        ? "rgba(34, 197, 94, 0.2)"
                        : "rgba(107, 114, 128, 0.2)",
                    color:
                      athlete.status === "active" ? "#22c55e" : "#9ca3af",
                    padding: "4px 12px",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".5px",
                  }}
                >
                  {athlete.status}
                </div>
              )}
            </div>
          </div>

          {/* Pro Info Bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 20,
              padding: "12px 0",
              borderTop: "1px solid rgba(255,255,255,.1)",
            }}
          >
            {/* Team */}
            <div>
              <div style={{ fontSize: 10, color: "var(--g300)", textTransform: "uppercase", marginBottom: 4 }}>
                Team
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                {athlete.pro_team || "—"}
              </div>
            </div>

            {/* League */}
            <div>
              <div style={{ fontSize: 10, color: "var(--g300)", textTransform: "uppercase", marginBottom: 4 }}>
                League
              </div>
              <div
                style={{
                  display: "inline-block",
                  background: leagueColor,
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {athlete.pro_league || "—"}
              </div>
            </div>

            {/* HS */}
            <div>
              <div style={{ fontSize: 10, color: "var(--g300)", textTransform: "uppercase", marginBottom: 4 }}>
                High School
              </div>
              {athlete.schools ? (
                <Link
                  href={`/football/schools/${athlete.schools.slug}`}
                  style={{
                    color: "var(--psp-gold)",
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  {athlete.schools.name}
                </Link>
              ) : (
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Unknown</div>
              )}
            </div>
          </div>
        </div>

        {/* Share Buttons */}
        <div
          style={{
            display: "flex",
            gap: 12,
            margin: "16px 0 24px 0",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: "var(--g400)", fontWeight: 600 }}>Share</span>
          <ShareButtons
            title={athlete.person_name}
            url={`https://phillysportspack.com/next-level/${slug}`}
          />
        </div>

        {/* Content Grid */}
        <div className="hero-container">
          {/* Left Column */}
          <div>
            {/* Bio Section */}
            {athlete.bio_note && (
              <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-head">Bio</div>
                <div className="card-body">
                  <div style={{ lineHeight: 1.6, color: "var(--text)", whiteSpace: "pre-wrap" }}>
                    {athlete.bio_note}
                  </div>
                </div>
              </div>
            )}

            {/* College Info */}
            {athlete.college && (
              <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-head">College</div>
                <div className="card-body">
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: "var(--g400)", textTransform: "uppercase", marginBottom: 4 }}>
                      School
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
                      {athlete.college}
                    </div>
                  </div>
                  {athlete.college_sport && (
                    <div>
                      <div style={{ fontSize: 11, color: "var(--g400)", textTransform: "uppercase", marginBottom: 4 }}>
                        Sport
                      </div>
                      <div style={{ fontSize: 14, color: "var(--text)" }}>
                        {athlete.college_sport}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Draft Info */}
            {athlete.draft_info && (
              <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-head">Draft Info</div>
                <div className="card-body">
                  <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>
                    {athlete.draft_info}
                  </div>
                </div>
              </div>
            )}

            {/* HS Career Stats */}
            {athlete.player && (
              <>
                {/* Football Stats */}
                {athlete.football_stats && athlete.football_stats.length > 0 && (
                  <div className="card" style={{ marginBottom: 24 }}>
                    <div className="card-head">High School Career Stats (Football)</div>
                    <div className="card-body">
                      {footballTotals && (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 12,
                            marginBottom: 16,
                            paddingBottom: 16,
                            borderBottom: "1px solid var(--g100)",
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 11, color: "var(--g400)", marginBottom: 4 }}>
                              Rush Yards
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--psp-gold)" }}>
                              {footballTotals.rushYards.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: "var(--g400)", marginBottom: 4 }}>
                              Pass Yards
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--psp-gold)" }}>
                              {footballTotals.passYards.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: "var(--g400)", marginBottom: 4 }}>
                              Rec Yards
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--psp-gold)" }}>
                              {footballTotals.recYards.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: "var(--g400)", marginBottom: 4 }}>
                              Total TDs
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--psp-gold)" }}>
                              {(footballTotals.rushTd + footballTotals.passTd + footballTotals.recTd)}
                            </div>
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          overflowX: "auto",
                        }}
                      >
                        <table style={{ width: "100%", fontSize: 12 }}>
                          <thead>
                            <tr style={{ borderBottom: "2px solid var(--g100)" }}>
                              <th style={{ padding: "8px 4px", textAlign: "left", fontWeight: 700 }}>
                                Season
                              </th>
                              <th style={{ padding: "8px 4px", textAlign: "right" }}>Rush Yds</th>
                              <th style={{ padding: "8px 4px", textAlign: "right" }}>Pass Yds</th>
                              <th style={{ padding: "8px 4px", textAlign: "right" }}>Rec Yds</th>
                              <th style={{ padding: "8px 4px", textAlign: "right" }}>TDs</th>
                            </tr>
                          </thead>
                          <tbody>
                            {athlete.football_stats.map((season: any, idx: number) => (
                              <tr
                                key={idx}
                                style={{
                                  borderBottom: "1px solid var(--g100)",
                                  background: idx % 2 === 0 ? "transparent" : "var(--g50)",
                                }}
                              >
                                <td style={{ padding: "8px 4px", fontWeight: 600 }}>
                                  {season.seasons?.label || "N/A"}
                                </td>
                                <td style={{ padding: "8px 4px", textAlign: "right" }}>
                                  {season.rush_yards || 0}
                                </td>
                                <td style={{ padding: "8px 4px", textAlign: "right" }}>
                                  {season.pass_yards || 0}
                                </td>
                                <td style={{ padding: "8px 4px", textAlign: "right" }}>
                                  {season.rec_yards || 0}
                                </td>
                                <td style={{ padding: "8px 4px", textAlign: "right", color: "var(--psp-gold)", fontWeight: 700 }}>
                                  {season.total_td || 0}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Link
                        href={`/football/players/${athlete.player?.slug}`}
                        style={{
                          display: "inline-block",
                          marginTop: 12,
                          color: "var(--psp-blue)",
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        View Full HS Profile →
                      </Link>
                    </div>
                  </div>
                )}

                {/* Basketball Stats */}
                {athlete.basketball_stats && athlete.basketball_stats.length > 0 && (
                  <div className="card" style={{ marginBottom: 24 }}>
                    <div className="card-head">High School Career Stats (Basketball)</div>
                    <div className="card-body">
                      {basketballTotals && (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: 12,
                            marginBottom: 16,
                            paddingBottom: 16,
                            borderBottom: "1px solid var(--g100)",
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 11, color: "var(--g400)", marginBottom: 4 }}>
                              Points
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--psp-gold)" }}>
                              {basketballTotals.points}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: "var(--g400)", marginBottom: 4 }}>
                              Rebounds
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--psp-gold)" }}>
                              {basketballTotals.rebounds}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: "var(--g400)", marginBottom: 4 }}>
                              Assists
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--psp-gold)" }}>
                              {basketballTotals.assists}
                            </div>
                          </div>
                        </div>
                      )}
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", fontSize: 12 }}>
                          <thead>
                            <tr style={{ borderBottom: "2px solid var(--g100)" }}>
                              <th style={{ padding: "8px 4px", textAlign: "left", fontWeight: 700 }}>
                                Season
                              </th>
                              <th style={{ padding: "8px 4px", textAlign: "right" }}>Points</th>
                              <th style={{ padding: "8px 4px", textAlign: "right" }}>Rebounds</th>
                              <th style={{ padding: "8px 4px", textAlign: "right" }}>Assists</th>
                            </tr>
                          </thead>
                          <tbody>
                            {athlete.basketball_stats.map((season: any, idx: number) => (
                              <tr
                                key={idx}
                                style={{
                                  borderBottom: "1px solid var(--g100)",
                                  background: idx % 2 === 0 ? "transparent" : "var(--g50)",
                                }}
                              >
                                <td style={{ padding: "8px 4px", fontWeight: 600 }}>
                                  {season.seasons?.label || "N/A"}
                                </td>
                                <td style={{ padding: "8px 4px", textAlign: "right" }}>
                                  {season.points || 0}
                                </td>
                                <td style={{ padding: "8px 4px", textAlign: "right" }}>
                                  {season.rebounds || 0}
                                </td>
                                <td style={{ padding: "8px 4px", textAlign: "right" }}>
                                  {season.assists || 0}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Link
                        href={`/basketball/players/${athlete.player?.slug}`}
                        style={{
                          display: "inline-block",
                          marginTop: 12,
                          color: "var(--psp-blue)",
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        View Full HS Profile →
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Awards */}
            {athlete.awards && athlete.awards.length > 0 && (
              <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-head">Awards & Honors</div>
                <div className="card-body">
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {athlete.awards.slice(0, 10).map((award: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          padding: "10px 12px",
                          background: "var(--g50)",
                          borderRadius: 4,
                          borderLeft: "4px solid var(--psp-gold)",
                        }}
                      >
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>
                          {award.award_type} {award.award_tier ? `(${award.award_tier})` : ""}
                        </div>
                        {award.award_year && (
                          <div style={{ fontSize: 11, color: "var(--g400)" }}>
                            {award.award_year}
                          </div>
                        )}
                        {award.description && (
                          <div style={{ fontSize: 11, color: "var(--text)", marginTop: 4 }}>
                            {award.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Related Articles */}
            {athlete.articles && athlete.articles.length > 0 && (
              <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-head">Featured Articles</div>
                <div className="card-body">
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {athlete.articles.slice(0, 5).map((article: any, idx: number) => (
                      <Link
                        key={idx}
                        href={`/articles/${article.slug}`}
                        style={{
                          padding: "12px",
                          background: "var(--g50)",
                          borderRadius: 4,
                          textDecoration: "none",
                          transition: ".15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "var(--g100)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "var(--g50)";
                        }}
                      >
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                          {article.title}
                        </div>
                        <div style={{ fontSize: 10, color: "var(--g400)" }}>
                          {article.published_at
                            ? new Date(article.published_at).toLocaleDateString()
                            : ""}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="sidebar">
            {/* External Links */}
            <div className="widget">
              <div className="w-head">External Profiles</div>
              <div className="w-body">
                {athlete.social_twitter && (
                  <a
                    href={`https://twitter.com/${athlete.social_twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-link"
                  >
                    𝕏 Twitter
                  </a>
                )}
                {athlete.social_instagram && (
                  <a
                    href={`https://instagram.com/${athlete.social_instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-link"
                  >
                    📷 Instagram
                  </a>
                )}
                {athlete.pro_league && (
                  <>
                    {athlete.pro_league === "NFL" && (
                      <a
                        href={`https://www.nfl.com/search?q=${encodeURIComponent(athlete.person_name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-link"
                      >
                        🏈 NFL.com
                      </a>
                    )}
                    {athlete.pro_league === "NBA" && (
                      <a
                        href={`https://www.nba.com/search/${encodeURIComponent(athlete.person_name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-link"
                      >
                        🏀 NBA.com
                      </a>
                    )}
                    {athlete.pro_league === "MLB" && (
                      <a
                        href={`https://www.mlb.com/search/${encodeURIComponent(athlete.person_name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-link"
                      >
                        ⚾ MLB.com
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* School Alumni */}
            {athlete.schools && (
              <div className="widget">
                <div className="w-head">School</div>
                <div className="w-body">
                  <Link
                    href={`/football/schools/${athlete.schools.slug}`}
                    className="w-link"
                  >
                    ↦ {athlete.schools.name}
                  </Link>
                  <div style={{ fontSize: 11, color: "var(--g400)", marginTop: 8 }}>
                    {athlete.schools.city}, {athlete.schools.state}
                  </div>
                </div>
              </div>
            )}

            {/* Draft Card */}
            {athlete.draft_info && (
              <div className="widget">
                <div className="w-head">Draft Info</div>
                <div className="w-body">
                  <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>
                    {athlete.draft_info}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="widget">
              <div className="w-head">Quick Links</div>
              <div className="w-body">
                <Link href="/next-level" className="w-link">
                  ↦ All Pro Athletes
                </Link>
                <Link href="/football" className="w-link">
                  ↦ Football
                </Link>
                <Link href="/basketball" className="w-link">
                  ↦ Basketball
                </Link>
                <Link href="/baseball" className="w-link">
                  ↦ Baseball
                </Link>
              </div>
            </div>

            {/* Ad Space */}
            <AdPlaceholder size="sidebar-rect" id={`psp-nextlevel-${athlete.id}`} />
          </aside>
        </div>
      </main>
    </div>
  );
}
