-- Mood Signal - Supabase Database Schema
-- Exécutez ce script dans Supabase SQL Editor

-- Create user_profiles table
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
  FOR UPDATE USING (auth.uid() = id);

-- Create couples table
CREATE TABLE IF NOT EXISTS public.couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  couple_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_couples_user1 ON public.couples(user1_id);
CREATE INDEX IF NOT EXISTS idx_couples_user2 ON public.couples(user2_id);

ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "users_can_read_own_couple" ON public.couples
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Create mood_events table
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

-- Create suggested_replies table
CREATE TABLE IF NOT EXISTS public.suggested_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mood_emoji TEXT UNIQUE NOT NULL,
  replies TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.suggested_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "users_can_read_suggested_replies" ON public.suggested_replies
  FOR SELECT USING (true);

-- Insert sample replies
INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
  ('😊', ARRAY['I''m so happy to hear that!', 'That''s wonderful!', 'Your happiness makes my day brighter', 'Tell me more!'])
ON CONFLICT DO NOTHING;

INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
  ('😢', ARRAY['I''m here for you always', 'It''s okay to feel sad', 'I''m listening', 'You''re not alone'])
ON CONFLICT DO NOTHING;

INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
  ('😴', ARRAY['Get some rest!', 'Sleep tight', 'You deserve a good rest', 'Sweet dreams'])
ON CONFLICT DO NOTHING;

INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
  ('😡', ARRAY['What''s going on?', 'I''m here to listen', 'Tell me what you need', 'Take your time'])
ON CONFLICT DO NOTHING;

INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
  ('❤️', ARRAY['I love you', 'Me too', 'Always', 'Forever'])
ON CONFLICT DO NOTHING;

INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
  ('😕', ARRAY['Something on your mind?', 'Talk to me', 'We''ll figure it out', 'I''m here'])
ON CONFLICT DO NOTHING;

INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
  ('😰', ARRAY['I''m here with you', 'You''re not alone', 'We''ll get through this', 'Breathe, I''m here'])
ON CONFLICT DO NOTHING;

INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
  ('😐', ARRAY['Everything okay?', 'Want to talk?', 'I''m here', 'No pressure']
ON CONFLICT DO NOTHING;
