import Link from "next/link";

const SPORT_LINKS = [
  { href: "/football", label: "Football" },
  { href: "/basketball", label: "Basketball" },
  { href: "/baseball", label: "Baseball" },
  { href: "/track-field", label: "Track & Field" },
  { href: "/lacrosse", label: "Lacrosse" },
  { href: "/wrestling", label: "Wrestling" },
  { href: "/soccer", label: "Soccer" },
];

const DATA_LINKS = [
  { href: "/search", label: "Search" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/records", label: "Records" },
  { href: "/championships", label: "Championships" },
  { href: "/compare", label: "Compare Players" },
];

const ABOUT_LINKS = [
  { href: "/about", label: "About PSP" },
  { href: "/methodology", label: "Data Sources" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--psp-navy)" }}>
      {/* Credit banner */}
      <div
        className="text-center py-4 border-b"
        style={{ borderColor: "var(--psp-navy-mid)", background: "var(--psp-navy-mid)" }}
      >
        <p className="text-sm" style={{ color: "var(--psp-gold)" }}>
          Data compiled by <strong>Ted Silary</strong> — Philadelphia&apos;s high school sports historian
        </p>
      </div>

      {/* Footer links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm"
                style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
              >
                PSP
              </div>
              <span
                className="font-bold text-lg"
                style={{ color: "white", fontFamily: "Bebas Neue, sans-serif" }}
              >
                PhillySportsPack
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              The most comprehensive database of Philadelphia high school sports data — covering football, basketball, baseball, and more.
            </p>
          </div>

          {/* Sports */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Sports
            </h4>
            <ul className="space-y-2">
              {SPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Data */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Data
            </h4>
            <ul className="space-y-2">
              {DATA_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              About
            </h4>
            <ul className="space-y-2">
              {ABOUT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t py-4"
        style={{ borderColor: "var(--psp-navy-mid)" }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} PhillySportsPack.com. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built by Mike Wallace &bull; Data by Ted Silary
          </p>
        </div>
      </div>
    </footer>
  );
}
