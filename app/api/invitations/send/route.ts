import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const { receiver_username } = await req.json();
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token || !receiver_username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find receiver by username
    const { data: receiverProfile, error: receiverError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', receiver_username)
      .single();

    if (receiverError || !receiverProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already in a couple
    const { data: existingCouple } = await supabase
      .from('couples')
      .select('id')
      .or(`and(user1_id.eq.${user.id},user2_id.eq.${receiverProfile.id}),and(user1_id.eq.${receiverProfile.id},user2_id.eq.${user.id})`)
      .single();

    if (existingCouple) {
      return NextResponse.json(
        { error: 'Already connected with this user' },
        { status: 400 }
      );
    }

    // Create invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('couple_invitations')
      .insert({
        sender_id: user.id,
        receiver_id: receiverProfile.id,
      })
      .select()
      .single();

    if (inviteError) {
      return NextResponse.json(
        { error: inviteError.message },
        { status: 400 }
      );
    }

    // Create notification for receiver
    await supabase.from('notifications').insert({
      user_id: receiverProfile.id,
      type: 'invitation_received',
      title: 'Invitation',
      message: 'You have a new partner invitation',
      related_user_id: user.id,
    });

    return NextResponse.json({ success: true, invitation });
  } catch (error) {
    console.error('Send invitation error:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
}
