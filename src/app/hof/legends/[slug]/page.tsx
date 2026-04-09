import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getUnifiedLegendBySlug,
  getAllUnifiedLegends,
} from "@/lib/mdx/legendAdapter";
import { fetchApprovedTributes } from "@/lib/legends/fetchTributes";
import LegendShell from "@/components/legends/LegendShell";
import LegacyBadge from "@/components/legacy/LegacyBadge";
import { getLegacyProfileForLegend } from "@/lib/data/legacy";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllUnifiedLegends()
    .filter((l) => l.frontmatter.category === "coach")
    .map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const unified = getUnifiedLegendBySlug(slug);
  if (!unified) return { title: "Legend Not Found" };
  const legend = unified.frontmatter;
  return {
    title: `${legend.name} — Legends`,
    description: legend.excerpt,
    alternates: {
      canonical: `https://phillysportspack.com/hof/legends/${legend.slug}`,
    },
    openGraph: {
      title: `${legend.name} — Legends of Philly HS Sports`,
      description: legend.excerpt,
      type: "article",
      url: `https://phillysportspack.com/hof/legends/${legend.slug}`,
      images: [`/api/og/legend/${legend.slug}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${legend.name} — Legends of Philly HS Sports`,
      description: legend.excerpt,
      images: [`/api/og/legend/${legend.slug}`],
    },
  };
}

export default async function LegendDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const unified = getUnifiedLegendBySlug(slug);
  if (!unified || unified.frontmatter.category !== "coach") notFound();

  const [tributes, allLegends, legacyProfile] = await Promise.all([
    fetchApprovedTributes(slug),
    Promise.resolve(getAllUnifiedLegends()),
    getLegacyProfileForLegend(slug),
  ]);

  return (
    <>
      {legacyProfile && (
        <div className="max-w-6xl mx-auto px-4 pt-4 flex justify-end">
          <LegacyBadge href={`/legacy/${legacyProfile.slug}`} />
        </div>
      )}
      <LegendShell
        unified={unified}
        allLegends={allLegends}
        tributes={tributes}
        variant="coach"
      />

      {/* Person JSON-LD for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildPersonJsonLd(unified)),
        }}
      />
    </>
  );
}

function buildPersonJsonLd(unified: ReturnType<typeof getUnifiedLegendBySlug>) {
  if (!unified) return null;
  const l = unified.frontmatter;
  const url = `https://phillysportspack.com/hof/legends/${l.slug}`;

  const awards: string[] = [];
  if (l.championships) {
    for (const c of l.championships) {
      awards.push(`${c.year} ${c.title}${c.opponent ? ` vs ${c.opponent}` : ""}`);
    }
  }
  if (l.highlights) awards.push(...l.highlights);

  const memberOf = (l.schools ?? []).map((school) => ({
    "@type": "OrganizationRole",
    roleName: l.role,
    memberOf: {
      "@type": "HighSchool",
      name: school,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: l.name,
    jobTitle: l.role,
    description: l.excerpt,
    url,
    alumniOf: l.schools?.length
      ? l.schools.map((s) => ({ "@type": "HighSchool", name: s }))
      : undefined,
    memberOf: memberOf.length > 0 ? memberOf : undefined,
    award: awards.length > 0 ? awards : undefined,
    mainEntityOfPage: url,
    publisher: {
      "@type": "Organization",
      name: "PhillySportsPack",
      url: "https://phillysportspack.com",
    },
  };
}
