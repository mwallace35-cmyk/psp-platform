import { createStaticClient } from "@/lib/supabase/static";
import PickemClient from "./PickemClient";

interface PickemWeek {
  id: number;
  sport_id: string;
  season_id: number;
  week_number: number;
  title: string;
  status: string;
  opens_at: string;
  closes_at: string | null;
  created_at: string;
}

interface Game {
  id: number;
  home_school_id: number;
  away_school_id: number;
  final_home_score?: number;
  final_away_score?: number;
  home_school?: { id: number; name: string } | null;
  away_school?: { id: number; name: string } | null;
}

export default async function PickemAdmin() {
  const supabase = createStaticClient();

  const [weeksRes, gamesRes] = await Promise.all([
    supabase
      .from("pickem_weeks")
      .select("*")
      .order("opens_at", { ascending: false }),
    supabase
      .from("pickem_games")
      .select(`
        *,
        home_school:schools!pickem_games_home_school_id_fkey(id, name),
        away_school:schools!pickem_games_away_school_id_fkey(id, name)
      `)
      .order("created_at", { ascending: false }),
  ]);

  const initialWeeks = ((weeksRes.data as PickemWeek[] | null) || []);
  const initialGames = ((gamesRes.data as Game[] | null) || []);

  return <PickemClient initialWeeks={initialWeeks} initialGames={initialGames} />;
}
