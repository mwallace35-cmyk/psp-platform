import { createStaticClient } from "@/lib/supabase/static";
import HighlightsClient from "./HighlightsClient";

interface Highlight {
  id: number;
  player_id: number;
  hudl_url: string;
  title: string;
  sport_id: string;
  season_id?: number;
  game_id?: number;
  is_featured: boolean;
  created_at: string;
  players?: { id: number; name: string; slug: string };
}

interface Player {
  id: number;
  name: string;
  slug: string;
}

export default async function HighlightsAdmin() {
  const supabase = createStaticClient();

  const [highlightsRes, playersRes] = await Promise.all([
    (supabase as any)
      .from("player_highlights")
      .select(`
        *,
        players:player_id(id, name, slug)
      `)
      .order("created_at", { ascending: false }),
    supabase.from("players").select("id, name, slug").order("name").limit(5000),
  ]);

  const initialHighlights = (highlightsRes.data || []) as Highlight[];
  const initialPlayers = (playersRes.data || []) as Player[];

  return (
    <HighlightsClient
      initialHighlights={initialHighlights}
      initialPlayers={initialPlayers}
    />
  );
}
