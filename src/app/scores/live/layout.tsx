import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Scores | PhillySportsPack",
  description: "Live game day scores for Philadelphia high school sports.",
  alternates: { canonical: "https://phillysportspack.com/scores/live" },
};

export default function LiveScoresLayout({ children }: { children: React.ReactNode }) {
  return children;
}
