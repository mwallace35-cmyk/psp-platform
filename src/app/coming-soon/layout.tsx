import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PhillySportsPack.com \u2014 Coming Soon",
  description:
    "The most comprehensive Philadelphia high school sports database is launching soon. Sign up to be notified.",
  alternates: { canonical: "https://phillysportspack.com/coming-soon" },
};

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
