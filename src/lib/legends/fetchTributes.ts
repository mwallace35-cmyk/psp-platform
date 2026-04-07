import { createClient } from "@supabase/supabase-js";

export interface LegendTribute {
  id: number;
  name: string;
  affiliation: string | null;
  body: string;
  source: "user" | "ted-silary-archive";
  created_at: string;
  archived_date: string | null;
}

/**
 * Server-side fetch of approved tributes for a given legend, used by
 * <TributesSection>. Uses the anon key + RLS (public read policy for
 * status='approved') — no service role required.
 *
 * Archived entries sort by their original publication date where we
 * have one, falling back to creation time. Live user entries always
 * sort by submission time.
 */
export async function fetchApprovedTributes(
  legendSlug: string,
  limit = 200,
): Promise<LegendTribute[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return [];

  const supabase = createClient(url, anonKey);
  const { data, error } = await supabase
    .from("legend_tributes")
    .select(
      "id, name, affiliation, body, source, created_at, archived_date",
    )
    .eq("legend_slug", legendSlug)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(
      "[fetchApprovedTributes] error:",
      error.message,
      "for slug",
      legendSlug,
    );
    return [];
  }
  return (data ?? []) as LegendTribute[];
}
