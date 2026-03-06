import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Footer from "@/components/layout/Footer";
import HeaderWithScores from "@/components/layout/HeaderWithScores";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import PSPPromo from "@/components/ads/PSPPromo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Corrections — PhillySportsPack",
  description: "Help us improve our database. Submit corrections to player stats, school records, and championships.",
};

async function getCorrectionStats() {
  try {
    const supabase = await createClient();
    const [submitted, reviewed, accepted] = await Promise.all([
      supabase.from("corrections").select("id", { count: "exact", head: true }),
      supabase.from("corrections").select("id", { count: "exact", head: true }).eq("status", "reviewed"),
      supabase.from("corrections").select("id", { count: "exact", head: true }).eq("status", "accepted"),
    ]);

    return {
      submitted: submitted.count ?? 0,
      reviewed: reviewed.count ?? 0,
      accepted: accepted.count ?? 0,
    };
  } catch {
    return { submitted: 0, reviewed: 0, accepted: 0 };
  }
}

async function getTopContributors() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("corrections")
      .select("submitter_name")
      .not("submitter_name", "is", null)
      .eq("status", "accepted")
      .limit(500);

    if (!data) return [];

    // Count contributions by submitter
    const counts = new Map<string, number>();
    for (const row of data) {
      if (row.submitter_name) {
        counts.set(row.submitter_name, (counts.get(row.submitter_name) ?? 0) + 1);
      }
    }

    // Sort and return top 5
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  } catch {
    return [];
  }
}

export default async function CorrectionsPage() {
  const stats = await getCorrectionStats();
  const topContributors = await getTopContributors();

  const correctionStats = [
    { label: "Submissions", value: stats.submitted },
    { label: "Under Review", value: stats.reviewed },
    { label: "Accepted", value: stats.accepted },
  ];

  const howItWorks = [
    {
      step: 1,
      icon: "🔍",
      title: "Find an Issue",
      description:
        "Browse player profiles, school records, or statistics. If you spot an error or missing data, you've found an opportunity to improve PSP.",
    },
    {
      step: 2,
      icon: "📝",
      title: "Submit a Correction",
      description:
        "Click the correction form on any player or school page. Include the correction, evidence (if possible), and let us know how you found the issue.",
    },
    {
      step: 3,
      icon: "✅",
      title: "Review & Accept",
      description:
        "Our team reviews your submission, verifies the data, and updates the database. Accepted corrections are credited to you.",
    },
  ];

  const faqs = [
    {
      q: "How can I submit a correction?",
      a: "Visit any player, school, or leaderboard page. Scroll to the bottom to find the 'Report a Correction' form. Fill in the details and submit.",
    },
    {
      q: "What kinds of corrections do you accept?",
      a: "We accept corrections for player names, school names, championships, playoff results, career statistics, and any other factual errors in our database.",
    },
    {
      q: "How long does it take to review corrections?",
      a: "Our team typically reviews submissions within 1-2 weeks. We'll notify you if your correction is accepted, rejected, or needs clarification.",
    },
    {
      q: "Do you credit contributors?",
      a: "Yes! Accepted corrections are credited to the submitter. Your name will appear in our top contributors section.",
    },
    {
      q: "Can I submit historical data?",
      a: "Absolutely! We're always looking to fill gaps in our coverage, especially for seasons before 2015. Submit historical stats with source documentation.",
    },
    {
      q: "Where do you get your data?",
      a: "Our database is built from MaxPreps, PIAA records, school archives, and newspaper archives. Corrections help us verify and enrich this data.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HeaderWithScores />

      <div className="espn-container" style={{ flex: 1 }}>
        <main>
          {/* ━━ HERO ━━ */}
          <section
            style={{
              background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)",
              color: "white",
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            <div className="max-w-7xl mx-auto">
              <Breadcrumb items={[{ label: "Corrections" }]} />

              <h1 style={{ fontSize: 48, fontWeight: 700, marginTop: 20, marginBottom: 12, fontFamily: "Bebas Neue, sans-serif", letterSpacing: 1 }}>
                Help Us Get It Right
              </h1>

              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.9)", maxWidth: 600, margin: "0 auto 30px", lineHeight: 1.6 }}>
                PhillySportsPack.com is built on community knowledge. Found an error? Missing data? Submit a correction and help us maintain the most
                accurate Philadelphia high school sports database.
              </p>

              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link
                  href="/football"
                  className="btn-primary"
                  style={{
                    background: "var(--psp-gold)",
                    color: "var(--psp-navy)",
                    padding: "12px 28px",
                    borderRadius: 6,
                    fontWeight: 700,
                    textDecoration: "none",
                    fontSize: 14,
                  }}
                >
                  Football Corrections
                </Link>
                <Link
                  href="/basketball"
                  className="btn-primary"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                    padding: "12px 28px",
                    borderRadius: 6,
                    fontWeight: 700,
                    textDecoration: "none",
                    fontSize: 14,
                  }}
                >
                  Basketball Corrections
                </Link>
              </div>
            </div>
          </section>

          {/* ━━ STATS ━━ */}
          <section style={{ padding: "40px 20px", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
            <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, marginBottom: 30, fontFamily: "Bebas Neue, sans-serif" }}>Community Impact</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 20,
              }}
            >
              {correctionStats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "white",
                    border: "2px solid var(--psp-navy)",
                    borderRadius: 8,
                    padding: 24,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 40, fontWeight: 700, color: "var(--psp-gold)", marginBottom: 8 }}>
                    {stat.value.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--psp-navy)", fontWeight: 600 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ━━ HOW IT WORKS ━━ */}
          <section style={{ padding: "40px 20px", background: "rgba(10, 22, 40, 0.05)", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 30, fontFamily: "Bebas Neue, sans-serif", textAlign: "center" }}>
              How It Works
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 30,
              }}
            >
              {howItWorks.map((item) => (
                <div
                  key={item.step}
                  style={{
                    background: "white",
                    borderRadius: 8,
                    padding: 24,
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      fontSize: 48,
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 60,
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--psp-navy)", marginBottom: 8, textAlign: "center" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, textAlign: "center" }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ━━ TOP CONTRIBUTORS ━━ */}
          {topContributors.length > 0 && (
            <section style={{ padding: "40px 20px", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
              <h2
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  marginBottom: 30,
                  fontFamily: "Bebas Neue, sans-serif",
                  textAlign: "center",
                }}
              >
                Top Contributors
              </h2>

              <div
                style={{
                  background: "white",
                  border: "2px solid var(--psp-navy)",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr style={{ background: "var(--psp-navy)", color: "white" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700 }}>Contributor</th>
                      <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>Corrections Accepted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topContributors.map((contrib, idx) => (
                      <tr
                        key={contrib.name}
                        style={{
                          borderTop: idx > 0 ? "1px solid #e5e7eb" : "none",
                          background: idx === 0 ? "rgba(240, 165, 0, 0.05)" : "white",
                        }}
                      >
                        <td style={{ padding: "12px 16px" }}>
                          {idx < 3 && <span style={{ marginRight: 8 }}>
                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                          </span>}
                          <strong>{contrib.name}</strong>
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, color: "var(--psp-gold)" }}>
                          {contrib.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <PSPPromo size="billboard" variant={2} />

          {/* ━━ CTA SECTION ━━ */}
          <section
            style={{
              background: "linear-gradient(135deg, var(--psp-gold) 0%, #d97706 100%)",
              color: "#000",
              padding: "40px 20px",
              textAlign: "center",
              maxWidth: 1280,
              margin: "0 auto",
              width: "100%",
              borderRadius: 8,
            }}
          >
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, fontFamily: "Bebas Neue, sans-serif" }}>
              Ready to Help?
            </h2>
            <p style={{ fontSize: 16, marginBottom: 24, opacity: 0.95, maxWidth: 600, margin: "0 auto 24px" }}>
              Start by exploring player profiles, school pages, or leaderboards. If you spot an issue, use the correction form to share your findings.
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/football/leaderboards/rushing"
                style={{
                  background: "white",
                  color: "var(--psp-gold)",
                  padding: "12px 28px",
                  borderRadius: 6,
                  fontWeight: 700,
                  textDecoration: "none",
                  fontSize: 14,
                }}
              >
                Football Leaders
              </Link>
              <Link
                href="/basketball/leaderboards/scoring"
                style={{
                  background: "rgba(0,0,0,0.2)",
                  color: "white",
                  padding: "12px 28px",
                  borderRadius: 6,
                  fontWeight: 700,
                  textDecoration: "none",
                  fontSize: 14,
                }}
              >
                Basketball Leaders
              </Link>
              <Link
                href="/schools"
                style={{
                  background: "rgba(0,0,0,0.2)",
                  color: "white",
                  padding: "12px 28px",
                  borderRadius: 6,
                  fontWeight: 700,
                  textDecoration: "none",
                  fontSize: 14,
                }}
              >
                Schools
              </Link>
            </div>
          </section>

          {/* ━━ FAQ ━━ */}
          <section style={{ padding: "40px 20px", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 30, fontFamily: "Bebas Neue, sans-serif", textAlign: "center" }}>
              Frequently Asked Questions
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 24,
              }}
            >
              {faqs.map((faq, idx) => (
                <div key={idx}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--psp-navy)", marginBottom: 8 }}>
                    {faq.q}
                  </h3>
                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <PSPPromo size="banner" variant={3} />
        </main>

        {/* ━━ SIDEBAR ━━ */}
        <aside className="sidebar">
          <div className="widget">
            <div className="w-head" style={{ background: "var(--psp-gold)", color: "#000" }}>
              📋 Quick Links
            </div>
            <div className="w-body">
              <Link href="/football" className="w-link">
                &#8594; Football Corrections
              </Link>
              <Link href="/basketball" className="w-link">
                &#8594; Basketball Corrections
              </Link>
              <Link href="/baseball" className="w-link">
                &#8594; Baseball Corrections
              </Link>
              <Link href="/lacrosse" className="w-link">
                &#8594; Lacrosse Corrections
              </Link>
              <Link href="/search" className="w-link">
                &#8594; Search Database
              </Link>
            </div>
          </div>

          <div className="widget">
            <div className="w-head">💡 Tips for Corrections</div>
            <div className="w-body" style={{ padding: "12px 14px", fontSize: 13, lineHeight: 1.6 }}>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li style={{ marginBottom: 8 }}>Include source information (newspaper, MaxPreps, official records)</li>
                <li style={{ marginBottom: 8 }}>Be specific about what&apos;s wrong</li>
                <li style={{ marginBottom: 8 }}>Provide correct data if you have it</li>
                <li>Check multiple sources to verify</li>
              </ul>
            </div>
          </div>

          <PSPPromo size="sidebar" variant={1} />
        </aside>
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
