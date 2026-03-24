import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Schools | PhillySportsPack",
  description: "Head-to-head comparison of Philadelphia high school sports programs.",
  alternates: { canonical: "https://phillysportspack.com/compare/schools" },
};

export default function CompareSchoolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
