import { Suspense } from "react";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SPORT_META, getPlayoffBrackets } from "@/lib/data";
import { SPORT_COLORS_HEX } from "@/lib/constants/sports";
import type { Metadata } from "next";
import PlayoffsClient from "./PlayoffsClient";

export const revalidate = 3600;
export const dynamic = "force-dynamic";
type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  return {
    title: `Playoffs — ${SPORT_META[sport].name} — PhillySportsPack`,
    description: `Playoff brackets and tournament results for Philadelphia high school ${SPORT_META[sport].name.toLowerCase()}. View PCL, Public League, PIAA, and District 12 brackets.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/playoffs`,
    },
  };
}

async function PlayoffsLoader({ sport }: { sport: string }) {
  const brackets = await getPlayoffBrackets(sport) ?? [];
  const sportColor = SPORT_COLORS_HEX[sport] || "#3b82f6";

  if (brackets.length === 0) {
    return (
      <div
        style={{
          background: "var(--psp-navy, #0a1628)",
          borderRadius: "12px",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>&#127942;</div>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "white",
            margin: "0 0 8px",
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
          }}
        >
          Playoff Brackets Coming Soon
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
            margin: 0,
            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          }}
        >
          Bracket data will be available once the playoff season begins.
          <br />
          Check back for PCL, Public League, PIAA, and District 12 tournaments.
        </p>
      </div>
    );
  }

  return <PlayoffsClient brackets={brackets} sportColor={sportColor} />;
}

export default async function PlayoffsPage({ params }: { params: Promise<PageParams> }) {
  const sport = await validateSportParam(params);
  const meta = SPORT_META[sport];

  const breadcrumbs = [
    { label: meta.name, href: `/${sport}` },
    { label: "Playoffs" },
  ];

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px 40px" }}>
      <Breadcrumb items={breadcrumbs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://phillysportspack.com" },
          { name: meta.name, url: `https://phillysportspack.com/${sport}` },
          { name: "Playoffs", url: `https://phillysportspack.com/${sport}/playoffs` },
        ]}
      />

      <h1
        style={{
          fontSize: "32px",
          fontWeight: 700,
          color: "var(--psp-navy, #0a1628)",
          margin: "16px 0 24px",
          fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
          letterSpacing: "0.5px",
        }}
      >
        {meta.name} Playoffs
      </h1>

      <Suspense
        fallback={
          <div
            style={{
              background: "var(--psp-navy, #0a1628)",
              borderRadius: "12px",
              padding: "60px 20px",
              textAlign: "center",
              color: "rgba(255,255,255,0.5)",
              fontSize: "14px",
            }}
          >
            Loading playoff brackets...
          </div>
        }
      >
        <PlayoffsLoader sport={sport} />
      </Suspense>
    </main>
  );
}
