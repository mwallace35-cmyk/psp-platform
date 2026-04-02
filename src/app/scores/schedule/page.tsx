import type { Metadata } from "next";
import Link from "next/link";
import { SPORT_COLORS_HEX } from "@/lib/constants/sports";
import { SPORT_META, VALID_SPORTS } from "@/lib/sports";
import { Breadcrumb } from "@/components/ui";
import { getMasterScheduleGames } from "@/lib/data/schedule";
import MasterScheduleView from "./MasterScheduleView";

export const metadata: Metadata = {
  title: "Schedule | PhillySportsPack",
  description:
    "This week in Philadelphia high school sports. Scores and schedules across football, basketball, baseball, and more.",
  alternates: { canonical: "https://phillysportspack.com/scores/schedule" },
};

export const revalidate = 1800;

interface PageProps {
  searchParams: Promise<{ sport?: string; week?: string }>;
}

/**
 * Get the Monday-Sunday range for a given date.
 */
function getWeekRange(dateStr?: string): { start: string; end: string; mondayDate: Date } {
  const d = dateStr ? new Date(dateStr + "T12:00:00") : new Date();
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().slice(0, 10),
    end: sunday.toISOString().slice(0, 10),
    mondayDate: monday,
  };
}

export default async function MasterSchedulePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedSport = params.sport || "all";

  // Determine which week to show
  const { start, end, mondayDate } = getWeekRange(params.week);

  // Fetch games for this week
  let games = await getMasterScheduleGames(
    start,
    end,
    selectedSport === "all" ? undefined : selectedSport
  );

  // If no games this week and no explicit week param, try finding the most recent week with games
  let displayWeekStart = start;
  let displayWeekEnd = end;
  let showingRecent = false;

  if (games.length === 0 && !params.week) {
    // Search backwards up to 12 weeks to find games
    for (let i = 1; i <= 12; i++) {
      const prevMonday = new Date(mondayDate);
      prevMonday.setDate(prevMonday.getDate() - 7 * i);
      const prevSunday = new Date(prevMonday);
      prevSunday.setDate(prevMonday.getDate() + 6);
      const prevStart = prevMonday.toISOString().slice(0, 10);
      const prevEnd = prevSunday.toISOString().slice(0, 10);

      const prevGames = await getMasterScheduleGames(
        prevStart,
        prevEnd,
        selectedSport === "all" ? undefined : selectedSport
      );
      if (prevGames.length > 0) {
        games = prevGames;
        displayWeekStart = prevStart;
        displayWeekEnd = prevEnd;
        showingRecent = true;
        break;
      }
    }
  }

  // Compute prev/next week dates for navigation
  const displayMonday = new Date(displayWeekStart + "T12:00:00");
  const prevMonday = new Date(displayMonday);
  prevMonday.setDate(prevMonday.getDate() - 7);
  const nextMonday = new Date(displayMonday);
  nextMonday.setDate(nextMonday.getDate() + 7);

  const prevWeekParam = prevMonday.toISOString().slice(0, 10);
  const nextWeekParam = nextMonday.toISOString().slice(0, 10);
  const thisWeekParam = getWeekRange().start;
  const isCurrentWeek = displayWeekStart === thisWeekParam;

  // Week label
  const weekLabel = `${new Date(displayWeekStart + "T12:00:00").toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" }
  )} - ${new Date(displayWeekEnd + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  // Sport breakdown
  const sportCounts = new Map<string, number>();
  for (const g of games) {
    const sid = (g.sport_id as string) || "unknown";
    sportCounts.set(sid, (sportCounts.get(sid) || 0) + 1);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <Breadcrumb
          items={[
            { label: "Scores", href: "/scores" },
            { label: "Schedule" },
          ]}
        />
      </div>

      {/* Hero */}
      <div className="bg-[var(--psp-navy)] border-b-4 border-[var(--psp-gold)] py-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-bebas text-4xl sm:text-5xl text-white tracking-wider mb-2">
            This Week in Philly Sports
          </h1>
          <p className="text-gray-400 text-base mb-6">
            Scores and schedules across Philadelphia high school sports
          </p>

          {/* Week navigation */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Link
              href={`/scores/schedule?week=${prevWeekParam}${selectedSport !== "all" ? `&sport=${selectedSport}` : ""}`}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Previous week"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>

            <div className="text-center">
              <p className="text-white font-bebas text-xl tracking-wider">
                {weekLabel}
              </p>
              {showingRecent && (
                <p className="text-[var(--psp-gold)] text-[10px] font-medium mt-0.5">
                  Showing most recent week with games
                </p>
              )}
            </div>

            <Link
              href={`/scores/schedule?week=${nextWeekParam}${selectedSport !== "all" ? `&sport=${selectedSport}` : ""}`}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Next week"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {!isCurrentWeek && (
              <Link
                href={`/scores/schedule${selectedSport !== "all" ? `?sport=${selectedSport}` : ""}`}
                className="ml-2 text-xs text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)] font-medium transition"
              >
                This Week
              </Link>
            )}
          </div>

          {/* Sport filter pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href={`/scores/schedule${params.week ? `?week=${params.week}` : ""}`}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                selectedSport === "all"
                  ? "bg-[var(--psp-gold)] text-[var(--psp-navy)]"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              All Sports
            </Link>
            {VALID_SPORTS.map((sportSlug) => {
              const meta = SPORT_META[sportSlug];
              const color = SPORT_COLORS_HEX[sportSlug] || "#f0a500";
              const count = sportCounts.get(sportSlug) || 0;
              const isActive = selectedSport === sportSlug;

              return (
                <Link
                  key={sportSlug}
                  href={`/scores/schedule?sport=${sportSlug}${params.week ? `&week=${params.week}` : ""}`}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition inline-flex items-center gap-1.5 ${
                    isActive
                      ? "text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                  style={isActive ? { backgroundColor: color } : undefined}
                >
                  <span>{meta?.emoji}</span>
                  <span>{meta?.name || sportSlug}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? "bg-white/20" : "bg-white/10"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {games.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <span className="text-4xl block mb-4">📅</span>
            <h3 className="font-bebas text-xl text-[var(--psp-navy)] tracking-wider mb-2">
              No games this week
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {selectedSport !== "all"
                ? `No ${SPORT_META[selectedSport as keyof typeof SPORT_META]?.name || selectedSport} games scheduled for this week.`
                : "No games scheduled across any sport for this week."}
            </p>
            <Link
              href="/scores"
              className="text-[var(--psp-blue)] text-sm font-medium hover:underline"
            >
              View recent scores
            </Link>
          </div>
        ) : (
          <MasterScheduleView
            games={JSON.parse(JSON.stringify(games))}
            selectedSport={selectedSport}
          />
        )}
      </div>
    </main>
  );
}
