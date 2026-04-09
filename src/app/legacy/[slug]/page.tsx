import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getLegacyProfile,
  getAllPublishedLegacySlugs,
  getCareerTimeline,
  getDualRoleStats,
  getAchievements,
  getCoachingTreeData,
} from "@/lib/data/legacy";
import LegacyHero from "@/components/legacy/LegacyHero";
import CareerTimeline from "@/components/legacy/CareerTimeline";
import DualRoleStatSplit from "@/components/legacy/DualRoleStatSplit";
import AchievementsConstellation from "@/components/legacy/AchievementsConstellation";
import CoachingTree from "@/components/legacy/CoachingTree";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPublishedLegacySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getLegacyProfile(slug);
  if (!profile) return { title: "Career Arc Not Found" };

  const title = profile.seo_title ?? `${profile.display_name} — Career Arc`;
  const description =
    profile.seo_description ??
    `Full career arc for ${profile.display_name}: player stats, coaching record, and legacy.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://phillysportspack.com/legacy/${profile.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "profile",
      url: `https://phillysportspack.com/legacy/${profile.slug}`,
      images: profile.hero_photo_url ? [profile.hero_photo_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LegacyCareerPage({ params }: PageProps) {
  const { slug } = await params;
  const profile = await getLegacyProfile(slug);
  if (!profile) notFound();

  const [timeline, dualStats, accolades, tree] = await Promise.all([
    getCareerTimeline(profile),
    getDualRoleStats(profile),
    getAchievements(profile),
    getCoachingTreeData(profile),
  ]);

  // Family chips for the hero — only 1-hop family relations
  const family = tree.family.map((f) => ({
    name: f.name,
    slug: f.legacySlug ?? f.slug,
    relation: f.relation,
  }));

  return (
    <main className="min-h-screen bg-gray-50">
      <LegacyHero profile={profile} family={family} />

      <div className="divide-y divide-gray-100">
        <CareerTimeline eras={timeline} />
        <DualRoleStatSplit stats={dualStats} />
        <AchievementsConstellation accolades={accolades} />
        <CoachingTree tree={tree} />
      </div>
    </main>
  );
}
