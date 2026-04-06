'use client';

import React, { useEffect, useState } from 'react';

interface CelebrationOverlayProps {
  starsEarned: number;
  onDismiss: () => void;
}

export function CelebrationOverlay({ starsEarned, onDismiss }: CelebrationOverlayProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-indigo-600/90 dark:bg-indigo-900/90 backdrop-blur-sm animate-in fade-in"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 text-center px-6">
        <div className="text-7xl animate-bounce">🎉</div>
        <h2 className="text-4xl font-bold text-white">Great work!</h2>
        <div className="flex items-center gap-2 text-3xl">
          {'⭐'.repeat(starsEarned)}
        </div>
        <p className="text-xl text-indigo-100 font-medium">
          You earned {starsEarned} star{starsEarned !== 1 ? 's' : ''}!
        </p>
        <button
          onClick={() => { setVisible(false); onDismiss(); }}
          className="mt-4 px-8 py-3 bg-white text-indigo-600 font-bold rounded-2xl text-lg hover:bg-indigo-50 transition-colors"
        >
          Keep going! →
        </button>
      </div>
    </div>
  );
}
