"use client";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * Sticky toolbar shell for schedule pages.
 * Wraps sport-specific filter controls with consistent styling.
 */
export default function ScheduleToolbar({ children }: Props) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// REUSABLE FILTER SUB-COMPONENTS
// ============================================================================

interface ViewToggleProps {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
}

/** Pill-style view mode toggle (e.g., League | Weekly | Team) */
export function ViewToggle({ options, selected, onChange }: ViewToggleProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
            selected === opt.value
              ? "bg-[var(--psp-navy)] text-white shadow-sm"
              : "text-gray-400 hover:text-[var(--psp-navy)]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

interface FilterPillsProps {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
  className?: string;
}

/** Small pill-style filter buttons (e.g., All | Upcoming | Results) */
export function FilterPills({ options, selected, onChange, className = "" }: FilterPillsProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition ${
            selected === opt.value
              ? "bg-[var(--psp-navy)] text-white"
              : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

interface TeamSelectorProps {
  teams: { slug: string; name: string; gameCount: number }[];
  selected: string;
  onChange: (slug: string) => void;
}

/** Dropdown to filter by a specific team */
export function TeamSelector({ teams, selected, onChange }: TeamSelectorProps) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-[var(--psp-navy)] focus:ring-2 focus:ring-[var(--psp-gold)]/50 focus:border-[var(--psp-gold)]"
    >
      <option value="all">All Teams</option>
      <optgroup label="Teams">
        {teams.map((t) => (
          <option key={t.slug} value={t.slug}>
            {t.name} ({t.gameCount})
          </option>
        ))}
      </optgroup>
    </select>
  );
}

interface LeagueFilterProps {
  leagues: { id: number; name: string; short: string }[];
  selected: string;
  onChange: (value: string) => void;
}

/** League filter pills for schedule pages */
export function LeagueFilter({ leagues, selected, onChange }: LeagueFilterProps) {
  return (
    <div className="flex gap-1">
      <button
        onClick={() => onChange("all")}
        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
          selected === "all"
            ? "bg-[var(--psp-navy)] text-white"
            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
        }`}
      >
        All
      </button>
      {leagues.map((lg) => (
        <button
          key={lg.id}
          onClick={() => onChange(String(lg.id))}
          className={`px-3 py-1 rounded-full text-xs font-medium transition ${
            selected === String(lg.id)
              ? "bg-[var(--psp-navy)] text-white"
              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
          }`}
        >
          {lg.short}
        </button>
      ))}
    </div>
  );
}
