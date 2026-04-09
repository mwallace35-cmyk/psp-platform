import { createStaticClient } from "@/lib/supabase/static";
import PickemClient from "./PickemClient";

interface PickemWeek {
  id: number;
  sport_id: string;
  season_id: number;
  week_number: number;
  title: string;
  is_open: boolean;
  starts_at: string;
  ends_at?: string;
  created_at: string;
}

interface Game {
  id: number;
  home_school_id: number;
  away_school_id: number;
  game_date: string;
  final_home_score?: number;
  final_away_score?: number;
  schools?: {
    home: { id: number; name: string };
    away: { id: number; name: string };
  };
}

export default async function PickemAdmin() {
  const supabase = createStaticClient();

  const [weeksRes, gamesRes] = await Promise.all([
    supabase
      .from("pickem_weeks")
      .select("*")
      .order("starts_at", { ascending: false }),
    supabase
      .from("pickem_games")
      .select(`
        *,
        schools:home_school_id(id, name),
        away:away_school_id(id, name)
      `)
      .order("game_date", { ascending: false }),
  ]);

  const initialWeeks = ((weeksRes.data as PickemWeek[] | null) || []);
  const initialGames = ((gamesRes.data as Game[] | null) || []);

  return <PickemClient initialWeeks={initialWeeks} initialGames={initialGames} />;
}
