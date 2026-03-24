import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claim Your Profile | Coaches | PhillySportsPack",
  description: "Philadelphia high school coaches — claim your profile and manage your team on PhillySportsPack.",
  alternates: { canonical: "https://phillysportspack.com/coaches/claim" },
};

export default function CoachClaimLayout({ children }: { children: React.ReactNode }) {
  return children;
}
