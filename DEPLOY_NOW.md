# Deploy Mood Signal NOW - Step by Step

Follow this exact guide. Takes ~30 minutes. Don't skip steps.

## STEP 1: Supabase Project (10 min)

### 1.1 Create Project
```
1. Go to supabase.com
2. Click "New project"
3. Fill in:
   - Project name: mood-signal
   - Database password: [create strong password]
   - Region: [closest to you]
4. Click "Create new project"
5. ⏱️ Wait 2-3 minutes for setup
```

**Status: ⏳ Creating...**

### 1.2 Get Your API Keys
```
1. Once ready, click on your project
2. Go to Settings (bottom left icon)
3. Click "API"
4. You'll see three sections:
   
   ✓ Project URL
     Copy this → Save as NEXT_PUBLIC_SUPABASE_URL
   
   ✓ anon public
     Copy this → Save as NEXT_PUBLIC_SUPABASE_ANON_KEY
   
   ✓ service_role secret
     Copy this → Save as SUPABASE_SERVICE_ROLE_KEY

5. Save all 3 in a text editor (you'll need them soon)
```

**STATUS: Now you have 3 API keys saved**

### 1.3 Enable Email Authentication
```
1. In Supabase dashboard, find "Authentication" (left menu)
2. Click "Providers"
3. Find "Email" section
4. Make sure toggle is ON (blue)
5. Click "Save"
```

**STATUS: Authentication ready**

### 1.4 Create Database Tables
```
1. In Supabase, go to "SQL Editor" (left menu)
2. Click "New query"
3. Open the file: /scripts/database.sql in your project
4. Copy ALL the content
5. Paste into Supabase SQL editor
6. Click "Run" button (blue)
7. ⏱️ Wait 5-10 seconds
8. Look at bottom - you should see green checkmarks (✓)
9. If errors appear:
   - STOP! Don't continue
   - Check the error message
   - Fix and try again
```

**Common Errors:**
```
Error: "relation already exists"
Solution: Safe to ignore - tables already exist

Error: "syntax error"
Solution: Make sure you copied entire file correctly

Error: "permission denied"
Solution: Check your service role key has access
```

**STATUS: Database tables created ✓**

## STEP 2: Vercel Deployment (5 min)

### 2.1 Push Code to GitHub
```
Make sure your code is pushed to GitHub:

1. Open terminal/command prompt
2. Navigate to your project folder
3. Run:
   git add .
   git commit -m "Ready to deploy Mood Signal"
   git push origin main

4. Go to GitHub, verify code is there
```

**STATUS: Code in GitHub ✓**

### 2.2 Connect Vercel
```
1. Go to vercel.com
2. Click "New Project"
3. Click "Import Project"
4. Find your GitHub repository (mood-signal)
5. Click "Import"
6. You'll see deployment settings page
```

**STATUS: Project imported**

### 2.3 Add Environment Variables
```
1. On the deployment page, find "Environment Variables" section
2. Add each variable one by one:

   Variable 1:
   - Name: NEXT_PUBLIC_SUPABASE_URL
   - Value: [paste from step 1.2]
   - Environment: All (Production, Preview, Development)

   Variable 2:
   - Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   - Value: [paste from step 1.2]
   - Environment: All

   Variable 3:
   - Name: SUPABASE_SERVICE_ROLE_KEY
   - Value: [paste from step 1.2]
   - Environment: Production only

3. After each variable, click "Add"
4. When all 3 added, click "Deploy"
```

**STATUS: Deploying to Vercel...**

### 2.4 Wait for Deployment
```
1. Vercel is building and deploying
2. You'll see "Building..." then "Deployed"
3. ⏱️ Takes about 2-3 minutes
4. When it says "Ready" (green), you're done!
5. Click the URL to see your live app
```

**STATUS: App is LIVE! ✓**

## STEP 3: Test Application (10 min)

### 3.1 Basic Test
```
1. Open your Vercel URL in browser
2. You should see: Mood Signal login screen
3. If you see blank page or error:
   - Wait 30 seconds and refresh
   - Check browser console (F12) for red errors
   - If still broken, check Vercel deployment logs
```

**STATUS: App loads ✓**

### 3.2 Signup Test
```
1. Click "Create Account"
2. Fill in:
   - Email: test@example.com
   - Username: testuser
   - Display Name: Test User
   - Password: TestPassword123
3. Click "Create Account"
4. Should see: "Success! Account created"
5. You're logged in!
```

**STATUS: Signup works ✓**

### 3.3 Share Mood Test
```
1. On dashboard, click "Share Mood"
2. Select any emoji (e.g., 😊)
3. Adjust intensity slider to 3
4. Add note: "Testing the app"
5. Click "Send my mood"
6. You should see: "Mood sent! ✓"
```

**STATUS: Mood submission works ✓**

### 3.4 Mobile Test
```
1. Open your Vercel URL on a mobile phone
2. Try signup again with different email
3. Share a mood
4. Check it looks good (not squished)
5. All buttons tappable?
```

**STATUS: Mobile version works ✓**

### 3.5 Install as PWA
```
iOS:
1. Open the app in Safari
2. Tap Share button (bottom center)
3. Select "Add to Home Screen"
4. Name: "Mood Signal"
5. Tap "Add"
6. App icon appears on home screen ✓

Android:
1. Open the app in Chrome
2. Tap menu (3 dots top right)
3. Select "Install app"
4. Tap "Install"
5. App icon appears in app drawer ✓
```

**STATUS: PWA installed ✓**

## STEP 4: Partner Setup (5 min)

### 4.1 Create Second Account
```
1. Open app in different browser (or incognito window)
2. Sign up with:
   - Email: partner@example.com
   - Username: partner
   - Display Name: My Partner
   - Password: PartnerPassword123
3. Submit
4. Logged in as partner ✓
```

**STATUS: Partner account created ✓**

### 4.2 Share Mood as Partner
```
1. As partner, click "Share Mood"
2. Select emoji (different from first account)
3. Set intensity to 4
4. Send mood
```

**STATUS: Partner mood saved ✓**

### 4.3 Link Accounts
```
1. Switch back to first account
2. On dashboard, find "Link to Partner" option
   (or might be automatic if featured)
3. Enter: partner@example.com
4. Partner accepts in their account
5. Now you're linked! ✓
```

**STATUS: Couple linked ✓**

### 4.4 Verify Real-Time Sync
```
1. First account: refresh dashboard
2. You should see partner's mood!
3. See emoji, intensity, notes ✓
4. Partner account: check your mood visible
```

**STATUS: Real-time sync works ✓**

## STEP 5: Share with Real Partner (Variable)

### 5.1 Prepare for Partner
```
1. You signup with YOUR real email
2. Share the Vercel URL with your partner
   - Via text/email: https://your-app.vercel.app
3. Let them know:
   - They need to create account
   - Then you'll link together
```

### 5.2 Partner Joins
```
1. Partner opens the URL
2. Creates account with their email
3. Creates password
4. Account created!
```

### 5.3 Link Together
```
1. In your app, enter partner's email
2. Partner accepts invitation
3. Couple is linked!
4. Start sharing moods! 💕
```

## ✅ DEPLOYMENT COMPLETE!

### You've Successfully:
- ✅ Created Supabase project
- ✅ Set up database with tables
- ✅ Deployed to Vercel
- ✅ Tested signup & moods
- ✅ Tested mobile experience
- ✅ Installed as PWA
- ✅ Created partner account
- ✅ Verified real-time syncing

### Next:
- Share with your real partner
- Create your real accounts
- Link together
- Start sharing moods daily! 💕

## 🆘 TROUBLESHOOTING

### "Can't see Supabase tables"
```
Solution:
1. Go to Supabase Table Editor
2. Refresh page
3. Tables should appear
4. If not, check SQL ran without errors
```

### "Deployment fails on Vercel"
```
Solution:
1. Check env variables are EXACTLY correct
2. Verify no extra spaces or typos
3. Redeploy by pushing to GitHub again
4. Check Vercel deployment logs
```

### "Can't signup"
```
Solution:
1. Open browser console (F12)
2. Look for red error messages
3. Check email is valid format
4. Check username is unique (try different one)
5. Check Supabase auth is enabled (Email provider)
```

### "Mood won't save"
```
Solution:
1. Check browser console for errors
2. Check SUPABASE_SERVICE_ROLE_KEY is correct
3. Try submitting again
4. Check database.sql was run successfully
```

### "Partner can't see my mood"
```
Solution:
1. Make sure you're actually linked (check couples table)
2. Check mood was actually saved (go to history)
3. Partner refresh page
4. Check couple_id is set on mood_events
```

## 📞 Need Help?

- **Browser Console**: Press F12 to see errors
- **Vercel Logs**: Check Deployments section
- **Supabase Logs**: Check Database section
- **Read**: FINAL_DEPLOYMENT.md (full guide)

---

## TIME TRACKING

- Supabase setup: 10 min
- Vercel deployment: 5 min
- Testing: 10 min
- Partner setup: 5 min
- **TOTAL: ~30 minutes**

## CELEBRATE! 🎉

You've built and deployed a real, working long-distance relationship app! Share with your partner and start connecting emotionally across the distance. 💕✨
