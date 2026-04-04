import React from 'react';

export const JOURNAL_SCENES = [
  { id: 'at-school', label: 'At School', emoji: '🏫' },
  { id: 'at-home', label: 'At Home', emoji: '🏠' },
  { id: 'outside', label: 'Outside', emoji: '🌳' },
  { id: 'eating', label: 'Eating', emoji: '🍽️' },
  { id: 'playing', label: 'Playing', emoji: '🎮' },
  { id: 'with-family', label: 'With Family', emoji: '👨‍👩‍👦' },
  { id: 'special-place', label: 'Special Place', emoji: '✨' },
];

interface ScenePickerProps {
  selected: string;
  onChange: (sceneId: string) => void;
  disabled?: boolean;
}

export function ScenePicker({ selected, onChange, disabled = false }: ScenePickerProps) {
  return (
    <div className="grid grid-cols-4 gap-3" role="group" aria-label="Choose a scene">
      {JOURNAL_SCENES.map(({ id, label, emoji }) => (
        <button
          key={id}
          type="button"
          disabled={disabled}
          onClick={() => onChange(id)}
          aria-pressed={selected === id}
          aria-label={label}
          className={[
            'flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all',
            selected === id
              ? 'border-green-500 bg-green-50 dark:bg-green-900/30 scale-105'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          ].join(' ')}
        >
          <span className="text-3xl">{emoji}</span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{label}</span>
        </button>
      ))}
    </div>
  );
}
