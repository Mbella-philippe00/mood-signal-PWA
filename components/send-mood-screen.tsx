'use client';

import React, { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { MoodSelector } from './mood-selector';
import { useAuth } from './auth-context';

const moodEmojis: Record<string, string> = {
  happy: '😄',
  good: '😊',
  neutral: '😐',
  sad: '😔',
  angry: '😡',
  stressed: '😰',
  tired: '🥱',
  lovey: '❤️',
};

interface SendMoodScreenProps {
  onBack: () => void;
  coupleId?: string;
}

export function SendMoodScreen({ onBack, coupleId }: SendMoodScreenProps) {
  const { session } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState('');
  const [needsCall, setNeedsCall] = useState(false);
  const [needsSpace, setNeedsSpace] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood || !session) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/moods/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          emoji: selectedMood,
          intensity,
          notes: note || null,
          needsCall,
          needsSpace,
          coupleId: coupleId || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit mood');
      }

      setSubmitted(true);
      setTimeout(() => {
        setSelectedMood(null);
        setIntensity(3);
        setNote('');
        setNeedsCall(false);
        setNeedsSpace(false);
        setSubmitted(false);
        onBack();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit mood');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <div className="bg-white rounded-3xl p-8 text-center shadow-lg animate-in fade-in scale-in-95">
          <div className="text-5xl mb-4">{selectedMood && moodEmojis[selectedMood]}</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Mood sent! 💌
          </h2>
          <p className="text-sm text-muted-foreground">
            Your partner will see how you're feeling
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur border-b border-border">
        <button
          onClick={onBack}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">How are you?</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {error && (
          <div className="p-3 mb-4 bg-red-100 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6 pb-8">
          {/* Mood Selector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-4">
              Choose your mood
            </label>
            <MoodSelector
              selectedMood={selectedMood}
              onMoodSelect={setSelectedMood}
            />
          </div>

          {/* Intensity Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">
                Intensity
              </label>
              <span className="text-sm font-semibold text-primary">
                {intensity}/5
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Light</span>
              <span>Heavy</span>
            </div>
          </div>

          {/* Note Textarea */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Want to say why?
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Share more about how you're feeling..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none h-24"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={needsCall}
                onChange={(e) => setNeedsCall(e.target.checked)}
                className="w-5 h-5 rounded accent-primary cursor-pointer"
              />
              <span className="text-sm font-medium text-foreground">
                I need a call
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={needsSpace}
                onChange={(e) => setNeedsSpace(e.target.checked)}
                className="w-5 h-5 rounded accent-primary cursor-pointer"
              />
              <span className="text-sm font-medium text-foreground">
                I need space
              </span>
            </label>
          </div>
        </form>
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-0 px-6 py-4 bg-background/95 backdrop-blur border-t border-border">
        <button
          onClick={handleSubmit}
          disabled={!selectedMood || loading}
          className="w-full py-3 px-4 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          {loading ? 'Sending...' : 'Send my mood'}
        </button>
      </div>
    </div>
  );
}
