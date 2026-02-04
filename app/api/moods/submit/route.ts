import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: userData } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (!userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { emoji, intensity, notes, needsCall, needsSpace, coupleId } = await req.json();

    const { data, error } = await supabase
      .from('mood_events')
      .insert({
        user_id: userData.user.id,
        couple_id: coupleId || null,
        emoji,
        intensity,
        notes: notes || null,
        needs_call: needsCall || false,
        needs_space: needsSpace || false,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, mood: data?.[0] });
  } catch (error) {
    console.error('Mood submission error:', error);
    return NextResponse.json({ error: 'Failed to submit mood' }, { status: 500 });
  }
}
