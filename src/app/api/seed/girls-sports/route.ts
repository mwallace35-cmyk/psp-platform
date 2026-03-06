import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/seed/girls-sports
 * Protected admin endpoint to seed girls sports data
 * Requires admin authentication
 */
export async function POST(req: NextRequest) {
  try {
    // Check for admin auth (basic check - in production, verify JWT token)
    const authHeader = req.headers.get("authorization");
    const adminSecret = process.env.ADMIN_SEED_SECRET;

    if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // 1. Upsert sports
    const sports = [
      { id: "girls-basketball", name: "Girls Basketball", emoji: "🏀", sort_order: 3, is_major: true },
      { id: "girls-soccer", name: "Girls Soccer", emoji: "⚽", sort_order: 9, is_major: false },
      { id: "softball", name: "Softball", emoji: "🥎", sort_order: 10, is_major: false },
      { id: "field-hockey", name: "Field Hockey", emoji: "🏑", sort_order: 11, is_major: false },
    ];

    for (const sport of sports) {
      const { error } = await supabase
        .from("sports")
        .upsert([sport], { onConflict: "id" });

      if (error) {
        console.error(`[seed/girls-sports] Error upserting sport ${sport.id}:`, error);
      }
    }

    // 2. Get or create schools
    const schoolsToCreate = [
      { slug: "neumann-goretti", name: "Neumann-Goretti", short_name: "N-G", city: "Philadelphia", mascot: "Saints" },
      { slug: "archbishop-wood", name: "Archbishop Wood", short_name: "Arch. Wood", city: "Warminster", mascot: "Vikings" },
      { slug: "cardinal-ohara", name: "Cardinal O'Hara", short_name: "Cardinal O'H", city: "Springfield", mascot: "Lions" },
      { slug: "plymouth-whitemarsh", name: "Plymouth Whitemarsh", short_name: "P-W", city: "Plymouth Meeting", mascot: "Colonials" },
      { slug: "spring-ford", name: "Spring-Ford", short_name: "Spring-Ford", city: "Royersford", mascot: "Rams" },
      { slug: "central-bucks-east", name: "Central Bucks East", short_name: "CB East", city: "Doylestown", mascot: "Patriots" },
    ];

    const schoolIds: Record<string, number> = {};

    for (const schoolData of schoolsToCreate) {
      // Try to find existing school
      const { data: existing } = await supabase
        .from("schools")
        .select("id")
        .eq("slug", schoolData.slug)
        .single();

      if (existing) {
        schoolIds[schoolData.slug] = existing.id;
      } else {
        // Create new school
        const { data: created, error } = await supabase
          .from("schools")
          .insert([
            {
              ...schoolData,
              state: "PA",
              region_id: "philadelphia",
              school_type: schoolData.slug.includes("central-bucks") ? "Public" : "Catholic",
            },
          ])
          .select("id")
          .single();

        if (error) {
          console.error(`[seed/girls-sports] Error creating school ${schoolData.slug}:`, error);
        } else if (created) {
          schoolIds[schoolData.slug] = created.id;
        }
      }
    }

    // 3. Get season IDs
    const { data: seasons } = await supabase
      .from("seasons")
      .select("id, year_start")
      .in("year_start", [2020, 2021, 2022, 2023, 2024]);

    const seasonMap = new Map(seasons?.map(s => [s.year_start, s.id]) ?? []);

    // 4. Insert team seasons for girls basketball
    const teamSeasons = [
      { school_slug: "neumann-goretti", year_start: 2024, wins: 28, losses: 2, ties: 0 },
      { school_slug: "neumann-goretti", year_start: 2023, wins: 26, losses: 4, ties: 0 },
      { school_slug: "archbishop-wood", year_start: 2024, wins: 25, losses: 5, ties: 0 },
      { school_slug: "archbishop-wood", year_start: 2023, wins: 24, losses: 6, ties: 0 },
      { school_slug: "cardinal-ohara", year_start: 2024, wins: 22, losses: 8, ties: 0 },
      { school_slug: "plymouth-whitemarsh", year_start: 2024, wins: 20, losses: 10, ties: 0 },
      { school_slug: "spring-ford", year_start: 2024, wins: 19, losses: 11, ties: 0 },
      { school_slug: "central-bucks-east", year_start: 2024, wins: 21, losses: 9, ties: 0 },
    ];

    for (const ts of teamSeasons) {
      const schoolId = schoolIds[ts.school_slug];
      const seasonId = seasonMap.get(ts.year_start);

      if (schoolId && seasonId) {
        const { error } = await supabase
          .from("team_seasons")
          .upsert(
            [
              {
                school_id: schoolId,
                season_id: seasonId,
                sport_id: "girls-basketball",
                wins: ts.wins,
                losses: ts.losses,
                ties: ts.ties,
              },
            ],
            { onConflict: "school_id,season_id,sport_id" }
          );

        if (error) {
          console.error(`[seed/girls-sports] Error inserting team season:`, error);
        }
      }
    }

    // 5. Insert championships
    const championships = [
      { school_slug: "neumann-goretti", year: 2024, level: "state", title: "PIAA 4A State Championship" },
      { school_slug: "neumann-goretti", year: 2023, level: "state", title: "PIAA 4A State Championship" },
      { school_slug: "archbishop-wood", year: 2022, level: "state", title: "PIAA 5A State Championship" },
      { school_slug: "archbishop-wood", year: 2021, level: "state", title: "PIAA 5A State Championship" },
      { school_slug: "cardinal-ohara", year: 2020, level: "state", title: "PIAA 5A State Championship" },
    ];

    for (const champ of championships) {
      const schoolId = schoolIds[champ.school_slug];

      if (schoolId) {
        const { error } = await supabase
          .from("championships")
          .insert([
            {
              school_id: schoolId,
              sport_id: "girls-basketball",
              championship_year: champ.year,
              level: champ.level,
              title: champ.title,
            },
          ]);

        if (error && error.code !== "23505") { // Ignore unique constraint violations
          console.error(`[seed/girls-sports] Error inserting championship:`, error);
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Girls sports seed data loaded successfully",
        summary: {
          sports_added: sports.length,
          schools_created: Object.keys(schoolIds).length,
          team_seasons_added: teamSeasons.length,
          championships_added: championships.length,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[seed/girls-sports] Error:", err);
    return NextResponse.json(
      {
        error: "Failed to seed girls sports data",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
