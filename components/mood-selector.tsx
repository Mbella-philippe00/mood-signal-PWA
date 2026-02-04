'use client';

import { useState } from 'react';

interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

const moods: MoodOption[] = [
  { id: 'happy', emoji: '😄', label: 'Happy', color: 'bg-yellow-100' },
  { id: 'good', emoji: '😊', label: 'Good', color: 'bg-green-100' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-blue-100' },
  { id: 'sad', emoji: '😔', label: 'Sad', color: 'bg-purple-100' },
  { id: 'angry', emoji: '😡', label: 'Angry', color: 'bg-red-100' },
  { id: 'stressed', emoji: '😰', label: 'Stressed', color: 'bg-orange-100' },
  { id: 'tired', emoji: '🥱', label: 'Tired', color: 'bg-slate-100' },
  { id: 'lovey', emoji: '❤️', label: 'Lovey', color: 'bg-pink-100' },
];

interface MoodSelectorProps {
  selectedMood: string | null;
  onMoodSelect: (moodId: string) => void;
}

export function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {moods.map((mood) => (
        <button
          key={mood.id}
          onClick={() => onMoodSelect(mood.id)}
          className={`flex flex-col items-center justify-center py-4 px-3 rounded-2xl transition-all duration-200 transform ${
            selectedMood === mood.id
              ? 'ring-2 ring-primary scale-105 shadow-lg'
              : 'hover:scale-110'
          } ${selectedMood === mood.id ? mood.color + ' bg-opacity-60' : 'hover:' + mood.color}`}
        >
          <span className="text-3xl mb-1">{mood.emoji}</span>
          <span className="text-xs font-medium text-foreground/70 leading-tight">
            {mood.label}
          </span>
        </button>
      ))}
    </div>
  );
}
