import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SPORT_META, isValidSport } from "@/lib/sports";
import { createStaticClient } from "@/lib/supabase/static";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SportIcon from "@/components/ui/SportIcon";
import { getPowerIndexRankings, getTopMovers, PowerIndexEntry } from "@/lib/data/power-index";

export const revalidate = 3600; // 1 hour
interface PageProps {
  params: Promise<{ sport: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { sport } = await params;

  if (!isValidSport(sport)) {
    return { title: "Not Found" };
  }

  const sportName = SPORT_META[sport as keyof typeof SPORT_META]?.name || sport;

  return {
    title: `PSP Power Index | ${sportName} | PhillySportsPack`,
    description: `Comprehensive power rankings for Philadelphia high school ${sportName} based on championships, win percentage, recruiting, and pro athletes.`,
    alternates: { canonical: `https://phillysportspack.com/${sport}/power-index` },
    openGraph: {
      title: `PSP Power Index | ${sportName}`,
      description: `Comprehensive power rankings for Philadelphia high school ${sportName}.`,
      url: `https://phillysportspack.com/${sport}/power-index`,
    },
  };
}

// export async function generateStaticParams() {
//   const supabase = createStaticClient();
//   const { data: seasons } = await supabase
//     .from("seasons")
//     .select("label")
//     .order("year_start", { ascending: false })
//     .limit(1);
// 
//   return [
//     { sport: "football" },
//     { sport: "basketball" },
//     { sport: "baseball" },
//     { sport: "track-field" },
//     { sport: "lacrosse" },
//     { sport: "wrestling" },
//     { sport: "soccer" },
//   ];
// }

export default async function PowerIndexPage({ params }: PageProps) {
  const { sport } = await params;

  if (!isValidSport(sport)) {
    notFound();
  }

  const sportData = SPORT_META[sport as keyof typeof SPORT_META];

  // Fetch rankings and movers in parallel
  const [rankings, topMovers] = (await Promise.all([
    getPowerIndexRankings(sport),
    getTopMovers(sport),
  ])) as any;

  const risers = topMovers
    .filter((m: any) => (m.rank ?? 999) < (m.previous_rank ?? 0))
    .slice(0, 5);

  const fallers = topMovers
    .filter((m: any) => (m.rank ?? 999) > (m.previous_rank ?? 0))
    .slice(0, 5);

  return (
    <main id="main-content" className="flex-1">
      <Breadcrumb
        items={[
          { label: sportData?.name || sport, href: `/${sport}` },
          { label: "Power Index", href: `/${sport}/power-index` },
        ]}
      />

      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--psp-navy) 0%, #1a3a52 100%)",
          padding: "2rem 1rem 1.5rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontFamily: "var(--font-bebas)",
            marginBottom: "0.5rem",
            color: "white",
          }}
        >
          {sportData?.emoji} PSP POWER INDEX
        </h1>
        <p style={{ fontSize: "1rem", color: "#ccc", marginBottom: "1.5rem" }}>
          {sportData?.name || sport} Rankings
        </p>

        {/* Methodology */}
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            background: "rgba(240, 165, 0, 0.1)",
            border: "1px solid var(--psp-gold)",
            borderRadius: "8px",
            padding: "1rem",
            fontSize: "0.85rem",
            color: "#ddd",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "var(--psp-gold)" }}>How It Works:</strong>{" "}
          Schools are ranked on a composite score based on championships,
          win percentage, pro athlete pipeline, recruiting pipeline, and
          strength of schedule.
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1.5rem 1rem 2rem",
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "2rem",
        }}
      >
        {/* Main Rankings Table */}
        <div>
          {rankings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
              <p>No power index data available for this sport yet.</p>
            </div>
          ) : (
            <div
              style={{
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  overflowX: "auto",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.9rem",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "var(--psp-navy)",
                        borderBottom: "2px solid var(--psp-gold)",
                      }}
                    >
                      <th
                        style={{
                          padding: "0.75rem",
                          textAlign: "left",
                          color: "var(--psp-gold)",
                          fontWeight: 700,
                        }}
                      >
                        Rank
                      </th>
                      <th
                        style={{
                          padding: "0.75rem",
                          textAlign: "left",
                          color: "var(--psp-gold)",
                          fontWeight: 700,
                        }}
                      >
                        School
                      </th>
                      <th
                        style={{
                          padding: "0.75rem",
                          textAlign: "right",
                          color: "var(--psp-gold)",
                          fontWeight: 700,
                        }}
                      >
                        Score
                      </th>
                      <th
                        style={{
                          padding: "0.75rem",
                          textAlign: "center",
                          color: "var(--psp-gold)",
                          fontWeight: 700,
                        }}
                      >
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((entry: any, idx: number) => {
                      const isTop3 = (entry.rank ?? 0) <= 3;
                      const medal =
                        entry.rank === 1
                          ? "🥇"
                          : entry.rank === 2
                          ? "🥈"
                          : entry.rank === 3
                          ? "🥉"
                          : "";

                      const trendIcon =
                        !entry.previous_rank || entry.rank === entry.previous_rank
                          ? "→"
                          : (entry.rank ?? 0) < (entry.previous_rank ?? 0)
                          ? "↑"
                          : "↓";

                      const trendColor =
                        trendIcon === "↑"
                          ? "#4ade80"
                          : trendIcon === "↓"
                          ? "#f87171"
                          : "#999";

                      return (
                        <tr
                          key={entry.id}
                          style={{
                            background:
                              isTop3
                                ? "rgba(240, 165, 0, 0.05)"
                                : idx % 2 === 0
                                ? "#0f0f0f"
                                : "#1a1a1a",
                            borderBottom: "1px solid #333",
                            transition: "background 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as any).style.background =
                              isTop3
                                ? "rgba(240, 165, 0, 0.1)"
                                : "rgba(255, 255, 255, 0.05)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as any).style.background =
                              isTop3
                                ? "rgba(240, 165, 0, 0.05)"
                                : idx % 2 === 0
                                ? "#0f0f0f"
                                : "#1a1a1a";
                          }}
                        >
                          <td
                            style={{
                              padding: "0.75rem",
                              fontWeight: 700,
                              color: isTop3 ? "var(--psp-gold)" : "#ccc",
                              fontSize: isTop3 ? "1.2rem" : "1rem",
                            }}
                          >
                            {medal || entry.rank}
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <Link
                              href={`/${sport}/schools/${entry.schools?.slug}`}
                              style={{
                                color: "var(--psp-blue)",
                                textDecoration: "none",
                                fontWeight: 600,
                              }}
                            >
                              {entry.schools?.name || "Unknown"}
                            </Link>
                          </td>
                          <td
                            style={{
                              padding: "0.75rem",
                              textAlign: "right",
                              color: "var(--psp-gold)",
                              fontWeight: 700,
                            }}
                          >
                            {entry.overall_score.toFixed(1)}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem",
                              textAlign: "center",
                              color: trendColor,
                              fontWeight: 700,
                            }}
                          >
                            {trendIcon}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {/* Biggest Risers */}
          {risers.length > 0 && (
            <div
              style={{
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "1rem",
              }}
            >
              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "var(--psp-gold)",
                  marginBottom: "0.75rem",
                  paddingBottom: "0.5rem",
                  borderBottom: "2px solid #333",
                }}
              >
                📈 Biggest Risers
              </h3>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {risers.map((m: any) => (
                  <Link
                    key={m.id}
                    href={`/${sport}/schools/${m.schools?.slug}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.5rem",
                      borderRadius: "6px",
                      background: "rgba(74, 222, 128, 0.1)",
                      border: "1px solid rgba(74, 222, 128, 0.2)",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as any).style.background =
                        "rgba(74, 222, 128, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as any).style.background =
                        "rgba(74, 222, 128, 0.1)";
                    }}
                  >
                    <span style={{ color: "#ccc", fontSize: "0.85rem" }}>
                      {m.schools?.name}
                    </span>
                    <span
                      style={{
                        color: "#4ade80",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                      }}
                    >
                      ↑ {(m.previous_rank ?? 0) - (m.rank ?? 0)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Biggest Fallers */}
          {fallers.length > 0 && (
            <div
              style={{
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "1rem",
              }}
            >
              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "var(--psp-gold)",
                  marginBottom: "0.75rem",
                  paddingBottom: "0.5rem",
                  borderBottom: "2px solid #333",
                }}
              >
                📉 Biggest Fallers
              </h3>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {fallers.map((m: any) => (
                  <Link
                    key={m.id}
                    href={`/${sport}/schools/${m.schools?.slug}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.5rem",
                      borderRadius: "6px",
                      background: "rgba(248, 113, 113, 0.1)",
                      border: "1px solid rgba(248, 113, 113, 0.2)",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as any).style.background =
                        "rgba(248, 113, 113, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as any).style.background =
                        "rgba(248, 113, 113, 0.1)";
                    }}
                  >
                    <span style={{ color: "#ccc", fontSize: "0.85rem" }}>
                      {m.schools?.name}
                    </span>
                    <span
                      style={{
                        color: "#f87171",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                      }}
                    >
                      ↓ {(m.rank ?? 0) - (m.previous_rank ?? 0)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* About */}
          <div
            style={{
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "var(--psp-gold)",
                marginBottom: "0.75rem",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid #333",
              }}
            >
              About Power Index
            </h3>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#999",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              The PSP Power Index ranks schools across five key dimensions:
              championships won, winning percentage, pro athlete production,
              recruiting success, and strength of schedule.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
