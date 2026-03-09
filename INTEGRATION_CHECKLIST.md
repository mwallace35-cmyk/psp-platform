# Stats Engine Integration Checklist

## Phase 1: Verify & Test (Before Integration)

- [ ] Run `npm run build` and verify no new errors in stats modules
- [ ] Import from barrel exports: `import { calculateYardsPerCarry } from '@/lib/stats'`
- [ ] Test null handling: `calculateYardsPerCarry(null, 200)` should return `null`
- [ ] Test component rendering: `<StatWithContext value={5.2} sport="football" />`
- [ ] Check TypeScript types: no `any` types in stats modules

## Phase 2: Player Profile Integration

### Update `/app/[sport]/players/[slug]/page.tsx`

```typescript
import {
  calculateYardsPerCarry,
  calculatePointsPerGame,
  getStatReliability,
  adjustForEra
} from '@/lib/stats';
import {
  StatWithContext,
  ConfidenceBadge,
  RateStatDisplay
} from '@/components/stats';

// In player data section:
const ypc = calculateYardsPerCarry(player.rush_yards, player.rush_attempts);
const confidence = getStatReliability(player.gamesPlayed, 'football');
const zScore = adjustForEra(player.rush_yards, 'football', 'rush_yards', season.year);

// Render:
<StatWithContext
  value={ypc}
  statName="rush_yards"
  label="Yards Per Carry"
  unit="YPC"
  gamesPlayed={player.gamesPlayed}
  sport="football"
  seasonYear={season.year}
/>
```

- [ ] Add rate stat calculations
- [ ] Display with StatWithContext component
- [ ] Show ConfidenceBadge if games < 13 (football)
- [ ] Add era tag for historical context

### Tasks
- [ ] Football: YPC, YPA, Passer Efficiency, YPR
- [ ] Basketball: PPG, RPG, APG
- [ ] Add to player stats sidebar

## Phase 3: Leaderboards Enhancement

### Update `/app/[sport]/leaderboards/[stat]/page.tsx`

```typescript
import { adjustForEra, getEraForYear } from '@/lib/stats';

const era = getEraForYear(seasonYear);

// When sorting, optionally use era-adjusted z-scores
const leaderboard = players
  .map(p => ({
    ...p,
    zScore: adjustForEra(p.stat_value, sport, stat, season.year)
  }))
  .sort((a, b) => useEraAdjusted ? b.zScore - a.zScore : b.stat_value - a.stat_value);

// Display:
<table>
  <tr>
    <td>{p.rank}</td>
    <td>{p.name}</td>
    <td>{p.stat_value}</td>
    {useEraAdjusted && <td>{p.zScore.toFixed(2)}σ</td>}
  </tr>
</table>
```

### Tasks
- [ ] Add "Era-Adjusted" toggle to leaderboards
- [ ] Show z-score column when enabled
- [ ] Update sorting logic
- [ ] Display era context next to league name

## Phase 4: School Profile Integration

### Update `/app/[sport]/schools/[slug]/page.tsx`

```typescript
import {
  getCollegePlacementRate,
  getProPipelineScore
} from '@/lib/stats';

const placement = await getCollegePlacementRate(schoolId);
const pipeline = await getProPipelineScore(schoolId);

// Display in new cards:
<Card>
  <h3>College Placement Rate</h3>
  <p>{(placement.placementRate * 100).toFixed(1)}% of players</p>
  <div>
    <span>D1: {placement.divisionBreakdown.p1}</span>
    <span>D3: {placement.divisionBreakdown.p3}</span>
  </div>
</Card>

<Card>
  <h3>Pro Pipeline</h3>
  <p>Tier: {pipeline.tier}</p>
  <p>Score: {pipeline.score}/100</p>
  <p>Pro Athletes: {pipeline.proAthletes}</p>
  <p>NFL: {pipeline.nflCount} | NBA: {pipeline.nbaCount}</p>
</Card>
```

### Tasks
- [ ] Create new cards for college placement
- [ ] Create new cards for pro pipeline
- [ ] Cache results in Redis (these are async DB queries)
- [ ] Update school schema to include these metrics

## Phase 5: Prediction Features

### Add All-City Prediction Widget

```typescript
import { predictAllCityProbability } from '@/lib/stats';

const prediction = predictAllCityProbability(playerStats, 'football', seasonYear);

// Display in prediction card:
<Card>
  <h3>All-City Probability</h3>
  <p>{(prediction.allCityProbability * 100).toFixed(0)}%</p>
  <p>Confidence: {prediction.confidenceLevel}</p>
  <ul>
    {prediction.reasoning.map(r => <li>{r}</li>)}
  </ul>
</Card>
```

### Tasks
- [ ] Add prediction card to player profiles
- [ ] Show in leaderboards for comparison
- [ ] Cache predictions (recompute daily)

## Phase 6: Documentation & Support

### Update Wiki/Docs
- [ ] Add "Understanding Stats" section
- [ ] Document era adjustment feature
- [ ] Explain confidence levels
- [ ] Show example comparisons

### Create Examples Page
- [ ] `/learn/stats` page explaining features
- [ ] Before/after: "Why Jim Brown beats modern rushers (era-adjusted)"
- [ ] Confidence levels interactive demo
- [ ] College placement pipeline visualization

### Tasks
- [ ] Add links to stats guide in footer
- [ ] Create tooltips for stat definitions
- [ ] Add "Learn More" buttons where relevant

## Phase 7: Admin Analytics (Optional)

### Create Admin Dashboard Section

```typescript
// /admin/analytics/stats
// Show:
- Stats completeness by sport (% players with stats)
- Confidence distribution (how many players have 13+ games?)
- Era distribution (which era has most data?)
- Quality score trend
```

### Tasks
- [ ] Query database for stat coverage
- [ ] Calculate aggregate stats quality
- [ ] Show era breakdown by sport
- [ ] Track data gaps

## Testing Requirements

### Unit Tests
- [ ] `calculateYardsPerCarry(1247, 187)` → 6.7
- [ ] `getStatReliability(4, 'football')` → 'insufficient'
- [ ] `adjustForEra(1247, 'football', 'rush_yards', 2015)` → number
- [ ] Null handling for all functions

### Integration Tests
- [ ] Player profile displays rate stats
- [ ] Components render without errors
- [ ] Era adjustment affects leaderboard ordering
- [ ] Predictions calculate correctly

### Visual Tests
- [ ] ✅ green for high confidence
- [ ] 🟡 yellow for low confidence
- [ ] 🔴 red for insufficient data
- [ ] Era tags show correct time period
- [ ] RateStatDisplay formats correctly

### Performance Tests
- [ ] Player profile page load time (should not increase)
- [ ] Leaderboard sorting (era-adjusted takes < 100ms)
- [ ] School profile async queries cache properly

## Rollout Plan

### Week 1: Core Integration
- Integrate computed metrics (rate stats)
- Update player profiles
- Add ConfidenceBadge component
- Target: ~200 player profiles updated

### Week 2: Leaderboards & Era Adjustment
- Add era-adjusted leaderboards
- Toggle between raw and adjusted
- Add era context annotations
- Target: 7 sports, all stat types

### Week 3: Decision Support
- Add college placement metrics
- Add pro pipeline scores
- Add All-City predictions
- Target: 1,237 active schools

### Week 4: Documentation & Polish
- Complete feature documentation
- Update stats guides
- Create admin analytics
- Target: 100% feature coverage

## Fallback Plan

If integration issues arise:

1. **Revert components** - Remove from templates (components won't be used)
2. **Keep library modules** - Functions can still be used elsewhere
3. **Cache results** - Pre-compute and store in database if queries too slow
4. **Gradual rollout** - Start with one sport/page, expand after testing

## Post-Launch Monitoring

### Metrics to Track
- Page load time (should stay < 3s)
- Database query time (should stay < 200ms)
- Cache hit rate (should be > 80%)
- User engagement (clicks on stats, etc.)

### Success Criteria
- All features deployed within 4 weeks
- No regression in page performance
- 0 production errors related to stats
- Positive user feedback

## References

- Stats Engine Guide: `src/lib/stats/STATS_ENGINE_GUIDE.md`
- Quick Reference: `STATS_ENGINE_QUICK_REFERENCE.md`
- Build Summary: `STATS_ENGINE_BUILD_SUMMARY.md`
- Module Documentation:
  - `src/lib/stats/computed-metrics.ts` - JSDoc comments
  - `src/lib/stats/confidence.ts` - JSDoc comments
  - `src/lib/stats/era-adjustment.ts` - JSDoc comments
  - `src/lib/stats/decision-support.ts` - JSDoc comments

---

**Estimated Timeline**: 4 weeks
**Effort Level**: Medium (mostly UI integration, minimal backend changes)
**Risk Level**: Low (no database changes, no API changes, additive features only)
