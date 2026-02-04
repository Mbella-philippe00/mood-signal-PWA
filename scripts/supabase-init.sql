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
  ('😐', ARRAY['Everything okay?', 'Want to talk?', 'I''m here', 'No pressure'])
ON CONFLICT DO NOTHING;

-- Create couple_invitations table
CREATE TABLE IF NOT EXISTS public.couple_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
  responded_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT no_self_invite CHECK (sender_id != receiver_id),
  CONSTRAINT unique_pending_invite UNIQUE(sender_id, receiver_id) WHERE status = 'pending'
);

CREATE INDEX IF NOT EXISTS idx_invitations_sender ON public.couple_invitations(sender_id);
CREATE INDEX IF NOT EXISTS idx_invitations_receiver ON public.couple_invitations(receiver_id);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.couple_invitations(status);

ALTER TABLE public.couple_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "users_can_see_their_invitations" ON public.couple_invitations
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY IF NOT EXISTS "users_can_send_invitations" ON public.couple_invitations
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY IF NOT EXISTS "users_can_respond_to_invitations" ON public.couple_invitations
  FOR UPDATE USING (auth.uid() = receiver_id OR auth.uid() = sender_id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('mood_shared', 'invitation_received', 'invitation_accepted', 'partner_online', 'message')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  related_mood_id UUID REFERENCES public.mood_events(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "users_can_read_own_notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "system_can_create_notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Create messages table for quick messages between partners
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_couple ON public.messages(couple_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "couple_can_see_messages" ON public.messages
  FOR SELECT USING (
    couple_id IN (
      SELECT id FROM public.couples 
      WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "users_can_send_messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id AND couple_id IN (
    SELECT id FROM public.couples 
    WHERE user1_id = auth.uid() OR user2_id = auth.uid()
  ));

-- Create couple_stats table for statistics
CREATE TABLE IF NOT EXISTS public.couple_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL UNIQUE REFERENCES public.couples(id) ON DELETE CASCADE,
  total_moods INT DEFAULT 0,
  last_interaction TIMESTAMP WITH TIME ZONE,
  connection_strength INT DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.couple_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "couple_can_read_stats" ON public.couple_stats
  FOR SELECT USING (
    couple_id IN (
      SELECT id FROM public.couples 
      WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  );
