"use client";

import Link from "next/link";
import SortableTable, { SortableColumn } from "@/components/ui/SortableTable";
import type { SchoolWinsRow, SchoolChampionshipRow, SchoolStatProductionRow } from "@/lib/data";

function formatNum(n: unknown): string {
  if (n == null) return "\u2014";
  const num = typeof n === "string" ? parseFloat(n) : (n as number);
  if (isNaN(num)) return "\u2014";
  return num.toLocaleString();
}

function formatPct(n: unknown): string {
  if (n == null) return "\u2014";
  const num = typeof n === "string" ? parseFloat(n) : (n as number);
  if (isNaN(num)) return "\u2014";
  return (num * 100).toFixed(1) + "%";
}

function SchoolLink({ name, slug, sport }: { name: string; slug: string; sport: string }) {
  return (
    <Link
      href={`/${sport}/schools/${slug}`}
      className="font-medium text-sm hover:underline"
      style={{ color: "var(--psp-navy)" }}
    >
      {name}
    </Link>
  );
}

// ─── Wins Tab ──────────────────────────────────────────────
export function WinsTable({ data, sport }: { data: SchoolWinsRow[]; sport: string }) {
  const columns: SortableColumn[] = [
    { key: "rank", label: "#", align: "center", sortable: false },
    {
      key: "school_name", label: "School", sortable: true, primary: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {row?.logo_url && (
            <img src={row.logo_url as string} alt={`${String(value)} logo`} className="w-6 h-6 rounded" loading="lazy" />
          )}
          <div>
            <SchoolLink name={String(value)} slug={row?.school_slug as string} sport={sport} />
            {row?.league_name && (
              <div className="text-xs" style={{ color: "var(--psp-gray-400)" }}>{row.league_name as string}</div>
            )}
          </div>
        </div>
      ),
    },
    { key: "total_wins", label: "W", align: "right", sortable: true, render: (v) => formatNum(v) },
    { key: "total_losses", label: "L", align: "right", sortable: true, render: (v) => formatNum(v) },
    { key: "total_ties", label: "T", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
    { key: "win_pct", label: "Win%", align: "right", sortable: true, render: (v) => formatPct(v) },
    { key: "total_seasons", label: "Seasons", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
    { key: "championship_count", label: "Titles", align: "right", sortable: true, render: (v) => {
      const n = Number(v);
      return n > 0 ? <span style={{ color: "var(--psp-gold)" }} className="font-semibold">{n}</span> : "0";
    }},
    { key: "total_points_for", label: "PF", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
  ];

  const tableData = data.map((row, idx) => ({
    id: String(row.school_id),
    rank: idx + 1,
    ...row,
  }));

  return (
    <SortableTable
      columns={columns}
      data={tableData}
      highlightTop3={true}
      mobileCardMode={true}
      emptyMessage="No school records available"
      ariaLabel="School wins leaderboard"
    />
  );
}

// ─── Championships Tab ─────────────────────────────────────
export function ChampionshipsTable({ data, sport }: { data: SchoolChampionshipRow[]; sport: string }) {
  const columns: SortableColumn[] = [
    { key: "rank", label: "#", align: "center", sortable: false },
    {
      key: "school_name", label: "School", sortable: true, primary: true,
      render: (value, row) => <SchoolLink name={String(value)} slug={row?.school_slug as string} sport={sport} />,
    },
    {
      key: "total_championships", label: "Total", align: "right", sortable: true,
      render: (v) => <span className="font-bold" style={{ color: "var(--psp-gold)" }}>{formatNum(v)}</span>,
    },
    { key: "fb_champs", label: "FB", align: "right", sortable: true, render: (v) => formatNum(v) },
    { key: "bb_champs", label: "BB", align: "right", sortable: true, render: (v) => formatNum(v) },
    { key: "base_champs", label: "BSB", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
    { key: "other_champs", label: "Other", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
  ];

  const tableData = data.map((row, idx) => ({
    id: String(row.school_id),
    rank: idx + 1,
    ...row,
  }));

  return (
    <SortableTable
      columns={columns}
      data={tableData}
      highlightTop3={true}
      mobileCardMode={true}
      emptyMessage="No championship data available"
      ariaLabel="School championships leaderboard"
    />
  );
}

// ─── Stat Production Tab ───────────────────────────────────
export function FootballStatsTable({ data, sport }: { data: SchoolStatProductionRow[]; sport: string }) {
  const columns: SortableColumn[] = [
    { key: "rank", label: "#", align: "center", sortable: false },
    {
      key: "school_name", label: "School", sortable: true, primary: true,
      render: (value, row) => <SchoolLink name={String(value)} slug={row?.school_slug as string} sport={sport} />,
    },
    { key: "total_players", label: "Players", align: "right", sortable: true, render: (v) => formatNum(v) },
    { key: "total_rush_yards", label: "Rush Yds", align: "right", sortable: true, render: (v) => formatNum(v) },
    { key: "total_pass_yards", label: "Pass Yds", align: "right", sortable: true, render: (v) => formatNum(v) },
    { key: "total_yards", label: "Total Yds", align: "right", sortable: true, render: (v) => {
      return <span className="font-semibold">{formatNum(v)}</span>;
    }},
    { key: "total_td", label: "Total TD", align: "right", sortable: true, render: (v) => formatNum(v) },
    { key: "total_tackles", label: "Tackles", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
    { key: "total_sacks", label: "Sacks", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
    { key: "total_interceptions", label: "INT", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
  ];

  const tableData = data.map((row, idx) => ({
    id: String(row.school_id),
    rank: idx + 1,
    ...row,
  }));

  return (
    <SortableTable
      columns={columns}
      data={tableData}
      highlightTop3={true}
      mobileCardMode={true}
      emptyMessage="No stat production data available"
      ariaLabel="School stat production leaderboard"
    />
  );
}

export function BasketballStatsTable({ data, sport }: { data: SchoolStatProductionRow[]; sport: string }) {
  const columns: SortableColumn[] = [
    { key: "rank", label: "#", align: "center", sortable: false },
    {
      key: "school_name", label: "School", sortable: true, primary: true,
      render: (value, row) => <SchoolLink name={String(value)} slug={row?.school_slug as string} sport={sport} />,
    },
    { key: "total_players", label: "Players", align: "right", sortable: true, render: (v) => formatNum(v) },
    {
      key: "total_points", label: "Points", align: "right", sortable: true,
      render: (v) => <span className="font-semibold">{formatNum(v)}</span>,
    },
    { key: "total_rebounds", label: "REB", align: "right", sortable: true, render: (v) => formatNum(v) },
    { key: "total_assists", label: "AST", align: "right", sortable: true, render: (v) => formatNum(v) },
    { key: "total_steals", label: "STL", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
    { key: "total_blocks", label: "BLK", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
    { key: "total_games", label: "GP", align: "right", sortable: true, hideOnMobile: true, render: (v) => formatNum(v) },
  ];

  const tableData = data.map((row, idx) => ({
    id: String(row.school_id),
    rank: idx + 1,
    ...row,
  }));

  return (
    <SortableTable
      columns={columns}
      data={tableData}
      highlightTop3={true}
      mobileCardMode={true}
      emptyMessage="No stat production data available"
      ariaLabel="School stat production leaderboard"
    />
  );
}
