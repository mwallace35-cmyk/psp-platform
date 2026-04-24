-- Full-column schools view that includes deleted (closed) schools.
--
-- Why: the `schools` table has RLS `USING (deleted_at IS NULL)`, which hides
-- closed schools from anon-key queries. The existing `school_names` view
-- (id/name/slug/league_id only) bypasses RLS but has too few columns for
-- historical rendering (missing logo_url, mascot, colors, city, closed_year).
--
-- This view adds a SECURITY DEFINER wrapper over the full schools row shape
-- so historical pages (team_seasons, games, awards, legend_tributes, etc.)
-- can render closed-school metadata when joining to school_id.
--
-- Usage: switch any historical query that needs to render closed schools
-- from `.from('schools')` → `.from('schools_all')`.

CREATE OR REPLACE VIEW public.schools_all
WITH (security_invoker = false) AS
SELECT
  id, slug, name, short_name, city, state, region_id, league_id,
  founded_year, closed_year, logo_url, mascot, colors, address,
  website_url, aliases, v4_id, created_at, updated_at, deleted_at,
  principal, athletic_director, athletic_director_email, phone,
  enrollment, school_type, division, piaa_class,
  primary_color, secondary_color, is_opponent_stub, is_stub
FROM public.schools;

-- Grant anon + authenticated read access (no RLS on the view itself, and
-- security_invoker=false means the view owner's permissions apply).
GRANT SELECT ON public.schools_all TO anon, authenticated;

COMMENT ON VIEW public.schools_all IS
  'Full mirror of schools including soft-deleted (closed) rows. Use for historical pages (team_seasons/games/awards/tributes). For current-day listings use schools directly (RLS filters closed).';
