import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META } from "@/lib/data";
import { createStaticClient } from "@/lib/supabase/static";
import { LeaderboardAd, InContentAd } from "@/components/ads/AdPlaceholder";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

export const revalidate = 86400;

type PageParams = { sport: string; slug: string };

interface Coach {
  id: number;
  name: string;
  slug: string;
  [key: string]: unknown;
}

interface CoachingStint {
  id: number;
  coach_id: number;
  start_year?: number;
  end_year?: number;
  sport_id?: string;
  record_wins?: number;
  record_losses?: number;
  record_ties?: number;
  championships?: number;
  role?: string;
  notes?: string;
  schools?: { name: string; slug: string };
}

async function getCoachBySlug(slug: string): Promise<Coach | null> {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase.from("coaches").select("*").eq("slug", slug).is("deleted_at", null).single();
    return data as Coach | null;
  } catch { return null; }
}

async function getCoachingStints(coachId: number, sportId?: string): Promise<CoachingStint[]> {
  try {
    const supabase = createStaticClient();
    let query = supabase
      .from("coaching_stints")
      .select("*, schools(name, slug)")
      .eq("coach_id", coachId);
    if (sportId) query = query.eq("sport_id", sportId);
    const { data } = await query.order("start_year", { ascending: false });
    return (data ?? []) as CoachingStint[];
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) return {};
  const coach = await getCoachBySlug(slug);
  if (!coach) return {};
  return {
    title: `${coach.name} — ${SPORT_META[sport].name} Coach — PhillySportsPack`,
    description: `${coach.name} coaching career, record, and championships.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/coaches/${slug}`,
    },
  };
}

export default async function CoachProfilePage({ params }: { params: Promise<PageParams> }) {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) notFound();

  const coach = await getCoachBySlug(slug);
  if (!coach) notFound();

  const meta = SPORT_META[sport];
  const stints = await getCoachingStints(coach.id, sport);

  const totalRecord = stints.reduce(
    (acc: { w: number; l: number; t: number; c: number }, st: CoachingStint) => ({
      w: acc.w + (st.record_wins || 0),
      l: acc.l + (st.record_losses || 0),
      t: acc.t + (st.record_ties || 0),
      c: acc.c + (st.championships || 0),
    }),
    { w: 0, l: 0, t: 0, c: 0 }
  );

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: meta.name, url: `https://phillysportspack.com/${sport}` },
        { name: "Coaches", url: `https://phillysportspack.com/${sport}/coaches` },
        { name: coach.name, url: `https://phillysportspack.com/${sport}/coaches/${slug}` },
      ]} />
      <section className="py-12" style={{ background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href={`/${sport}`} className="hover:text-white transition-colors">{meta.name}</Link>
            <span>/</span>
            <span className="text-white">Coaches</span>
          </div>
          <h1 className="text-4xl md:text-5xl text-white tracking-wider" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
            {coach.name}
          </h1>
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <span className="text-gray-300">{totalRecord.w}-{totalRecord.l}{totalRecord.t > 0 ? `-${totalRecord.t}` : ""} Career Record</span>
            {totalRecord.c > 0 && <span style={{ color: "var(--psp-gold)" }}>{totalRecord.c} Championship{totalRecord.c !== 1 ? "s" : ""}</span>}
          </div>
        </div>
      </section>

      <LeaderboardAd id="psp-coach-banner" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {stints.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
              Coaching Timeline
            </h2>
            <div className="space-y-4">
              {stints.map((stint: CoachingStint) => (
                <div key={stint.id} className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-5 flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${meta.color}15` }}
                  >
                    {meta.emoji}
                  </div>
                  <div className="flex-1">
                    <Link href={`/${sport}/schools/${stint.schools?.slug}`} className="font-bold text-sm hover:underline" style={{ color: "var(--psp-navy)" }}>
                      {stint.schools?.name}
                    </Link>
                    <div className="text-xs mt-1" style={{ color: "var(--psp-gray-500)" }}>
                      {stint.start_year}–{stint.end_year || "Present"} • {stint.role === "head_coach" ? "Head Coach" : stint.role}
                    </div>
                    <div className="text-sm mt-2" style={{ color: "var(--psp-gray-500)" }}>
                      Record: {stint.record_wins}-{stint.record_losses}{(stint.record_ties ?? 0) > 0 ? `-${stint.record_ties}` : ""}
                      {(stint.championships ?? 0) > 0 && (
                        <span className="ml-3" style={{ color: "var(--psp-gold)" }}>
                          🏆 {stint.championships} title{stint.championships !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    {stint.notes && <p className="text-xs mt-2" style={{ color: "var(--psp-gray-400)" }}>{stint.notes}</p>}
                  </div>
                </div>
              ))}
            </div>

            <InContentAd id="psp-coach-mid" />
          </div>
        ) : (
          <div className="text-center py-16" style={{ color: "var(--psp-gray-400)" }}>
            <div className="text-4xl mb-4">🧑‍🏫</div>
            <h3 className="text-lg font-medium mb-2" style={{ color: "var(--psp-navy)" }}>No coaching records yet</h3>
          </div>
        )}

        {coach.bio ? (
          <div className="mt-8 bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--psp-gray-400)" }}>Bio</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--psp-gray-500)" }}>{String(coach.bio)}</p>
          </div>
        ) : null}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: coach.name,
            jobTitle: "Coach",
            url: `https://phillysportspack.com/${sport}/coaches/${slug}`,
          }),
        }}
      />
    </>
  );
}
