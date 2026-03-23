import { notFound } from "next/navigation";
import { isValidSport } from "@/lib/data";
import SportNavTabs from "@/components/sport/SportNavTabs";

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
    <>
      <SportNavTabs sport={sport} />
      {children}
    </>
  );
}
