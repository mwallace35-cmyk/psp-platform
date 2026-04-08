/**
 * /p/{slug} — short canonical player URL (audit CC-7 / PP-5 fix).
 *
 * Lets fans share `phillysportspack.com/p/amahj-gowans-167` instead of
 * the longer sport-prefixed `/{sport}/players/{slug}`. Works as a redirect
 * to the canonical sport profile so all existing routes keep working.
 */

import { redirect, notFound } from "next/navigation";
import { createStaticClient } from "@/lib/supabase/static";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ShortPlayerRedirect({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createStaticClient();

  // Find the player by slug — search across all sport season tables to
  // determine the canonical sport for the redirect.
  const { data: player } = await supabase
    .from("players")
    .select("id, slug")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (!player) notFound();

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
          : "football";

  redirect(`/${sport}/players/${slug}`);
}
