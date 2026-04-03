import React from 'react';

export function LoadingState() {
  return (
    <div
      role="status"
      aria-label="Loading feedback"
      className="flex flex-col items-center gap-3 py-8 text-gray-500 dark:text-gray-400"
    >
      <div className="flex gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full bg-indigo-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-lg">Thinking...</p>
    </div>
  );
}
