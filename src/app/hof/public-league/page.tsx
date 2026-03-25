import type { Metadata } from "next";
import { createStaticClient } from "@/lib/supabase/static";
import PublicLeagueHofClient from "./PublicLeagueHofClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Public League Hall of Fame | PhillySportsPack.com",
  description:
    "Honoring the legends of Philadelphia Public League athletics -- built on the original Hall of Fame created by Jon 'Duck' Gray and maintained by Ted Silary.",
  alternates: {
    canonical: "https://phillysportspack.com/hof/public-league",
  },
  openGraph: {
    title: "Public League Hall of Fame | PhillySportsPack.com",
    description:
      "Honoring the legends of Philadelphia Public League athletics -- built on the original Hall of Fame created by Jon 'Duck' Gray and maintained by Ted Silary.",
    url: "https://phillysportspack.com/hof/public-league",
  },
};

export interface PublicLeagueInductee {
  id: number;
  name: string;
  sport: string | null;
  induction_year: number;
  high_school: string | null;
  school_id: number | null;
  player_id: number | null;
  role: string | null;
  position: string | null;
  achievements: string | null;
  professional_career: string | null;
  graduation_year: number | null;
  bio: string | null;
  school_slug: string | null;
  school_name: string | null;
}

async function getPublicLeagueInductees(): Promise<PublicLeagueInductee[]> {
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from("hof_inductees")
    .select(
      `
      id,
      name,
      sport,
      induction_year,
      high_school,
      school_id,
      player_id,
      role,
      position,
      achievements,
      professional_career,
      graduation_year,
      bio,
      schools!hof_inductees_school_id_fkey ( slug, name )
    `
    )
    .eq("organization_id", 4)
    .order("induction_year", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    console.error("[PSP] Failed to fetch Public League HOF inductees:", error);
    return [];
  }

  if (!data || data.length === 0) return [];

  return (data as any[]).map((row) => {
    const school = Array.isArray(row.schools)
      ? row.schools[0]
      : row.schools;
    return {
      id: row.id,
      name: row.name,
      sport: row.sport,
      induction_year: row.induction_year,
      high_school: row.high_school,
      school_id: row.school_id,
      player_id: row.player_id,
      role: row.role,
      position: row.position,
      achievements: row.achievements,
      professional_career: row.professional_career,
      graduation_year: row.graduation_year ?? null,
      bio: row.bio ?? null,
      school_slug: school?.slug ?? null,
      school_name: school?.name ?? row.high_school ?? null,
    };
  });
}

export default async function PublicLeagueHofPage() {
  const inductees = await getPublicLeagueInductees();

  /* Derive filter options from data */
  const sports = Array.from(
    new Set(inductees.map((i) => i.sport).filter(Boolean))
  ).sort() as string[];

  const schools = Array.from(
    new Set(
      inductees
        .map((i) => i.school_name ?? i.high_school)
        .filter(Boolean)
    )
  ).sort() as string[];

  const decades = Array.from(
    new Set(
      inductees
        .map((i) => `${Math.floor(i.induction_year / 10) * 10}s`)
        .filter(Boolean)
    )
  ).sort();

  return (
    <PublicLeagueHofClient
      inductees={inductees}
      sports={sports}
      schools={schools}
      decades={decades}
    />
  );
}
