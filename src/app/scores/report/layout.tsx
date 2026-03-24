import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report a Score | PhillySportsPack",
  description: "Submit game scores for Philadelphia high school sports.",
  alternates: { canonical: "https://phillysportspack.com/scores/report" },
};

export default function ReportScoreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
