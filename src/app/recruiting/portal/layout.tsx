import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recruiter Portal | PhillySportsPack",
  description: "College recruiters — search and filter top Philadelphia high school recruits by sport, position, and measurables.",
  alternates: { canonical: "https://phillysportspack.com/recruiting/portal" },
};

export default function RecruiterPortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
