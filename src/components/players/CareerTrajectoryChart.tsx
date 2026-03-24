'use client';

import React, { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';

interface SeasonData {
  label: string;
  stats: Record<string, number>;
}

interface Props {
  seasons: SeasonData[];
  sport: string;
}

/** Sport-specific stat configs: which lines to show and their colors */
const SPORT_STAT_CONFIG: Record<
  string,
  { key: string; label: string; color: string; primary?: boolean }[]
> = {
  football: [
    { key: 'pass_yards', label: 'Pass Yards', color: '#3b82f6' },
    { key: 'rush_yards', label: 'Rush Yards', color: '#f0a500', primary: true },
    { key: 'rec_yards', label: 'Rec Yards', color: '#10b981' },
  ],
  basketball: [
    { key: 'points', label: 'Points', color: '#f0a500', primary: true },
    { key: 'rebounds', label: 'Rebounds', color: '#3b82f6' },
    { key: 'assists', label: 'Assists', color: '#10b981' },
  ],
  baseball: [
    { key: 'hits', label: 'Hits', color: '#f0a500', primary: true },
    { key: 'rbi', label: 'RBI', color: '#3b82f6' },
    { key: 'home_runs', label: 'Home Runs', color: '#ea580c' },
  ],
};

const DARK_BG = '#0a1628';
const GRID_COLOR = '#1f2937'; // gray-800

export default function CareerTrajectoryChart({ seasons, sport }: Props) {
  const statConfig = SPORT_STAT_CONFIG[sport] ?? SPORT_STAT_CONFIG.football;

  // Sort seasons chronologically by label
  const sortedSeasons = useMemo(
    () => [...seasons].sort((a, b) => a.label.localeCompare(b.label)),
    [seasons],
  );

  // Figure out which stats the player actually has (non-zero in at least one season)
  const activeStats = useMemo(() => {
    return statConfig.filter((cfg) =>
      sortedSeasons.some((s) => (s.stats[cfg.key] ?? 0) !== 0),
    );
  }, [statConfig, sortedSeasons]);

  // Nothing to chart
  if (activeStats.length === 0 || sortedSeasons.length === 0) return null;

  const isSingleSeason = sortedSeasons.length === 1;

  if (isSingleSeason) {
    return (
      <SingleSeasonBar
        season={sortedSeasons[0]}
        activeStats={activeStats}
      />
    );
  }

  return (
    <MultiSeasonLine
      seasons={sortedSeasons}
      activeStats={activeStats}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Multi-season line chart                                           */
/* ------------------------------------------------------------------ */

function MultiSeasonLine({
  seasons,
  activeStats,
}: {
  seasons: SeasonData[];
  activeStats: { key: string; label: string; color: string; primary?: boolean }[];
}) {
  const lineData = useMemo(
    () =>
      activeStats.map((cfg) => ({
        id: cfg.label,
        color: cfg.color,
        data: seasons.map((s) => ({
          x: s.label,
          y: s.stats[cfg.key] ?? 0,
        })),
      })),
    [activeStats, seasons],
  );

  const colors = useMemo(() => activeStats.map((s) => s.color), [activeStats]);

  return (
    <div className="w-full">
      <h3
        className="psp-h3 mb-3"
        style={{ color: 'var(--psp-navy, #0a1628)' }}
      >
        Career Trajectory
      </h3>
      <div
        className="w-full rounded-xl overflow-hidden"
        style={{ background: DARK_BG, height: 340 }}
      >
        <ResponsiveLine
          data={lineData}
          colors={colors}
          margin={{ top: 24, right: 24, bottom: 56, left: 56 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false }}
          curve="monotoneX"
          lineWidth={3}
          enablePoints={true}
          pointSize={8}
          pointColor={DARK_BG}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          enableGridX={false}
          enableGridY={true}
          enableArea={false}
          useMesh={true}
          crosshairType="bottom-left"
          theme={{
            text: { fill: '#9ca3af', fontFamily: 'DM Sans, sans-serif', fontSize: 11 },
            grid: { line: { stroke: GRID_COLOR, strokeDasharray: '4 4' } },
            crosshair: { line: { stroke: '#f0a500', strokeWidth: 1, strokeOpacity: 0.5 } },
            tooltip: {
              container: {
                background: '#1e293b',
                color: '#e2e8f0',
                fontSize: 12,
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                fontFamily: 'DM Sans, sans-serif',
              },
            },
            axis: {
              ticks: { text: { fill: '#6b7280', fontSize: 11 } },
              legend: { text: { fill: '#9ca3af', fontSize: 12 } },
            },
          }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            format: (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)),
          }}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              translateY: 52,
              itemWidth: 100,
              itemHeight: 16,
              itemTextColor: '#9ca3af',
              symbolSize: 10,
              symbolShape: 'circle',
            },
          ]}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Single-season bar chart fallback                                  */
/* ------------------------------------------------------------------ */

function SingleSeasonBar({
  season,
  activeStats,
}: {
  season: SeasonData;
  activeStats: { key: string; label: string; color: string; primary?: boolean }[];
}) {
  const barData = useMemo(
    () =>
      activeStats.map((cfg) => ({
        stat: cfg.label,
        value: season.stats[cfg.key] ?? 0,
        color: cfg.color,
      })),
    [activeStats, season],
  );

  const barColors = useMemo(() => activeStats.map((s) => s.color), [activeStats]);

  return (
    <div className="w-full">
      <h3
        className="psp-h3 mb-3"
        style={{ color: 'var(--psp-navy, #0a1628)' }}
      >
        {season.label} Season Stats
      </h3>
      <div
        className="w-full rounded-xl overflow-hidden"
        style={{ background: DARK_BG, height: 280 }}
      >
        <ResponsiveBar
          data={barData}
          keys={['value']}
          indexBy="stat"
          colors={({ data }) => (data as { color: string }).color}
          margin={{ top: 24, right: 24, bottom: 48, left: 56 }}
          padding={0.4}
          borderRadius={4}
          enableLabel={true}
          label={(d) => {
            const v = d.value ?? 0;
            return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);
          }}
          labelTextColor="#ffffff"
          enableGridY={true}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            format: (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)),
          }}
          theme={{
            text: { fill: '#9ca3af', fontFamily: 'DM Sans, sans-serif', fontSize: 11 },
            grid: { line: { stroke: GRID_COLOR, strokeDasharray: '4 4' } },
            tooltip: {
              container: {
                background: '#1e293b',
                color: '#e2e8f0',
                fontSize: 12,
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                fontFamily: 'DM Sans, sans-serif',
              },
            },
            axis: {
              ticks: { text: { fill: '#6b7280', fontSize: 11 } },
            },
          }}
        />
      </div>
    </div>
  );
}
