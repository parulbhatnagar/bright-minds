import React from 'react';

interface WordCardProps {
  word: string;
  definition: string;
}

export function WordCard({ word, definition }: WordCardProps) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 border-2 border-purple-100 dark:border-purple-800 p-6 flex flex-col gap-2 text-center">
      <p className="text-4xl font-black text-purple-700 dark:text-purple-300 tracking-wide">{word}</p>
      <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">{definition}</p>
    </div>
  );
}
