"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Users, School, GraduationCap, LayoutGrid } from "lucide-react";

interface EntityTypeTabsProps {
  counts: { all: number; player: number; school: number; coach: number };
  query: string;
}

const TABS = [
  { key: "all", label: "All", icon: LayoutGrid },
  { key: "player", label: "Players", icon: Users },
  { key: "school", label: "Schools", icon: School },
  { key: "coach", label: "Coaches", icon: GraduationCap },
] as const;

export default function EntityTypeTabs({ counts, query }: EntityTypeTabsProps) {
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type") || "all";

  return (
    <nav className="border-b border-gray-200 overflow-x-auto" aria-label="Result type filter">
      <div className="max-w-7xl mx-auto px-4 flex gap-0">
        {TABS.map(({ key, label, icon: Icon }) => {
          const count = counts[key as keyof typeof counts];
          const isActive = activeType === key;

          // Build URL preserving other params
          const params = new URLSearchParams(searchParams.toString());
          if (key === "all") params.delete("type");
          else params.set("type", key);
          params.set("q", query);
          const href = `/search?${params.toString()}`;

          return (
            <Link
              key={key}
              href={href}
              className={`inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? "border-[var(--psp-navy)] text-[var(--psp-navy)]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon size={15} />
              {label}
              {count > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-[var(--psp-navy)] text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
