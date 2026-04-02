import { redirect, notFound } from "next/navigation";
import { createStaticClient } from "@/lib/supabase/static";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Legacy /players/[slug] route — redirects to the sport-scoped version.
 * Detects primary sport by checking which season tables have data.
 */
export default async function LegacyPlayerRedirect({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createStaticClient();

  const { data: player } = await supabase
    .from("players")
    .select("id")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (!player) notFound();

  // Check sport-specific season tables to determine primary sport
  const [fb, bk, bb] = await Promise.all([
    supabase
      .from("football_player_seasons")
      .select("player_id", { count: "exact", head: true })
      .eq("player_id", player.id),
    supabase
      .from("basketball_player_seasons")
      .select("player_id", { count: "exact", head: true })
      .eq("player_id", player.id),
    supabase
      .from("baseball_player_seasons")
      .select("player_id", { count: "exact", head: true })
      .eq("player_id", player.id),
  ]);

  const sport =
    (fb.count ?? 0) > 0
      ? "football"
      : (bk.count ?? 0) > 0
        ? "basketball"
        : (bb.count ?? 0) > 0
          ? "baseball"
          : "football"; // default fallback

  redirect(`/${sport}/players/${slug}`);
}
