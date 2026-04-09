import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coaching Records — Ted Silary Hall of Fame",
  description:
    "All-time Philadelphia high school coaching records. The 100-Win Club, best winning percentages, and longest tenures.",
  openGraph: {
    title: "Coaching Records — Ted Silary Hall of Fame",
    description:
      "All-time Philadelphia HS coaching records: 100-win club, best winning percentages, longest tenures.",
    type: "website",
  },
};

export default function CoachingRecordsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
