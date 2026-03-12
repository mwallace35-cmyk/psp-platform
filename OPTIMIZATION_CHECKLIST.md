# Client Component Optimization Checklist

## Completed Optimizations ✓

### Code Extraction & Consolidation
- [x] Extract `GameLogTables.tsx` (FootballGameTable, BasketballGameTable)
- [x] Extract `challengeData.ts` (CHALLENGE_BANK constant, ChallengeQuestion interface)
- [x] Remove duplicate function definitions from GameLogAccordion
- [x] Remove inline CHALLENGE_BANK from DailyChallenge

### 'use client' Directive Cleanup
- [x] Remove from HomePageClient (pure server component)
- [x] Keep in GameLogAccordion (uses useState, useMemo)
- [x] Keep in DailyChallenge (uses useState, useEffect, localStorage)
- [x] Keep in CommentSection (uses browser APIs)
- [x] Add to wrapper components (CommentSectionLazy, DailyChallengeLazy, WinLossTrendChartLazy)

### Dynamic Imports & Lazy Loading
- [x] Implement CommentSectionLazy (ArticleDetail page)
- [x] Implement DailyChallengeLazy (Challenge page)
- [x] Implement WinLossTrendChartLazy (School profile page)
- [x] Add loading skeletons for all lazy components
- [x] Use ssr: false for client-only components

### Build Verification
- [x] Build passes with 0 errors in optimized components
- [x] No TypeScript errors in new files
- [x] No breaking changes to component APIs
- [x] Backward compatible with existing imports

## Testing Checklist

### Manual Testing
- [ ] Test HomePageClient renders correctly (should now be fully SSR'd)
- [ ] Test GameLogAccordion expands/collapses accordion properly
- [ ] Test CommentSection loads lazily on article pages
- [ ] Test DailyChallenge loads with spinner, then displays challenge
- [ ] Test WinLossTrendChart loads with skeleton on school profile
- [ ] Verify no JavaScript errors in browser console
- [ ] Test on mobile (< 768px) for responsive loading

### Performance Testing
- [ ] Measure Core Web Vitals before/after
- [ ] Check bundle size reduction with `npm run analyze`
- [ ] Profile network tab to verify lazy loading
- [ ] Check Time to Interactive (TTI) improvement
- [ ] Verify lazy components load when user scrolls to them

### Regression Testing
- [ ] Game log accordion state persists on page
- [ ] Comment form submission works
- [ ] Challenge answer selection works properly
- [ ] Chart tooltips display correctly
- [ ] No visual regressions in loading states

## Performance Metrics to Track

| Metric | Baseline | Target | Status |
|--------|----------|--------|--------|
| Largest Contentful Paint (LCP) | TBD | -10% | [ ] |
| First Input Delay (FID) | TBD | -20% | [ ] |
| Cumulative Layout Shift (CLS) | TBD | <0.1 | [ ] |
| Initial JS Bundle | TBD | -5% | [ ] |
| Time to Interactive | TBD | -15% | [ ] |

## Future Optimization Opportunities

### Phase 4: Additional Lazy Loading
- [ ] LazyLoad EraComparisonTool (>400 lines)
- [ ] LazyLoad PipelineSankey (>350 lines)
- [ ] LazyLoad StatHeatmap (>260 lines)
- [ ] LazyLoad HomePageClient subsections

### Phase 5: Component Memoization
- [ ] Add React.memo() to large presentational components
- [ ] Use useCallback for event handlers in lists
- [ ] Profile SortableTable for optimization opportunities
- [ ] Consider useDeferredValue for search filtering

### Phase 6: Code Splitting
- [ ] Implement route-based code splitting
- [ ] Lazy load pages with heavy visualizations
- [ ] Code split chart libraries (Recharts alternatives)
- [ ] Implement module federation for shared components

## Documentation

### For Developers
- File: `OPTIMIZATION_SUMMARY.md` - Detailed technical analysis
- File: `OPTIMIZATION_CHECKLIST.md` - This file, tracking checklist
- Principle: Keep server components server-side, use 'use client' only when necessary

### Performance Audit Results
- File: Pre-optimization evaluation report (if available)
- Location: `/psp-platform/docs/PSP_Design_Evaluation_Report.pdf`

## Rollback Plan
If issues arise:
1. Revert `'use client'` removal: `git checkout HEAD -- src/components/HomePageClient.tsx`
2. Revert lazy loading: `git checkout HEAD -- src/components/*/\*Lazy.tsx`
3. Restore original GameLogAccordion: `git checkout HEAD -- src/components/game-log/GameLogAccordion.tsx`
4. Clear build cache: `rm -rf .next`
5. Rebuild: `npm run build`

## Questions & Notes
- [ ] Verify lazy components UX is acceptable with loading states
- [ ] Check if any analytics tracking is affected by lazy loading
- [ ] Ensure error boundaries catch lazy component failures
- [ ] Monitor Real User Metrics (RUM) post-deployment
