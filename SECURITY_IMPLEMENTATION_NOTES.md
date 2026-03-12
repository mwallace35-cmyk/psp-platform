# Phase 1 Security Fixes - Implementation Notes

## Overview

This document summarizes the security hardening implemented for PhillySportsPack Next.js API routes.

**Date:** 2026-03-12
**Status:** ✓ Complete — Build verified successful

---

## 1. Rate Limiting for Public APIs

### What Was Added

Middleware-level rate limiting in `src/middleware.ts` for public API routes:

| Route Pattern | Limit | Window | Use Case |
|---|---|---|---|
| `/api/v1/*` | 60 req/min | 60s | Public data API (players, schools, leaderboards) |
| `/api/ai/*` | 5 req/min | 60s | AI content generation (summaries, recaps) |
| `/api/email/*` | 10 req/min | 60s | Email signup/confirmation flows |

### How It Works

1. **IP-based sliding window counter** using in-memory Map
2. **Per-route isolation** — each endpoint has separate limit
3. **Automatic cleanup** — expired entries purged every 5 minutes
4. **Standard headers** — X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

### Response When Limit Exceeded

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1678627234
Retry-After: 60
```

### Important Notes

- **Single-instance only** — Each Vercel instance has independent limits
- **No distributed state** — Not suitable for multi-instance clusters without Redis upgrade
- See `src/lib/rate-limit.ts` for `RedisAdapter` interface if needed for production scale-up

---

## 2. Test Routes Removed

### What Was Deleted

- `/src/app/api/sentry-example-api/` — Complete directory removed
  - Contained test error handling examples
  - Not suitable for production deployments

### Impact

- Reduced API surface area
- Cleaner production codebase
- One less potential debugging path

---

## 3. Duplicate API Routes Consolidated

### What Was Removed

- `/src/app/api/player/[id]/` (singular, deprecated)

### What Was Kept

- `/src/app/api/players/[id]/pro-status/` (plural, RESTful standard)

### Reason

- Prevents endpoint confusion
- Follows RESTful naming convention (plural resource names)
- Consistent with `/api/v1/players/*` structure

---

## 4. CORS Utility Library

### Location

`src/lib/cors.ts` — New reusable CORS helper library

### Core Functions

#### `isOriginAllowed(origin: string | null): boolean`

Check if a request origin is allowed.

```typescript
if (isOriginAllowed(request.headers.get("origin"))) {
  // Safe to respond with CORS headers
}
```

Supports:
- Exact matches: `https://phillysportspack.com`
- Wildcard patterns: `https://*.phillysportspack.com`
- Environment variable expansion: `ALLOWED_CORS_ORIGINS` env var

#### `addCorsHeaders(response: NextResponse, origin: string | null): NextResponse`

Attach CORS headers to a response (only if origin is allowed).

```typescript
const response = NextResponse.json({ data });
return addCorsHeaders(response, request.headers.get("origin"));
```

Sets:
- `Access-Control-Allow-Origin` ← if allowed
- `Access-Control-Allow-Methods` → GET, POST, PUT, DELETE, PATCH, OPTIONS
- `Access-Control-Allow-Headers` → Content-Type, Authorization, etc.
- `Access-Control-Max-Age` → 86400 (24 hours)
- `Vary: Origin` → (always set)

#### `handleCorsPreFlight(request: NextRequest): NextResponse`

Respond to OPTIONS preflight requests.

```typescript
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreFlight(request);
}
```

#### `corsErrorResponse(): NextResponse`

Return 403 Forbidden for disallowed origins.

```typescript
if (!isOriginAllowed(origin)) {
  return corsErrorResponse();
}
```

### Default Allowed Origins

```
http://localhost:3000
http://localhost:3001
http://127.0.0.1:3000
http://127.0.0.1:3001
https://phillysportspack.com
https://www.phillysportspack.com
https://*.phillysportspack.com
(+ any from ALLOWED_CORS_ORIGINS env var)
```

### Example API Route with CORS

```typescript
import { handleCorsPreFlight, addCorsHeaders } from "@/lib/cors";
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreFlight(request);
}

export async function GET(request: NextRequest) {
  try {
    // Your logic here
    const data = await fetchData();

    const response = NextResponse.json({ data });
    return addCorsHeaders(response, request.headers.get("origin"));
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

---

## Integration Checklist for New API Routes

When adding new public API routes, follow this security checklist:

- [ ] Route path is `/api/v1/*` for data APIs, `/api/ai/*` for AI, `/api/email/*` for email
- [ ] Rate limiting applied (automatic via middleware, verify via X-RateLimit-Limit header)
- [ ] CORS support added if cross-origin access needed
  - [ ] `OPTIONS` handler calls `handleCorsPreFlight(request)`
  - [ ] Response calls `addCorsHeaders(response, origin)` before returning
- [ ] Input validation in place (Zod schemas, parameter checks)
- [ ] Error handling captures request ID for logging
- [ ] Response includes standard headers (Content-Type, Cache-Control, etc.)

---

## Testing Rate Limits Locally

```bash
# Should succeed (within 60 req/min limit)
curl http://localhost:3000/api/v1/players

# Rapidly send 65 requests to trigger 429
for i in {1..65}; do
  curl http://localhost:3000/api/v1/players \
    -H "x-forwarded-for: 127.0.0.1"
done

# Last request should return 429 with Retry-After: 60
# Headers will show X-RateLimit-Remaining: 0
```

---

## Middleware Execution Order

The middleware flow is:

1. **Request ID generation** → Every request gets correlation ID
2. **Preview parameter handling** → Check for `?preview=<key>`
3. **Coming-soon gate** → Redirect non-allowlisted IPs unless bypassed
4. **Public API rate limiting** (NEW)
   - `/api/v1/*` → 60 req/min
   - `/api/ai/*` → 5 req/min
   - `/api/email/*` → 10 req/min
5. **Admin auth gate** → Supabase session check for `/admin` and `/login`
6. **Security headers** → CSP, HSTS, X-Frame-Options, etc. (unchanged)

---

## Future Enhancements

### For Scale (Multi-Instance)

Upgrade rate limiting to Redis:

```typescript
// In src/lib/rate-limit.ts, there's already a RedisAdapter
// Configure Redis connection and the middleware will auto-detect:
const adapter = await getRateLimitAdapter();
// Returns RedisAdapter if Redis available, InMemoryAdapter otherwise
```

### For Advanced CORS

Extend `src/lib/cors.ts` to support:
- Credential requirements per origin
- Method whitelisting per origin
- Custom header rules per endpoint
- Rate limiting by origin (separate from IP rate limits)

---

## Files Reference

| File | Purpose | Changes |
|---|---|---|
| `src/middleware.ts` | Edge middleware | Added `checkRateLimit()` + 3 rate limit checks (+70 lines) |
| `src/lib/cors.ts` | CORS utilities | NEW file, 144 lines |
| `src/app/api/sentry-example-api/` | Test endpoint | DELETED |
| `src/app/api/player/[id]/` | Duplicate player route | DELETED |

---

## Verification

Build verification: ✓ Passed (2026-03-12 00:45 UTC)

```
✓ Compiled successfully in 10.5s
✓ Generating static pages using 3 workers (141/141) in 13.4s
```

No TypeScript errors or runtime warnings.
