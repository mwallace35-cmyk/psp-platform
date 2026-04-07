/**
 * Resolve a filename stored in the `legend-photos` Supabase Storage bucket
 * (under `<slug>/`) to its public URL. Used by <LegendHero>, <PhotoInline>,
 * and the OG image route.
 */
export function legendPhotoUrl(slug: string, file: string | undefined): string | null {
  if (!file) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  // Allow full URLs to pass through unchanged so legacy entries that already
  // point at an external image still work.
  if (/^https?:\/\//i.test(file)) return file;
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "");
  const cleanFile = file.replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/legend-photos/${cleanSlug}/${cleanFile}`;
}
