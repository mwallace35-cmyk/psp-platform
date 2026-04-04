"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { VALID_SPORTS, SPORT_META } from "@/lib/sports";

const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "camp", label: "Camps" },
  { value: "clinic", label: "Clinics" },
  { value: "combine", label: "Combines" },
  { value: "showcase", label: "Showcases" },
  { value: "tournament", label: "Tournaments" },
  { value: "award-ceremony", label: "Awards" },
  { value: "tryout", label: "Tryouts" },
];

const WHEN_OPTIONS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
  { value: "past", label: "Past Events" },
];

export default function EventFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentType = searchParams.get("type") || "all";
  const currentSport = searchParams.get("sport") || "all";
  const currentWhen = searchParams.get("when") || "upcoming";

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || (key === "when" && value === "upcoming")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page"); // Reset pagination on filter change
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6">
      {/* Type row */}
      <FilterRow label="Type">
        {TYPE_OPTIONS.map((opt) => (
          <FilterPill
            key={opt.value}
            label={opt.label}
            active={currentType === opt.value}
            onClick={() => setFilter("type", opt.value)}
          />
        ))}
      </FilterRow>

      {/* Sport row */}
      <FilterRow label="Sport">
        <FilterPill
          label="All Sports"
          active={currentSport === "all"}
          onClick={() => setFilter("sport", "all")}
        />
        {VALID_SPORTS.map((sport) => {
          const meta = SPORT_META[sport];
          return (
            <FilterPill
              key={sport}
              label={meta.name}
              active={currentSport === sport}
              onClick={() => setFilter("sport", sport)}
            />
          );
        })}
      </FilterRow>

      {/* When row */}
      <FilterRow label="When">
        {WHEN_OPTIONS.map((opt) => (
          <FilterPill
            key={opt.value}
            label={opt.label}
            active={currentWhen === opt.value}
            onClick={() => setFilter("when", opt.value)}
          />
        ))}
      </FilterRow>
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 items-center mb-3">
      <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-gray-500 mr-1 min-w-12">
        {label}
      </span>
      {children}
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition border cursor-pointer ${
        active
          ? "bg-[var(--psp-navy)] text-white border-[var(--psp-navy)]"
          : "bg-white text-gray-600 border-gray-200 hover:border-[var(--psp-gold)] hover:text-[var(--psp-gold-text)]"
      }`}
    >
      {label}
    </button>
  );
}
