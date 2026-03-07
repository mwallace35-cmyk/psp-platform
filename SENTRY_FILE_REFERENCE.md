# Sentry Integration - File Reference

Quick reference guide to all Sentry integration files.

## Implementation Files Created

### Core Implementation

#### `src/lib/sentry-reporter.ts` (5.7 KB)
Full Sentry implementation with all features.

**What it does:**
- Implements `SentryReporter` class
- Maps error severity to Sentry levels
- Provides breadcrumb, tag, and context methods
- Handles both server and client environments
- Gracefully handles missing `@sentry/nextjs` package

**Key exports:**
- `SentryReporter` - Main class
- `getSentryReporter()` - Singleton instance

**When to use:**
- Automatically used when DSN is configured
- Users interact through `captureError()` in `error-tracking.ts`

---

#### `src/instrumentation.ts` (3.3 KB)
Next.js server-side initialization hook.

**What it does:**
- Called by Next.js during server startup
- Initializes Sentry on Node.js runtime only
- Configures sample rates and integrations
- Sets up error filtering

**Key exports:**
- `register()` - Called by Next.js automatically

**Configuration:**
- `tracesSampleRate`: 100% dev, 50% prod
- `sampleRate`: 100% dev, 50% prod
- Respects: `NEXT_PUBLIC_SENTRY_DSN`, `NODE_ENV`

**When to use:**
- No direct user interaction
- Runs automatically on server startup

---

#### `sentry.client.config.ts` (3.7 KB)
Client-side configuration file.

**What it does:**
- Initializes Sentry for browser errors
- Enables session replay
- Configures replay masking
- Filters browser-specific errors

**How to use:**
Add to top of your root layout (e.g., `src/app/layout.tsx`):
```typescript
import "@/sentry.client.config";
```

**Configuration:**
- `replaysSessionSampleRate`: 50% dev, 10% prod
- `replaysOnErrorSampleRate`: 100% (all error replays)
- Masks text, media, and form inputs

---

### Test & Example Files

#### `src/app/api/sentry-example-api/route.ts` (6.5 KB)
Test endpoint for validating Sentry integration.

**What it does:**
- Demonstrates error capture patterns
- Provides multiple test scenarios
- Shows proper request correlation
- Supports user context testing

**Test endpoints:**
```bash
# Exception error
curl http://localhost:3000/api/sentry-example-api?type=exception

# Message capture
curl http://localhost:3000/api/sentry-example-api?type=message

# Validation error
curl http://localhost:3000/api/sentry-example-api?type=validation_error

# Network error
curl http://localhost:3000/api/sentry-example-api?type=network_error

# With user context
curl "http://localhost:3000/api/sentry-example-api?type=exception&userId=user123"
```

---

## Files Modified

### `src/lib/error-tracking.ts`
**Changes made:**
- Enhanced `ErrorReporter` interface
  - Added optional: `captureMessage()`, `addBreadcrumb()`, `setTag()`, `setContext()`
- Updated `SentryReporter` to delegate to full implementation
- Lazy loading of `sentry-reporter.ts`
- All existing code remains unchanged

**Impact:** Zero breaking changes, backward compatible

---

### `src/app/global-error.tsx`
**Changes made:**
- Updated error context: `source: "global-error-boundary"`
- Improved labeling for better debugging

**Impact:** More informative error tracking

---

### `.env.local.example`
**Changes made:**
- Added `NEXT_PUBLIC_SENTRY_DSN` with documentation
- Added `NEXT_PUBLIC_APP_VERSION`
- Noted that Sentry is optional

**Impact:** Users know what to configure

---

## Documentation Files

### Quick Start Guide

#### `SENTRY_SETUP_QUICK.md` (4 KB)
5-minute setup guide for impatient users.

**Contents:**
1. Install dependencies
2. Get DSN from Sentry
3. Add environment variables
4. Import client config
5. Test it works

**Best for:** Getting started quickly

---

### Comprehensive Guides

#### `SENTRY_INTEGRATION.md` (16 KB)
Complete integration guide with deep details.

**Contents:**
- Installation instructions
- Architecture overview
- Error categorization reference
- Usage patterns
- Configuration guide
- Testing procedures
- Troubleshooting
- Performance monitoring
- Session replay details
- Alerts configuration
- Security considerations

**Best for:** Understanding everything

---

#### `SENTRY_IMPLEMENTATION_SUMMARY.md` (12 KB)
Technical overview of the implementation.

**Contents:**
- Files created and modified
- Architecture decisions
- Feature list and status
- File-by-file breakdown
- Backward compatibility
- Environment configuration
- Testing instructions
- Future enhancements

**Best for:** Understanding architecture

---

#### `SENTRY_USAGE_EXAMPLES.md` (12+ KB)
30+ practical code examples.

**Contents:**
- Basic error capture
- API routes
- Server components
- Client components
- User context management
- Advanced features (breadcrumbs, tags, context)
- Validation errors
- Network errors
- Unit tests
- Best practices

**Best for:** Copy-paste examples

---

### Checklists & Reference

#### `SENTRY_IMPLEMENTATION_CHECKLIST.md` (10+ KB)
Step-by-step verification checklist.

**Contents:**
- Phase 1-10 setup instructions
- File verification
- Integration steps
- Testing procedures
- Configuration
- Troubleshooting
- Success criteria
- Quick reference

**Best for:** Following step-by-step

---

#### `SENTRY_FILE_REFERENCE.md` (This file)
Quick reference to all files.

**Best for:** Finding what you need

---

## Environment Variables

### Required (Optional - Falls Back to Console)
```env
# Get from https://sentry.io
NEXT_PUBLIC_SENTRY_DSN=https://key@o0.ingest.sentry.io/0

# Set to your app version for release tracking
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Automatically Used
```env
# Controls environment-specific settings
NODE_ENV=development|staging|production
```

---

## Quick Reference Matrix

| Purpose | File | Read When | Modify When |
|---------|------|-----------|------------|
| Setup | SENTRY_SETUP_QUICK.md | Getting started | Never (reference only) |
| Details | SENTRY_INTEGRATION.md | Need full guide | Never (reference only) |
| Examples | SENTRY_USAGE_EXAMPLES.md | Need code samples | Never (reference only) |
| Implementation | SENTRY_IMPLEMENTATION_SUMMARY.md | Understanding design | Never (reference only) |
| Checklist | SENTRY_IMPLEMENTATION_CHECKLIST.md | Setting up | Check off items |
| Server init | src/instrumentation.ts | Server config | Adjust sample rates |
| Client config | sentry.client.config.ts | Client setup | Adjust masking/filtering |
| Sentry impl | src/lib/sentry-reporter.ts | Understanding features | Add new methods |
| Error tracking | src/lib/error-tracking.ts | Using errors | Add new features |
| Global errors | src/app/global-error.tsx | Error boundary | Add new context |
| Test endpoint | src/app/api/sentry-example-api | Testing | Add test scenarios |
| Env example | .env.local.example | Setup | Copy to .env.local |

---

## Directory Structure

```
next-app/
├── src/
│   ├── lib/
│   │   ├── error-tracking.ts (MODIFIED)
│   │   └── sentry-reporter.ts (NEW)
│   ├── app/
│   │   ├── global-error.tsx (MODIFIED)
│   │   └── api/
│   │       └── sentry-example-api/
│   │           └── route.ts (NEW)
│   └── instrumentation.ts (NEW)
├── sentry.client.config.ts (NEW)
├── .env.local.example (MODIFIED)
├── SENTRY_INTEGRATION.md (NEW)
├── SENTRY_SETUP_QUICK.md (NEW)
├── SENTRY_IMPLEMENTATION_SUMMARY.md (NEW)
├── SENTRY_IMPLEMENTATION_CHECKLIST.md (NEW)
├── SENTRY_USAGE_EXAMPLES.md (NEW)
├── SENTRY_FILE_REFERENCE.md (NEW - this file)
└── [other files...]
```

---

## File Sizes

| File | Size | Type |
|------|------|------|
| src/lib/sentry-reporter.ts | 5.7 KB | Implementation |
| src/instrumentation.ts | 3.3 KB | Implementation |
| sentry.client.config.ts | 3.7 KB | Configuration |
| src/app/api/sentry-example-api/route.ts | 6.5 KB | Test |
| SENTRY_INTEGRATION.md | 16 KB | Documentation |
| SENTRY_SETUP_QUICK.md | 4 KB | Documentation |
| SENTRY_IMPLEMENTATION_SUMMARY.md | 12 KB | Documentation |
| SENTRY_IMPLEMENTATION_CHECKLIST.md | 10+ KB | Reference |
| SENTRY_USAGE_EXAMPLES.md | 12+ KB | Examples |
| SENTRY_FILE_REFERENCE.md | 4 KB | Reference |
| **Total** | **~75 KB** | |

---

## Common Tasks

### "I want to understand the whole system"
1. Read: SENTRY_SETUP_QUICK.md
2. Read: SENTRY_IMPLEMENTATION_SUMMARY.md
3. Read: SENTRY_INTEGRATION.md (sections: Architecture, Usage)

### "I want to set it up quickly"
1. Follow: SENTRY_SETUP_QUICK.md
2. Reference: SENTRY_IMPLEMENTATION_CHECKLIST.md

### "I want code examples"
1. Read: SENTRY_USAGE_EXAMPLES.md
2. Reference: src/app/api/sentry-example-api/route.ts

### "I want to understand architecture"
1. Read: SENTRY_IMPLEMENTATION_SUMMARY.md
2. Read: src/lib/error-tracking.ts
3. Read: src/lib/sentry-reporter.ts

### "I want to troubleshoot an issue"
1. Check: SENTRY_INTEGRATION.md (Troubleshooting section)
2. Check: SENTRY_IMPLEMENTATION_CHECKLIST.md (Troubleshooting section)

### "I want to configure for production"
1. Read: SENTRY_INTEGRATION.md (Environment Configuration section)
2. Modify: src/instrumentation.ts
3. Modify: sentry.client.config.ts

### "I want to test my setup"
1. Follow: SENTRY_IMPLEMENTATION_CHECKLIST.md (Testing phase)
2. Use: src/app/api/sentry-example-api endpoint

---

## Key Concepts

### SentryReporter
- Full Sentry implementation
- Implements ErrorReporter interface
- Handles server and client errors
- Location: `src/lib/sentry-reporter.ts`

### Instrumentation
- Server-side initialization hook
- Called by Next.js on startup
- Initializes Sentry for Node.js
- Location: `src/instrumentation.ts`

### Client Config
- Browser-side configuration
- Enables session replay
- Must be imported in root layout
- Location: `sentry.client.config.ts`

### Error Tracking
- Central error capture system
- Deduplication and rate limiting
- Auto-detects Sentry DSN
- Falls back to console
- Location: `src/lib/error-tracking.ts`

### Global Error Boundary
- Catches unhandled errors
- Reports to Sentry automatically
- Location: `src/app/global-error.tsx`

---

## Next Steps

1. **First time?** Read: SENTRY_SETUP_QUICK.md
2. **Need details?** Read: SENTRY_INTEGRATION.md
3. **Want examples?** Read: SENTRY_USAGE_EXAMPLES.md
4. **Setting up?** Follow: SENTRY_IMPLEMENTATION_CHECKLIST.md
5. **Understanding code?** Read: SENTRY_IMPLEMENTATION_SUMMARY.md

---

## Support

If you have questions about:

- **Setup & installation** → SENTRY_SETUP_QUICK.md
- **Code usage** → SENTRY_USAGE_EXAMPLES.md
- **Architecture** → SENTRY_IMPLEMENTATION_SUMMARY.md
- **Configuration** → SENTRY_INTEGRATION.md
- **Troubleshooting** → See Troubleshooting sections in guides
- **Specific files** → Read file comments and type definitions

---

## Checklist Before Going Live

- [ ] Read SENTRY_SETUP_QUICK.md
- [ ] Install @sentry/nextjs and @sentry/replay
- [ ] Create Sentry project and get DSN
- [ ] Add NEXT_PUBLIC_SENTRY_DSN to .env.local
- [ ] Import sentry.client.config in root layout
- [ ] Run tests with curl examples
- [ ] Verify errors appear in Sentry dashboard
- [ ] Configure alerts in Sentry
- [ ] Adjust sample rates for environment
- [ ] Review error categorization
- [ ] Test with real user scenarios

---

**Version:** 1.0.0
**Created:** 2026-03-07
**For:** Next.js 16.1.6 + Sentry Integration
