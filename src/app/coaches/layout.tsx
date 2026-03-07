import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coaches Directory",
  description: "Browse Philadelphia high school sports coaches across all sports.",
  alternates: {
    canonical: "https://phillysportspack.com/coaches",
  },
};

export default function CoachesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
