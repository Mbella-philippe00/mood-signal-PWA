# Mood Signal - Verify Your Deployment

## Verification Checklist

### Phase 1: Supabase Verification

**Step 1: Database Tables**
```
Go to Supabase Dashboard → SQL Editor

Run this query:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

Expected Result:
✅ user_profiles
✅ couples
✅ mood_events
✅ suggested_replies
```

**Step 2: RLS Policies**
```
Go to Supabase → Authentication → Policies

Expected:
✅ user_profiles (3 policies)
✅ couples (2 policies)
✅ mood_events (3 policies)
✅ suggested_replies (1 policy)
```

**Step 3: Test Connection**
```
curl https://your-supabase-url/rest/v1/user_profiles \
  -H "apikey: your-anon-key"

Expected: Empty array [] (no error)
```

### Phase 2: Vercel Verification

**Step 1: Deployment Status**
```
1. Go to Vercel Dashboard
2. Select your project
3. Check: Status should be "Ready" (green)
4. Check: No recent deployment failures
```

**Step 2: Environment Variables**
```
Settings → Environment Variables

Expected:
✅ NEXT_PUBLIC_SUPABASE_URL (visible to browser)
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY (visible to browser)
✅ SUPABASE_SERVICE_ROLE_KEY (hidden from browser)
```

**Step 3: Test Endpoint**
```
Visit: https://your-vercel-url/api/validate-config

Expected response:
{
  "status": "OK",
  "checks": {
    "supabaseUrl": true,
    "supabaseAnonKey": true,
    "supabaseServiceKey": true
  }
}
```

### Phase 3: Application Verification

**Test 1: Page Loads**
```
1. Visit https://your-vercel-url
2. Page should load in < 3 seconds
3. No red errors in console (F12)
4. See login screen
```

**Test 2: Signup Flow**
```
1. Click "Create Account"
2. Enter: email, username, display name, password
3. Click "Create Account"
4. Should see success message
5. Redirect to dashboard or login
```

**Test 3: Login Flow**
```
1. Click "Sign In"
2. Enter email and password
3. Click "Sign In"
4. Should redirect to dashboard
```

**Test 4: Dashboard**
```
1. After login, see:
   ✅ "Partner hasn't shared mood yet" (if new)
   ✅ Back button works
   ✅ "Share Mood" button present
   ✅ Sign out button present
```

**Test 5: Mood Submission**
```
1. Click "Share Mood"
2. Select emoji
3. Adjust intensity (should work)
4. Add optional note
5. Check "Needs a call" (optional)
6. Click "Send my mood"
7. See success message
8. Back to dashboard
```

**Test 6: History Screen**
```
1. Click "History" button
2. Should see your mood(s) listed
3. Grouped by date
4. Show intensity bar
5. Time displayed
```

### Phase 4: Mobile Verification

**Test 1: Responsive Design**
```
Mobile (375px width):
✅ All buttons visible
✅ Text readable (no horizontal scroll)
✅ Emojis large and tappable
✅ Forms full width

Tablet (768px width):
✅ Layout adapts correctly
✅ No excessive whitespace
✅ Still mobile-optimized
```

**Test 2: Touch Interaction**
```
On actual phone:
✅ Buttons responsive to touch
✅ No delay in clicks
✅ No hover effects visible
✅ Swipe back works (if implemented)
```

**Test 3: PWA Installation**
```
iOS (Safari):
1. Open app URL
2. Share → Add to Home Screen
3. Name: "Mood Signal"
4. Add
5. Icon appears on home screen ✅

Android (Chrome):
1. Open app URL
2. Menu → Install app
3. Confirm
4. Icon appears in app drawer ✅
```

**Test 4: PWA Functionality**
```
After installation:
✅ Opens in full-screen mode
✅ No browser URL bar
✅ Back button works
✅ Can open multiple times
```

### Phase 5: Multi-Account Verification

**Test 1: Two Accounts**
```
1. Create account #1 (email1@test.com)
2. Create account #2 (email2@test.com)
3. Both accounts exist independently
```

**Test 2: Couple Linking**
```
1. In account #1, find "Link to Partner"
2. Enter email2@test.com
3. In account #2, see pending invitation
4. Accept invitation
5. Couple linked! ✅
```

**Test 3: Mood Sharing**
```
1. In account #1, share mood
2. In account #2, refresh dashboard
3. See account #1's mood! ✅
4. Suggested replies visible
5. Click reply button (copy to clipboard)
```

**Test 4: History Sync**
```
1. Account #1 shares 3 different moods
2. Account #2 history shows all 3
3. Grouped by date correctly
4. Intensity bars correct
```

### Phase 6: Security Verification

**Test 1: Authentication**
```
1. Logged in as Account #1
2. Try to access Account #2's data directly
3. Should get permission denied (401)
```

**Test 2: Session Persistence**
```
1. Login
2. Refresh page (F5)
3. Still logged in ✅
```

**Test 3: Logout**
```
1. Click sign out button
2. Redirect to login page
3. Try back button
4. Cannot access dashboard without login
```

**Test 4: HTTPS**
```
1. Check URL starts with https://
2. No certificate warnings
3. Padlock icon visible
```

### Phase 7: Error Handling

**Test 1: Invalid Credentials**
```
1. Try signup with invalid email
2. Error message appears
3. Form still visible for retry
```

**Test 2: Network Error**
```
1. Disable internet
2. Try to submit mood
3. See error message
4. Re-enable internet
5. Try again (auto-retry or manual)
```

**Test 3: Database Error**
```
1. If Supabase down: see error message
2. Not a blank white screen
3. Error is user-friendly
```

## Quick Verification Commands

### Browser Console Tests (F12)
```javascript
// Check Supabase client loaded
console.log(typeof supabase); // Should be 'object'

// Check environment variables
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL); // Should show URL

// Check auth state
supabase.auth.getSession().then(console.log); // Should show session
```

### API Endpoint Tests
```bash
# Validate config
curl https://your-vercel-url/api/validate-config

# Check if database accessible
curl https://your-vercel-url/api/moods/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Verification Scorecard

```
[ ] Supabase tables created
[ ] Supabase RLS policies enabled
[ ] Vercel deployment successful
[ ] Environment variables set
[ ] API endpoints responsive
[ ] Signup works
[ ] Login works
[ ] Mood submission works
[ ] Dashboard displays data
[ ] Mobile responsive
[ ] PWA installable
[ ] Two accounts can link
[ ] Mood sharing works
[ ] History displays correctly
[ ] Security permissions work
[ ] Error handling works
```

## Score: ___ / 16 ✓

**15-16**: Perfect! Ready to launch
**13-14**: Almost there! Fix 1-2 items
**<13**: Review the failing tests, check error logs

## Troubleshooting Failed Checks

### Database tables not created
```
Solution:
1. Go to Supabase SQL Editor
2. Re-run /scripts/database.sql
3. Check error messages
4. Fix SQL syntax if needed
5. Re-run
```

### Environment variables not working
```
Solution:
1. Verify var names exactly (case-sensitive)
2. Verify values from Supabase (no typos)
3. In Vercel, redeploy after adding vars
4. Wait 5 minutes for cache clear
5. Test endpoint /api/validate-config
```

### Signup fails
```
Solution:
1. Check browser console (F12)
2. Check Supabase logs
3. Verify email provider enabled
4. Test API directly with curl
5. Check network tab in F12
```

### Moods not saving
```
Solution:
1. Check SUPABASE_SERVICE_ROLE_KEY correct
2. Verify mood_events table exists
3. Check RLS policies allow insert
4. Review Supabase logs
5. Test with curl request
```

## Next Steps After Verification

✅ All checks pass → Ready to launch!
✅ Share with partner
✅ Have partner create account
✅ Link couples
✅ Start sharing moods
✅ Enjoy the connection! 💕

---

**Expected verification time: 15-20 minutes**

Once all items checked, your Mood Signal is production-ready!
