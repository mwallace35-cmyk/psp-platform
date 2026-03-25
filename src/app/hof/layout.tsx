import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Ted Silary Hall of Fame | PhillySportsPack.com",
  description:
    "Honoring the greatest athletes in Philadelphia high school sports — a living tribute to Ted Silary",
  alternates: {
    canonical: "https://phillysportspack.com/hof",
  },
  openGraph: {
    title: "The Ted Silary Hall of Fame | PhillySportsPack.com",
    description:
      "Honoring the greatest athletes in Philadelphia high school sports — a living tribute to Ted Silary",
    url: "https://phillysportspack.com/hof",
  },
};

export default function HofLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
