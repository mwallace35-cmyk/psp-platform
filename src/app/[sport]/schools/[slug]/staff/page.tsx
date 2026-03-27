import Link from "next/link";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { SPORT_META, getSchoolBySlug } from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PSPPromo from "@/components/ads/PSPPromo";
import ShareButtons from "@/components/social/ShareButtons";
import { buildOgImageUrl } from "@/lib/og-utils";
import { createStaticClient } from "@/lib/supabase/static";
import type { Metadata } from "next";

export const revalidate = 86400; // ISR: daily
type PageParams = { sport: string; slug: string };

interface Coach {
  id: number;
  name: string;
  slug: string;
  photo_url?: string;
  bio?: string;
}

interface CoachingStaff {
  id: number;
  coach_id: number;
  school_id: number;
  sport_id: string;
  start_year: number;
  end_year?: number;
  role: string;
  record_wins?: number;
  record_losses?: number;
  record_ties?: number;
  championships?: number;
  notes?: string;
  coaches?: Coach;
  former_player_id?: number;
}

// Dynamic — too many slug combos to pre-render
export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport, slug } = await params;
  const sportValidated = await validateSportParamForMetadata({ sport });
  if (!sportValidated) return {};

  const school = await getSchoolBySlug(slug);
  if (!school) return {};

  const ogImageUrl = buildOgImageUrl({
    title: `${school.name} Coaching Staff`,
    subtitle: `${SPORT_META[sportValidated].name} — Coaches`,
    sport: sportValidated,
    type: "school",
  });

  return {
    title: `${school.name} ${SPORT_META[sportValidated].name} Coaching Staff — PhillySportsPack`,
    description: `Coaching staff and history for ${school.name} ${SPORT_META[sportValidated].name.toLowerCase()}.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sportValidated}/schools/${slug}/staff`,
    },
    openGraph: {
      title: `${school.name} Coaching Staff — PhillySportsPack`,
      description: `Coaching staff and history for ${school.name} ${SPORT_META[sportValidated].name.toLowerCase()}.`,
      url: `https://phillysportspack.com/${sportValidated}/schools/${slug}/staff`,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${school.name} Coaching Staff`,
        },
      ],
    },
  };
}

async function getCoachingStaff(schoolId: number, sportId: string): Promise<CoachingStaff[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("coaching_stints")
    .select(`
      *,
      coaches:coach_id(id, name, slug, photo_url, bio)
    `)
    .eq("school_id", schoolId)
    .eq("sport_id", sportId)
    .order("start_year", { ascending: false });

  if (error) throw error;
  return (data || []) as CoachingStaff[];
}

export default async function SchoolCoachingStaffPage({ params }: { params: Promise<PageParams> }) {
  const { sport: sportRaw, slug } = await params;
  const sport = await validateSportParam({ sport: sportRaw });

  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  const meta = SPORT_META[sport];

  let staff: CoachingStaff[] = [];
  try {
    staff = await getCoachingStaff(school.id, sport);
  } catch (error) {
    console.error("Error fetching coaching staff:", error);
  }

  const headCoach = staff.find((s) => s.role === "head_coach");
  const coordinators = staff.filter((s) => s.role?.includes("coordinator"));
  const assistants = staff.filter((s) => !s.role?.includes("coordinator") && s.role !== "head_coach");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://phillysportspack.com" },
          { name: meta.name, url: `https://phillysportspack.com/${sport}` },
          { name: "Schools", url: `https://phillysportspack.com/${sport}/schools` },
          { name: school.name, url: `https://phillysportspack.com/${sport}/schools/${slug}` },
          { name: "Coaching Staff", url: `https://phillysportspack.com/${sport}/schools/${slug}/staff` },
        ]}
      />

      {/* Header */}
      <section
        className="py-12 md:py-16"
        style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 60%, ${meta.color}22 100%)` }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: meta.name, href: `/${sport}` },
              { label: "Schools" },
              { label: school.name, href: `/${sport}/schools/${slug}` },
              { label: "Coaching Staff" },
            ]}
          />

          <div className="flex items-start gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
              style={{ background: `${meta.color}20` }}
            >
              {meta.emoji}
            </div>
            <div className="flex-1">
              <h1
                className="psp-h1 text-white mb-2"
              >
                {school.name} Coaching Staff
              </h1>
              <p className="text-gray-300 mb-4">{meta.name} Program</p>
              <ShareButtons
                url={`/${sport}/schools/${slug}/staff`}
                title={`${school.name} ${meta.name} Coaching Staff — PhillySportsPack`}
                description={`Meet the coaching staff at ${school.name}`}
              />
            </div>
          </div>
        </div>
      </section>

      <PSPPromo size="banner" variant={1} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Head Coach */}
            {headCoach && (
              <div>
                <h2 className="psp-h2 mb-4" style={{ color: "var(--psp-navy)" }}>
                  Head Coach
                </h2>
                <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden hover:shadow-lg transition-shadow">
                  <div
                    className="h-48 flex items-center justify-center text-6xl"
                    style={{ background: `linear-gradient(135deg, ${meta.color}20 0%, ${meta.color}05 100%)` }}
                  >
                    {headCoach.coaches?.photo_url ? (
                      <img
                        src={headCoach.coaches.photo_url}
                        alt={headCoach.coaches.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "👨‍🏫"
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        className="psp-h3"
                        style={{ color: "var(--psp-navy)" }}
                      >
                        {headCoach.coaches?.name || "Unknown Coach"}
                      </h3>
                      {headCoach.former_player_id && (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-900">
                          Former Player
                        </span>
                      )}
                    </div>

                    {headCoach.coaches?.slug && (
                      <Link
                        href={`/${sport}/coaches/${headCoach.coaches.slug}`}
                        className="text-sm font-medium mb-4 inline-block transition-colors hover:opacity-80"
                        style={{ color: "var(--psp-gold)" }}
                      >
                        View Full Profile →
                      </Link>
                    )}

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span style={{ color: "var(--psp-gray-500)" }}>Tenure</span>
                        <span className="font-medium" style={{ color: "var(--psp-navy)" }}>
                          {headCoach.start_year}
                          {headCoach.end_year ? `–${headCoach.end_year}` : "–Present"}
                        </span>
                      </div>
                      {headCoach.record_wins !== null && (
                        <div className="flex justify-between">
                          <span style={{ color: "var(--psp-gray-500)" }}>Career Record</span>
                          <span className="font-medium" style={{ color: "var(--psp-navy)" }}>
                            {headCoach.record_wins}
                            {headCoach.record_losses ? `–${headCoach.record_losses}` : ""}
                            {headCoach.record_ties ? `–${headCoach.record_ties}` : ""}
                          </span>
                        </div>
                      )}
                      {headCoach.championships && (
                        <div className="flex justify-between">
                          <span style={{ color: "var(--psp-gray-500)" }}>Championships</span>
                          <span className="font-medium" style={{ color: "var(--psp-navy)" }}>
                            {headCoach.championships}
                          </span>
                        </div>
                      )}
                    </div>

                    {headCoach.notes && (
                      <div className="mt-4 pt-4 border-t border-[var(--psp-gray-200)]">
                        <p className="text-sm" style={{ color: "var(--psp-gray-600)" }}>
                          {headCoach.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Coordinators */}
            {coordinators.length > 0 && (
              <div>
                <h2 className="psp-h2 mb-4" style={{ color: "var(--psp-navy)" }}>
                  Coordinators
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coordinators.map((coach) => (
                    <div key={coach.id} className="bg-white rounded-lg border border-[var(--psp-gray-200)] p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">👨‍🏫</div>
                        <div className="flex-1">
                          <h3 className="font-bold" style={{ color: "var(--psp-navy)" }}>
                            {coach.coaches?.name || "Unknown Coach"}
                          </h3>
                          <p className="text-xs" style={{ color: "var(--psp-gray-500)" }}>
                            {coach.role} • {coach.start_year}
                            {coach.end_year ? `–${coach.end_year}` : "–Present"}
                          </p>
                          {coach.former_player_id && (
                            <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-900 font-semibold inline-block mt-2">
                              Former Player
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assistants */}
            {assistants.length > 0 && (
              <div>
                <h2 className="psp-h2 mb-4" style={{ color: "var(--psp-navy)" }}>
                  Assistant Coaches
                </h2>
                <div className="space-y-2">
                  {assistants.map((coach) => (
                    <div key={coach.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium" style={{ color: "var(--psp-navy)" }}>
                          {coach.coaches?.name || "Unknown Coach"}
                        </p>
                        <p className="text-sm" style={{ color: "var(--psp-gray-500)" }}>
                          {coach.role} • {coach.start_year}
                          {coach.end_year ? `–${coach.end_year}` : "–Present"}
                        </p>
                      </div>
                      {coach.former_player_id && (
                        <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-900 font-semibold">
                          Former Player
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {staff.length === 0 && (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p style={{ color: "var(--psp-gray-500)" }}>No coaching staff data available for this program yet.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h2 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                School Info
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt style={{ color: "var(--psp-gray-500)" }}>School</dt>
                  <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{school.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt style={{ color: "var(--psp-gray-500)" }}>Sport</dt>
                  <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{meta.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt style={{ color: "var(--psp-gray-500)" }}>Location</dt>
                  <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>
                    {school.city}, {school.state}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h2 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                Quick Links
              </h2>
              <div className="space-y-2">
                <Link
                  href={`/${sport}/schools/${slug}`}
                  className="block text-sm py-1 hover:underline"
                  style={{ color: "var(--psp-navy)" }}
                >
                  ← Back to School Profile
                </Link>
                <Link
                  href={`/${sport}/leaderboards/rushing?school=${slug}`}
                  className="block text-sm py-1 hover:underline"
                  style={{ color: "var(--psp-navy)" }}
                >
                  📊 Stat Leaders at {school.name}
                </Link>
              </div>
            </div>

            <PSPPromo size="sidebar" variant={2} />
          </div>
        </div>
      </div>
    </>
  );
}
