import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import type { Metadata } from "next";

export const revalidate = 86400;

type PageParams = { sport: string; slug: string };

async function getCoachBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("coaches")
      .select("*")
      .eq("slug", slug)
      .is("deleted_at", null)
      .single();
    return data;
  } catch {
    return null;
  }
}

async function getCoachingStints(coachId: number) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("coaching_stints")
      .select("*, schools(id, name, slug, city, state), sports(name, id)")
      .eq("coach_id", coachId)
      .order("start_year", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

async function getCoachChampionships(coachId: number) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("championships")
      .select("*, schools(name, slug), seasons(label)")
      .eq("coach_id", coachId)
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) return {};
  const coach = await getCoachBySlug(slug);
  if (!coach) return {};
  const meta = (SPORT_META as any)[sport];
  return {
    title: `${coach.name} — ${meta?.name || sport} Coach — PhillySportsPack`,
    description: `${coach.name} coaching career, record, championships, and school history in Philadelphia high school ${meta?.name || sport}.`,
  };
}

export default async function CoachProfilePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) notFound();

  const coach = await getCoachBySlug(slug);
  if (!coach) notFound();

  const meta = (SPORT_META as any)[sport];
  if (!meta) notFound();

  const [allStints, championships] = await Promise.all([
    getCoachingStints(coach.id),
    getCoachChampionships(coach.id),
  ]);

  // Filter stints by current sport for the main view, but show all for "Other Sports"
  const sportStints = allStints.filter(
    (st: any) => st.sport_id === sport || st.sports?.id === sport
  );
  const otherStints = allStints.filter(
    (st: any) => st.sport_id !== sport && st.sports?.id !== sport
  );

  const totalRecord = sportStints.reduce(
    (acc: { w: number; l: number; t: number; c: number }, st: any) => ({
      w: acc.w + (st.record_wins || 0),
      l: acc.l + (st.record_losses || 0),
      t: acc.t + (st.record_ties || 0),
      c: acc.c + (st.championships || 0),
    }),
    { w: 0, l: 0, t: 0, c: 0 }
  );
  const totalGames = totalRecord.w + totalRecord.l + totalRecord.t;
  const winPct =
    totalGames > 0 ? ((totalRecord.w / totalGames) * 100).toFixed(1) : null;

  // Current stint (no end_year, in this sport)
  const currentStint = sportStints.find((st: any) => !st.end_year);

  return (
    <>
      <Breadcrumb
        items={[
          { label: meta.name, href: `/${sport}` },
          { label: "Coaches", href: "/coaches" },
          { label: coach.name },
        ]}
      />

      {/* Hero Banner */}
      <div
        style={{
          background: `linear-gradient(135deg, var(--psp-navy) 0%, ${meta.color}44 100%)`,
          padding: "28px 20px",
          color: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          {/* Coach avatar placeholder */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: `${meta.color}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              border: "3px solid rgba(255,255,255,.2)",
              flexShrink: 0,
            }}
          >
            {meta.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 30,
                margin: 0,
                letterSpacing: 0.5,
              }}
            >
              {coach.name}
            </h1>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
              {meta.name} Coach
              {currentStint?.schools?.name && (
                <>
                  {" · "}
                  <Link
                    href={`/schools/${currentStint.schools.slug}`}
                    style={{ color: "var(--psp-gold)", textDecoration: "none" }}
                  >
                    {currentStint.schools.name}
                  </Link>
                </>
              )}
              {currentStint && (
                <span style={{ marginLeft: 8, color: "#4ade80", fontWeight: 600 }}>
                  Active
                </span>
              )}
            </div>
          </div>
          {/* Stat blocks */}
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  fontFamily: "'Barlow Condensed', sans-serif",
                }}
              >
                {totalGames > 0
                  ? `${totalRecord.w}-${totalRecord.l}${totalRecord.t > 0 ? `-${totalRecord.t}` : ""}`
                  : "—"}
              </div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Record</div>
            </div>
            {winPct && (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  {winPct}%
                </div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>Win %</div>
              </div>
            )}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  color: "var(--psp-gold)",
                }}
              >
                {totalRecord.c || "—"}
              </div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Championships</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  fontFamily: "'Barlow Condensed', sans-serif",
                }}
              >
                {sportStints.length}
              </div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Schools</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px" }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}
        >
          {/* MAIN */}
          <main>
            {/* Current Team Card */}
            {currentStint && (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(240, 165, 0, 0.08), transparent)",
                  border: "1px solid var(--psp-gold)",
                  borderRadius: 8,
                  padding: "16px 20px",
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "var(--psp-gold)",
                      marginBottom: 4,
                      letterSpacing: 1,
                    }}
                  >
                    Current Team
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 18,
                      fontFamily: "'Barlow Condensed', sans-serif",
                    }}
                  >
                    {currentStint.schools?.name}
                  </div>
                  <div
                    style={{ fontSize: 12, color: "var(--g400)", marginTop: 2 }}
                  >
                    {currentStint.role === "head_coach"
                      ? "Head Coach"
                      : currentStint.role || "Coach"}{" "}
                    · Since {currentStint.start_year}
                    {currentStint.schools?.city &&
                      ` · ${currentStint.schools.city}, ${currentStint.schools.state}`}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/schools/${currentStint.schools?.slug}/${sport}`}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      background: meta.color,
                      color: "#fff",
                      fontWeight: 600,
                      textDecoration: "none",
                      fontSize: 13,
                    }}
                  >
                    View Team Page
                  </Link>
                  <Link
                    href={`/schools/${currentStint.schools?.slug}`}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      background: "var(--g100)",
                      color: "var(--text)",
                      fontWeight: 600,
                      textDecoration: "none",
                      fontSize: 13,
                    }}
                  >
                    School Profile
                  </Link>
                </div>
              </div>
            )}

            {/* Coaching Timeline */}
            <div className="sec-head" style={{ marginBottom: 8 }}>
              <h2 style={{ margin: 0 }}>
                {meta.name} Coaching Timeline
              </h2>
            </div>

            {sportStints.length > 0 ? (
              <div
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--g100)",
                  borderRadius: 8,
                  overflow: "hidden",
                  marginBottom: 24,
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "var(--g50, rgba(0,0,0,0.03))",
                        borderBottom: "2px solid var(--g200)",
                      }}
                    >
                      <th
                        style={{
                          padding: "8px 12px",
                          textAlign: "left",
                          fontWeight: 600,
                        }}
                      >
                        School
                      </th>
                      <th
                        style={{
                          padding: "8px 12px",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        Years
                      </th>
                      <th
                        style={{
                          padding: "8px 12px",
                          textAlign: "left",
                          fontWeight: 600,
                        }}
                      >
                        Role
                      </th>
                      <th
                        style={{
                          padding: "8px 12px",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        Record
                      </th>
                      <th
                        style={{
                          padding: "8px 12px",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        Titles
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sportStints.map((stint: any, i: number) => {
                      const record = `${stint.record_wins || 0}-${stint.record_losses || 0}${stint.record_ties ? `-${stint.record_ties}` : ""}`;
                      const stintGames =
                        (stint.record_wins || 0) +
                        (stint.record_losses || 0) +
                        (stint.record_ties || 0);
                      return (
                        <tr
                          key={stint.id || i}
                          style={{
                            borderBottom: "1px solid var(--g100)",
                            background: !stint.end_year
                              ? "rgba(74, 222, 128, 0.05)"
                              : undefined,
                          }}
                        >
                          <td style={{ padding: "10px 12px" }}>
                            <Link
                              href={`/schools/${stint.schools?.slug}`}
                              style={{
                                color: "var(--psp-blue)",
                                textDecoration: "none",
                                fontWeight: 600,
                              }}
                            >
                              {stint.schools?.name || "—"}
                            </Link>
                            {!stint.end_year && (
                              <span
                                style={{
                                  marginLeft: 6,
                                  fontSize: 9,
                                  fontWeight: 700,
                                  color: "#4ade80",
                                  textTransform: "uppercase",
                                }}
                              >
                                Current
                              </span>
                            )}
                          </td>
                          <td
                            style={{
                              padding: "10px 12px",
                              textAlign: "center",
                              fontSize: 12,
                            }}
                          >
                            {stint.start_year}–{stint.end_year || "Present"}
                          </td>
                          <td
                            style={{
                              padding: "10px 12px",
                              fontSize: 12,
                              color: "var(--g500)",
                            }}
                          >
                            {stint.role === "head_coach"
                              ? "Head Coach"
                              : stint.role === "assistant"
                                ? "Assistant"
                                : stint.role || "—"}
                          </td>
                          <td
                            style={{
                              padding: "10px 12px",
                              textAlign: "center",
                              fontWeight: 600,
                            }}
                          >
                            {stintGames > 0 ? record : "—"}
                          </td>
                          <td
                            style={{
                              padding: "10px 12px",
                              textAlign: "center",
                              fontWeight: 700,
                              color:
                                stint.championships > 0
                                  ? "var(--psp-gold)"
                                  : "var(--g400)",
                            }}
                          >
                            {stint.championships > 0
                              ? `${stint.championships}`
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                style={{
                  padding: "24px",
                  textAlign: "center",
                  color: "var(--g400)",
                  background: "var(--card-bg)",
                  border: "1px solid var(--g100)",
                  borderRadius: 8,
                  marginBottom: 24,
                }}
              >
                No coaching records available for {meta.name}.
              </div>
            )}

            {/* Championships */}
            {championships.length > 0 && (
              <>
                <div className="sec-head" style={{ marginBottom: 8 }}>
                  <h2 style={{ margin: 0 }}>
                    Championships ({championships.length})
                  </h2>
                </div>
                <div style={{ display: "grid", gap: 8, marginBottom: 24 }}>
                  {championships.map((c: any, i: number) => (
                    <div
                      key={c.id || i}
                      style={{
                        padding: "12px 16px",
                        background:
                          "linear-gradient(135deg, rgba(240, 165, 0, 0.1), transparent)",
                        border: "1px solid var(--psp-gold)",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <span style={{ fontSize: 24 }}>🥇</span>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 14,
                            color: "var(--psp-gold)",
                          }}
                        >
                          {c.level} Championship
                        </div>
                        <div
                          style={{ fontSize: 12, color: "var(--g400)" }}
                        >
                          {c.seasons?.label}
                          {c.schools?.name && (
                            <>
                              {" · "}
                              <Link
                                href={`/schools/${c.schools.slug}`}
                                style={{
                                  color: "var(--psp-blue)",
                                  textDecoration: "none",
                                }}
                              >
                                {c.schools.name}
                              </Link>
                            </>
                          )}
                          {c.score && ` · ${c.score}`}
                          {c.opponent?.name && ` vs ${c.opponent.name}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Other Sports */}
            {otherStints.length > 0 && (
              <>
                <div className="sec-head" style={{ marginBottom: 8 }}>
                  <h2 style={{ margin: 0 }}>Other Sports</h2>
                </div>
                <div
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--g100)",
                    borderRadius: 8,
                    overflow: "hidden",
                    marginBottom: 24,
                  }}
                >
                  {otherStints.map((stint: any, i: number) => {
                    const sportName = stint.sports?.name || stint.sport_id;
                    const sportId = stint.sports?.id || stint.sport_id;
                    return (
                      <div
                        key={stint.id || i}
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid var(--g100)",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <span style={{ fontSize: 18 }}>
                          {(SPORT_META as any)[sportId]?.emoji || "🏅"}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>
                            {sportName} —{" "}
                            <Link
                              href={`/schools/${stint.schools?.slug}`}
                              style={{
                                color: "var(--psp-blue)",
                                textDecoration: "none",
                              }}
                            >
                              {stint.schools?.name}
                            </Link>
                          </div>
                          <div
                            style={{ fontSize: 11, color: "var(--g400)" }}
                          >
                            {stint.start_year}–{stint.end_year || "Present"}{" "}
                            ·{" "}
                            {stint.record_wins || stint.record_losses
                              ? `${stint.record_wins || 0}-${stint.record_losses || 0}`
                              : "No record"}
                          </div>
                        </div>
                        <Link
                          href={`/${sportId}/coaches/${slug}`}
                          style={{
                            fontSize: 12,
                            color: "var(--psp-blue)",
                            textDecoration: "none",
                          }}
                        >
                          View →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Bio */}
            {coach.bio && (
              <div
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--g100)",
                  borderRadius: 8,
                  padding: 20,
                  marginBottom: 24,
                }}
              >
                <h3
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "var(--g400)",
                    marginBottom: 8,
                    letterSpacing: 1,
                  }}
                >
                  About
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "var(--text)",
                    margin: 0,
                  }}
                >
                  {coach.bio}
                </p>
              </div>
            )}

            <PSPPromo size="banner" variant={1} />
          </main>

          {/* SIDEBAR */}
          <aside>
            {/* School Links */}
            {sportStints.length > 0 && (
              <div className="widget" style={{ marginBottom: 16 }}>
                <div className="w-head">Schools Coached</div>
                <div className="w-body">
                  {sportStints.map((stint: any, i: number) =>
                    stint.schools?.slug ? (
                      <div key={stint.id || i} style={{ marginBottom: 8 }}>
                        <Link
                          href={`/schools/${stint.schools.slug}`}
                          className="w-link"
                          style={{ fontWeight: 600 }}
                        >
                          {stint.schools.name}
                        </Link>
                        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                          <Link
                            href={`/schools/${stint.schools.slug}/${sport}`}
                            style={{
                              fontSize: 11,
                              color: meta.color,
                              textDecoration: "none",
                            }}
                          >
                            Team Page
                          </Link>
                          <span style={{ fontSize: 11, color: "var(--g300)" }}>
                            ·
                          </span>
                          <Link
                            href={`/schools/${stint.schools.slug}/${sport}/history`}
                            style={{
                              fontSize: 11,
                              color: "var(--g400)",
                              textDecoration: "none",
                            }}
                          >
                            History
                          </Link>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="widget" style={{ marginBottom: 16 }}>
              <div className="w-head">Quick Links</div>
              <div className="w-body">
                <Link href="/coaches" className="w-link">
                  → All Coaches
                </Link>
                <Link href={`/${sport}`} className="w-link">
                  → {meta.name} Hub
                </Link>
                <Link href={`/${sport}/championships`} className="w-link">
                  → {meta.name} Championships
                </Link>
                <Link href="/schools" className="w-link">
                  → All Schools
                </Link>
              </div>
            </div>

            <PSPPromo size="sidebar" variant={2} />
          </aside>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: coach.name,
            jobTitle: `${meta.name} Coach`,
            url: `https://phillysportspack.com/${sport}/coaches/${slug}`,
            ...(currentStint?.schools?.name && {
              worksFor: {
                "@type": "EducationalOrganization",
                name: currentStint.schools.name,
              },
            }),
          }),
        }}
      />
    </>
  );
}
