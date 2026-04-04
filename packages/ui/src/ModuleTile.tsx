import React from 'react';

interface ModuleTileProps {
  id: string;
  title: string;
  description: string;
  emoji: string;
  starsThisWeek: number;
  isLocked?: boolean;
  href: string;
}

export function ModuleTile({
  title,
  description,
  emoji,
  starsThisWeek,
  isLocked = false,
  href,
}: ModuleTileProps) {
  const content = (
    <div
      className={[
        'flex flex-col gap-2 p-5 rounded-3xl border-2 transition-all',
        isLocked
          ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed'
          : 'bg-white dark:bg-gray-800 border-indigo-100 dark:border-indigo-900 shadow-md hover:shadow-lg hover:border-indigo-300 cursor-pointer active:scale-95',
      ].join(' ')}
    >
      <div className="text-4xl" aria-hidden="true">{isLocked ? '🔒' : emoji}</div>
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">{description}</p>
      <div className="mt-auto pt-2 flex items-center gap-1 text-sm text-amber-500 font-medium">
        {'⭐'.repeat(Math.min(starsThisWeek, 5))}
        {starsThisWeek > 0 && (
          <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">
            {starsThisWeek} this week
          </span>
        )}
      </div>
    </div>
  );

  if (isLocked) return content;

  return (
    <a href={href} className="block no-underline" aria-label={`Start ${title}`}>
      {content}
    </a>
  );
}
