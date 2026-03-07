# Sentry Implementation Checklist

Use this checklist to verify and complete the Sentry integration.

## Phase 1: Installation & Setup

- [ ] **Install NPM Packages**
  ```bash
  npm install @sentry/nextjs @sentry/replay
  ```
  - [ ] Verify installation: `npm list @sentry/nextjs`

- [ ] **Create Sentry Project**
  - [ ] Go to https://sentry.io
  - [ ] Create new project (select "Next.js")
  - [ ] Copy DSN (format: `https://key@o0.ingest.sentry.io/0`)

- [ ] **Configure Environment Variables**
  - [ ] Copy: `cp .env.local.example .env.local`
  - [ ] Add to `.env.local`:
    ```env
    NEXT_PUBLIC_SENTRY_DSN=https://your-dsn-here@o0.ingest.sentry.io/0
    NEXT_PUBLIC_APP_VERSION=1.0.0
    ```
  - [ ] Verify no local .env file is committed (should be in .gitignore)

## Phase 2: File Verification

- [ ] **Verify Created Files**
  - [ ] `src/lib/sentry-reporter.ts` (5.7 KB)
    - [ ] Contains `SentryReporter` class
    - [ ] Implements `ErrorReporter` interface
    - [ ] Has `getSentryReporter()` export
    - [ ] Dynamic import with error handling

  - [ ] `src/instrumentation.ts` (3.3 KB)
    - [ ] Contains `export async function register()`
    - [ ] Checks `NEXT_RUNTIME === "nodejs"`
    - [ ] Initializes Sentry with proper config
    - [ ] Respects environment variables

  - [ ] `sentry.client.config.ts` (3.7 KB)
    - [ ] Calls `Sentry.init()`
    - [ ] Configures session replay
    - [ ] Sets error filters
    - [ ] Uses `NEXT_PUBLIC_SENTRY_DSN`

  - [ ] `src/app/api/sentry-example-api/route.ts` (6.5 KB)
    - [ ] Has GET and POST handlers
    - [ ] Supports multiple test types
    - [ ] Uses `captureError()` properly
    - [ ] Shows context examples

- [ ] **Verify Modified Files**
  - [ ] `src/lib/error-tracking.ts`
    - [ ] Enhanced `ErrorReporter` interface
    - [ ] Updated `SentryReporter` class
    - [ ] Imports from `sentry-reporter.ts`

  - [ ] `src/app/global-error.tsx`
    - [ ] Updated error context
    - [ ] Still calls `captureError()`

  - [ ] `.env.local.example`
    - [ ] Contains `NEXT_PUBLIC_SENTRY_DSN`
    - [ ] Contains `NEXT_PUBLIC_APP_VERSION`
    - [ ] Has helpful comments

## Phase 3: Integration

- [ ] **Import Sentry Client Config**
  - [ ] Open `src/app/layout.tsx` (or root layout file)
  - [ ] Add at the very top:
    ```typescript
    import "@/sentry.client.config";
    ```
  - [ ] Ensure it's before any other imports

- [ ] **Verify TypeScript Compilation**
  ```bash
  npx tsc --noEmit
  ```
  - [ ] No type errors related to Sentry
  - [ ] Only expected errors (if any) from @sentry/nextjs import

- [ ] **Build Application**
  ```bash
  npm run build
  ```
  - [ ] Build completes successfully
  - [ ] No build-time errors

## Phase 4: Testing

- [ ] **Start Development Server**
  ```bash
  npm run dev
  ```
  - [ ] Server starts without errors
  - [ ] No initialization errors in console

- [ ] **Test Exception Capture**
  ```bash
  curl "http://localhost:3000/api/sentry-example-api?type=exception"
  ```
  - [ ] Returns 500 status
  - [ ] Contains error message in response
  - [ ] Check browser console for initialization logs
  - [ ] Check Sentry dashboard for event (within 5-10 seconds)

- [ ] **Test Message Capture**
  ```bash
  curl "http://localhost:3000/api/sentry-example-api?type=message"
  ```
  - [ ] Returns 200 status
  - [ ] Check Sentry dashboard for message

- [ ] **Test with User Context**
  ```bash
  curl "http://localhost:3000/api/sentry-example-api?type=exception&userId=test-user-123"
  ```
  - [ ] Error appears in Sentry with user ID
  - [ ] User context visible in event details

- [ ] **Test Client-Side Errors**
  - [ ] Open app in browser
  - [ ] Open DevTools console
  - [ ] Trigger an error manually:
    ```javascript
    throw new Error("Test client error");
    ```
  - [ ] Check Sentry dashboard for error

## Phase 5: Validation

- [ ] **Check Sentry Dashboard**
  - [ ] Log into https://sentry.io
  - [ ] Open your project
  - [ ] **Issues tab**
    - [ ] See captured exceptions
    - [ ] See error categories
    - [ ] See severity levels
    - [ ] See user information (if set)

  - [ ] **Events tab**
    - [ ] Individual event details visible
    - [ ] Stack traces present
    - [ ] Tags shown (category, severity, requestId)
    - [ ] Breadcrumbs visible

  - [ ] **Performance tab** (if enabled)
    - [ ] Transaction data visible
    - [ ] Request timing information

  - [ ] **Session Replay tab**
    - [ ] Replay data for error events
    - [ ] User interactions captured

- [ ] **Verify Request Correlation**
  - [ ] Check error tags for `x-request-id`
  - [ ] Correlate with server logs using request ID

- [ ] **Check Error Categorization**
  - [ ] Errors tagged with correct categories
  - [ ] Severity levels properly assigned
  - [ ] Custom tags present in events

## Phase 6: Configuration (Optional)

- [ ] **Adjust Sample Rates** (as needed)
  - [ ] Edit `src/instrumentation.ts`:
    - [ ] `tracesSampleRate` (default: 0.1 prod, 0.5 dev)
    - [ ] `sampleRate` (default: 0.5 prod, 1.0 dev)

  - [ ] Edit `sentry.client.config.ts`:
    - [ ] `tracesSampleRate`
    - [ ] `sampleRate`
    - [ ] `replaysSessionSampleRate`

- [ ] **Configure Error Filters**
  - [ ] Review `beforeSend` hooks
  - [ ] Add custom filters if needed
  - [ ] Review `ignoreErrors` patterns

- [ ] **Set Up Alerts**
  - [ ] Go to Sentry project settings
  - [ ] Create alert for:
    - [ ] New issues
    - [ ] Error rate spike
    - [ ] Critical severity errors
  - [ ] Configure notification channels (Slack, email, etc.)

- [ ] **Set Release Version**
  - [ ] Verify `NEXT_PUBLIC_APP_VERSION` is set
  - [ ] Check Sentry dashboard "Releases" tab
  - [ ] Each deployment creates new release

## Phase 7: Environment Setup

- [ ] **Development Environment**
  - [ ] NEXT_PUBLIC_SENTRY_DSN set
  - [ ] NODE_ENV=development
  - [ ] Full error capture (100% sampling)
  - [ ] Console debug logging enabled

- [ ] **Staging Environment**
  - [ ] NEXT_PUBLIC_SENTRY_DSN set (staging DSN)
  - [ ] NODE_ENV=staging
  - [ ] Full error capture
  - [ ] Console debug logging disabled

- [ ] **Production Environment**
  - [ ] NEXT_PUBLIC_SENTRY_DSN set (prod DSN)
  - [ ] NODE_ENV=production
  - [ ] Reduced sampling (50% errors, 10% transactions)
  - [ ] Console debug logging disabled
  - [ ] Alerts configured

## Phase 8: Documentation

- [ ] **Review Documentation**
  - [ ] Read `SENTRY_SETUP_QUICK.md` for overview
  - [ ] Read `SENTRY_INTEGRATION.md` for detailed guide
  - [ ] Read `SENTRY_IMPLEMENTATION_SUMMARY.md` for architecture

- [ ] **Update Project Documentation**
  - [ ] Add Sentry info to main README
  - [ ] Document error handling conventions
  - [ ] Add Sentry dashboard link to team docs

## Phase 9: Team Communication

- [ ] **Document for Team**
  - [ ] Share setup instructions
  - [ ] Share Sentry dashboard access
  - [ ] Document error handling best practices
  - [ ] Show how to interpret error data

- [ ] **Code Review**
  - [ ] Review all new code
  - [ ] Verify TypeScript types
  - [ ] Check error handling patterns
  - [ ] Validate environment config

## Phase 10: Monitoring

- [ ] **Monitor Initial Deployment**
  - [ ] Watch Sentry dashboard for errors
  - [ ] Check for false positives
  - [ ] Verify error categorization
  - [ ] Monitor performance impact

- [ ] **Ongoing Maintenance**
  - [ ] Review error trends weekly
  - [ ] Tune sampling rates if needed
  - [ ] Update error filters
  - [ ] Monitor Sentry quota usage

## Troubleshooting Checklist

If something doesn't work:

- [ ] **Errors Not Appearing**
  - [ ] Verify DSN in environment variables
  - [ ] Check DevTools Network tab for ingest.sentry.io requests
  - [ ] Verify @sentry/nextjs package installed
  - [ ] Check browser console for initialization errors
  - [ ] Increase sample rate (set to 1.0 for testing)

- [ ] **Performance Issues**
  - [ ] Reduce `sampleRate` in configurations
  - [ ] Disable session replay (`replaysSessionSampleRate: 0`)
  - [ ] Review custom integrations

- [ ] **Too Much Noise**
  - [ ] Add more patterns to `ignoreErrors`
  - [ ] Enhance `beforeSend` filtering
  - [ ] Configure error grouping in Sentry UI

- [ ] **TypeScript Errors**
  - [ ] Reinstall @sentry/nextjs: `npm install @sentry/nextjs`
  - [ ] Check tsconfig.json for compatibility
  - [ ] Update types: `npm update @types/node`

## Success Criteria

You'll know everything is working when:

- ✓ `npm install` completes without errors
- ✓ `npm run build` completes successfully
- ✓ `npm run dev` starts without errors
- ✓ Test endpoint returns errors
- ✓ Errors appear in Sentry dashboard within 5-10 seconds
- ✓ User ID appears in error context
- ✓ Request IDs correlate with errors
- ✓ Error categories are correct
- ✓ Severity levels are accurate
- ✓ Session replay captures interactions

## Quick Reference

### Files Created (7 new files)
- `src/lib/sentry-reporter.ts` - Full Sentry implementation
- `src/instrumentation.ts` - Server initialization
- `sentry.client.config.ts` - Client configuration
- `src/app/api/sentry-example-api/route.ts` - Test endpoint
- `SENTRY_INTEGRATION.md` - Full documentation
- `SENTRY_SETUP_QUICK.md` - Quick setup guide
- `SENTRY_IMPLEMENTATION_SUMMARY.md` - Implementation summary

### Files Modified (3 files)
- `src/lib/error-tracking.ts` - Enhanced interface
- `src/app/global-error.tsx` - Better error context
- `.env.local.example` - Added Sentry variables

### Commands to Remember
```bash
# Install packages
npm install @sentry/nextjs @sentry/replay

# Check types
npx tsc --noEmit

# Build
npm run build

# Test
curl "http://localhost:3000/api/sentry-example-api?type=exception"
```

### Environment Variables
```env
NEXT_PUBLIC_SENTRY_DSN=https://key@o0.ingest.sentry.io/0
NEXT_PUBLIC_APP_VERSION=1.0.0
```
