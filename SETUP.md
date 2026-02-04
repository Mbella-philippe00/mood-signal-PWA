# Mood Signal - Setup Guide

## Overview

Mood Signal is a long-distance couple mood-sharing PWA built with Next.js 16, React, Supabase, and Tailwind CSS.

## Features

✅ User authentication with Supabase Auth
✅ Couple management and connection
✅ Mood tracking with emojis and intensity levels
✅ Partner mood dashboard with real-time updates
✅ Mood history timeline
✅ Suggested empathetic replies
✅ Row-level security (RLS) for data privacy
✅ Mobile-first responsive design

## Prerequisites

- Node.js 18+
- Supabase account and project
- Environment variables configured in Vercel

## Environment Variables

You need to set these in your Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Setup Steps

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create a new project
- Copy the URL and API keys

### 2. Deploy with Vercel
- Connect your GitHub repo to Vercel
- Add the environment variables from step 1
- Deploy

### 3. Initialize Database
- Visit `/setup` page in your deployed app
- Click "Initialize Database"
- Wait for confirmation message
- The following tables will be created:
  - `user_profiles` - User account information
  - `couples` - Relationship connections
  - `mood_events` - Mood submissions
  - `mood_statistics` - Aggregated mood data
  - `suggested_replies` - Recommended responses

### 4. Start Using the App
- Go to the home page
- Sign up or sign in
- Connect with your partner by their username
- Start sharing moods!

## Database Schema

### user_profiles
- `id` (UUID) - Links to auth.users
- `username` (TEXT) - Unique username
- `display_name` (TEXT) - Display name
- `avatar_url` (TEXT) - Profile picture URL
- `bio` (TEXT) - User bio
- `created_at` / `updated_at` - Timestamps

### couples
- `id` (UUID) - Unique couple ID
- `user1_id` / `user2_id` (UUID) - Both partners
- `couple_name` (TEXT) - Relationship name
- `created_at` / `updated_at` - Timestamps

### mood_events
- `id` (UUID) - Unique mood ID
- `user_id` (UUID) - Who shared the mood
- `couple_id` (UUID) - Which relationship (nullable)
- `emoji` (TEXT) - Mood emoji
- `intensity` (INTEGER) - 1-5 scale
- `notes` (TEXT) - Optional note
- `needs_call` / `needs_space` (BOOLEAN) - Flags
- `created_at` / `updated_at` - Timestamps

### suggested_replies
- `id` (UUID) - Reply ID
- `mood_emoji` (TEXT) - Which mood emoji
- `replies` (TEXT[]) - Array of suggested messages

## API Routes

### Authentication
- `POST /api/auth/signup` - Sign up new user
- `POST /api/auth/signin` - Sign in (handled by Supabase)

### Moods
- `POST /api/moods/submit` - Submit a new mood
- `GET /api/moods/history` - Get mood history
- `GET /api/moods/partner` - Get partner's latest mood

### Couples
- `GET /api/couples` - Get all couples for user
- `POST /api/couples` - Create new couple connection

### Setup
- `POST /api/setup` - Initialize database tables

## Security

The app uses Supabase's Row-Level Security (RLS) to ensure:
- Users can only see their own data
- Partners can see each other's moods
- All data is encrypted in transit and at rest

## Architecture

```
app/
├── api/                    # Backend routes
│   ├── auth/              # Authentication
│   ├── moods/             # Mood endpoints
│   ├── couples/           # Couple management
│   └── setup/             # Database initialization
├── layout.tsx             # Root layout with AuthProvider
├── page.tsx               # Main app
└── setup/                 # Setup verification page

components/
├── auth-context.tsx       # Authentication state management
├── login-screen.tsx       # Sign up / Sign in
├── send-mood-screen.tsx   # Submit mood
├── partner-dashboard.tsx  # View partner's mood
├── history-screen.tsx     # Mood timeline
└── mood-selector.tsx      # Emoji selector

lib/
└── supabase.ts           # Supabase client setup

scripts/
└── database.sql          # Database schema
```

## Troubleshooting

### "Database tables not found"
- Visit `/setup` and click "Initialize Database"
- Check that SUPABASE_SERVICE_ROLE_KEY is set

### "Unauthorized" errors
- Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct
- Verify session token is valid

### "Partner not found" when creating couple
- Ensure partner has already signed up
- Check that username is spelled correctly

## Development

### Local Development
```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### Database Migrations
Edit `/scripts/database.sql` and re-run the setup endpoint

## Deployment

The app is deployed on Vercel with:
- Next.js 16 with React Server Components
- Supabase PostgreSQL backend
- Automatic deployments from GitHub

## Performance

- Optimized images with Next.js Image component
- Edge caching with Vercel CDN
- Database indexes on frequently queried columns
- RLS policies optimized for performance
