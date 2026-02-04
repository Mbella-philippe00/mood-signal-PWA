'use client';

import { useState } from 'react';
import { Heart, CheckCircle, AlertCircle, Copy } from 'lucide-react';

export default function InitDBPage() {
  const [step, setStep] = useState<'instructions' | 'initializing' | 'success' | 'error'>(
    'instructions'
  );
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const sqlCode = `-- Copy this entire script and paste into Supabase SQL Editor

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
CREATE POLICY IF NOT EXISTS "users_can_read_all_profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "users_can_update_own_profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "users_can_insert_own_profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

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
CREATE POLICY IF NOT EXISTS "users_can_read_own_couple" ON public.couples FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

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
CREATE POLICY IF NOT EXISTS "users_can_read_own_moods" ON public.mood_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "users_can_create_mood" ON public.mood_events FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.suggested_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mood_emoji TEXT UNIQUE NOT NULL,
  replies TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.suggested_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "users_can_read_suggested_replies" ON public.suggested_replies FOR SELECT USING (true);

INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
  ('😊', ARRAY['I''m so happy!', 'That''s wonderful!', 'Your happiness brightens my day'])
ON CONFLICT DO NOTHING;

INSERT INTO public.suggested_replies (mood_emoji, replies) VALUES
  ('😢', ARRAY['I''m here for you', 'It''s okay to feel sad', 'I''m listening'])
ON CONFLICT DO NOTHING;`;

  const handleCopySQL = async () => {
    await navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInitialize = async () => {
    setStep('initializing');
    setError('');

    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.instructions ||
            data.error ||
            'Failed to initialize database'
        );
        setStep('error');
        return;
      }

      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep('error');
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#fce4ec] via-background to-[#e3f2fd] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Heart className="w-8 h-8 text-primary fill-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Initialize Database
          </h1>
          <p className="text-muted-foreground">
            Set up your Mood Signal database in Supabase
          </p>
        </div>

        {/* Step: Instructions */}
        {step === 'instructions' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Step 1: Copy SQL Script
              </h2>
              <p className="text-sm text-muted-foreground">
                Copy the SQL script below to create your database tables:
              </p>

              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs text-foreground max-h-48 overflow-y-auto">
                  <code>{sqlCode}</code>
                </pre>
                <button
                  onClick={handleCopySQL}
                  className="absolute top-2 right-2 p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                  title="Copy SQL"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {copied && (
                  <div className="absolute top-2 right-12 text-xs text-green-600 bg-green-100 px-3 py-2 rounded-lg">
                    Copied!
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Step 2: Run in Supabase
              </h2>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="text-primary font-semibold flex-shrink-0">1.</span>
                  <span className="text-foreground">
                    Go to{' '}
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Supabase Dashboard
                    </a>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold flex-shrink-0">2.</span>
                  <span className="text-foreground">
                    Click "SQL Editor" in the left sidebar
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold flex-shrink-0">3.</span>
                  <span className="text-foreground">Click "New Query"</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold flex-shrink-0">4.</span>
                  <span className="text-foreground">
                    Paste the SQL script (copied above)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-semibold flex-shrink-0">5.</span>
                  <span className="text-foreground">Click "Run"</span>
                </li>
              </ol>
            </div>

            <button
              onClick={handleInitialize}
              className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-colors"
            >
              Continue (I've Run the SQL)
            </button>
          </div>
        )}

        {/* Step: Initializing */}
        {step === 'initializing' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Initializing database...
            </p>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <h2 className="text-xl font-semibold text-foreground">
              Database Ready!
            </h2>
            <p className="text-muted-foreground">
              Your Mood Signal database has been initialized successfully.
            </p>
            <a
              href="/"
              className="inline-block py-3 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-colors"
            >
              Go to App
            </a>
          </div>
        )}

        {/* Step: Error */}
        {step === 'error' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border space-y-4">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="font-semibold text-foreground mb-2">Setup Required</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4">
                  {error}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <button
                onClick={() => setStep('instructions')}
                className="w-full py-2 px-4 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg transition-colors"
              >
                Back to Instructions
              </button>
              <button
                onClick={handleInitialize}
                className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
