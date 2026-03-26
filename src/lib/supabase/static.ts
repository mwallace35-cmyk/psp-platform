import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Creates a Supabase client for public, read-only data fetching.
 *
 * This client does NOT use cookies() and is safe for:
 * - Static generation (build time)
 * - ISR revalidation (background workers)
 * - Server Components with `revalidate` exports
 *
 * Use the server.ts client instead for authenticated operations
 * that need session/cookie access (admin, auth flows).
 *
 * If env vars are missing (e.g. during local build without .env),
 * the client is still created but queries will fail gracefully
 * via the data layer's withErrorHandling wrappers.
 */
export function createStaticClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!url || !key) {
    console.warn(
      "[PSP] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase queries will return empty results"
    );
  }

  return createSupabaseClient<Database>(url || "https://placeholder.supabase.co", key || "placeholder", {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
