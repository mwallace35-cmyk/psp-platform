# Quick Sentry Setup Guide

This is a quick setup guide. For detailed information, see [SENTRY_INTEGRATION.md](./SENTRY_INTEGRATION.md).

## 5-Minute Setup

### 1. Install Dependencies

```bash
npm install @sentry/nextjs @sentry/replay
```

### 2. Get Your Sentry DSN

1. Go to https://sentry.io (create account if needed)
2. Create a new project (select "Next.js")
3. Copy your DSN (looks like: `https://exampleKey@o0.ingest.sentry.io/0`)

### 3. Add Environment Variables

Copy `.env.local.example` to `.env.local` and update:

```env
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn-here@o0.ingest.sentry.io/0
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 4. Import Client Config in Your Layout

In `src/app/layout.tsx`, add at the top:

```typescript
import "@/sentry.client.config";
```

### 5. Test It Works

```bash
# Start dev server
npm run dev

# In another terminal, trigger a test error
curl "http://localhost:3000/api/sentry-example-api?type=exception"

# Check Sentry dashboard - you should see the error appear in a few seconds
```

## That's It!

Your app now has Sentry error tracking. Errors will automatically be sent to Sentry when they occur.

## Optional: Next Steps

1. **Set Up Alerts**: Configure notifications in Sentry dashboard
2. **Configure Sample Rates**: Adjust in `src/instrumentation.ts` and `sentry.client.config.ts`
3. **Add Breadcrumbs**: Track user actions for better debugging
4. **Monitor Performance**: Check "Performance" tab in Sentry

## Troubleshooting

**Errors not appearing?**
- Verify DSN in environment variables
- Check browser DevTools Network tab for requests to `ingest.sentry.io`
- Look for console errors during initialization

**Too many errors?**
- Reduce `sampleRate` in configuration (currently 100% in dev)
- Configure error filters in `beforeSend` hook

**Need more help?**
- See [SENTRY_INTEGRATION.md](./SENTRY_INTEGRATION.md)
- Check [Sentry docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
