'use client';

import { Copy, MessageCircle, Phone, LogOut, UserPlus, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from './auth-context';
import { NotificationsBell } from './notifications-bell';

interface PartnerDashboardScreenProps {
  onNavigate: (screen: string) => void;
  onCoupleSelect: (coupleId: string) => void;
}

const suggestedReplies = [
  {
    id: 1,
    message: "I'm here for you whenever you need me",
    emoji: '💙',
  },
  {
    id: 2,
    message: "That's totally understandable. You're doing great",
    emoji: '🌟',
  },
  {
    id: 3,
    message: "Let's talk about it when you're ready",
    emoji: '👂',
  },
  {
    id: 4,
    message: "I'm thinking of you right now",
    emoji: '💭',
  },
];

interface PartnerMood {
  emoji: string;
  intensity: number;
  notes: string | null;
  needs_call: boolean;
  needs_space: boolean;
  created_at: string;
}

export function PartnerDashboardScreen({
  onNavigate,
  onCoupleSelect,
}: PartnerDashboardScreenProps) {
  const { session, signOut } = useAuth();
  const [partnerMood, setPartnerMood] = useState<PartnerMood | null>(null);
  const [couples, setCouples] = useState<any[]>([]);
  const [selectedCouple, setSelectedCouple] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    fetchCouples();
  }, [session]);

  const fetchCouples = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const response = await fetch('/api/couples', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      const data = await response.json();
      setCouples(data.couples || []);
      if (data.couples?.[0]) {
        selectCouple(data.couples[0]);
      }
    } catch (error) {
      console.error('Error fetching couples:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectCouple = async (couple: any) => {
    setSelectedCouple(couple);
    onCoupleSelect(couple.id);
    await fetchPartnerMood(couple.id);
  };

  const fetchPartnerMood = async (coupleId: string) => {
    if (!session) return;
    try {
      const response = await fetch(`/api/moods/partner?coupleId=${coupleId}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      const data = await response.json();
      setPartnerMood(data.mood);
    } catch (error) {
      console.error('Error fetching partner mood:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 px-6 py-4 bg-background/95 backdrop-blur border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Mood Signal</h1>
          {!selectedCouple ? (
            <p className="text-xs text-muted-foreground mt-1">No partner connected yet</p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">
              {selectedCouple.couple_name || 'Connected'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <NotificationsBell onInvitationClick={() => onNavigate('invitations')} />
          {!selectedCouple && (
            <button
              onClick={() => onNavigate('add-partner')}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Add partner"
            >
              <UserPlus className="w-5 h-5 text-primary" />
            </button>
          )}
          {selectedCouple && (
            <button
              onClick={() => onNavigate('add-partner')}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Add another partner"
            >
              <UserPlus className="w-5 h-5 text-foreground opacity-50" />
            </button>
          )}
          <button
            onClick={() => onNavigate('invitations')}
            className="p-2 hover:bg-muted rounded-lg transition-colors relative"
            title="Invitations"
          >
            <Mail className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={handleSignOut}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : !partnerMood ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <p className="text-muted-foreground mb-4">Partner hasn't shared a mood yet</p>
            <p className="text-sm text-muted-foreground">Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Latest Mood Card */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 mb-8 border border-primary/10 shadow-sm">
              <div className="text-center">
                <div className="text-7xl mb-4">{partnerMood.emoji}</div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Feeling {partnerMood.emoji}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {formatTime(partnerMood.created_at)}
                </p>

                {/* Intensity Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Intensity
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {partnerMood.intensity}/5
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${(partnerMood.intensity / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Note */}
                {partnerMood.notes && (
                  <div className="text-sm text-foreground bg-white/50 rounded-xl p-4 mb-6 italic">
                    "{partnerMood.notes}"
                  </div>
                )}

                {/* Tags */}
                <div className="flex gap-2 justify-center flex-wrap">
                  {partnerMood.needs_call && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                      <Phone className="w-3 h-3" />
                      Needs a call
                    </span>
                  )}
                  {partnerMood.needs_space && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                      Needs space
                    </span>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Suggested Replies */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Suggested replies
          </h3>
          <div className="space-y-3">
            {suggestedReplies.map((reply) => (
              <div
                key={reply.id}
                className="bg-white rounded-2xl p-4 border border-border hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{reply.emoji}</span>
                      <p className="text-sm text-foreground leading-relaxed">
                        {reply.message}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(reply.message, reply.id)
                    }
                    className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                      copiedId === reply.id
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                    title="Copy message"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="py-4 px-4 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" />
            Call Now
          </button>
          <button className="py-4 px-4 rounded-2xl bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium transition-colors flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Message
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 px-6 py-4 bg-background/95 backdrop-blur border-t border-border flex gap-3">
        <button
          onClick={() => onNavigate('send')}
          className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-colors"
        >
          Share your mood
        </button>
        <button
          onClick={() => onNavigate('history')}
          className="flex-1 py-3 px-4 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-xl transition-colors"
        >
          History
        </button>
      </div>
    </div>
  );
}
