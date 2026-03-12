# Integration Guide: Next Level Pro Athletes Module

This guide shows how to integrate the new pro athlete features into existing pages.

## 1. Adding "Went Pro" Badge to Player Profiles

File: `src/app/[sport]/players/[slug]/page.tsx`

### Step 1: Import the component
```typescript
import { WentProBadge } from "@/components/players/WentProBadge";
```

### Step 2: Add to render (in main content area, after breadcrumb)
```typescript
<main>
  {/* Breadcrumb */}
  <Breadcrumb ... />

  {/* NEW: Went Pro Badge */}
  <WentProBadge playerId={player.id} />

  {/* Rest of profile content */}
  <div className="sport-header">
    ...
  </div>
  ...
</main>
```

The badge will only render if the player has a pro record in the database, so it's safe to add to all player profiles.

## 2. Adding Pro Alumni to School Profiles

File: `src/app/[sport]/schools/[slug]/page.tsx` or `src/components/schools/SchoolProfileTabs.tsx`

### Step 1: Import the component
```typescript
import { ProAlumniSection } from "@/components/schools/ProAlumniSection";
```

### Step 2: Add to school profile (in main content, after other sections)
```typescript
<main>
  {/* School header, championships, etc. */}
  <div className="sport-header">...</div>

  {/* Team seasons table */}
  <div className="sec-head">...</div>

  {/* NEW: Pro Alumni Section */}
  <ProAlumniSection schoolId={school.id} schoolName={school.name} />

  {/* Other sections */}
  ...
</main>
```

The section will only render if the school has pro alumni, so it's safe to add conditionally.

## 3. Using Pro Athlete Data in Custom Components

### Get pro athletes by school
```typescript
import { getProAthletesBySchool } from "@/lib/data";

async function MyComponent({ schoolId }: { schoolId: number }) {
  const proAthletes = await getProAthletesBySchool(schoolId);

  return (
    <div>
      {proAthletes.map((athlete) => (
        <div key={athlete.id}>
          <strong>{athlete.person_name}</strong> - {athlete.pro_team} ({athlete.pro_league})
        </div>
      ))}
    </div>
  );
}
```

### Get all pro athletes with filters
```typescript
import { getProAthletes } from "@/lib/data";

const result = await getProAthletes({
  league: 'NFL',
  sport: 'football',
  page: 1,
  pageSize: 25
});

console.log(result.data);    // Array of athletes
console.log(result.total);   // Total count
console.log(result.hasMore); // Whether more pages exist
```

### Get featured pro athletes for homepage
```typescript
import { getFeaturedProAthletes } from "@/lib/data";

const featured = await getFeaturedProAthletes(6);
```

## 4. Creating URLs for Pro Athletes

The slug format is: `{name-slug}-{id}`

For example: "marvin-harrison-jr-1234"

### In TypeScript/Server Components:
```typescript
import { createProAthleteSlug } from "@/lib/slug-utils";

const slug = createProAthleteSlug("Marvin Harrison Jr.", 1234);
const url = `/next-level/${slug}`;
```

### In Client Components:
```typescript
import { createProAthleteSlug } from "@/lib/slug-utils";

export default function MyComponent({ athlete }: { athlete: ProAthlete }) {
  const slug = createProAthleteSlug(athlete.person_name, athlete.id);
  return <Link href={`/next-level/${slug}`}>{athlete.person_name}</Link>;
}
```

## 5. Adding to Homepage

File: `src/app/page.tsx` or homepage component

### Import and use featured athletes
```typescript
import { getFeaturedProAthletes } from "@/lib/data";
import { createProAthleteSlug } from "@/lib/slug-utils";

export default async function HomePage() {
  const featured = await getFeaturedProAthletes(6);

  return (
    <div>
      {/* ... existing content ... */}

      {/* Featured Pro Athletes Section */}
      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
          Featured Pro Athletes
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {featured.map((athlete) => {
            const slug = createProAthleteSlug(athlete.person_name, athlete.id);
            return (
              <Link
                key={athlete.id}
                href={`/next-level/${slug}`}
                style={{
                  padding: 16,
                  background: 'var(--g50)',
                  borderRadius: 8,
                  textDecoration: 'none',
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 4 }}>
                  {athlete.person_name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--g400)' }}>
                  {athlete.pro_team} ({athlete.pro_league})
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
```

## 6. Adding to Navigation

File: `src/components/header/Header.tsx` or navigation component

The `/next-level` route is already created and publicly available. Simply add a link:

```typescript
<Link href="/next-level">Next Level</Link>
```

Can be added to:
- Main nav bar
- Sport hub menus
- Footer quick links
- Sidebar "More" section

## 7. API Usage in Client Components

For dynamic filtering/searching on the client side, use the API endpoints:

### Fetch pro athletes
```typescript
'use client';

const response = await fetch('/api/next-level?league=NFL&search=smith');
const data = await response.json();
// data.athletes, data.total, data.hasMore, etc.
```

### Fetch stats
```typescript
'use client';

const response = await fetch('/api/next-level/stats');
const stats = await response.json();
// stats.nfl, stats.nba, stats.mlb, stats.wnba, stats.total
```

### Fetch player pro status
```typescript
'use client';

const response = await fetch(`/api/players/${playerId}/pro-status`);
const proData = await response.json();
// proData.personName, proData.proTeam, proData.proLeague, etc.
```

## 8. Common Patterns

### Display athlete card with league color
```typescript
import { createProAthleteSlug } from "@/lib/slug-utils";

const leagueColors: Record<string, string> = {
  NFL: "#003da5",
  NBA: "#c4122e",
  MLB: "#002d72",
  WNBA: "#552583",
};

export function AthleteCard({ athlete }: { athlete: ProAthlete }) {
  const slug = createProAthleteSlug(athlete.person_name, athlete.id);
  const color = leagueColors[athlete.pro_league || ""] || "#0a1628";

  return (
    <Link href={`/next-level/${slug}`}>
      <div style={{ background: color, color: "#fff", padding: 16, borderRadius: 8 }}>
        <h3>{athlete.person_name}</h3>
        <p>{athlete.pro_team} - {athlete.pro_league}</p>
      </div>
    </Link>
  );
}
```

### Filter and display by league
```typescript
export function LeagueFilter({ athletes }: { athletes: ProAthlete[] }) {
  const nfl = athletes.filter(a => a.pro_league === "NFL");
  const nba = athletes.filter(a => a.pro_league === "NBA");
  const mlb = athletes.filter(a => a.pro_league === "MLB");

  return (
    <div>
      <h3>NFL ({nfl.length})</h3>
      {nfl.map(a => <AthleteCard key={a.id} athlete={a} />)}

      <h3>NBA ({nba.length})</h3>
      {nba.map(a => <AthleteCard key={a.id} athlete={a} />)}

      <h3>MLB ({mlb.length})</h3>
      {mlb.map(a => <AthleteCard key={a.id} athlete={a} />)}
    </div>
  );
}
```

## 9. Error Handling

All data fetchers are wrapped with error handling. They return empty results on failure:

```typescript
const athletes = await getProAthletes(); // Returns { data: [], total: 0, ... }
const bySchool = await getProAthletesBySchool(123); // Returns []
const featured = await getFeaturedProAthletes(); // Returns []
```

Components like `WentProBadge` and `ProAlumniSection` will silently render nothing if no data is found.

## 10. Testing Your Integration

After adding these components:

1. **Player Profile**: Visit a player page and verify:
   - If player is pro: Badge appears above stats
   - If player is not pro: Badge doesn't appear
   - Badge links to correct pro profile

2. **School Profile**: Visit a school page and verify:
   - If school has pro alumni: Section appears
   - Athletes grouped by league correctly
   - Links work and go to pro profiles

3. **Next Level Page**: Visit `/next-level` and verify:
   - All athletes load
   - Filtering by league works
   - Search works
   - Cards link to individual profiles

4. **Individual Pro Profile**: Click an athlete and verify:
   - Hero section displays correctly
   - Stats tables show (if available)
   - External links work
   - School link goes to correct school

## Troubleshooting

### Badge/Section not appearing
- Check that records exist in `next_level_tracking` table
- Verify `player_id` and `high_school_id` are properly linked
- Check browser console for errors

### Links returning 404
- Verify athlete ID is numeric
- Check that slug format is correct: `name-slug-{id}`
- See `parseProAthleteSlug()` in `slug-utils.ts`

### Data not loading
- Check that Supabase client is configured
- Verify database credentials in `.env.local`
- Check network tab in browser DevTools
- Review server console for API errors

### Styling issues
- Ensure CSS variables are defined (navy, gold, blue)
- Check that dark mode styling works
- Test on mobile viewports
