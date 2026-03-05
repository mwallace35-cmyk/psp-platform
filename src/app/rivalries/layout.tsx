import HeaderWithScores from "@/components/layout/HeaderWithScores";
import Footer from "@/components/layout/Footer";

export default function RivalriesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderWithScores />
      <main className="min-h-screen bg-navy">{children}</main>
      <Footer />
    </>
  );
}
