import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PhillyEverywhereSection from "@/components/philly-everywhere/PhillyEverywhereSection";
import { getTrackedAlumni, getAlumniCounts } from "@/lib/data";
import { captureError } from "@/lib/error-tracking";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Philly Everywhere — PhillySportsPack",
  description: "Track Philadelphia athletes wherever they play — prep schools, colleges, and the pros. Follow every Philly kid making waves beyond city limits.",
  alternates: { canonical: "https://phillysportspack.com/philly-everywhere" },
};

interface TrackedAlumni {
  id: number;
  person_name: string;
  current_level: string;
  current_org: string;
  current_role?: string;
  college?: string;
  pro_team?: string;
  pro_league?: string;
  sport_id: string;
  bio_note?: string;
  schools?: { name: string; slug: string } | null;
}

interface AlumniBySport {
  football: TrackedAlumni[];
  basketball: TrackedAlumni[];
  baseball: TrackedAlumni[];
}

export default async function PhillyEverywherePage() {
  let footballAlumni: TrackedAlumni[] = [];
  let basketballAlumni: TrackedAlumni[] = [];
  let baseballAlumni: TrackedAlumni[] = [];
  let alumniCounts: Record<string, number> | null = null;

  try {
    const results = await Promise.allSettled([
      getTrackedAlumni({ sport: "football" }, 50),
      getTrackedAlumni({ sport: "basketball" }, 50),
      getTrackedAlumni({ sport: "baseball" }, 50),
      getAlumniCounts(),
    ]);

    const [footballResult, basketballResult, baseballResult, countsResult] = results;

    if (footballResult.status === "fulfilled") footballAlumni = Array.isArray(footballResult.value) ? footballResult.value as unknown as TrackedAlumni[] : [];
    if (basketballResult.status === "fulfilled") basketballAlumni = Array.isArray(basketballResult.value) ? basketballResult.value as unknown as TrackedAlumni[] : [];
    if (baseballResult.status === "fulfilled") baseballAlumni = Array.isArray(baseballResult.value) ? baseballResult.value as unknown as TrackedAlumni[] : [];
    if (countsResult.status === "fulfilled" && typeof countsResult.value === "object" && countsResult.value !== null) {
      alumniCounts = countsResult.value as Record<string, number>;
    }

    // Log any failures
    if (footballResult.status === "rejected") {
      const errorMsg = footballResult.reason instanceof Error ? footballResult.reason.message : String(footballResult.reason);
      console.error("[PSP] Failed to fetch football alumni:", errorMsg);
      captureError(footballResult.reason, { fetch: "getTrackedAlumni", sport: "football" });
    }
    if (basketballResult.status === "rejected") {
      const errorMsg = basketballResult.reason instanceof Error ? basketballResult.reason.message : String(basketballResult.reason);
      console.error("[PSP] Failed to fetch basketball alumni:", errorMsg);
      captureError(basketballResult.reason, { fetch: "getTrackedAlumni", sport: "basketball" });
    }
    if (baseballResult.status === "rejected") {
      const errorMsg = baseballResult.reason instanceof Error ? baseballResult.reason.message : String(baseballResult.reason);
      console.error("[PSP] Failed to fetch baseball alumni:", errorMsg);
      captureError(baseballResult.reason, { fetch: "getTrackedAlumni", sport: "baseball" });
    }
    if (countsResult.status === "rejected") {
      const errorMsg = countsResult.reason instanceof Error ? countsResult.reason.message : String(countsResult.reason);
      console.error("[PSP] Failed to fetch alumni counts:", errorMsg);
      captureError(countsResult.reason, { fetch: "getAlumniCounts" });
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[PSP] Unexpected error fetching Philly Everywhere data:", errorMsg);
    captureError(error, { context: "philly_everywhere_page" });
  }

  return (
    <main id="main-content">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: "Philly Everywhere", url: "https://phillysportspack.com/philly-everywhere" },
      ]} />
      <Breadcrumb items={[{ label: "Philly Everywhere" }]} />

      {/* Hero */}
      <div className="sport-hdr" style={{ borderBottomColor: "var(--psp-gold)" }}>
        <div className="sport-hdr-inner">
          <span style={{ fontSize: 28 }} aria-hidden="true">🌍</span>
          <h1>Philly Everywhere</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.7)", maxWidth: 600, marginTop: 8 }}>
            Tracking Philadelphia athletes wherever they play. From suburban prep schools to D1 programs to the pros — once Philly, always Philly.
          </p>
        </div>
      </div>

      <div className="espn-container">
        <main>
          <PhillyEverywhereSection sport="football" alumni={footballAlumni} />
          <PhillyEverywhereSection sport="basketball" alumni={basketballAlumni} />
          <PhillyEverywhereSection sport="baseball" alumni={baseballAlumni} />
        </main>

        <aside className="sidebar">
          <div className="widget">
            <div className="w-head">🌍 By the Numbers</div>
            <div className="w-body">
              {alumniCounts ? (
                <>
                  <div className="w-row"><span className="name">Athletes Tracked</span><span className="val">{alumniCounts.total || 0}</span></div>
                  <div className="w-row"><span className="name">At Prep Schools</span><span className="val">{alumniCounts.prep || 0}</span></div>
                  <div className="w-row"><span className="name">In College (D1)</span><span className="val">{alumniCounts.college || 0}</span></div>
                  <div className="w-row"><span className="name">Playing Pro</span><span className="val">{alumniCounts.pro || 0}</span></div>
                  <div className="w-row"><span className="name">States Represented</span><span className="val">{alumniCounts.states || 0}</span></div>
                </>
              ) : (
                <>
                  <div className="w-row"><span className="name">Athletes Tracked</span><span className="val">{footballAlumni.length + basketballAlumni.length + baseballAlumni.length}</span></div>
                  <div className="w-row"><span className="name">Data Loading</span><span className="val" style={{ fontSize: 12 }}>Check back soon</span></div>
                </>
              )}
            </div>
          </div>

          <div className="widget">
            <div className="w-head">🔥 Recent Alerts</div>
            <div className="w-body">
              <div style={{ padding: "8px 0", borderBottom: "1px solid var(--g100)" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--psp-navy)" }}>Marcus Johnson — 3 TDs</div>
                <div style={{ fontSize: 10, color: "var(--g400)" }}>Malvern Prep vs Episcopal · Yesterday</div>
              </div>
              <div style={{ padding: "8px 0", borderBottom: "1px solid var(--g100)" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--psp-navy)" }}>Jamal Harris — 22 pts, 8 ast</div>
                <div style={{ fontSize: 10, color: "var(--g400)" }}>Temple vs Villanova · 2 days ago</div>
              </div>
              <div style={{ padding: "8px 0" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--psp-navy)" }}>Carlos Rivera — 3-for-4, 2 RBI</div>
                <div style={{ fontSize: 10, color: "var(--g400)" }}>La Salle vs Malvern Prep · 3 days ago</div>
              </div>
            </div>
          </div>

          <div className="widget">
            <div className="w-head">🔗 Quick Links</div>
            <div className="w-body">
              <Link href="/our-guys" className="w-link">→ Our Guys</Link>
              <Link href="/recruiting" className="w-link">→ Recruiting Board</Link>
              <Link href="/next-level" className="w-link">→ Next Level Tracker</Link>
              <Link href="/coaches" className="w-link">→ Coaches Directory</Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
