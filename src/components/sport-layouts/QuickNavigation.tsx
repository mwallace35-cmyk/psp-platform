import Link from "next/link";

interface QuickNavItem {
  icon: string;
  label: string;
  description: string;
  href: string;
}

interface QuickNavigationProps {
  sport: string;
  sportColor: string;
}

export default function QuickNavigation({ sport, sportColor }: QuickNavigationProps) {
  // Default leaderboard stat for each sport
  const leaderboardStats: Record<string, string> = {
    football: "rushing",
    basketball: "scoring",
    baseball: "batting-avg",
    "track-field": "100m",
    lacrosse: "goals",
    wrestling: "pins",
    soccer: "goals",
  };

  const defaultStat = leaderboardStats[sport] || "scoring";

  // Build navigation items
  const navItems: QuickNavItem[] = [
    {
      icon: "📊",
      label: "Leaderboards",
      description: "Top performers & stat leaders",
      href: `/${sport}/leaderboards/${defaultStat}`,
    },
    {
      icon: "🏆",
      label: "Records",
      description: "All-time records & achievements",
      href: `/${sport}/records`,
    },
    {
      icon: "👑",
      label: "Championships",
      description: "Title winners through the years",
      href: `/${sport}/championships`,
    },
    {
      icon: "⭐",
      label: "Awards & Honors",
      description: "All-City, All-League, Player of the Year & more",
      href: `/${sport}/awards`,
    },
    ...(sport === "football"
      ? [
          {
            icon: "🎯",
            label: "City All-Star Game",
            description: "Public vs Non-Public rivalry (1975–2019)",
            href: `/${sport}/city-all-star-game`,
          },
        ]
      : []),
    {
      icon: "🏫",
      label: "Schools",
      description: "Browse all participating schools",
      href: `/${sport}/schools`,
    },
    {
      icon: "🔍",
      label: "Search",
      description: "Find players, schools & stats",
      href: `/search?q=&sport=${sport}`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group relative overflow-hidden rounded-lg border-2 transition-all duration-300 hover:shadow-lg"
            style={{
              borderColor: "#f0a500",
              backgroundColor: "#0a1628",
            }}
          >
            {/* Hover overlay gradient */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              style={{ backgroundColor: "#f0a500" }}
              aria-hidden="true"
            />

            <div className="relative p-6 flex flex-col h-full">
              {/* Icon */}
              <div className="text-4xl mb-3" aria-hidden="true">{item.icon}</div>

              {/* Label */}
              <h3
                className="text-lg font-black mb-1 group-hover:translate-x-1 transition-transform duration-300 font-bebas uppercase tracking-wider"
                style={{
                  color: "#f0a500",
                }}
              >
                {item.label}
              </h3>

              {/* Description */}
              <p
                className="text-sm flex-grow"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#ffffff",
                  opacity: 0.85,
                  lineHeight: 1.5,
                }}
              >
                {item.description}
              </p>

              {/* Arrow indicator (hidden on desktop hover) */}
              <div className="mt-4 flex items-center gap-2">
                <span
                  className="text-xs font-semibold uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-300"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#3b82f6",
                  }}
                >
                  Explore
                </span>
                <span
                  className="group-hover:translate-x-0.5 transition-transform duration-300"
                  style={{ color: "#3b82f6" }}
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
