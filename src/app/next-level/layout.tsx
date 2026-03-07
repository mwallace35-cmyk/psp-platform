import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next Level Athletes",
  description: "Philadelphia high school athletes playing at the next level - college and professional.",
  alternates: {
    canonical: "https://phillysportspack.com/next-level",
  },
};

export default function NextLevelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
