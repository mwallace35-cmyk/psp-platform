# PhillySportsPack Statistical Engine Guide

## Overview

The PSP Statistical Engine provides comprehensive tools for computing, analyzing, and displaying sports statistics with proper uncertainty quantification and era normalization. It's built on three core personas: **Bill James** (sabermetrics), **Nate Silver** (probabilistic modeling), and **Daryl Morey** (decision analytics).

**Current Score: 5/10 → Target: 9/10** after implementation

## Architecture

```
src/lib/stats/
├── computed-metrics.ts      # Rate stats, efficiency, percentiles, z-scores
├── confidence.ts            # Sample size assessment, confidence intervals
├── era-adjustment.ts        # Time period normalization (1887-2025)
├── decision-support.ts      # College placement, pro pipeline, predictions
├── index.ts                 # Barrel export (use this for imports)
└── STATS_ENGINE_GUIDE.md    # This file

src/components/stats/
├── StatWithContext.tsx      # Full stat display with era + percentile
├── ConfidenceBadge.tsx      # Sample size reliability indicator
├── EraTag.tsx              # Time period pill/badge
├── RateStatDisplay.tsx     # Rate stat with denominator
└── index.ts                # Barrel export
```

## Quick Start

### 1. Calculate Rate Statistics

```typescript
import {
  calculateYardsPerCarry,
  calculatePasserEfficiency,
  calculatePointsPerGame
} from '@/lib/stats';

// Football: Yards per carry
const ypc = calculateYardsPerCarry(1247, 187); // 6.7 YPC

// Football: Passer efficiency (NCAA formula)
const pe = calculatePasserEfficiency(
  2400,  // passing yards
  24,    // TDs
  180,   // completions
  8,     // INTs
  300    // attempts
); // ~155 rating (elite)

// Basketball: Points per game
const ppg = calculatePointsPerGame(450, 20); // 22.5 PPG
```

### 2. Assess Confidence

```typescript
import {
  getStatReliability,
  getConfidenceInterval,
  assessReliability
} from '@/lib/stats';

// Is 4 games enough data?
const reliability = getStatReliability(4, 'football');
// → 'low' (less than 8 games for football)

// Get confidence interval
const ci = getConfidenceInterval(5.2, 8, 'football', 'rush_yards');
// → { lower: 3.38, upper: 7.02, confidence: 0.68 }

// Full assessment with recommendation
const assessment = assessReliability(8, 'football');
// → {
//     level: 'low',
//     gamesPlayed: 8,
//     minGamesRequired: 13,
//     confidence: 0.6,
//     recommendation: 'Approaching reliability. Good for context...'
//   }
```

### 3. Normalize Across Eras

```typescript
import {
  adjustForEra,
  getEraForYear,
  formatWithEraContext
} from '@/lib/stats';

// Is a 1,000-yard rusher from 1950 better than 2020?
// Adjust to z-scores relative to era mean/stddev

const z1950 = adjustForEra(1000, 'football', 'rush_yards', 1950);
// → 1.65 SD above mean (very elite for that era)

const z2020 = adjustForEra(1000, 'football', 'rush_yards', 2020);
// → -0.06 SD (slightly below mean for modern era)

// Era context for display
const text = formatWithEraContext(1247, 2015, 'football', 'rush_yards');
// → "1,247 yards (87th percentile, Data Era 2015-2025)"
```

### 4. Predict Outcomes

```typescript
import {
  predictAllCityProbability,
  getProPipelineScore
} from '@/lib/stats';

// All-City probability (logistic regression model)
const prediction = predictAllCityProbability(
  {
    name: 'D\'Andre Swift',
    rush_yards: 1850,
    total_td: 28,
    rush_attempts: 267
  },
  'football',
  2015
);
// → {
//     allCityProbability: 0.92,
//     confidenceLevel: 'high',
//     reasoning: ['Top 10% in rush_yards', 'Top 10% in total_td'],
//   }

// School's pro pipeline strength
const pipeline = await getProPipelineScore(123); // St. Joseph's Prep
// → {
//     proAthletes: 47,
//     nflCount: 12,
//     nbaCount: 8,
//     score: 89,
//     tier: 'elite'
//   }
```

## Computed Metrics Module

### Football Rate Stats

| Function | Formula | Example |
|----------|---------|---------|
| `calculateYardsPerCarry` | yards / carries | 1247 / 187 = 6.7 YPC |
| `calculateYardsPerAttempt` | pass_yards / attempts | 2400 / 300 = 8.0 YPA |
| `calculatePasserEfficiency` | NCAA formula | (8.4×Y + 330×TD + 100×C - 200×INT) / Att |
| `calculateYardsPerReception` | rec_yards / receptions | 650 / 38 = 17.1 YPR |
| `calculateCompletionPercentage` | (completions / attempts) × 100 | (180 / 300) × 100 = 60% |
| `calculateTDPercentage` | (TD / touches) × 100 | (25 / 150) × 100 = 16.7% |
| `calculateTDToTurnoverRatio` | TD / INT | 24 / 8 = 3.0 |

### Basketball Rate Stats

| Function | Formula | Example |
|----------|---------|---------|
| `calculatePointsPerGame` | points / games | 450 / 20 = 22.5 PPG |
| `calculateReboundsPerGame` | rebounds / games | 240 / 20 = 12.0 RPG |
| `calculateAssistsPerGame` | assists / games | 100 / 20 = 5.0 APG |
| `calculateStealsPerGame` | steals / games | 60 / 20 = 3.0 SPG |
| `calculateBlocksPerGame` | blocks / games | 80 / 20 = 4.0 BPG |

### Statistical Analysis

```typescript
// Z-Score: How many std devs from mean?
const zResult = calculateZScore(1247, 891, 534);
// → { zScore: 0.666, stdDev: 534, mean: 891 }

// Percentile Rank: What % are below this value?
const percentile = calculatePercentileRank(1247, [450, 712, 891, 1034, ...]);
// → { percentile: 78.5, rank: 1523, total: 1934 }

// Estimate percentile from pre-computed bounds
const est = estimatePercentile(1247, { p50: 891, p75: 1267, p90: 1876 });
// → 87.3 (interpolated)
```

### Utility Functions

```typescript
// Format for display
formatRateStat(6.666) → "6.7"
formatPercentage(52.3) → "52.3%"
formatNumber(1247) → "1,247"

// Dataset statistics
calculateMean([450, 712, 891, 1034]) → 771.75
calculateStdDev([450, 712, 891, 1034]) → 246.8
```

## Confidence Module

### Sample Size Thresholds

Football: 13+ games for "high" reliability
Basketball: 25+ games for "high" reliability
Baseball: 40+ games for "high" reliability

```typescript
// Reliability levels
getStatReliability(4, 'football')   // → 'insufficient' (< 4 games)
getStatReliability(8, 'football')   // → 'low' (4-8 games)
getStatReliability(12, 'football')  // → 'medium' (9-12 games)
getStatReliability(16, 'football')  // → 'high' (13+ games)

// Detect small samples
isSmallSample(4, 'football') // → true
isSmallSample(16, 'football') // → false

// High-variance stats need more games
getMinGamesThreshold('basketball', 'steals') // → 20 (vs. 25 for general)
```

### Confidence Intervals

```typescript
const ci = getConfidenceInterval(5.2, 8, 'football');
// → {
//     lower: 3.38,
//     upper: 7.02,
//     confidence: 0.68  // 68% confidence at 8 games
//   }

// Full assessment
const assessment = assessReliability(8, 'football', 'pass_int');
// → {
//     level: 'low',
//     gamesPlayed: 8,
//     minGamesRequired: 13,
//     confidence: 0.6,
//     recommendation: 'Approaching reliability...'
//   }

// Visual indicators
getConfidenceIndicator(16, 'football')    // → "✅" (high)
getConfidenceColorClass(8, 'football')    // → "text-yellow-600" (low)
getConfidenceScore(8, 'football')         // → 0.5
```

## Era Adjustment Module

### The Problem

A 1,000-yard rusher from 1950 might be more dominant than a 1,200-yard rusher from 2020 because:
- Season length has increased
- Defenses have improved
- Game quality varies by era
- Data collection has improved

### The Solution: Z-Score Normalization

Adjust each statistic to its era's mean and standard deviation:

```
z = (value - era_mean) / era_stddev
```

### Era Definitions

| Era | Years | Description |
|-----|-------|-------------|
| Pre-Merger | 1887-1969 | Foundation era, limited games, leather helmets |
| Modern | 1970-1999 | Post-merger explosion, more games/coaching |
| MaxPreps | 2000-2014 | Online tracking emerges, detailed stats begin |
| Data Era | 2015-2025 | Complete digital tracking, comprehensive data |

### Usage

```typescript
// Get era for a season
getEraForYear(2015)           // → Pre-merger Era object
getEraForSeasonLabel('2015-16') // → Data Era object

// Adjust to era z-score
const z2015 = adjustForEra(1247, 'football', 'rush_yards', 2015);
// → 0.35 (slightly above 2015 mean of 1034)

// Compare across eras
const comparison = compareAcrossEras(
  { name: 'Jim Brown', value: 1500, seasonYear: 1960 },
  { name: 'Barry Sanders', value: 1500, seasonYear: 1990 },
  'football',
  'rush_yards'
);
// → { playerA/B z-scores, moreImpressive, dominanceRatio }

// Format for display with era context
formatWithEraContext(1247, 2015, 'football', 'rush_yards');
// → "1,247 yards (87th percentile, Data Era 2015-2025)"
```

## Decision Support Module

### College Placement Rate

```typescript
const placement = await getCollegePlacementRate(123); // St. Joseph's Prep
// → {
//     totalPlayers: 847,
//     trackedToCollege: 178,
//     placementRate: 0.21, // 21%
//     divisionBreakdown: {
//       p1: 45,   // FBS / D1 Basketball
//       p2: 32,   // FCS / D2
//       p3: 48,   // D3 / NAIA
//       naia: 18,
//       club: 35
//     }
//   }
```

### Professional Pipeline Score

```typescript
const pipeline = await getProPipelineScore(123);
// → {
//     proAthletes: 47,
//     proPercentage: 0.055, // 5.5%
//     nflCount: 12,
//     nbaCount: 8,
//     mlbCount: 6,
//     hallOfFamers: 2,
//     score: 89,
//     tier: 'elite'  // or 'national', 'regional', 'developing', 'minimal'
//   }
```

### All-City Probability Prediction

```typescript
const prediction = predictAllCityProbability(
  {
    name: 'Kaleb Morris',
    rush_yards: 1850,
    total_td: 28,
    pass_yards: 450
  },
  'football',
  2024
);
// → {
//     allCityProbability: 0.88,
//     confidenceLevel: 'high',
//     reasoning: [
//       'Top 10% in rush_yards',
//       'Top 10% in total_td'
//     ],
//     comparison: {
//       topPercentile: 88,
//       vs: 'peers in same season'
//     }
//   }
```

## React Components

### StatWithContext

Displays a stat with confidence indicator and era tag.

```typescript
<StatWithContext
  value={5.2}
  statName="rush_yards"
  label="Yards Per Carry"
  unit="YPC"
  gamesPlayed={16}
  sport="football"
  seasonYear={2015}
  percentile={87}
  showConfidenceIndicator={true}
  showEraTag={true}
  decimals={1}
/>
// Output: "5.2 YPC ✅ (87th percentile, Data Era)"
```

### ConfidenceBadge

Shows sample size reliability.

```typescript
// Compact (default)
<ConfidenceBadge gamesPlayed={16} sport="football" variant="compact" />
// Output: "✅ 16 games"

// Full
<ConfidenceBadge gamesPlayed={8} sport="football" variant="full" />
// Output: "🟡 Low confidence (8 games)"
```

### EraTag

Displays time period context.

```typescript
<EraTag seasonYear={2015} variant="pill" />
// Output: "Data Era (2015-2025)"

<EraTag seasonLabel="1995-96" variant="badge" />
// Output: "Modern Era"
```

### RateStatDisplay

Shows rate stats with denominator.

```typescript
// Inline (default)
<RateStatDisplay
  value={5.2}
  numerator={187}
  denominatorLabel="carries"
  abbreviation="YPC"
  fullName="Yards Per Carry"
  variant="inline"
/>
// Output: "5.2 YPC (187 carries)"

// Stacked
<RateStatDisplay
  value={22.5}
  numerator={450}
  denominatorLabel="games"
  abbreviation="PPG"
  variant="stacked"
/>
// Output: "22.5 PPG\n450 games"
```

## Integration Examples

### Player Profile Page

```typescript
import {
  calculateYardsPerCarry,
  calculatePointsPerGame,
  getStatReliability,
  adjustForEra
} from '@/lib/stats';
import { StatWithContext, ConfidenceBadge, RateStatDisplay } from '@/components/stats';

export default function PlayerProfile({ player, season }) {
  const ypc = calculateYardsPerCarry(
    player.rush_yards,
    player.rush_attempts
  );

  const eraAdjusted = adjustForEra(
    player.rush_yards,
    'football',
    'rush_yards',
    season.year
  );

  return (
    <div>
      <StatWithContext
        value={ypc}
        statName="rush_yards"
        label="Yards Per Carry"
        unit="YPC"
        gamesPlayed={12}
        sport="football"
        seasonYear={season.year}
        percentile={85}
      />

      <ConfidenceBadge
        gamesPlayed={12}
        sport="football"
        variant="full"
      />

      <RateStatDisplay
        value={ypc}
        numerator={player.rush_attempts}
        denominatorLabel="carries"
        abbreviation="YPC"
        highlight={eraAdjusted > 1.5}
      />
    </div>
  );
}
```

### Leaderboard with Era Adjustment

```typescript
import { adjustForEra, getEraForYear } from '@/lib/stats';

export default function Leaderboard({ season, players }) {
  const era = getEraForYear(season.year);

  const ranked = players
    .map(p => ({
      ...p,
      zScore: adjustForEra(p.rush_yards, 'football', 'rush_yards', season.year)
    }))
    .sort((a, b) => b.zScore - a.zScore);

  return (
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player</th>
          <th>Rushing Yards</th>
          <th>Era-Adjusted</th>
        </tr>
      </thead>
      <tbody>
        {ranked.map((p, i) => (
          <tr key={p.id}>
            <td>{i + 1}</td>
            <td>{p.name}</td>
            <td>{p.rush_yards}</td>
            <td>{p.zScore.toFixed(2)}σ</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Testing the Engine

Each module has comprehensive null handling:

```typescript
// All functions handle null/undefined gracefully
calculateYardsPerCarry(null, 200) // → null
calculateYardsPerCarry(1000, 0)   // → null
calculateYardsPerCarry(1000, 200) // → 5.0

getStatReliability(null, 'football')      // → 'insufficient'
getStatReliability(-5, 'football')        // → 'insufficient'
getConfidenceInterval(null, 8, 'football') // → null
```

## Performance Considerations

- **Percentile calculation**: O(n) for dataset size n. Cache for frequently accessed stats.
- **Era lookup**: O(1) hash lookup. getEraForYear caches results.
- **Decision support**: Async database queries. Consider caching school statistics.
- **Components**: All client-side rendering. No blocking server calls.

## Future Enhancements

1. **Meilisearch integration** for full-text search on stats
2. **Historical trend analysis** (5-year rolling averages)
3. **Advanced ML predictions** (injury risk, draft probability)
4. **API endpoints** for external tools
5. **Caching layer** for expensive calculations
6. **Real-time game updates** with confidence decay
7. **Custom era definitions** by league/sport

## References

- Bill James' Sabermetrics principles
- Nate Silver's uncertainty quantification
- Daryl Morey's decision framework
- NCAA passer efficiency formula
- FBS/FCS/D3 athletic standards
- EPA and Success Rate concepts
