'use client';

import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from './auth-context';

interface InvitationsScreenProps {
  onBack: () => void;
  onInvitationHandled: () => void;
}

interface Invitation {
  id: string;
  sender: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  created_at: string;
  status: string;
}

export function InvitationsScreen({ onBack, onInvitationHandled }: InvitationsScreenProps) {
  const { session } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, [session]);

  const fetchInvitations = async () => {
    if (!session) return;
    setLoading(true);

    try {
      const response = await fetch('/api/invitations/list', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      const data = await response.json();
      setInvitations(data.invitations || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (invitationId: string, action: 'accept' | 'reject') => {
    if (!session) return;

    setResponding(invitationId);

    try {
      const response = await fetch('/api/invitations/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          invitationId,
          action,
        }),
      });

      if (response.ok) {
        setInvitations(invitations.filter(inv => inv.id !== invitationId));
        onInvitationHandled();
      }
    } catch (error) {
      console.error('Error responding to invitation:', error);
    } finally {
      setResponding(null);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 px-6 py-4 bg-background/95 backdrop-blur border-b border-border flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">
          Invitations ({invitations.length})
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading invitations...</p>
          </div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <p className="text-muted-foreground mb-2">No pending invitations</p>
            <p className="text-xs text-muted-foreground">
              When someone sends you an invitation, it will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {invitation.sender.display_name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    @{invitation.sender.username}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Invited you to connect
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRespond(invitation.id, 'accept')}
                    disabled={responding === invitation.id}
                    className="p-2 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground rounded-lg transition-colors"
                    title="Accept"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleRespond(invitation.id, 'reject')}
                    disabled={responding === invitation.id}
                    className="p-2 bg-muted hover:bg-muted/80 disabled:bg-muted text-foreground rounded-lg transition-colors"
                    title="Reject"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
