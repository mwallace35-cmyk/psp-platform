import type { Metadata } from "next";
import { createStaticClient } from "@/lib/supabase/static";
import CityAllStarClient from "./CityAllStarClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    "PA Sports HOF City All Star Chapter | PhillySportsPack.com",
  description:
    "Athlete inductees of the PA Sports Hall of Fame Philadelphia City All Star Chapter -- celebrating multi-sport excellence across Philadelphia since 1992.",
  alternates: {
    canonical: "https://phillysportspack.com/hof/city-all-star",
  },
  openGraph: {
    title:
      "PA Sports HOF City All Star Chapter | PhillySportsPack.com",
    description:
      "Athlete inductees of the PA Sports Hall of Fame Philadelphia City All Star Chapter -- celebrating multi-sport excellence across Philadelphia since 1992.",
    url: "https://phillysportspack.com/hof/city-all-star",
  },
};

export interface CityAllStarInductee {
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
  school_slug: string | null;
  school_name: string | null;
}

async function getCityAllStarInductees(): Promise<CityAllStarInductee[]> {
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
      schools!hof_inductees_school_id_fkey ( slug, name )
    `
    )
    .eq("organization_id", 2)
    .order("induction_year", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    console.error(
      "[PSP] Failed to fetch City All Star HOF inductees:",
      error
    );
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
      school_slug: school?.slug ?? null,
      school_name: school?.name ?? row.high_school ?? null,
    };
  });
}

export default async function CityAllStarHofPage() {
  const inductees = await getCityAllStarInductees();

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

  const years = Array.from(
    new Set(inductees.map((i) => i.induction_year))
  ).sort((a, b) => b - a);

  return (
    <CityAllStarClient
      inductees={inductees}
      sports={sports}
      schools={schools}
      years={years}
    />
  );
}
