import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function checkTablesExist(supabase: any): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    return !error || error.code !== 'PGRST205';
  } catch {
    return false;
  }
}

async function seedSuggestedReplies(supabase: any): Promise<void> {
  const replies = [
    { mood_emoji: '😊', replies: ['I\'m so happy to hear that!', 'That\'s wonderful!', 'Your happiness makes my day brighter', 'Tell me more!'] },
    { mood_emoji: '😢', replies: ['I\'m here for you always', 'It\'s okay to feel sad', 'I\'m listening', 'You\'re not alone'] },
    { mood_emoji: '😴', replies: ['Get some rest!', 'Sleep tight', 'You deserve a good rest', 'Sweet dreams'] },
    { mood_emoji: '😡', replies: ['What\'s going on?', 'I\'m here to listen', 'Tell me what you need', 'Take your time'] },
    { mood_emoji: '❤️', replies: ['I love you', 'Me too', 'Always', 'Forever'] },
    { mood_emoji: '😕', replies: ['Something on your mind?', 'Talk to me', 'We\'ll figure it out', 'I\'m here'] },
    { mood_emoji: '😰', replies: ['I\'m here with you', 'You\'re not alone', 'We\'ll get through this', 'Breathe, I\'m here'] },
    { mood_emoji: '😐', replies: ['Everything okay?', 'Want to talk?', 'I\'m here', 'No pressure'] },
  ];

  for (const item of replies) {
    await supabase
      .from('suggested_replies')
      .upsert(item, { onConflict: 'mood_emoji' });
  }
}

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Check if tables exist
    const tablesExist = await checkTablesExist(supabase);

    if (!tablesExist) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database tables not found. Please run the SQL script first.',
          instructions: `
1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire content from /scripts/supabase-init.sql
5. Paste it into the SQL editor
6. Click "Run"
7. Then come back here and click "Initialize Database" again
          `.trim(),
          sqlFile: '/scripts/supabase-init.sql',
        },
        { status: 400 }
      );
    }

    // Seed suggested replies
    await seedSuggestedReplies(supabase);

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully. Your tables are ready!',
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: `Setup error: ${String(error)}`,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to /api/setup to initialize database. First, run the SQL script from /scripts/supabase-init.sql in your Supabase dashboard.',
  });
}
