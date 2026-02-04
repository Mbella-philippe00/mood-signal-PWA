import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function GET(req: NextRequest) {
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

    const coupleId = req.nextUrl.searchParams.get('coupleId');

    let query = supabase
      .from('mood_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (coupleId) {
      query = query.eq('couple_id', coupleId);
    } else {
      query = query.eq('user_id', userData.user.id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ moods: data || [] });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
