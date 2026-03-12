# PhillySportsPack Engagement Features - Quick Start Guide

## Pre-Flight Checklist

- [ ] Database migration applied to Supabase (done via apply_migration)
- [ ] Environment variables set: `CRON_SECRET`, `RESEND_API_KEY`
- [ ] All 10 new files created in src/
- [ ] Ready to integrate components into existing pages

---

## Step 1: Add Referral Button to Player Profiles

**File:** `src/app/[sport]/players/[slug]/page.tsx`

```tsx
import { ReferralButton } from '@/components/referral/ReferralButton';

export default async function PlayerProfilePage({ params }: PageProps) {
  // ... existing code ...

  return (
    <div>
      {/* Existing player header */}
      <div className="flex gap-4 mb-6">
        {/* Existing share button */}
        <ReferralButton variant="secondary" />
      </div>

      {/* Rest of player profile */}
    </div>
  );
}
```

---

## Step 2: Add Referral Button to School Profiles

**File:** `src/app/[sport]/schools/[slug]/page.tsx`

Same pattern as above:
```tsx
import { ReferralButton } from '@/components/referral/ReferralButton';

<ReferralButton variant="secondary" className="mb-4" />
```

---

## Step 3: Display Badges on User Profile Pages

**File:** `src/app/profile/page.tsx` (or similar)

```tsx
import { BadgeDisplay } from '@/components/referral/BadgeDisplay';

export default async function ProfilePage() {
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div>
      <h1>{user?.email}</h1>
      <BadgeDisplay userId={user!.id} className="mt-4" />
    </div>
  );
}
```

---

## Step 4: Add Notification Settings Link to Header

**File:** `src/components/Header.tsx` (in user dropdown menu)

```tsx
// In your user dropdown menu component
<a
  href="/settings/notifications"
  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
>
  <span>⚙️</span>
  <span>Notification Settings</span>
</a>
```

---

## Step 5: Add Referral Leaderboard to Sidebar

**File:** `src/app/community/page.tsx` (or any sidebar)

```tsx
import { ReferralLeaderboard } from '@/components/referral/ReferralLeaderboard';

export default function CommunityPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main content */}
      <div className="md:col-span-2">
        {/* ... */}
      </div>

      {/* Sidebar */}
      <div>
        <ReferralLeaderboard />
      </div>
    </div>
  );
}
```

---

## Step 6: Configure Weekly Digest Cron Job

### Option A: Vercel Cron (Recommended)

**File:** `vercel.json` (in project root)

```json
{
  "crons": [
    {
      "path": "/api/email/weekly-digest",
      "schedule": "0 9 * * 0"
    }
  ]
}
```

This runs the digest every Sunday at 9:00 AM UTC.

### Option B: External Service

Use Zapier, Make, or AWS EventBridge to POST:

```bash
curl -X POST https://phillysportspack.com/api/email/weekly-digest \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json"
```

---

## Step 7: Set Environment Variables

Add to `.env.local`:

```env
# Existing
NEXT_PUBLIC_SITE_URL=https://phillysportspack.com
RESEND_API_KEY=re_xxxxx

# NEW - Generate a secure random string:
# Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
CRON_SECRET=your-super-secret-random-string-here
```

---

## Testing Each Feature

### Test Referral System

1. **Create Referral Link**
   ```bash
   curl -X POST http://localhost:3000/api/referral/create \
     -H "Cookie: auth_token=..." \
     -H "Content-Type: application/json" \
     -d '{"targetUrl": "/football/players/some-slug"}'
   ```
   Expected: Returns `referralCode` and `referralUrl`

2. **Track Click**
   ```bash
   curl -X POST http://localhost:3000/api/referral/track \
     -H "Content-Type: application/json" \
     -d '{"referralCode": "ABC12345", "eventType": "click"}'
   ```
   Expected: `{"success": true}`

3. **Get Stats**
   ```bash
   curl -X GET http://localhost:3000/api/referral/stats \
     -H "Cookie: auth_token=..."
   ```
   Expected: Returns user stats and badges

### Test Notification Preferences

1. **Get Current Prefs**
   ```bash
   curl -X GET http://localhost:3000/api/notifications/preferences \
     -H "Cookie: auth_token=..."
   ```

2. **Update Prefs**
   ```bash
   curl -X POST http://localhost:3000/api/notifications/preferences \
     -H "Cookie: auth_token=..." \
     -H "Content-Type: application/json" \
     -d '{
       "notification_prefs": {
         "game_alerts": false,
         "weekly_digest": true
       }
     }'
   ```

3. **Visit Settings Page**
   - Go to `http://localhost:3000/settings/notifications`
   - Toggle preferences
   - Click Save
   - Should see success message

### Test Weekly Digest Email

1. **Trigger Manually** (requires CRON_SECRET)
   ```bash
   curl -X POST http://localhost:3000/api/email/weekly-digest \
     -H "Authorization: Bearer $CRON_SECRET" \
     -H "Content-Type: application/json"
   ```

2. **Verify Email Logs**
   ```sql
   SELECT * FROM email_logs WHERE template = 'weekly_digest' ORDER BY sent_at DESC LIMIT 10;
   ```

3. **Check Email Delivery**
   - Use Resend dashboard to verify sends
   - Test email arrives in inbox
   - Verify unsubscribe link works

---

## Common Integration Patterns

### Pattern 1: Show Referral Stats in User Menu

```tsx
const { data: stats } = await fetch('/api/referral/stats').then(r => r.json());

return (
  <div>
    <p>Referral Clicks: {stats.totalClicks}</p>
    <p>Earned Badges: {stats.badges.length}</p>
  </div>
);
```

### Pattern 2: Conditional Badge Display

```tsx
{badges.length > 0 && (
  <div className="mb-4">
    <h3 className="font-bold mb-2">Achievements</h3>
    <BadgeDisplay userId={userId} />
  </div>
)}
```

### Pattern 3: Notification Preferences in Settings

```tsx
import { NotificationPrefs } from '@/components/notifications/NotificationPrefs';

export default function SettingsPage() {
  return (
    <div>
      <h2>Notification Settings</h2>
      <NotificationPrefs onSaveSuccess={() => {
        // Trigger toast or redirect
      }} />
    </div>
  );
}
```

---

## Database Queries for Monitoring

### Check Active Referral Links

```sql
SELECT
  user_id,
  COUNT(*) as link_count,
  SUM(click_count) as total_clicks
FROM referral_links
WHERE deleted_at IS NULL
GROUP BY user_id
ORDER BY total_clicks DESC
LIMIT 10;
```

### Check Referral Conversions

```sql
SELECT
  rl.user_id,
  COUNT(DISTINCT CASE WHEN re.event_type = 'signup' THEN re.id END) as signups,
  COUNT(DISTINCT re.id) as total_events
FROM referral_links rl
LEFT JOIN referral_events re ON rl.id = re.referral_link_id
WHERE rl.deleted_at IS NULL
GROUP BY rl.user_id;
```

### Check Notification Preferences

```sql
SELECT
  notification_prefs->>'weekly_digest' as digest_enabled,
  COUNT(*) as user_count
FROM user_profiles
WHERE deleted_at IS NULL
GROUP BY digest_enabled;
```

### Check Email Send History

```sql
SELECT
  DATE(sent_at) as date,
  template,
  COUNT(*) as sent_count
FROM email_logs
WHERE deleted_at IS NULL
GROUP BY DATE(sent_at), template
ORDER BY DATE(sent_at) DESC;
```

---

## Troubleshooting

### Referral Button Not Showing
- **Check:** User is logged in (component returns null if unauthenticated)
- **Check:** Pathname is valid (referral link uses pathname)

### Notification Settings Won't Save
- **Check:** User is authenticated
- **Check:** JSONB column exists in user_profiles
- **Check:** Rate limit not exceeded (10 requests/min)

### Weekly Digest Not Sending
- **Check:** `CRON_SECRET` env var is set
- **Check:** Bearer token matches CRON_SECRET
- **Check:** Users have `notification_prefs.weekly_digest = true`
- **Check:** RESEND_API_KEY is valid
- **Check:** Email_logs table exists

### Badges Not Unlocking
- **Check:** user_badges table has entries
- **Check:** Referral stats endpoint returning correct counts
- **Check:** Badge unlock logic in /api/referral/stats

---

## Performance Tips

1. **Cache referral stats** — Cache /api/referral/stats response for 1 hour
2. **Batch email sends** — Weekly digest processes 1000s of users efficiently
3. **Index referral codes** — Already indexed on (user_id, referral_code)
4. **Monitor RLS policies** — Ensure RLS doesn't cause N+1 queries

---

## Next Steps

1. Deploy migration to production
2. Integrate components into pages
3. Set up Vercel cron job
4. Monitor engagement metrics
5. Tune notification preferences defaults
6. Add more badge types as needed

---

**All features are production-ready!** 🚀
