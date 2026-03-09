import { NextResponse } from "next/server";
import { createStaticClient } from "@/lib/supabase/static";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "MISSING";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "MISSING";

  const results: Record<string, unknown> = {
    env: {
      url: url === "MISSING" ? "MISSING" : url.substring(0, 40) + "...",
      key: key === "MISSING" ? "MISSING" : key.substring(0, 20) + "...",
      nodeEnv: process.env.NODE_ENV,
    },
  };

  const supabase = createStaticClient();

  // Test 1: Simple query (no join)
  const t1 = await supabase
    .from("schools")
    .select("id, name", { count: "exact" })
    .is("deleted_at", null)
    .limit(3);
  results.test1_simple = {
    rows: t1.data?.length ?? 0,
    total: t1.count,
    error: t1.error?.message ?? null,
  };

  // Test 2: Fixed schools query (colors instead of metadata)
  const t2 = await supabase
    .from("schools")
    .select("id, slug, name, city, state, league_id, colors, leagues(name)")
    .is("deleted_at", null)
    .order("name", { ascending: true })
    .limit(5);
  results.test2_with_join = {
    rows: t2.data?.length ?? 0,
    error: t2.error ? { message: t2.error.message, code: t2.error.code, details: t2.error.details, hint: t2.error.hint } : null,
    sample: t2.data?.slice(0, 3).map((s: any) => ({ name: s.name, league: s.leagues })) ?? [],
  };

  // Test 3: Championships query (no deleted_at)
  const t3 = await supabase
    .from("championships")
    .select("school_id")
    .limit(5);
  results.test3_championships = {
    rows: t3.data?.length ?? 0,
    error: t3.error?.message ?? null,
  };

  // Test 4: Football player seasons (leaderboard query)
  const t4 = await supabase
    .from("football_player_seasons")
    .select("*, players(name, slug, pro_team, schools:schools!players_primary_school_id_fkey(name, slug)), seasons(label, year_start)")
    .not("rush_yards", "is", null)
    .gt("rush_yards", 0)
    .order("rush_yards", { ascending: false, nullsFirst: false })
    .limit(3);
  results.test4_leaderboard = {
    rows: t4.data?.length ?? 0,
    error: t4.error ? { message: t4.error.message, code: t4.error.code, details: t4.error.details, hint: t4.error.hint } : null,
    sample: t4.data?.slice(0, 2).map((r: any) => ({ player: r.players?.name, yards: r.rush_yards })) ?? [],
  };

  return NextResponse.json(results);
}
