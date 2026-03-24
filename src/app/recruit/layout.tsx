import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Recruited | PhillySportsPack",
  description: "Philadelphia high school athletes — create a recruiting profile and get noticed by college coaches.",
  alternates: { canonical: "https://phillysportspack.com/recruit" },
};

export default function RecruitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
