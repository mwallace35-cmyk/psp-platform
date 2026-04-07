"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { AllStar } from "@/content/legends-schema";

export interface AllStarMatch {
  /** Key format: `${team}|${player}|${position ?? ""}|${year}` */
  key: string;
  playerSlug: string;
}

interface Props {
  allStars: AllStar[];
  /** Build-time cache of All-Star → player profile matches. */
  matches?: AllStarMatch[];
  className?: string;
}

type TeamTab = "first" | "second" | "third" | "honorable";

const TEAM_LABELS: Record<TeamTab, string> = {
  first: "First Team",
  second: "Second Team",
  third: "Third Team",
  honorable: "Honorable Mention",
};

type SortKey = "year" | "player" | "position";
type SortDir = "asc" | "desc";

/**
 * Hybrid All-Star table.
 *
 *  - Three/four tabs (First/Second/Third/Honorable), showing only the
 *    teams that have entries.
 *  - Columns sortable by year, player name, or position.
 *  - Toggle to "Timeline" view: one row per year, honorees stacked by tier.
 *  - Names in the build-time match cache link to /players/[slug].
 */
export default function AllStarTable({
  allStars,
  matches = [],
  className = "",
}: Props) {
  const matchMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const match of matches) m.set(match.key, match.playerSlug);
    return m;
  }, [matches]);

  const teamsPresent = useMemo<TeamTab[]>(() => {
    const set = new Set<TeamTab>();
    for (const a of allStars) set.add(a.team as TeamTab);
    return (["first", "second", "third", "honorable"] as const).filter((t) =>
      set.has(t),
    );
  }, [allStars]);

  const [view, setView] = useState<"table" | "timeline">("table");
  const [activeTab, setActiveTab] = useState<TeamTab>(
    teamsPresent[0] ?? "first",
  );
  const [sortKey, setSortKey] = useState<SortKey>("year");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  if (!allStars || allStars.length === 0) return null;

  const rowsForTab = useMemo(() => {
    const filtered = allStars.filter((a) => a.team === activeTab);
    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "year") cmp = a.year - b.year;
      else if (sortKey === "player") cmp = a.player.localeCompare(b.player);
      else cmp = (a.position ?? "").localeCompare(b.position ?? "");
      if (cmp === 0) cmp = a.year - b.year;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [allStars, activeTab, sortKey, sortDir]);

  const years = useMemo(() => {
    const ys = Array.from(new Set(allStars.map((a) => a.year))).sort(
      (x, y) => x - y,
    );
    return ys;
  }, [allStars]);

  function toggleSort(k: SortKey) {
    if (k === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(k);
      setSortDir("asc");
    }
  }

  function keyFor(a: AllStar): string {
    return `${a.team}|${a.player}|${a.position ?? ""}|${a.year}`;
  }

  function renderPlayerCell(a: AllStar) {
    const slug = matchMap.get(keyFor(a));
    if (slug) {
      return (
        <Link
          href={`/players/${slug}`}
          className="text-[var(--psp-navy)] font-semibold hover:text-[var(--psp-gold)] underline decoration-[var(--psp-gold)]/40 underline-offset-2 hover:decoration-[var(--psp-gold)]"
        >
          {a.player}
        </Link>
      );
    }
    return <span className="text-[var(--psp-gray-700)]">{a.player}</span>;
  }

  return (
    <section
      className={`bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden ${className}`}
      aria-label="All-Star honorees"
    >
      {/* Header row: title + view toggle */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 bg-[var(--psp-navy)] text-white">
        <h3 className="font-heading text-base md:text-lg uppercase tracking-wider">
          All-Star Honorees
          <span className="ml-2 text-xs opacity-60">
            ({allStars.length})
          </span>
        </h3>
        <div
          className="flex text-xs rounded-full overflow-hidden border border-white/20"
          role="tablist"
          aria-label="View mode"
        >
          {(["table", "timeline"] as const).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 font-semibold uppercase tracking-wider transition ${
                view === v
                  ? "bg-[var(--psp-gold)] text-[var(--psp-navy)]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "table" ? (
        <>
          {/* Team tabs */}
          {teamsPresent.length > 1 && (
            <div
              role="tablist"
              aria-label="All-Star team tier"
              className="flex gap-1 px-4 py-3 border-b border-[var(--psp-gray-200)] bg-[var(--psp-gray-50)] overflow-x-auto"
            >
              {teamsPresent.map((t) => {
                const count = allStars.filter((a) => a.team === t).length;
                return (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={activeTab === t}
                    onClick={() => setActiveTab(t)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition ${
                      activeTab === t
                        ? "bg-[var(--psp-navy)] text-white"
                        : "text-[var(--psp-gray-700)] hover:bg-white"
                    }`}
                  >
                    {TEAM_LABELS[t]}{" "}
                    <span className="opacity-60">({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Sortable table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--psp-gray-50)] text-[var(--psp-gray-500)] text-xs uppercase tracking-wider">
                <tr>
                  <SortableTh
                    label="Player"
                    k="player"
                    activeKey={sortKey}
                    dir={sortDir}
                    onClick={toggleSort}
                  />
                  <SortableTh
                    label="Pos"
                    k="position"
                    activeKey={sortKey}
                    dir={sortDir}
                    onClick={toggleSort}
                  />
                  <SortableTh
                    label="Year"
                    k="year"
                    activeKey={sortKey}
                    dir={sortDir}
                    onClick={toggleSort}
                  />
                </tr>
              </thead>
              <tbody>
                {rowsForTab.map((a, i) => (
                  <tr
                    key={`${a.player}-${a.year}-${i}`}
                    className="border-t border-[var(--psp-gray-100)] hover:bg-[var(--psp-cream)]/40"
                  >
                    <td className="px-4 py-2">{renderPlayerCell(a)}</td>
                    <td className="px-4 py-2 text-[var(--psp-gray-600)]">
                      {a.position ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-[var(--psp-gray-600)] tabular-nums">
                      {a.year}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="p-5 space-y-4 max-h-[560px] overflow-y-auto">
          {years.map((year) => {
            const forYear = allStars.filter((a) => a.year === year);
            if (forYear.length === 0) return null;
            return (
              <div
                key={year}
                className="grid grid-cols-[56px_1fr] gap-4 items-start"
              >
                <div className="font-heading text-2xl text-[var(--psp-gold)] tabular-nums leading-none pt-1">
                  {year}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {forYear.map((a, i) => (
                    <span
                      key={`${a.player}-${i}`}
                      className="inline-flex items-baseline gap-1.5 text-sm"
                    >
                      <span className="text-[10px] uppercase tracking-wider text-[var(--psp-gray-400)]">
                        {a.team === "honorable" ? "HM" : a.team[0].toUpperCase()}
                      </span>
                      {renderPlayerCell(a)}
                      {a.position && (
                        <span className="text-xs text-[var(--psp-gray-500)]">
                          {a.position}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function SortableTh({
  label,
  k,
  activeKey,
  dir,
  onClick,
}: {
  label: string;
  k: SortKey;
  activeKey: SortKey;
  dir: SortDir;
  onClick: (k: SortKey) => void;
}) {
  const active = k === activeKey;
  return (
    <th scope="col" className="text-left">
      <button
        type="button"
        onClick={() => onClick(k)}
        className={`w-full px-4 py-3 text-left flex items-center gap-1 ${
          active ? "text-[var(--psp-navy)]" : "hover:text-[var(--psp-navy)]"
        }`}
      >
        {label}
        <span className="text-[10px]" aria-hidden>
          {active ? (dir === "asc" ? "\u25b2" : "\u25bc") : "\u25b4"}
        </span>
      </button>
    </th>
  );
}
