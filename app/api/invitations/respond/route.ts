import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const { invitationId, action } = await req.json();
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token || !invitationId || !['accept', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('couple_invitations')
      .select()
      .eq('id', invitationId)
      .eq('receiver_id', user.id)
      .single();

    if (inviteError || !invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    if (action === 'accept') {
      // Create couple
      const { data: couple, error: coupleError } = await supabase
        .from('couples')
        .insert({
          user1_id: invitation.sender_id,
          user2_id: user.id,
        })
        .select()
        .single();

      if (coupleError) {
        return NextResponse.json(
          { error: coupleError.message },
          { status: 400 }
        );
      }

      // Update invitation
      await supabase
        .from('couple_invitations')
        .update({
          status: 'accepted',
          responded_at: new Date(),
        })
        .eq('id', invitationId);

      // Create couple_stats
      await supabase.from('couple_stats').insert({
        couple_id: couple.id,
      });

      // Notify sender
      await supabase.from('notifications').insert({
        user_id: invitation.sender_id,
        type: 'invitation_accepted',
        title: 'Invitation Accepted',
        message: 'Your partner invitation was accepted!',
        related_user_id: user.id,
      });

      return NextResponse.json({ success: true, couple });
    } else {
      // Reject invitation
      await supabase
        .from('couple_invitations')
        .update({
          status: 'rejected',
          responded_at: new Date(),
        })
        .eq('id', invitationId);

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Respond to invitation error:', error);
    return NextResponse.json(
      { error: 'Failed to respond to invitation' },
      { status: 500 }
    );
  }
}
