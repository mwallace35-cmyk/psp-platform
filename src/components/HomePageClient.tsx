'use client';

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

// Helper function to format time ago
function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface DisplayArticle {
  slug: string;
  title: string;
  excerpt: string;
  sport_id: string;
  featured_image_url: string;
  published_at: string;
}

interface DisplayAlumnus {
  emoji: string;
  name: string;
  team: string;
  role?: string;
  hs: string;
}

interface HomePageClientProps {
  stats: {
    schools: number;
    players: number;
    seasons: number;
    championships: number;
  };
  articles: DisplayArticle[];
  alumni: DisplayAlumnus[];
  websiteJsonLd: Record<string, unknown>;
}

export default function HomePageClient({ stats, articles, alumni, websiteJsonLd }: HomePageClientProps) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--psp-white)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <Header />

      <ErrorBoundary>
        <main id="main-content" style={{ flex: 1, width: "100%" }}>
          <div id="content-updates" aria-live="polite" aria-atomic="true" className="sr-only"></div>

        {/* ============ HERO SECTION ============ */}
        <section
          style={{
            width: "100%",
            padding: "80px 20px",
            background: "linear-gradient(135deg, var(--psp-navy) 0%, #1a4d8f 100%)",
            color: "var(--psp-white)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 2 }}>
            <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", fontWeight: 700, marginBottom: "16px", fontFamily: "var(--font-bebas)", letterSpacing: "1px" }}>
              Philadelphia&apos;s Home for High School Sports
            </h1>
            <p style={{ fontSize: "clamp(1rem, 3vw, 1.25rem)", marginBottom: "32px", opacity: 0.95, maxWidth: "600px", margin: "0 auto 32px" }}>
              Track the stats, celebrate the champions, and discover tomorrow&apos;s stars
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/search"
                style={{
                  padding: "12px 32px",
                  backgroundColor: "var(--psp-gold)",
                  color: "var(--psp-navy)",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "1rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.backgroundColor = "var(--psp-gold-light)";
                  (e.target as HTMLAnchorElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.backgroundColor = "var(--psp-gold)";
                  (e.target as HTMLAnchorElement).style.transform = "translateY(0)";
                }}
              >
                Explore Database
              </Link>
              <Link
                href="/football"
                style={{
                  padding: "12px 32px",
                  backgroundColor: "transparent",
                  color: "var(--psp-white)",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "1rem",
                  border: "2px solid var(--psp-white)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.backgroundColor = "var(--psp-white)";
                  (e.target as HTMLAnchorElement).style.color = "var(--psp-navy)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.backgroundColor = "transparent";
                  (e.target as HTMLAnchorElement).style.color = "var(--psp-white)";
                }}
              >
                View Sports
              </Link>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: "-50%",
              right: "-10%",
              width: "400px",
              height: "400px",
              backgroundColor: "rgba(240, 165, 0, 0.1)",
              borderRadius: "50%",
              zIndex: 1,
            }}
          />
        </section>

        {/* ============ SOCIAL PROOF BAR ============ */}
        <section
          style={{
            width: "100%",
            padding: "40px 20px",
            backgroundColor: "var(--psp-gray-50)",
            borderTop: "1px solid var(--psp-gray-200)",
            borderBottom: "1px solid var(--psp-gray-200)",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "24px",
              textAlign: "center",
            }}
          >
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--psp-navy)", fontFamily: "var(--font-bebas)" }}>
                {stats.players.toLocaleString()}+
              </div>
              <div style={{ fontSize: "0.95rem", color: "var(--psp-gray-600)", marginTop: "8px" }}>Players Tracked</div>
            </div>
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--psp-navy)", fontFamily: "var(--font-bebas)" }}>
                {stats.schools.toLocaleString()}+
              </div>
              <div style={{ fontSize: "0.95rem", color: "var(--psp-gray-600)", marginTop: "8px" }}>Schools</div>
            </div>
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--psp-navy)", fontFamily: "var(--font-bebas)" }}>3</div>
              <div style={{ fontSize: "0.95rem", color: "var(--psp-gray-600)", marginTop: "8px" }}>Sports Covered</div>
            </div>
            <div>
              <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--psp-navy)", fontFamily: "var(--font-bebas)" }}>50+</div>
              <div style={{ fontSize: "0.95rem", color: "var(--psp-gray-600)", marginTop: "8px" }}>Years of Data</div>
            </div>
          </div>
        </section>

        {/* ============ FEATURED CONTENT GRID ============ */}
        <section style={{ width: "100%", padding: "60px 20px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "32px", color: "var(--psp-navy)", fontFamily: "var(--font-bebas)" }}>
              Latest Coverage
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "24px",
              }}
            >
              {articles.map((article, idx) => (
                <Link
                  key={idx}
                  href={`/articles/${article.slug}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundColor: "var(--psp-white)",
                    border: "1px solid var(--psp-gray-200)",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      backgroundColor: "var(--psp-gray-200)",
                      backgroundImage: article.featured_image_url ? `url(${article.featured_image_url})` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--psp-gold)", textTransform: "uppercase", marginBottom: "8px" }}>
                      {article.sport_id}
                    </span>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "8px", color: "var(--psp-navy)", lineHeight: "1.4" }}>
                      {article.title}
                    </h3>
                    <p style={{ fontSize: "0.95rem", color: "var(--psp-gray-600)", marginBottom: "12px", lineHeight: "1.5", flex: 1 }}>
                      {article.excerpt}
                    </p>
                    <span style={{ fontSize: "0.85rem", color: "var(--psp-gray-500)" }}>
                      {formatTimeAgo(article.published_at)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============ SPORT NAVIGATION CARDS ============ */}
        <section style={{ width: "100%", padding: "60px 20px", backgroundColor: "var(--psp-gray-50)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "32px", color: "var(--psp-navy)", fontFamily: "var(--font-bebas)" }}>
              Explore by Sport
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
              {[
                { name: "Football", color: "#16a34a", icon: "🏈", href: "/football", desc: "120+ schools, 5,000+ players tracked" },
                { name: "Basketball", color: "#ea580c", icon: "🏀", href: "/basketball", desc: "120+ schools, 5,000+ players tracked" },
                { name: "Baseball", color: "#dc2626", icon: "⚾", href: "/baseball", desc: "120+ schools, 5,000+ players tracked" },
              ].map((sport, idx) => (
                <Link
                  key={idx}
                  href={sport.href}
                  style={{
                    textDecoration: "none",
                    color: "var(--psp-white)",
                    padding: "40px 24px",
                    borderRadius: "12px",
                    backgroundColor: sport.color,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: "16px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    minHeight: "200px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-8px)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <span style={{ fontSize: "3rem" }}>{sport.icon}</span>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0, fontFamily: "var(--font-bebas)" }}>
                    {sport.name}
                  </h3>
                  <p style={{ fontSize: "0.9rem", opacity: 0.9, margin: 0 }}>
                    {sport.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============ NEWSLETTER CTA ============ */}
        <section
          style={{
            width: "100%",
            padding: "60px 20px",
            background: "linear-gradient(135deg, var(--psp-navy) 0%, #1a4d8f 100%)",
            color: "var(--psp-white)",
          }}
        >
          <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "16px", fontFamily: "var(--font-bebas)" }}>
              Stay Updated
            </h2>
            <p style={{ fontSize: "1rem", marginBottom: "32px", opacity: 0.95, lineHeight: "1.6" }}>
              Get the latest Philadelphia high school sports news, rankings, and player highlights delivered to your inbox
            </p>
            <div style={{ display: "flex", gap: "12px", maxWidth: "500px", margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: "1",
                  minWidth: "200px",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "1rem",
                  backgroundColor: "var(--psp-white)",
                  color: "var(--psp-navy)",
                }}
              />
              <button
                style={{
                  padding: "12px 32px",
                  backgroundColor: "var(--psp-gold)",
                  color: "var(--psp-navy)",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = "var(--psp-gold-light)";
                  (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = "var(--psp-gold)";
                  (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* ============ PHILLY EVERYWHERE (ALUMNI) ============ */}
        <section style={{ width: "100%", padding: "60px 20px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "32px", color: "var(--psp-navy)", fontFamily: "var(--font-bebas)" }}>
              Philly Everywhere
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--psp-gray-600)", marginBottom: "32px", maxWidth: "600px" }}>
              Track Philadelphia&apos;s next-level athletes competing at the highest levels of college and professional sports
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "16px",
              }}
            >
              {alumni.slice(0, 12).map((alumnus, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "16px",
                    backgroundColor: "var(--psp-gray-50)",
                    borderRadius: "8px",
                    border: "1px solid var(--psp-gray-200)",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{alumnus.emoji}</div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--psp-navy)", margin: "0 0 4px 0", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {alumnus.name}
                  </h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--psp-gold)", margin: "0 0 4px 0", fontWeight: 500 }}>
                    {alumnus.team}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--psp-gray-600)", margin: 0 }}>
                    {alumnus.hs}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "32px", textAlign: "center" }}>
              <Link
                href="/search"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "var(--psp-navy)",
                  color: "var(--psp-white)",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  display: "inline-block",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#1a4d8f";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--psp-navy)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                }}
              >
                View All Alumni
              </Link>
            </div>
          </div>
        </section>
        </main>
      </ErrorBoundary>

      <OrganizationJsonLd />
      <Footer />
    </div>
  );
}
