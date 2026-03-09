# PSP Data Visualization Components

A collection of production-ready React visualization components built for PhillySportsPack.com, following **Edward Tufte's data visualization principles** and **Mike Bostock's interactive design patterns**. All components use pure SVG (no external charting libraries) for maximum control and performance.

## Philosophy

These components embrace:
- **High data-ink ratio**: Every pixel conveys information
- **Direct labeling**: No legends when labels can be placed directly
- **Honest scales**: Global min/max across comparisons for fair representation
- **Minimal chartjunk**: No unnecessary decorations, gridlines only when needed
- **Interactivity**: Hover reveals context; click navigates to details

---

## Components

### 1. **CareerTrajectoryChart**

Line chart showing a player's statistics progression across multiple seasons with league average overlay.

#### Props
```typescript
interface CareerTrajectoryChartProps {
  seasons: SeasonData[];        // Array of {year, value, label?, isChampionship?}
  stat: string;                 // Statistic name (e.g., "Passing Yards")
  sport: string;                // Sport (football, basketball, baseball, etc.)
  leagueAvg?: Array<{year, value}>;  // Optional league average line
  maxValue?: number;            // Fixed max value (defaults to data max)
  height?: number;              // SVG height in px (default: 300)
  hideAverage?: boolean;        // Hide league average line
}
```

#### Features
- Gold line for player, gray dashed line for league average
- Peak season highlighted with gold circle
- Championship seasons marked with trophy icon
- Responsive: mobile shows every other year label, desktop shows all
- Hover reveals exact values in tooltip
- Bottom metadata: peak value, average, season count

#### Example
```tsx
import { CareerTrajectoryChart } from '@/components/viz';

<CareerTrajectoryChart
  seasons={[
    { year: '2019-20', value: 1500, isChampionship: true },
    { year: '2020-21', value: 1800 },
    { year: '2021-22', value: 2100 },
  ]}
  stat="Passing Yards"
  sport="football"
  leagueAvg={[
    { year: '2019-20', value: 1200 },
    { year: '2020-21', value: 1300 },
    { year: '2021-22', value: 1400 },
  ]}
/>
```

---

### 2. **DynastyTimeline**

Horizontal timeline showing a school's multi-year performance with coaching eras and championship markers.

#### Props
```typescript
interface DynastyTimelineProps {
  schoolName: string;           // School name
  seasons: SeasonRecord[];      // Array of {year, wins, losses, championships?, coach?}
  sport: string;                // Sport (football, basketball, etc.)
}
```

#### Features
- Win-loss percentage encoded as color gradient: red (30%) → orange → yellow → green (70%+)
- Championship years marked with gold diamonds
- Coaching era background bands (alternating light/dark)
- Hover shows season details (W-L record, win%)
- Era summary table below showing total W-L and coach name
- Horizontally scrollable for long timelines

#### Example
```tsx
import { DynastyTimeline } from '@/components/viz';

<DynastyTimeline
  schoolName="St. Joseph's Prep"
  seasons={[
    { year: 2015, wins: 12, losses: 2, coach: "Coach A", championships: ["PCAL"] },
    { year: 2016, wins: 14, losses: 0, coach: "Coach A", championships: ["PCAL", "State"] },
    { year: 2017, wins: 10, losses: 4, coach: "Coach B" },
  ]}
  sport="football"
/>
```

---

### 3. **EraComparisonTool**

Radar/spider chart with side-by-side stats table for comparing up to 4 players across different eras.

#### Props
```typescript
interface EraComparisonToolProps {
  players: PlayerData[];        // Array of {name, stats, era, seasonYear}
  sport: string;                // Sport name
  maxPlayers?: number;          // Max players to display (default: 4)
}
```

#### Features
- Toggle between raw stats and era-adjusted (z-score) values
- Selectable stat pills (top 8 stats by default)
- Radar chart with one polygon per player
- Corresponding stats table with raw + adjusted values
- Green/red highlighting for positive/negative era-adjusted performance
- Color-coded player legend (gold, blue, red, purple)

#### Example
```tsx
import { EraComparisonTool } from '@/components/viz';

<EraComparisonTool
  players={[
    { name: "Player A", era: "1990s", seasonYear: 1995, stats: { rushing: 1200, passing: 0 } },
    { name: "Player B", era: "2020s", seasonYear: 2022, stats: { rushing: 1100, passing: 500 } },
  ]}
  sport="football"
/>
```

---

### 4. **SmallMultiples**

Grid of sparklines for comparing many schools/players at once. Following Tufte's principle of small multiples.

#### Props
```typescript
interface SmallMultiplesProps {
  items: SmallMultiplesItem[];  // Array of {name, slug, data: number[]}
  sport: string;                // Sport name
  statName: string;             // Statistic name
  columns?: number;             // Grid columns (default: 4)
  onItemClick?: (slug: string) => void;  // Click handler
}
```

#### Features
- Responsive grid: 1 col (mobile) → 2 (tablet) → 4 (desktop)
- All sparklines on same global scale (honest comparison)
- Hover reveals min/avg/max stats for each item
- Clickable cards navigate to profile pages
- Info box explains honest scale principle
- Sport-specific colors

#### Example
```tsx
import { SmallMultiples } from '@/components/viz';

<SmallMultiples
  items={[
    { name: "School A", slug: "school-a", data: [10, 15, 20, 18, 22] },
    { name: "School B", slug: "school-b", data: [12, 14, 16, 20, 19] },
  ]}
  sport="football"
  statName="Wins Per Season"
  columns={3}
/>
```

---

### 5. **StatHeatmap**

Color-coded data table where numeric cells are highlighted by percentile within their column.

#### Props
```typescript
interface StatHeatmapProps {
  data: RowData[];              // Array of row objects
  columns: SortableColumn[];    // Column definitions
  colorScale?: 'green-red' | 'blue-gold';  // Color direction
  highlightTop3?: boolean;      // Highlight top 3 values with gold ring
  minSampleSize?: number;       // Min values required for heatmap (default: 5)
}
```

#### Features
- Percentile coloring: white (low) → gold (high) or green → red
- Top 3 values in each column highlighted with gold ring
- Hover shows percentile value
- Integrates with sortable table pattern
- Numeric columns only (non-numeric columns stay neutral)
- Min sample size filter to avoid outliers

#### Example
```tsx
import { StatHeatmap } from '@/components/viz';

<StatHeatmap
  data={[
    { rank: 1, name: "Player A", points: 2000, assists: 500 },
    { rank: 2, name: "Player B", points: 1800, assists: 600 },
  ]}
  columns={[
    { key: 'rank', label: 'Rank' },
    { key: 'name', label: 'Player' },
    { key: 'points', label: 'Points' },
    { key: 'assists', label: 'Assists' },
  ]}
  colorScale="blue-gold"
/>
```

---

### 6. **PipelineSankey**

Sankey-style flow diagram showing player progression from high school → college → professional.

#### Props
```typescript
interface PipelineSankeyProps {
  flows: FlowData[];            // Array of {from, to, count, names?}
  title?: string;               // Diagram title
  subtitle?: string;            // Subtitle
}
```

#### Features
- Three-column layout: High School → College → Pro
- Node size proportional to total player count
- Flow width proportional to number of players
- Color-coded by stage: Navy (HS) → Blue (College) → Gold (Pro)
- Hover highlights connected flows
- Click-able "View List" to see player names
- Flow details table with sorting by player count

#### Example
```tsx
import { PipelineSankey } from '@/components/viz';

<PipelineSankey
  flows={[
    { from: "0_St. Joseph's Prep", to: "1_Penn State", count: 5, names: ["Player A", "Player B"] },
    { from: "1_Penn State", to: "2_NFL", count: 3, names: ["Player A"] },
  ]}
  title="PSP to College to Pro"
/>
```

---

## Usage Patterns

### Importing
```typescript
// Import specific component
import { CareerTrajectoryChart } from '@/components/viz';

// Import all
import {
  CareerTrajectoryChart,
  DynastyTimeline,
  EraComparisonTool,
  SmallMultiples,
  StatHeatmap,
  PipelineSankey,
} from '@/components/viz';
```

### Server vs. Client
- All components are **client components** (`'use client'` directive)
- Safe to use in Next.js app router with `use client` parent boundary
- Data fetching should happen in parent server component and passed as props

### Styling
- All components use Tailwind CSS classes
- PSP brand colors via CSS variables: `--psp-navy`, `--psp-gold`, `--psp-blue`
- Sport colors: `--fb` (football), `--bb` (basketball), `--base` (baseball), etc.
- Responsive via Tailwind breakpoints (sm, md, lg)

---

## Design Principles Applied

### Edward Tufte
1. **High data-ink ratio**: Every visual element serves data
2. **Minimize chartjunk**: No unnecessary decorations or 3D effects
3. **Direct labeling**: Labels placed directly on data, not in legends
4. **Small multiples**: Compare many items at once with consistent scale
5. **Layering and separation**: Background context, foreground data, hover details

### Mike Bostock (D3 / Interactive Visualization)
1. **SVG-based**: Pure vectors, no canvas or external libraries
2. **Interaction hierarchy**: Hover → Tooltip → Click → Navigation
3. **Smooth transitions**: Opacity changes on hover/focus
4. **Responsive viewBox**: Scale to any container size
5. **Accessibility**: ARIA labels, keyboard navigation ready

---

## Accessibility

All components follow WCAG AA standards:
- **Color contrast**: Text on backgrounds meet 4.5:1 ratio
- **Hover/Focus**: All interactive elements have visible focus states
- **Tooltips**: Appear on hover and keyboard focus
- **Screen readers**: SVG text elements are semantic
- **Keyboard**: All interactive elements accessible via keyboard

---

## Performance

- **No external libraries**: Pure React + SVG for minimal bundle size
- **React.memo**: All components are memoized to prevent unnecessary re-renders
- **SVG rendering**: Efficient vector graphics scale to any size
- **ViewBox**: Responsive via SVG viewBox, not CSS media queries
- **Lazy loading**: Import only components you need

---

## Troubleshooting

### Chart not displaying
- Check that `sport` prop matches one of: `football`, `basketball`, `baseball`, `track`, `lacrosse`, `wrestling`, `soccer`
- Verify data array is not empty
- Check browser console for TypeScript errors

### Styling issues
- Verify Tailwind CSS is configured in `tailwind.config.ts`
- Check that CSS custom properties are available in `globals.css`
- Confirm parent container has explicit width (not undefined)

### Performance issues
- Memoization is automatic with React.memo
- For very large datasets (1000+ items), consider pagination or virtualization
- Use `maxPlayers` prop in EraComparisonTool to limit radar complexity

---

## File Structure

```
src/components/viz/
├── CareerTrajectoryChart.tsx    (12 KB) — Line chart with league average
├── DynastyTimeline.tsx          (9.5 KB) — Horizontal timeline with eras
├── EraComparisonTool.tsx        (13 KB) — Radar chart + stats table
├── SmallMultiples.tsx           (5.8 KB) — Sparkline grid
├── StatHeatmap.tsx              (9.8 KB) — Color-coded data table
├── PipelineSankey.tsx           (12 KB) — Three-stage flow diagram
├── index.ts                     (388 B) — Barrel export
└── README.md                    (this file)
```

**Total size**: ~62 KB (uncompressed), ~15 KB (gzipped)

---

## Examples & Integration

### On a player profile page:
```tsx
import { CareerTrajectoryChart, EraComparisonTool } from '@/components/viz';

export default function PlayerProfile({ player }) {
  return (
    <div className="space-y-8">
      <CareerTrajectoryChart
        seasons={player.seasonStats}
        stat="Passing Yards"
        sport="football"
      />

      <EraComparisonTool
        players={[player, ...comparePlayers]}
        sport="football"
      />
    </div>
  );
}
```

### On a school hub page:
```tsx
import { DynastyTimeline, SmallMultiples } from '@/components/viz';

export default function SchoolHub({ school, allSchools }) {
  return (
    <div className="space-y-8">
      <DynastyTimeline
        schoolName={school.name}
        seasons={school.seasonHistory}
        sport="football"
      />

      <SmallMultiples
        items={allSchools}
        sport="football"
        statName="All-Time Wins"
      />
    </div>
  );
}
```

---

## License & Attribution

Built for PhillySportsPack.com following design principles from:
- **Edward Tufte**: "The Visual Display of Quantitative Information"
- **Mike Bostock**: D3.js & Observable Design Principles
- **PSP Brand**: Navy (#0a1628), Gold (#f0a500), Sport-specific colors

---

## Support

For questions or improvements:
1. Check component props in TypeScript interfaces
2. Review example usage above
3. Refer to existing chart components for patterns
4. Test in browser DevTools (responsive, console warnings)
