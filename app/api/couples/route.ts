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

    const { data, error } = await supabase
      .from('couples')
      .select('*')
      .or(`user1_id.eq.${userData.user.id},user2_id.eq.${userData.user.id}`);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ couples: data || [] });
  } catch (error) {
    console.error('Get couples error:', error);
    return NextResponse.json({ error: 'Failed to fetch couples' }, { status: 500 });
  }
}

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

    const { partner_username, couple_name } = await req.json();

    // Get partner's ID
    const { data: partnerData, error: partnerError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', partner_username)
      .single();

    if (partnerError || !partnerData) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    // Create couple
    const { data, error } = await supabase
      .from('couples')
      .insert({
        user1_id: userData.user.id,
        user2_id: partnerData.id,
        couple_name: couple_name || `${userData.user.id} & ${partnerData.id}`,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, couple: data?.[0] });
  } catch (error) {
    console.error('Create couple error:', error);
    return NextResponse.json({ error: 'Failed to create couple' }, { status: 500 });
  }
}
