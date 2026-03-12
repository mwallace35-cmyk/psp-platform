# PhillySportsPack Features Quick Start Guide

## Feature 1: Multi-Sport School Hub

### Basic Usage
Navigate to any school profile:
```
https://phillysportspack.com/schools/st-josephs-prep
```

### What You'll See
- School hero section with brand colors, mascot, contact info
- All sports grid (🏈 Football, 🏀 Basketball, ⚾ Baseball, etc.)
- Next-level athletes (college commitments, pro career paths)
- Championship history across all sports
- Recent season records
- Related articles
- Share buttons

### For Developers: Using the Data Layer

```tsx
import {
  getSchoolHubData,
  getSchoolAllSportsStats,
  getSchoolNextLevel,
  getSchoolAllChampionships,
  getSchoolByLeague,
} from "@/lib/data/school-hub";

// Get school profile
const school = await getSchoolHubData("st-josephs-prep");

// Get all sports stats for the school
const allSports = await getSchoolAllSportsStats(school.id);
// Returns: [{sport_id, sport_name, wins, losses, ties, championship_count, player_count}, ...]

// Get next-level athletes
const athletes = await getSchoolNextLevel(school.id);
// Returns: [{person_name, current_level, college, pro_team, pro_league}, ...]

// Get all championships
const champs = await getSchoolAllChampionships(school.id);
// Returns: [{year, sport_name, level, league_name}, ...]

// Get schools grouped by league (for directory)
const schoolsByLeague = await getSchoolsByLeague();
// Returns: [
//   {id, name, slug, city, state, league_id, leagues, champ_count},
//   ...
// ]
```

---

## Feature 2: Advanced Search with Filters

### Basic Usage
Navigate to search page:
```
https://phillysportspack.com/search
```

### How to Use Filters

1. **Enter search query** (min 2 characters) — e.g., "Kyle McCord"
2. **Select filters:**
   - Sport: Football, Basketball, Baseball, etc.
   - Type: Players, Schools, Coaches, Seasons
   - League: Catholic League, Public League, Inter-Ac
   - Era: 2020s, 2010s, 2000s, 1990s, Earlier
   - Position: QB, RB, WR (when sport is selected)
3. **Click "Apply Filters"** or **"Clear"** to reset

### Example Searches
```
/search?q=Kyle+McCord&sport=football
/search?q=Roman&type=school&league=catholic
/search?q=Jones&era=1990s&league=public
/search?q=player&sport=basketball&position=PG
```

### For Developers: Using SearchFilters Component

```tsx
import SearchFilters from "@/components/search/SearchFilters";

export default function SearchPage() {
  return (
    <>
      {/* Show filters when user has searched */}
      {query.length >= 2 && (
        <SearchFilters onFiltersChange={() => {
          // Callback when filters are applied
          console.log("Filters changed");
        }} />
      )}

      {/* Rest of search results */}
    </>
  );
}
```

### URL Parameter Structure
```
/search?q=<query>&sport=<sport>&type=<type>&league=<league>&era=<era>&position=<position>
```

Example:
```
/search?q=McCord&sport=football&type=player&league=catholic&era=2020s
```

---

## Feature 3: Shareable Stat Cards & Social Sharing

### Basic Usage

#### On Player Profile
```tsx
import { ShareStatButton } from "@/components/ui";

<ShareStatButton
  url={`/football/players/${slug}`}
  title={`${player.name} — ${school.name}`}
  statText={`${player.name}: 3,200 passing yards — St. Joseph's Prep (Class of 2024)`}
  type="player"
/>
```

#### On School Profile
```tsx
<ShareStatButton
  url={`/schools/${school.slug}`}
  title={`${school.name} Athletics`}
  statText={`${school.name}: 85 All-Time Championships`}
  type="school"
/>
```

### What Happens When Sharing

1. **Copy Link** — Copies URL to clipboard
2. **Twitter/X** — Opens intent dialog with pre-filled stat text
   - Example: "Check out Kyle McCord: 3,200 passing yards — St. Joseph's Prep"
3. **Facebook** — Opens share dialog
4. **Native Share** (mobile) — Uses system share sheet

### OG Image Generation

When links are shared on social media:
1. URL is fetched
2. OG meta tag requests image from `/api/og`
3. Next.js ImageResponse renders branded card with:
   - Player/school name
   - Sport (with color theme)
   - School affiliation
   - PSP branding

Example OG URL:
```
/api/og?title=Kyle+McCord&subtitle=St.+Joseph%27s+Prep+%E2%80%94+Football&sport=football&type=player
```

### For Developers: Building OG Images

```tsx
import { buildOgImageUrl } from "@/lib/og-utils";

// Generate OG image URL
const ogImageUrl = buildOgImageUrl({
  title: "Kyle McCord",
  subtitle: "St. Joseph's Prep — Football",
  sport: "football",
  type: "player",
});

// Use in metadata
export const metadata: Metadata = {
  openGraph: {
    images: [{ url: ogImageUrl, width: 1200, height: 630 }],
  },
};
```

### Customizing Share Text

The ShareStatButton takes a `statText` prop that's used for social shares:

```tsx
// Player with specific stat
<ShareStatButton
  url={`/football/players/${slug}`}
  title={player.name}
  statText={`${player.name}: ${stats.passingYards} passing yards — ${school.name}`}
/>

// School with championships
<ShareStatButton
  url={`/schools/${school.slug}`}
  title={school.name}
  statText={`${school.name}: ${champCount} championships across all sports`}
/>

// Coach with record
<ShareStatButton
  url={`/football/coaches/${slug}`}
  title={coach.name}
  statText={`${coach.name}: ${wins}-${losses}-${ties} all-time record — View Full Profile`}
/>
```

---

## Testing the Features

### Feature 1: School Hub
```bash
# Visit a school with multiple sports
curl https://phillysportspack.com/schools/st-josephs-prep

# Check if hero colors load
# Check if all-sports grid displays
# Check if championships show across sports
```

### Feature 2: Search Filters
```bash
# Test basic search
https://phillysportspack.com/search?q=Kyle+McCord

# Test with sport filter
https://phillysportspack.com/search?q=McCord&sport=football

# Test with multiple filters
https://phillysportspack.com/search?q=Jones&sport=football&league=catholic&era=1990s

# Test mobile (resize to <768px width)
# Should show "Filters" button
```

### Feature 3: Social Sharing
```bash
# Visit a player profile
https://phillysportspack.com/football/players/kyle-mccord

# Click share button
# - Test "Copy Link"
# - Open Twitter/X intent in new window
# - Open Facebook sharer in new window
# - On mobile, should show native share sheet

# Share link on Twitter
# - OG image should display from /api/og endpoint
# - Title should be player name + school
```

---

## Common Integration Points

### Adding ShareStatButton to New Pages

1. Import the component:
```tsx
import { ShareStatButton } from "@/components/ui";
```

2. Add to your page:
```tsx
<ShareStatButton
  url={currentUrl}
  title={entityName}
  statText={optionalCustomText}
  type="player" // or "school"
/>
```

3. The button will:
   - Render with gold styling
   - Show dropdown menu on click
   - Support native share on mobile
   - Generate OG image on social share

### Adding Filters to Other Search Pages

1. Import the component:
```tsx
import SearchFilters from "@/components/search/SearchFilters";
```

2. Add above your results:
```tsx
{showFilters && <SearchFilters />}
```

3. Read filter params in your component:
```tsx
const searchParams = useSearchParams();
const sport = searchParams.get("sport");
const type = searchParams.get("type");
const league = searchParams.get("league");
const era = searchParams.get("era");
const position = searchParams.get("position");
```

### Using School Hub Data in Custom Pages

```tsx
import {
  getSchoolHubData,
  getSchoolAllSportsStats,
} from "@/lib/data/school-hub";

export default async function CustomPage({ params }) {
  const school = await getSchoolHubData(params.slug);
  const sports = await getSchoolAllSportsStats(school.id);

  return (
    <div>
      <h1>{school.name}</h1>
      <div>
        {sports.map(sport => (
          <div key={sport.sport_id}>
            <h3>{sport.sport_emoji} {sport.sport_name}</h3>
            <p>{sport.wins}W - {sport.losses}L - {sport.championship_count} Championships</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Troubleshooting

### SearchFilters not showing
- Ensure query length >= 2 characters
- Check that `SearchFilters` component is imported
- Verify URL params are being passed correctly

### ShareStatButton not appearing
- Ensure `ShareStatButton` is imported from `@/components/ui`
- Check that required props (url, title) are provided
- Verify page exports proper metadata for OG images

### OG images not displaying
- Check `/api/og` endpoint is working (add ?title=test)
- Verify `buildOgImageUrl()` is called in metadata
- Ensure OpenGraph meta tags are in page metadata
- Check that images are cached (1-year TTL)

### School hub not loading all sports
- Verify school has team_seasons in database
- Check that sports are linked via sport_id
- Ensure soft-deleted records are filtered

---

## API Reference

### SearchFilters Props
```tsx
interface SearchFiltersProps {
  onFiltersChange?: () => void;
}
```

### ShareStatButton Props
```tsx
interface ShareStatButtonProps {
  url: string;           // URL path (e.g., "/football/players/kyle-mccord")
  title: string;         // Share title
  statText?: string;     // Custom text for social media
  type?: "player" | "school";
}
```

### OG Image URL Builder
```tsx
interface OGImageParams {
  title: string;         // Required: Main text
  subtitle?: string;     // Optional: Supporting text
  sport?: SportId;       // Optional: Sport for color scheme
  type?: "player" | "team" | "school" | "article" | "sport";
}
```

### School Hub Data Fetchers
All functions use React `cache()` and retry logic:

```tsx
// School profile metadata
getSchoolHubData(slug: string) → SchoolHubData

// All sports stats
getSchoolAllSportsStats(schoolId: number) → SchoolSportStats[]

// College/Pro athletes
getSchoolNextLevel(schoolId: number) → NextLevelAthlete[]

// Championship history
getSchoolAllChampionships(schoolId: number) → SchoolChampionshipData[]

// Recent team records
getSchoolRecentSeasons(schoolId: number, limit?: number) → RecentSeasonData[]

// Articles mentioning school
getSchoolArticles(schoolId: number, limit?: number) → Article[]

// Schools by league
getSchoolsByLeague() → School[]
```

---

## Performance Notes

- **Filters:** Client-side only, no API calls
- **School Hub:** Uses parallel queries, ~200-500ms load time
- **OG Images:** Cached 1 year, generated on first share
- **Search:** Full-text search via Supabase, <100ms response

---

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile: Optimized, including native share sheet
- IE11: Not supported

---

For more details, see FEATURES_IMPLEMENTATION.md
