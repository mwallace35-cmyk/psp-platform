import { redirect } from "next/navigation";

/**
 * Legacy /players/compare — redirects to /compare.
 * Preserves query params (player slugs).
 */
export default async function LegacyCompareRedirect({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { a, b } = await searchParams;
  const params = new URLSearchParams();
  if (a) params.set("a", a);
  if (b) params.set("b", b);
  const qs = params.toString();
  redirect(`/compare${qs ? `?${qs}` : ""}`);
}
