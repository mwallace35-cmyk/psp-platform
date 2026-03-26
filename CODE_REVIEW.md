# PSP Code Review — Security, Performance & Correctness

**Date:** March 26, 2026
**Scope:** Critical files across middleware, API routes, data layer, Supabase clients

---

## Findings Summary

| Severity | Count | Top Issues |
|----------|-------|------------|
| 🔴 Critical | 3 | IP spoofing, SQL injection via order_by, cookie security |
| 🟠 High | 5 | N+1 queries, input validation, credential handling, null crashes |
| 🟡 Medium | 5 | Cache headers, type safety, pagination, CSP, race condition |
| ⚪ Low | 3 | Error exposure, HTTPS enforcement, redirect validation |

---

## 🔴 CRITICAL (Fix Immediately)

### 1. Rate Limit Bypass via IP Spoofing
**File:** `src/middleware.ts` lines 144-146
```typescript
const forwarded = request.headers.get("x-forwarded-for") || "";
const clientIp = forwarded.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
```
`x-forwarded-for` is user-controllable. Attacker can spoof IP to bypass rate limits.

**Fix:** On Vercel, the first value in `x-forwarded-for` is set by Vercel's proxy and is trustworthy. But validate with:
```typescript
// Vercel sets x-real-ip reliably — prefer it
const clientIp = request.headers.get("x-real-ip") ||
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  "unknown";
```

### 2. SQL Injection via order_by Parameter
**File:** `src/app/api/v1/players/route.ts` line 156
```typescript
const orderBy = searchParams.get("order_by") || "name";
query = query.order(orderBy as string, { ascending: orderBy === "name" });
```
No whitelist validation on `orderBy`. User can inject arbitrary column names.

**Fix:**
```typescript
const ALLOWED_ORDER = ["name", "graduation_year", "pro_team"];
const orderBy = searchParams.get("order_by")?.toLowerCase() || "name";
if (!ALLOWED_ORDER.includes(orderBy)) {
  return NextResponse.json({ error: "Invalid order_by" }, { status: 400 });
}
```
*Also applies to `/api/v1/schools/route.ts`*

### 3. Cookie Missing Secure Flag in Non-Production
**File:** `src/middleware.ts` line 132
```typescript
secure: process.env.NODE_ENV === 'production',
```
Preview/staging bypass cookies transmit over HTTP.

**Fix:** Always set `secure: true`.

---

## 🟠 HIGH (Fix This Sprint)

### 4. N+1 Queries in getGameBoxScore
**File:** `src/lib/data/games.ts` lines 84-150
Fetches game_player_stats, then separate queries for players and schools. Should use Supabase JOINs in a single query.

### 5. Sport Parameter Not Lowercased Consistently
**File:** `src/app/api/v1/search/route.ts` line 184
Validated at line 103 but used without lowercasing at line 184.

### 6. Placeholder Credentials Fallback
**File:** `src/lib/supabase/static.ts` lines 19-28
Falls back to `placeholder.supabase.co` instead of throwing. Masks missing env vars.

### 7. Null School Crash on Missing Slug
**File:** `src/lib/data/schools.ts` lines 137-150
`getSchoolBySlug` returns null without a 404-triggering error.

### 8. API Key Rate Limit Race Condition
**File:** `src/lib/api-auth.ts` lines 35-42
Read-then-increment is not atomic. Use `rpc('increment_api_requests')` instead.

---

## 🟡 MEDIUM (Next Sprint)

### 9. Inconsistent Cache Headers Across API Routes
Players uses 10-min fixed cache, schools uses dynamic cache.

### 10. 97 `as any` Casts in Data Layer
Concentrated in greatest-seasons (18), computed-records (13), position-leaders (9).

### 11. Missing Pagination Metadata on Leaderboards
Queries silently truncate large result sets.

### 12. CSP frame-ancestors 'none' May Block Internal Iframes
If app uses embedded videos/scoreboards, they'll be blocked.

### 13. Missing HTTPS Redirect in Middleware
HSTS header exists but no HTTP→HTTPS redirect.

---

## Priority Action List

| Priority | Action | Files | Effort |
|----------|--------|-------|--------|
| **P0** | Add order_by whitelist to API routes | 2 API routes | 15 min |
| **P0** | Fix cookie secure flag | middleware.ts | 5 min |
| **P0** | Use x-real-ip over x-forwarded-for | middleware.ts | 5 min |
| **P1** | Convert N+1 to JOINs in getGameBoxScore | games.ts | 30 min |
| **P1** | Throw on missing Supabase credentials | static.ts | 10 min |
| **P1** | Add null→404 for getSchoolBySlug | schools.ts | 10 min |
| **P1** | Atomic rate limit increment | api-auth.ts | 20 min |
| **P2** | Standardize cache headers | API routes | 30 min |
| **P2** | Generate Supabase types | One-time setup | 15 min |
