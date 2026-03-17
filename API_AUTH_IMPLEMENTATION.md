# Private API Authentication & Premium Endpoints Implementation

**Date:** 2026-03-16
**Status:** COMPLETE - All files created and integrated successfully

## Overview

This implementation adds API key authentication middleware and 3 new premium-tier API endpoints to the PhillySportsPack platform, along with an admin management interface for API keys.

## Files Created

### 1. `src/lib/api-auth.ts` (175 lines)
**Purpose:** Core API key authentication middleware

**Key Functions:**
- `validateApiKey(request)` - Validates X-API-Key header against Supabase api_keys table
  - Checks is_active status
  - Validates daily rate limits
  - Increments request counter
  - Returns ApiKeyInfo or null

- `logApiUsage(apiKeyId, endpoint, responseCode, responseTimeMs)` - Logs API usage for analytics

- `withApiAuth(handler, requiredTier)` - Wrapper for required API key authentication
  - Validates key existence
  - Checks tier requirements (basic/standard/premium)
  - Sets rate limit headers
  - Logs usage automatically
  - Returns 401 for missing/invalid keys, 403 for insufficient tier

- `withOptionalApiAuth(handler)` - Wrapper for optional API key validation
  - Allows access without key (public endpoints)
  - Tracks usage if key is provided
  - Adds rate limit headers when authenticated

**Interface:**
```typescript
interface ApiKeyInfo {
  id: number;
  partnerName: string;
  tier: 'basic' | 'standard' | 'premium';
  dailyLimit: number;
  requestsToday: number;
}
```

---

### 2. `src/app/api/v1/recruiting/updates/route.ts` (195 lines)
**Endpoint:** `GET /api/v1/recruiting/updates`
**Tier:** PREMIUM
**Purpose:** Fetch recent recruiting updates and player commitments

**Query Parameters:**
- `sport` (optional) - Filter by sport (football, basketball, etc.)
- `limit` (optional, default: 20, max: 100) - Number of updates
- `type` (optional) - Filter by type (commitment, offer, rating-change, transfer, decommitment)
- `page` (optional, default: 0) - Pagination offset

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "player_id": 12345,
      "player_name": "John Smith",
      "player_slug": "john-smith",
      "school_id": 100,
      "school_name": "St. Joseph's Prep",
      "school_slug": "st-josephs-prep",
      "sport": "football",
      "type": "commitment",
      "title": "Commits to UPenn",
      "description": "...",
      "target_school": "...",
      "target_college": "UPenn",
      "created_at": "2026-03-16T10:00:00Z"
    }
  ],
  "pagination": { "page": 0, "limit": 20, "total": 150, "has_more": true },
  "meta": { "timestamp": "...", "request_id": "...", "tier": "premium" }
}
```

**Database:** Uses recruiting_updates table (structure defined, data population ongoing)

---

### 3. `src/app/api/v1/rankings/power-index/route.ts` (243 lines)
**Endpoint:** `GET /api/v1/rankings/power-index`
**Tier:** PREMIUM
**Purpose:** Composite power index rankings by sport

**Query Parameters:**
- `sport` (optional) - Filter by single sport
- `limit` (optional, default: 25, max: 100) - Number of rankings
- `league_id` (optional) - Filter by league

**Power Score Calculation:**
- 40% historical win percentage
- 30% recent (5-year) win percentage
- 15% state championships
- 15% league championships

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "school_id": 1005,
      "school_name": "St. Joseph's Prep",
      "school_slug": "st-josephs-prep",
      "sport": "football",
      "league": "Catholic League",
      "power_score": 87.53,
      "championships": 15,
      "all_time_record": { "wins": 620, "losses": 180, "ties": 8 },
      "recent_seasons_record": { "wins": 48, "losses": 7, "ties": 0 },
      "state_titles": 9,
      "league_titles": 23,
      "last_updated": "2026-03-16T10:00:00Z"
    }
  ],
  "meta": { "timestamp": "...", "request_id": "...", "tier": "premium", "sport": "football" }
}
```

**Caching:** 1 hour (3600s) with stale-while-revalidate for 24 hours

---

### 4. `src/app/api/v1/live/scores/route.ts` (211 lines)
**Endpoint:** `GET /api/v1/live/scores`
**Tier:** PREMIUM
**Purpose:** Real-time game scores and results

**Query Parameters:**
- `sport` (optional) - Filter by sport
- `date` (optional, default: today, format: YYYY-MM-DD) - Query date
- `league_id` (optional) - Filter by league

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "id": 42839,
      "sport": "football",
      "league": "Public League",
      "date": "2026-03-16",
      "time": "19:00",
      "status": "final",
      "home_team": { "id": 209, "name": "Imhotep", "slug": "imhotep", "score": 35 },
      "away_team": { "id": 127, "name": "Roman Catholic", "slug": "roman-catholic", "score": 28 },
      "location": "Lincoln Field",
      "notes": "Playoff game"
    }
  ],
  "meta": { "timestamp": "...", "request_id": "...", "tier": "premium", "date": "2026-03-16" }
}
```

**Caching:** 60 seconds (fresh live data) with 5-minute stale-while-revalidate

---

### 5. `src/app/admin/api-keys/page.tsx` (341 lines)
**Route:** `/admin/api-keys`
**Purpose:** Admin dashboard for managing API keys

**Features:**
- View all API keys with usage stats
- Create new keys with partner name, email, and tier selection
- Auto-generates API key using crypto.randomUUID() with `psp_` prefix
- Toggle active/inactive status
- Reset daily usage counter
- Copy API key to clipboard
- Display daily usage bar chart (requests_today / daily_limit)
- Shows last used timestamp

**Tier Limits (Auto-set on creation):**
- Basic: 100 requests/day
- Standard: 1,000 requests/day
- Premium: 10,000 requests/day

**UI Components Used:**
- Button (default import)
- Card (default import)
- Badge (default import)

---

## Files Modified

### 1. `src/app/api/v1/players/route.ts`
- Added import: `import { withOptionalApiAuth, type ApiKeyInfo } from "@/lib/api-auth";`
- Renamed function: `GET()` → `getPlayersHandler(request, apiKey)`
- Added wrapper: `export const GET = withOptionalApiAuth(getPlayersHandler);`
- **Impact:** Optional API key tracking, no breaking changes to public API

### 2. `src/app/api/v1/schools/route.ts`
- Added import: `import { withOptionalApiAuth, type ApiKeyInfo } from "@/lib/api-auth";`
- Renamed function: `GET()` → `getSchoolsHandler(request, apiKey)`
- Added wrapper: `export const GET = withOptionalApiAuth(getSchoolsHandler);`
- **Impact:** Optional API key tracking, no breaking changes to public API

---

## API Rate Limiting

**Response Headers Added:**
```
X-RateLimit-Limit: 10000 (or tier-specific limit)
X-RateLimit-Remaining: 9999
X-Powered-By: PhillySportsPack API v1
```

**Database Schema Integration:**
- Uses existing `api_keys` table with columns:
  - `api_key` (varchar, unique) - The actual key
  - `partner_name` (varchar) - Partner/company name
  - `email` (varchar, nullable) - Contact email
  - `tier` (enum: basic, standard, premium)
  - `daily_limit` (int) - Requests allowed per day
  - `requests_today` (int) - Counter for current day
  - `is_active` (boolean) - Enable/disable flag
  - `created_at` (timestamp)
  - `last_used_at` (timestamp, nullable)

- Uses `api_usage_log` table for analytics:
  - `api_key_id` (FK to api_keys)
  - `endpoint` (varchar)
  - `response_code` (int)
  - `response_time_ms` (int)

---

## Error Handling

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Invalid or missing API key. Get one at phillysportspack.com/api/keys"
}
```

### 403 Forbidden (Insufficient Tier)
```json
{
  "success": false,
  "error": "This endpoint requires premium tier or higher. Your tier: basic"
}
```

### 400 Bad Request (Invalid Parameters)
```json
{
  "success": false,
  "error": "Invalid sport. Must be one of: football, basketball, baseball, ..."
}
```

### 429 Rate Limited (Daily Limit Exceeded)
Handled at validateApiKey level - returns null, triggering 401 response

---

## Testing the Implementation

### 1. Create an API key in `/admin/api-keys`:
- Navigate to http://localhost:3000/admin/api-keys
- Click "Create New Key"
- Fill in partner name (e.g., "Test Partner")
- Select tier (e.g., "premium")
- Click "Create API Key"
- Copy the generated key (format: `psp_[32-char-hex]`)

### 2. Test a public endpoint with optional auth:
```bash
# Without API key (public access)
curl http://localhost:3000/api/v1/players?sport=football&limit=5

# With API key (tracked)
curl -H "X-API-Key: psp_xxxxxxxxxxxxx" http://localhost:3000/api/v1/players?sport=football&limit=5
```

### 3. Test a premium endpoint (requires API key):
```bash
# With valid premium key
curl -H "X-API-Key: psp_xxxxxxxxxxxxx" http://localhost:3000/api/v1/rankings/power-index?sport=football

# Without key or with basic key (will fail)
curl http://localhost:3000/api/v1/rankings/power-index?sport=football
# Returns: 401 Unauthorized
```

---

## Known Limitations & Future Work

1. **recruiting_updates table** - Currently returns mock structure, awaiting actual data source
2. **Database reset logic** - `requests_today` counter should reset at midnight (set up via cron job or PostgreSQL trigger)
3. **Rate limiting** - Uses database increment (could add Redis for distributed systems)
4. **API key generation** - Currently uses simple UUID, could add rotation/expiration features
5. **Analytics** - api_usage_log can be queried for detailed usage reports (admin dashboard pending)

---

## Build Status

✅ All new files created successfully
✅ Existing routes updated with optional auth
✅ TypeScript compilation: PASS (excluding pre-existing test file issues)
✅ Ready for deployment to Vercel

---

## File Summary

| File | Type | Lines | Status |
|------|------|-------|--------|
| src/lib/api-auth.ts | Library | 175 | ✅ Created |
| src/app/api/v1/recruiting/updates/route.ts | API Route | 195 | ✅ Created |
| src/app/api/v1/rankings/power-index/route.ts | API Route | 243 | ✅ Created |
| src/app/api/v1/live/scores/route.ts | API Route | 211 | ✅ Created |
| src/app/admin/api-keys/page.tsx | Admin Page | 341 | ✅ Created |
| src/app/api/v1/players/route.ts | Modified | +8 | ✅ Updated |
| src/app/api/v1/schools/route.ts | Modified | +8 | ✅ Updated |
| **Total** | | **1,181 lines** | **COMPLETE** |

---

## Next Steps (Optional)

1. Populate the `recruiting_updates` table with data from your recruiting data sources
2. Set up midnight cron job to reset daily counters: `UPDATE api_keys SET requests_today = 0`
3. Create admin dashboard for viewing api_usage_log analytics
4. Add API key rotation and expiration features
5. Implement Redis adapter for distributed rate limiting (if scaling)
