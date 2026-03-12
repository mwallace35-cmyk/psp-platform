import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui";
import { createStaticClient } from "@/lib/supabase/static";
import { captureError } from "@/lib/error-tracking";

export const revalidate = 86400; // Daily ISR

export const metadata: Metadata = {
  title: "About PhillySportsPack",
  description:
    "Learn the story of PhillySportsPack — Ted Silary's life work documenting Philadelphia high school sports history. The most comprehensive database ever assembled.",
  openGraph: {
    title: "About PhillySportsPack",
    description:
      "The story of Ted Silary's decades covering Philadelphia high school sports, now a digital legacy.",
    type: "website",
    url: "https://phillysportspack.com/about",
  },
};

async function getAboutStats() {
  try {
    const supabase = createStaticClient();
    const [
      { count: playerCount },
      { count: schoolCount },
      { count: championshipCount },
      { data: earliestSeason },
    ] = await Promise.all([
      supabase.from("players").select("id", { count: "exact", head: true }),
      supabase
        .from("schools")
        .select("id", { count: "exact", head: true })
        .not("deleted_at", "is", null),
      supabase.from("championships").select("id", { count: "exact", head: true }),
      supabase
        .from("seasons")
        .select("label")
        .order("label", { ascending: true })
        .limit(1)
        .single(),
    ]);

    return {
      players: playerCount ?? 47093,
      schools: schoolCount ?? 1270,
      championships: championshipCount ?? 1534,
      earliestYear: earliestSeason?.label?.split("-")[0] ?? "1937",
    };
  } catch (error) {
    captureError(error, { function: "getAboutStats" });
    return {
      players: 47093,
      schools: 1270,
      championships: 1534,
      earliestYear: "1937",
    };
  }
}

export default async function AboutPage() {
  const stats = await getAboutStats();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PhillySportsPack",
    url: "https://phillysportspack.com",
    logo: "https://phillysportspack.com/psp-logo.svg",
    description:
      "The definitive Philadelphia high school sports database, compiled by Ted Silary over decades of dedicated coverage.",
    founder: {
      "@type": "Person",
      name: "Ted Silary",
      description: "Legendary Philadelphia high school sports journalist",
    },
    sameAs: ["https://phillysportspack.com"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: "https://phillysportspack.com",
    },
  };

  return (
    <main id="main-content">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "About" }]} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="container py-12 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bebas font-bold mb-6 text-[var(--psp-navy)]">
              The Story of PhillySportsPack
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-dm-sans leading-relaxed">
              Philadelphia has given the world some of the greatest athletes in sports history.
              Now, for the first time, that legacy is fully documented in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Ted's Story Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-[var(--psp-navy)] to-[#0f2040] text-white">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bebas font-bold mb-8 text-[var(--psp-gold)]">
            Ted Silary's Life Work
          </h2>
          <div className="prose prose-invert max-w-none space-y-6 font-dm-sans text-base md:text-lg leading-relaxed">
            <p>
              Ted Silary spent decades as Philadelphia's premier high school sports journalist.
              Before computers, smartphones, and the internet made information instant and
              accessible, Ted did it by hand — calling coaches, visiting practices, attending
              games, and meticulously recording every stat, every name, every championship.
            </p>
            <p>
              His work appeared in the Philadelphia Daily News, publications across the region,
              and on tedsilary.com, a pioneering independent sports website. But his real legacy
              wasn't just reporting — it was <strong>preservation</strong>. Ted understood that
              these stories, these achievements, these athletes deserved to be remembered.
            </p>
            <p>
              For over 25 years, Ted collected data from Philadelphia's seven high school sports
              (football, basketball, baseball, soccer, lacrosse, track & field, and wrestling).
              He tracked individual statistics, team records, championships, and the players who
              went on to play college and professional sports.
            </p>
            <p>
              This database is Ted's gift to Philadelphia. It's proof that high school athletics
              matter. That local heroes deserve recognition. That the traditions built by Catholic
              League, Public League, and Inter-Ac champions are worth preserving.
            </p>
          </div>
        </div>
      </section>

      {/* The Platform Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bebas font-bold mb-8 text-[var(--psp-navy)] dark:text-white">
            Building the Digital Legacy
          </h2>
          <div className="space-y-6 font-dm-sans text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              In 2024, Mike Wallace took Ted's decades of research and transformed it into a
              modern, searchable platform. PhillySportsPack.com now makes this data freely
              available to anyone who wants to discover Philadelphia high school sports history.
            </p>
            <p>
              Built on a PostgreSQL database with a Next.js web interface, PhillySportsPack is
              designed to be fast, beautiful, and intuitive. Whether you're looking for your
              school's all-time record, the NFL players produced by your rival, or career
              statistics for a forgotten legend, it's all here.
            </p>
            <p>
              The platform continues to grow. We're constantly adding new data, refining
              statistics, and connecting the archive to comprehensive box scores and game
              details. And we're always looking to honor more athletes and preserve more
              stories.
            </p>
          </div>
        </div>
      </section>

      {/* By the Numbers Section */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bebas font-bold mb-12 text-[var(--psp-navy)] dark:text-white text-center">
            By the Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              value={stats.players.toLocaleString()}
              label="Players"
              emoji="👤"
            />
            <StatCard
              value={stats.schools.toLocaleString()}
              label="Schools"
              emoji="🏫"
            />
            <StatCard
              value={stats.championships.toLocaleString()}
              label="Championships"
              emoji="🏆"
            />
            <StatCard
              value={`${stats.earliestYear}-${new Date().getFullYear()}`}
              label="Years Covered"
              emoji="📅"
            />
          </div>
        </div>
      </section>

      {/* What Makes PSP Special */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bebas font-bold mb-12 text-[var(--psp-navy)] dark:text-white">
            What Makes PSP Special
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              title="Comprehensive"
              description="7 sports, 13 leagues, 90+ years of championships, and detailed player statistics going back decades."
            />
            <FeatureCard
              title="Authentic"
              description="Data compiled by a legendary journalist who covered Philadelphia high school sports for his entire career."
            />
            <FeatureCard
              title="Free & Open"
              description="No paywalls, no subscriptions. PhillySportsPack is available to everyone because these are community stories."
            />
            <FeatureCard
              title="Living Project"
              description="We're constantly verifying, enriching, and expanding the database with new sources and deeper connections."
            />
          </div>
        </div>
      </section>

      {/* NCAA & Pro Pipeline */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bebas font-bold mb-8 text-[var(--psp-gold)]">
            The Pipeline to the Next Level
          </h2>
          <p className="text-lg mb-8 font-dm-sans leading-relaxed">
            Philadelphia high schools have produced some of the greatest athletes of all time.
          </p>
          <div className="grid md:grid-cols-3 gap-6 font-dm-sans">
            <div className="bg-white/10 rounded-lg p-6 border border-white/20">
              <h3 className="text-2xl font-bebas font-bold mb-3">NFL Legends</h3>
              <p>
                From St. Joseph's Prep to Roman Catholic, Philadelphia has sent 50+ players to
                the NFL, including future Hall of Famers.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 border border-white/20">
              <h3 className="text-2xl font-bebas font-bold mb-3">NBA Icons</h3>
              <p>
                Wilt Chamberlain, Kobe Bryant, Earl Monroe. The list of Philly high school
                hoops stars who made it to the NBA is remarkable.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 border border-white/20">
              <h3 className="text-2xl font-bebas font-bold mb-3">MLB Stars</h3>
              <p>
                Mike Piazza, Reggie Jackson, Roy Campanella. Philadelphia's high schools have
                been a pipeline to baseball's biggest stage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bebas font-bold mb-6 text-[var(--psp-navy)] dark:text-white">
            Explore the Data
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 font-dm-sans max-w-2xl mx-auto">
            Dive into Philadelphia high school sports history. Search for your school, track
            your favorite athletes, discover hidden gems, and celebrate the champions who built
            this legacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-block px-8 py-3 bg-[var(--psp-navy)] hover:bg-[#0f2040] text-white font-bebas text-lg rounded transition"
            >
              Search Players & Schools
            </Link>
            <Link
              href="/football"
              className="inline-block px-8 py-3 border-2 border-[var(--psp-navy)] text-[var(--psp-navy)] dark:text-white dark:border-white hover:bg-[var(--psp-navy)] hover:text-white dark:hover:bg-white dark:hover:text-[var(--psp-navy)] font-bebas text-lg rounded transition"
            >
              Browse Sports
            </Link>
          </div>
        </div>
      </section>

      {/* Credits */}
      <section className="py-8 md:py-12 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700">
        <div className="container max-w-4xl text-center font-dm-sans text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            <strong>Data compiled by:</strong> Ted Silary
          </p>
          <p>
            <strong>Platform built by:</strong> Mike Wallace
          </p>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  value,
  label,
  emoji,
}: {
  value: string;
  label: string;
  emoji: string;
}) {
  return (
    <div className="bg-gradient-to-br from-[var(--psp-navy)] to-[#0f2040] text-white rounded-lg p-6 text-center">
      <div className="text-4xl mb-3">{emoji}</div>
      <div className="text-3xl md:text-4xl font-bebas font-bold text-[var(--psp-gold)] mb-2">
        {value}
      </div>
      <div className="text-sm md:text-base font-dm-sans">{label}</div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-l-4 border-[var(--psp-gold)] rounded p-6">
      <h3 className="text-xl font-bebas font-bold text-[var(--psp-navy)] dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 font-dm-sans leading-relaxed">
        {description}
      </p>
    </div>
  );
}
