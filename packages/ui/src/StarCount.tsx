import React from 'react';

interface StarCountProps {
  totalStars: number;
  streakDays: number;
  childName: string;
}

export function StarCount({ totalStars, streakDays, childName }: StarCountProps) {
  return (
    <div className="flex items-center justify-between w-full bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 shadow-sm border border-indigo-50 dark:border-gray-700">
      <span className="text-gray-700 dark:text-gray-200 font-semibold text-lg">
        Hi, {childName}! 👋
      </span>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1" aria-label={`${totalStars} stars total`}>
          <span className="text-2xl">⭐</span>
          <span className="font-bold text-amber-500 text-lg">{totalStars}</span>
        </div>
        {streakDays > 0 && (
          <div className="flex items-center gap-1" aria-label={`${streakDays} day streak`}>
            <span className="text-2xl">🔥</span>
            <span className="font-bold text-orange-500 text-lg">{streakDays}</span>
          </div>
        )}
      </div>
    </div>
  );
}
