import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const sql = `
-- User Profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "users_can_read_all_profiles" ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "users_can_update_own_profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "users_can_insert_own_profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Couples
CREATE TABLE IF NOT EXISTS public.couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  couple_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT couple_not_self CHECK (user1_id != user2_id),
  CONSTRAINT unique_couple UNIQUE(user1_id, user2_id)
);

CREATE INDEX IF NOT EXISTS idx_couples_user1 ON public.couples(user1_id);
CREATE INDEX IF NOT EXISTS idx_couples_user2 ON public.couples(user2_id);

ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "users_can_read_own_couple" ON public.couples
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY IF NOT EXISTS "users_can_insert_couple" ON public.couples
  FOR INSERT WITH CHECK (auth.uid() = user1_id);

-- Mood Events
CREATE TABLE IF NOT EXISTS public.mood_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  couple_id UUID REFERENCES public.couples(id) ON DELETE SET NULL,
  emoji TEXT NOT NULL,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5),
  notes TEXT,
  needs_call BOOLEAN DEFAULT false,
  needs_space BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mood_events_user ON public.mood_events(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_events_couple ON public.mood_events(couple_id);
CREATE INDEX IF NOT EXISTS idx_mood_events_created ON public.mood_events(created_at DESC);

ALTER TABLE public.mood_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "users_can_read_own_moods" ON public.mood_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "users_can_create_mood" ON public.mood_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "users_can_delete_own_mood" ON public.mood_events
  FOR DELETE USING (auth.uid() = user_id);

-- Suggested Replies
CREATE TABLE IF NOT EXISTS public.suggested_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mood_emoji TEXT UNIQUE NOT NULL,
  replies TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.suggested_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "users_can_read_suggested_replies" ON public.suggested_replies
  FOR SELECT USING (true);
    `;

    // Execute the SQL using Supabase
    const { error } = await supabase.rpc('exec', { sql });
    
    if (error) throw error;

    // Insert sample data
    await supabase.from('suggested_replies').upsert([
      { mood_emoji: '😊', replies: ['I\'m so happy to hear that!', 'That\'s wonderful!', 'Your happiness makes my day brighter'] },
      { mood_emoji: '😢', replies: ['I\'m here for you always', 'It\'s okay to feel sad', 'I\'m listening'] },
      { mood_emoji: '😴', replies: ['Get some rest!', 'Sleep tight', 'You deserve a good rest'] },
      { mood_emoji: '😡', replies: ['What\'s going on?', 'I\'m here to listen', 'Tell me what you need'] },
      { mood_emoji: '❤️', replies: ['I love you', 'Me too', 'Always'] },
      { mood_emoji: '😕', replies: ['Something on your mind?', 'Talk to me', 'We\'ll figure it out'] },
      { mood_emoji: '😰', replies: ['I\'m here with you', 'You\'re not alone', 'We\'ll get through this'] },
      { mood_emoji: '😐', replies: ['Everything okay?', 'Want to talk?', 'I\'m here'] },
    ], { onConflict: 'mood_emoji' });

    return NextResponse.json({ success: true, message: 'Database initialized' });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST to /api/setup to initialize database' });
}
