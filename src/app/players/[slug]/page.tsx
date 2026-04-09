import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createStaticClient } from "@/lib/supabase/static";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `${title} — PhillySportsPack`,
    description: `Philadelphia high school athlete profile for ${title}. Career stats, awards, and game logs.`,
    robots: { index: false, follow: true },
  };
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
