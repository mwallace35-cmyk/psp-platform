import { notFound } from "next/navigation";
import HeaderWithScores from "@/components/layout/HeaderWithScores";
import Footer from "@/components/layout/Footer";
import { isValidSport } from "@/lib/data";

export default async function SportLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ sport: string }>;
}) {
  const { sport } = await params;
  if (!isValidSport(sport)) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithScores />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
