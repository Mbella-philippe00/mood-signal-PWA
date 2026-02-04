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

    if (!coupleId) {
      return NextResponse.json({ error: 'Couple ID required' }, { status: 400 });
    }

    // Get couple to find partner
    const { data: coupleData, error: coupleError } = await supabase
      .from('couples')
      .select('user1_id, user2_id')
      .eq('id', coupleId)
      .single();

    if (coupleError || !coupleData) {
      return NextResponse.json({ error: 'Couple not found' }, { status: 404 });
    }

    const partnerId = coupleData.user1_id === userData.user.id ? coupleData.user2_id : coupleData.user1_id;

    // Get partner's latest mood
    const { data, error } = await supabase
      .from('mood_events')
      .select('*')
      .eq('user_id', partnerId)
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ mood: data || null });
  } catch (error) {
    console.error('Partner mood error:', error);
    return NextResponse.json({ error: 'Failed to fetch partner mood' }, { status: 500 });
  }
}
