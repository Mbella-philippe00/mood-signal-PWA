'use client';

import { ArrowLeft, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from './auth-context';

interface HistoryScreenProps {
  onBack: () => void;
  coupleId?: string;
}

interface MoodEntry {
  id: string;
  emoji: string;
  created_at: string;
  intensity: number;
}

export function HistoryScreen({ onBack, coupleId }: HistoryScreenProps) {
  const { session } = useAuth();
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoodHistory();
  }, [session, coupleId]);

  const fetchMoodHistory = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const url = coupleId 
        ? `/api/moods/history?coupleId=${coupleId}`
        : '/api/moods/history';
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      const data = await response.json();
      setMoods(data.moods || []);
    } catch (error) {
      console.error('Error fetching mood history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateGroup = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    const daysAgo = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return `${daysAgo} days ago`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const groupedMoods = moods.reduce((acc: Record<string, MoodEntry[]>, mood) => {
    const dateGroup = formatDateGroup(mood.created_at);
    if (!acc[dateGroup]) acc[dateGroup] = [];
    acc[dateGroup].push(mood);
    return acc;
  }, {});

  const dateOrder = ['Today', 'Yesterday'];
  const sortedDateGroups = Object.keys(groupedMoods).sort((a, b) => {
    const aIndex = dateOrder.indexOf(a);
    const bIndex = dateOrder.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  const moodHistory = moods.map(mood => ({
    id: mood.id,
    emoji: mood.emoji,
    date: formatDateGroup(mood.created_at),
    time: formatTime(mood.created_at),
    intensity: mood.intensity,
  }));

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
        <h1 className="text-lg font-semibold text-foreground">Mood History</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-8">
        <div className="flex items-center gap-2 mb-6 text-xs text-muted-foreground">
          <Calendar className="w-4 h-4" />
          Mood History
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : moods.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <p className="text-muted-foreground">No moods yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedDateGroups.map((dateGroup) => (
              <div key={dateGroup}>
                {/* Date separator */}
                <div className="mb-4 mt-2 first:mt-0">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {dateGroup}
                  </h3>
                  <div className="h-px bg-border mt-2" />
                </div>

                {/* Mood entries for this date */}
                {groupedMoods[dateGroup].map((mood) => (
                  <div
                    key={mood.id}
                    className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="text-3xl flex-shrink-0">{mood.emoji}</div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {formatTime(mood.created_at)}
                      </p>

                      {/* Intensity Bar */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{
                              width: `${(mood.intensity / 5) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          {mood.intensity}/5
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
