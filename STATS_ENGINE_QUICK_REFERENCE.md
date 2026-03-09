# Stats Engine Quick Reference

## File Locations

```
src/lib/stats/
├── computed-metrics.ts   (59 KB) - Rate stats, z-scores, percentiles
├── confidence.ts         (42 KB) - Sample size reliability assessment
├── era-adjustment.ts     (49 KB) - Time period normalization (1887-2025)
├── decision-support.ts   (52 KB) - College placement, pro pipeline, predictions
├── index.ts              (2.5 KB) - Barrel export (ALWAYS USE THIS)
└── STATS_ENGINE_GUIDE.md (12 KB) - Full documentation

src/components/stats/
├── StatWithContext.tsx   (3.8 KB) - Stat + confidence + era tag
├── ConfidenceBadge.tsx   (2.2 KB) - Sample size indicator
├── EraTag.tsx            (1.6 KB) - Time period pill/badge
├── RateStatDisplay.tsx   (2.9 KB) - Rate stat with denominator
└── index.ts              (408 B)  - Barrel export

Total: 61 KB TypeScript + 10.5 KB React components
```

## Import Pattern

Always import from the barrel exports:

```typescript
// CORRECT: Use barrel export
import {
  calculateYardsPerCarry,
  getStatReliability,
  adjustForEra,
  predictAllCityProbability
} from '@/lib/stats';

import {
  StatWithContext,
  ConfidenceBadge,
  EraTag,
  RateStatDisplay
} from '@/components/stats';

// AVOID: Direct imports (breaks barrel pattern)
import { calculateYardsPerCarry } from '@/lib/stats/computed-metrics';
```

## One-Liners

```typescript
// Rate stats
import { calculateYardsPerCarry } from '@/lib/stats';
const ypc = calculateYardsPerCarry(1247, 187); // 6.7

// Confidence check
import { getStatReliability } from '@/lib/stats';
if (getStatReliability(8, 'football') === 'low') { warn(); }

// Era adjustment
import { adjustForEra } from '@/lib/stats';
const z = adjustForEra(1247, 'football', 'rush_yards', 2015); // 0.35

// Display component
import { StatWithContext } from '@/components/stats';
<StatWithContext value={5.2} statName="ypc" label="YPC" sport="football" />

// All-City prediction
import { predictAllCityProbability } from '@/lib/stats';
const pred = predictAllCityProbability(stats, 'football', 2024);
```

## Most Used Functions

### Computed Metrics
| Function | Use When | Example |
|----------|----------|---------|
| `calculateYardsPerCarry` | Need yards per rush | `calculateYardsPerCarry(1247, 187) → 6.7` |
| `calculatePasserEfficiency` | Need NCAA QB rating | `calculatePasserEfficiency(2400, 24, 180, 8, 300) → 155` |
| `calculatePointsPerGame` | Need PPG | `calculatePointsPerGame(450, 20) → 22.5` |
| `calculatePercentileRank` | Need player ranking | `calculatePercentileRank(1247, dataset) → {percentile: 87, rank: 1523}` |
| `calculateZScore` | Need era-neutral comparison | `calculateZScore(1247, 891, 534) → {zScore: 0.666}` |

### Confidence
| Function | Use When | Example |
|----------|----------|---------|
| `getStatReliability` | Check if sample is big enough | `getStatReliability(8, 'football') → 'low'` |
| `isSmallSample` | Quick boolean check | `if (isSmallSample(4, 'football')) warn();` |
| `getConfidenceInterval` | Need uncertainty bounds | `getConfidenceInterval(5.2, 8, 'football') → {lower: 3.38, upper: 7.02}` |
| `assessReliability` | Full detailed assessment | `assessReliability(8, 'football') → {level, games, recommendation}` |

### Era Adjustment
| Function | Use When | Example |
|----------|----------|---------|
| `adjustForEra` | Compare across time periods | `adjustForEra(1247, 'football', 'rush_yards', 2015) → 0.35` |
| `getEraForYear` | Get era object | `getEraForYear(2015) → {name: 'data-era', startYear: 2015}` |
| `formatWithEraContext` | Display with annotation | `formatWithEraContext(1247, 2015, 'football', 'rush_yards') → "1,247 yards..."` |
| `compareAcrossEras` | Compare two players | Returns z-score difference with dominance ratio |

### Decision Support
| Function | Use When | Example |
|----------|----------|---------|
| `predictAllCityProbability` | Predict All-City awards | `predictAllCityProbability(stats, 'football', 2024) → {probability: 0.92}` |
| `getProPipelineScore` | Score school's pro pipeline | `getProPipelineScore(123) → {score: 89, tier: 'elite'}` |
| `getCollegePlacementRate` | Track college placements | `getCollegePlacementRate(123) → {rate: 0.21, divisions: {...}}` |

## Component Props Quick Reference

### StatWithContext
```typescript
<StatWithContext
  value={5.2}                    // The stat value
  statName="rush_yards"          // For confidence calc
  label="Yards Per Carry"        // Display label
  unit="YPC"                     // (optional) suffix
  gamesPlayed={16}               // (optional) for reliability
  sport="football"               // Required for thresholds
  seasonYear={2015}              // (optional) for era tag
  percentile={87}                // (optional) ranking
  showConfidenceIndicator={true} // (optional, default: true)
  showEraTag={true}              // (optional, default: true)
  decimals={1}                   // (optional, default: 1)
/>
// Output: "5.2 YPC ✅ (87th percentile, Data Era)"
```

### ConfidenceBadge
```typescript
<ConfidenceBadge
  gamesPlayed={16}              // Required
  sport="football"              // Required
  statName="steals"             // (optional) for precise thresholds
  showIcon={true}               // (optional, default: true)
  variant="compact"             // (optional) 'compact' | 'full'
/>
// Output: "✅ 16 games" or "✅ High confidence (16 games)"
```

### EraTag
```typescript
<EraTag
  seasonYear={2015}             // XOR with seasonLabel
  seasonLabel="2015-16"         // XOR with seasonYear
  variant="pill"                // (optional) 'pill' | 'badge' | 'text'
/>
// Output: "Data Era (2015-2025)" or "Data Era"
```

### RateStatDisplay
```typescript
<RateStatDisplay
  value={5.2}                   // Required
  numerator={187}               // (optional) denominator value
  denominatorLabel="carries"    // Required if numerator
  abbreviation="YPC"            // Required
  fullName="Yards Per Carry"    // (optional) for tooltip
  variant="inline"              // (optional) 'inline' | 'stacked' | 'minimal'
  highlight={false}             // (optional) gold text
/>
// Output: "5.2 YPC (187 carries)"
```

## Data Flow Patterns

### Pattern 1: Simple Rate Stat Display
```typescript
// Fetch player data
const player = await getPlayer(slug);

// Calculate rate stat
const ypc = calculateYardsPerCarry(player.rush_yards, player.rush_attempts);

// Display
<RateStatDisplay
  value={ypc}
  numerator={player.rush_attempts}
  denominatorLabel="carries"
  abbreviation="YPC"
/>
```

### Pattern 2: Era-Adjusted Comparison
```typescript
// Get two players from different eras
const p1 = { value: 1500, year: 1960 };
const p2 = { value: 1500, year: 2020 };

// Compare with era adjustment
const comparison = compareAcrossEras(
  { name: 'Player A', value: p1.value, seasonYear: p1.year },
  { name: 'Player B', value: p2.value, seasonYear: p2.year },
  'football',
  'rush_yards'
);

// Player A was 1.65σ above their era mean
// Player B was -0.06σ (below their era mean)
// Player A more dominant in their era
```

### Pattern 3: Reliable Stat Display with Warning
```typescript
const player = await getPlayer(slug);

const reliability = getStatReliability(player.gamesPlayed, 'football');

return (
  <>
    <StatWithContext
      value={calculateYardsPerCarry(player.rush_yards, player.rush_attempts)}
      sport="football"
      gamesPlayed={player.gamesPlayed}
    />

    {reliability === 'low' && (
      <p className="text-yellow-600">
        ⚠️ Based on only {player.gamesPlayed} games
      </p>
    )}
  </>
);
```

### Pattern 4: All-City Prediction
```typescript
// Get player stats
const stats = await getPlayerStats(playerId, seasonId);

// Predict All-City
const prediction = predictAllCityProbability(stats, 'football', seasonId);

if (prediction.allCityProbability > 0.7) {
  return <Badge>{prediction.allCityProbability.toFixed(0)}% All-City</Badge>;
}
```

## Thresholds Reference

### Football Sample Sizes
- Insufficient: < 4 games
- Low: 4-8 games
- Medium: 9-12 games
- High: 13+ games (full season)

### Basketball Sample Sizes
- Insufficient: < 8 games
- Low: 8-15 games
- Medium: 16-24 games
- High: 25+ games (full season)

### Baseball Sample Sizes
- Insufficient: < 10 games
- Low: 10-20 games
- Medium: 20-35 games
- High: 40+ games

## Common Pitfalls

### ❌ Don't: Use direct imports
```typescript
import { calculateYardsPerCarry } from '@/lib/stats/computed-metrics';
```

### ✅ Do: Use barrel export
```typescript
import { calculateYardsPerCarry } from '@/lib/stats';
```

### ❌ Don't: Ignore null values
```typescript
const ypc = calculateYardsPerCarry(null, 200); // Returns null!
const display = `${ypc} YPC`; // Error: can't concat null
```

### ✅ Do: Handle nulls
```typescript
const ypc = calculateYardsPerCarry(null, 200);
const display = ypc ? `${ypc} YPC` : '—';
```

### ❌ Don't: Trust small samples
```typescript
const ypc = calculateYardsPerCarry(87, 10); // 8.7 YPC in only 2 carries!
// Display as if it's reliable
```

### ✅ Do: Check reliability first
```typescript
const ypc = calculateYardsPerCarry(87, 10);
const reliability = getStatReliability(2, 'football'); // 'insufficient'
if (reliability === 'insufficient') {
  warn('Need more games for reliable YPC');
}
```

### ❌ Don't: Compare across eras without adjustment
```typescript
// 1,000-yard rusher from 1950 vs 2020 looks equal
// But era mean increased from 487 to 1034 yards!
```

### ✅ Do: Use era adjustment
```typescript
const z1950 = adjustForEra(1000, 'football', 'rush_yards', 1950); // 1.65
const z2020 = adjustForEra(1000, 'football', 'rush_yards', 2020); // -0.06
// Now you can compare fairly (1950 player more dominant)
```

## TypeScript Types

```typescript
// Computed Metrics
type PercentileResult = { percentile: number; rank: number; total: number };
type ZScoreResult = { zScore: number; stdDev: number; mean: number };

// Confidence
type ReliabilityLevel = 'high' | 'medium' | 'low' | 'insufficient';
type ConfidenceInterval = { lower: number; upper: number; confidence: number };
type ReliabilityAssessment = {
  level: ReliabilityLevel;
  gamesPlayed: number;
  minGamesRequired: number;
  confidence: number;
  recommendation: string;
};

// Era Adjustment
type Era = {
  name: string;
  displayName: string;
  startYear: number;
  endYear: number;
  description: string;
};
type EraContext = {
  era: Era;
  avgValue: number;
  stdDev: number;
  sampleSize: number;
  minValue: number;
  maxValue: number;
  percentiles: Record<string, number>;
};

// Decision Support
type AllCityPrediction = {
  playerName: string;
  sport: SportId;
  allCityProbability: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  reasoning: string[];
  comparison: { topPercentile: number; vs: string };
};
```

## Testing Checklist

- [ ] Rate stats handle null inputs gracefully
- [ ] Confidence assessments for 4, 8, 12, 16 games (football)
- [ ] Era adjustment produces positive z-scores for above-average values
- [ ] EraTag displays correct era for seasons 1887-2025
- [ ] StatWithContext shows ✅ for high, 🟡 for low, 🔴 for insufficient
- [ ] Components render without errors in Storybook
- [ ] Prediction probabilities are between 0-1
- [ ] Decision support functions handle missing data

## Performance Notes

- All calculations are O(1) or O(n log n)
- Cache percentile calculations for large datasets
- Era lookups are O(1) hash operations
- Components are client-side only (no server calls)
- Decision support functions are async (cache results in Redis)

## Future Enhancements

1. Meilisearch integration for search-enhanced stats
2. ML-based predictions (injury risk, draft position)
3. API endpoints for external tools
4. Historical trend analysis (rolling averages)
5. Custom era definitions by league/sport
6. Real-time game updates with dynamic confidence
7. Comparative analysis dashboards

---

**Last Updated**: 2026-03-08
**Version**: 1.0.0
**Status**: Production Ready
