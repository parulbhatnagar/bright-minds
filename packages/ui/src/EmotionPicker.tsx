import React from 'react';

const EMOTIONS = [
  { label: 'Happy', emoji: '😊' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Angry', emoji: '😠' },
  { label: 'Scared', emoji: '😨' },
  { label: 'Surprised', emoji: '😲' },
  { label: 'Confused', emoji: '😕' },
  { label: 'Proud', emoji: '🌟' },
  { label: 'Excited', emoji: '🎉' },
  { label: 'Worried', emoji: '😟' },
  { label: 'Calm', emoji: '😌' },
];

interface EmotionPickerProps {
  selected: string;
  onChange: (emotion: string) => void;
  disabled?: boolean;
}

export function EmotionPicker({ selected, onChange, disabled = false }: EmotionPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2" role="group" aria-label="Choose an emotion">
      {EMOTIONS.map(({ label, emoji }) => (
        <button
          key={label}
          type="button"
          disabled={disabled}
          onClick={() => onChange(label)}
          aria-pressed={selected === label}
          aria-label={label}
          className={[
            'flex flex-col items-center gap-1 p-2 rounded-2xl border-2 transition-all text-sm font-medium',
            selected === label
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50 scale-105'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          ].join(' ')}
        >
          <span className="text-2xl">{emoji}</span>
          <span className="text-xs text-gray-600 dark:text-gray-300">{label}</span>
        </button>
      ))}
    </div>
  );
}
