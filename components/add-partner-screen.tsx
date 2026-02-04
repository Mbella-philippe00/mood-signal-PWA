'use client';

import React from "react"

import { ArrowLeft, Send, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from './auth-context';

interface AddPartnerScreenProps {
  onBack: () => void;
  onPartnerAdded: () => void;
}

export function AddPartnerScreen({ onBack, onPartnerAdded }: AddPartnerScreenProps) {
  const { session } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !session) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/invitations/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ receiver_username: username.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send invitation');
        return;
      }

      setSuccess('Invitation sent successfully!');
      setUsername('');
      setTimeout(() => {
        onPartnerAdded();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setLoading(false);
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
        <h1 className="text-lg font-semibold text-foreground">Add Partner</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Connect with Your Partner</h2>
            <p className="text-sm text-muted-foreground">
              Enter your partner's username to send them an invitation. They can accept or decline.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSendInvitation} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Partner's Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., sarah_love"
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Ask your partner for their username
              </p>
            </div>

            <button
              type="submit"
              disabled={!username.trim() || loading}
              className="w-full py-3 px-4 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </form>

          {/* Tips */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm text-foreground">How it works:</h3>
            <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Enter your partner's username</li>
              <li>They'll receive an invitation</li>
              <li>Once they accept, you can share moods</li>
              <li>View each other's feelings in real-time</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
