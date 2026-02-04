# Mood Signal - Mobile Deployment Guide

## 🎯 Quick Start (5 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New project"**
3. Fill in:
   - **Project name**: `mood-signal`
   - **Database password**: Create a strong password
   - **Region**: Choose closest to you
4. Click **"Create new project"** and wait for setup (2-3 minutes)

### Step 2: Get Your Supabase Credentials

Once your project is ready:

1. Go to **Settings → API** in Supabase dashboard
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Initialize Database Tables

1. In Supabase, go to **SQL Editor**
2. Create a new query
3. Copy the entire contents of `/scripts/database.sql`
4. Run the query

If you get errors:
- Go to **Authentication → Providers**
- Enable **Email** provider
- Click **Save**

Then try the SQL again.

### Step 4: Add Environment Variables to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add these 3 variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = (from Supabase)
   NEXT_PUBLIC_SUPABASE_ANON_KEY = (from Supabase)
   SUPABASE_SERVICE_ROLE_KEY = (from Supabase)
   ```
5. Click **Save**

### Step 5: Deploy to Vercel

Option A - Via GitHub (Recommended):
1. Push your code to GitHub
2. In Vercel, click **Import Project**
3. Select your GitHub repository
4. Click **Import**
5. Vercel auto-deploys!

Option B - Manual Push:
```bash
vercel --prod
```

### Step 6: Test on Mobile

1. After deployment, get your Vercel URL
2. Open on phone browser or scan QR code
3. The app is installable as a PWA:
   - **iOS**: Tap Share → Add to Home Screen
   - **Android**: Tap menu → Install app

### Step 7: Create Your First Account

1. Sign up with email/password
2. App creates your profile automatically
3. Share your partner's registration link
4. Both create accounts to link couples

## 📱 Mobile Optimization Features

✅ **Installed as PWA**
- Works offline (once loaded)
- Full-screen app mode
- No browser bars

✅ **Touch Optimized**
- Large emoji buttons (easy tap)
- Smooth swipe navigation
- No hover states

✅ **Mobile Performance**
- Lightweight (< 100KB JS)
- Fast loading (< 2s)
- Optimized images

✅ **Responsive Design**
- Adapts to any screen size
- Safe area support for notches
- Portrait/landscape orientation

## 🔧 Troubleshooting

### Issue: "Cannot find module @supabase"
**Solution**: Delete `node_modules`, run `npm install`

### Issue: "NEXT_PUBLIC_SUPABASE_URL is required"
**Solution**: Check Vercel Environment Variables are set correctly

### Issue: "Email/password signup not working"
**Solution**: 
1. Go to Supabase → Authentication → Providers
2. Enable **Email** if disabled
3. Click Save

### Issue: "Database tables don't exist"
**Solution**: 
1. Run the SQL from `/scripts/database.sql` in Supabase
2. Check for error messages
3. Verify authentication tables exist

## 📲 Install as App

### iOS
1. Open in Safari
2. Tap **Share** button
3. Tap **Add to Home Screen**
4. Name it "Mood Signal"
5. Tap **Add**

### Android
1. Open in Chrome
2. Tap **Menu** (three dots)
3. Tap **Install app**
4. Tap **Install**

## 🚀 Production Checklist

- [ ] Supabase project created
- [ ] Database tables initialized
- [ ] Environment variables added to Vercel
- [ ] Code pushed to GitHub
- [ ] Vercel deployment successful
- [ ] Test signup works
- [ ] Test mood submission
- [ ] Test mobile installation
- [ ] Share with partner

## 📞 Support

If you encounter issues:
1. Check browser console (F12) for errors
2. Check Supabase logs: Settings → Database
3. Check Vercel logs: Deployments → View
4. Review the SETUP.md guide in project root

## 🎉 You're Live!

Your Mood Signal app is now live on mobile. Share the URL with your partner to get started!

**Happy mood sharing! 💕**
