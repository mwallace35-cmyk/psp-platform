# Security Implementation Checklist

## CSP Nonce Implementation

### When Adding New Script Tags

All `<Script>` components in Next.js should receive the nonce prop:

```typescript
// In layout.tsx or other Server Components
import { headers } from "next/headers";
import Script from "next/script";

export default function Layout() {
  const headersList = headers();
  const nonce = headersList.get("x-csp-nonce") || "";

  return (
    <>
      {/* For external scripts */}
      <Script nonce={nonce} src="https://example.com/script.js" />

      {/* For inline scripts */}
      <Script
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `console.log('hello')`
        }}
      />
    </>
  );
}
```

### For Inline Styles

If you must use inline styles, apply the nonce:

```typescript
// Good - with nonce
<style nonce={nonce}>{`
  .my-class { color: red; }
`}</style>

// Better - use CSS file instead
// globals.css: .my-class { color: red; }
<div className="my-class">Text</div>
```

---

## Rate Limiting Usage

### Basic Rate Limiting in API Routes

```typescript
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const userAgent = request.headers.get("user-agent");
  const acceptLanguage = request.headers.get("accept-language");

  // Check rate limit - now async!
  const { success, remaining, resetAt } = await rateLimit(
    ip,
    maxRequests,      // Max requests per window
    windowMs,         // Time window in ms
    "/api/my-route",  // Endpoint identifier
    userAgent,        // For fingerprinting
    acceptLanguage,   // For fingerprinting
    false             // isAdmin bypass (false for public endpoints)
  );

  if (!success) {
    const headers: Record<string, string> = {
      "Retry-After": "60",
      "X-RateLimit-Remaining": "0"
    };
    if (resetAt) {
      headers["X-RateLimit-Reset"] = String(Math.ceil(resetAt / 1000));
    }
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers }
    );
  }

  // Continue with request...
}
```

### Rate Limiting Limits by Endpoint

- `/api/search` - 30 requests per minute
- `/api/player/[id]` - 60 requests per minute
- `/api/ai/summary` - 5 requests per minute
- `/api/ai/recap` - 5 requests per minute
- `/api/oembed` - 10 requests per minute

To change limits, update the `rateLimit()` call in the respective route.

### Admin Bypass

For authenticated admin endpoints:

```typescript
const isAdmin = user?.role === 'admin'; // Get from your auth system

const { success } = await rateLimit(
  ip,
  limit,
  window,
  endpoint,
  userAgent,
  acceptLanguage,
  isAdmin  // Admin gets unlimited requests
);
```

---

## Environment Variables

### Required Variables

These must be set or the app will fail to start:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Optional Variables

These have defaults and are optional:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX      # For Google Analytics
PSP_PREVIEW_KEY=your-preview-key                # For preview mode
REVALIDATION_SECRET=your-revalidation-secret    # For ISR revalidation
RESEND_API_KEY=your-resend-key                  # For email sending
ANTHROPIC_API_KEY=your-anthropic-key            # For AI features
```

### Accessing Environment Variables

```typescript
import { env } from "@/lib/env";

// Type-safe access
const supabaseUrl = env.supabaseUrl;      // Required
const gaId = env.gaId;                    // Optional (safe to use if missing)
const apiKey = env.anthropicApiKey;       // Optional

// Never use process.env directly - use env instead
// ❌ Bad
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

// ✅ Good
const url = env.supabaseUrl;
```

---

## Cookie Security

### Preview Bypass Cookie

The preview bypass cookie is set with the following security attributes:

**Production:**
- `httpOnly: true` - Cannot be accessed by JavaScript (prevents XSS theft)
- `secure: true` - Only sent over HTTPS
- `sameSite: strict` - No cross-origin requests can send this cookie

**Development:**
- `httpOnly: true` - Still secure, prevents XSS
- `secure: false` - Allows HTTP for local testing
- `sameSite: lax` - Allows some cross-origin requests for testing

### Setting Custom Cookies

When setting new cookies in middleware or API routes:

```typescript
response.cookies.set("my-cookie", value, {
  httpOnly: true,                     // Prevent JS access
  secure: process.env.NODE_ENV === 'production',  // HTTPS only in prod
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 60 * 60 * 24 * 30,         // 30 days
  path: "/",
});
```

---

## Error Handling

### Secure Error Responses

Always return generic error messages to clients. Log details internally.

```typescript
import { captureError } from "@/lib/error-tracking";

try {
  const data = await someDangerousOperation();
  return NextResponse.json({ success: true, data });
} catch (error: any) {
  // Log the full error internally
  captureError(error, { endpoint: '/api/my-route' });

  // Return generic message to client
  return NextResponse.json(
    { error: 'Failed to process request' },
    { status: 500 }
  );
}
```

### Never Expose

❌ Never send these to clients:
- `error.message`
- `error.stack`
- Database query details
- API credentials
- Internal file paths

✅ Do send:
- Generic "Something went wrong" messages
- Standard error codes
- Helpful information for debugging (without leaking internals)

---

## CSRF Token Handling

### Using CSRF Tokens in Forms

The CSRF token is automatically set in cookies. For form submissions:

```typescript
// In Server Component or API route
import { generateCsrfToken, CSRF_COOKIE_NAME } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  const csrfToken = request.headers.get('x-csrf-token');
  const csrfCookie = request.cookies.get(CSRF_COOKIE_NAME)?.value;

  if (!validateCsrfToken(csrfToken, csrfCookie)) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  // Process form submission
}
```

### Client-Side CSRF

For client-side forms using fetch:

```typescript
// Get token from cookie
const getCsrfToken = () => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'psp_csrf') return decodeURIComponent(value);
  }
  return null;
};

// Use in fetch requests
await fetch('/api/my-endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-csrf-token': getCsrfToken() || ''
  },
  body: JSON.stringify({ data })
});
```

---

## Rate Limit Adapter Configuration

### Using Redis in Production

To use Redis instead of in-memory storage:

```typescript
// src/lib/rate-limit-redis.ts
import { RateLimitAdapter, RateLimitResult } from "@/lib/rate-limit";
import Redis from "ioredis";

export class RedisRateLimitAdapter implements RateLimitAdapter {
  constructor(private redis: Redis) {}

  async check(
    key: string,
    maxRequests: number,
    windowMs: number
  ): Promise<RateLimitResult> {
    const result = await this.redis.incr(key);

    if (result === 1) {
      await this.redis.pexpire(key, windowMs);
    }

    const remaining = Math.max(0, maxRequests - result);
    const resetAt = Date.now() + windowMs;

    return {
      success: result <= maxRequests,
      remaining,
      resetAt
    };
  }
}
```

Then in your app initialization:

```typescript
// app/layout.tsx or api initialization
import { setRateLimitAdapter } from "@/lib/rate-limit";
import { RedisRateLimitAdapter } from "@/lib/rate-limit-redis";
import Redis from "ioredis";

if (process.env.REDIS_URL) {
  const redis = new Redis(process.env.REDIS_URL);
  setRateLimitAdapter(new RedisRateLimitAdapter(redis));
}
```

---

## Security Headers Overview

The middleware automatically sets these headers on all responses:

| Header | Value | Purpose |
|--------|-------|---------|
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| X-Frame-Options | SAMEORIGIN | Prevent clickjacking |
| Referrer-Policy | strict-origin-when-cross-origin | Control referrer leakage |
| Permissions-Policy | camera=(), microphone=() | Disable unused APIs |
| Strict-Transport-Security | max-age=63072000 | Force HTTPS (2 years) |
| Cross-Origin-Opener-Policy | same-origin | Prevent cross-origin popups |
| Cross-Origin-Resource-Policy | same-origin | Restrict resource embedding |
| Content-Security-Policy | nonce-based, strict | Prevent XSS and injection |

---

## Pre-Commit Checklist

Before pushing security-related changes:

- [ ] No `process.env.*` access outside of `env.ts`
- [ ] All Script tags have `nonce={nonce}` prop
- [ ] No inline styles without nonce or alternative CSS
- [ ] API error handling doesn't leak `error.message`
- [ ] Rate limiting calls include all fingerprinting headers
- [ ] Cookies set with proper `secure` and `sameSite` attributes
- [ ] CSRF tokens validated for state-changing requests
- [ ] No sensitive data in URL parameters
- [ ] No database query details in error responses
- [ ] All new API routes have rate limiting

---

## Testing Security

### CSP Nonce Test

```bash
curl -i https://your-domain.com/ | grep "Content-Security-Policy"
# Should show: nonce-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Rate Limit Test

```bash
# Rapid requests should trigger rate limit
for i in {1..35}; do
  curl https://your-domain.com/api/search?q=test -o /dev/null -s -w "%{http_code}\n"
done

# After 30 requests: should see "429"
```

### Security Headers Test

```bash
# Check all security headers
curl -i https://your-domain.com/ | grep -E "^(X-|Strict|Content-Security|Cross-Origin)"
```

### HTTPS Redirect Test

```bash
# Should redirect HTTP to HTTPS
curl -i http://your-domain.com/ | grep -i "location"
```

---

## Common Issues & Solutions

### Issue: Scripts not loading due to CSP

**Symptom:** Console shows CSP violation for scripts

**Solution:**
1. Ensure all Script tags have `nonce={nonce}` prop
2. Check that nonce is properly passed from headers
3. Verify CSP header in network tab includes script URL

### Issue: Rate limiting too restrictive

**Symptom:** Legitimate users getting 429 errors

**Solution:**
1. Increase limits in API route: `await rateLimit(ip, 100, 60000, ...)`
2. Check if users share IP addresses (corporate networks)
3. Adjust fingerprinting if needed

### Issue: CSRF token validation failing

**Symptom:** POST requests returning 403

**Solution:**
1. Verify CSRF token is sent in `x-csrf-token` header
2. Check cookie name matches `CSRF_COOKIE_NAME`
3. Ensure CORS is properly configured

### Issue: Cookies not persisting

**Symptom:** Preview bypass not working

**Solution:**
1. Check if browser allows cookies (3rd-party cookie settings)
2. In production, must use HTTPS
3. Verify `sameSite` attribute is compatible with usage

---

## Resources

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [Content Security Policy Guide](https://content-security-policy.com/)
- [HTTP Security Headers](https://securityheaders.com/)
- [CORS Deep Dive](https://auth0.com/blog/cors-explained/)
- [Rate Limiting Best Practices](https://www.cloudflare.com/learning/bam/what-is-rate-limiting/)

