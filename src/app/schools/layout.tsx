import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schools Directory",
  description: "Browse Philadelphia high school sports across all schools.",
  alternates: {
    canonical: "https://phillysportspack.com/schools",
  },
};

export default function SchoolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
