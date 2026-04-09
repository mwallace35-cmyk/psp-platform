import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Compare Players — PhillySportsPack",
  description: "Compare Philadelphia high school athletes side by side. Career stats, awards, and recruiting rankings.",
  robots: { index: false, follow: true },
};

/**
 * Legacy /players/compare — redirects to /compare.
 * Preserves query params (query params preserved for target).
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
