"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomNav({ onSearchClick }: { onSearchClick?: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <Link href="/" className={isActive("/") && pathname === "/" ? "active" : ""}>
        <span className="bnav-icon">&#127968;</span>
        Home
      </Link>
      <Link href="/football" className={isActive("/football") ? "active" : ""}>
        <span className="bnav-icon">&#127944;</span>
        Football
      </Link>
      <Link href="/basketball" className={isActive("/basketball") ? "active" : ""}>
        <span className="bnav-icon">&#127936;</span>
        Hoops
      </Link>
      <button
        onClick={onSearchClick}
        type="button"
        aria-label="Search"
      >
        <span className="bnav-icon">&#128269;</span>
        Search
      </button>
      <Link href="/schools" className={isActive("/schools") ? "active" : ""}>
        <span className="bnav-icon">&#9776;</span>
        More
      </Link>
    </nav>
  );
}
