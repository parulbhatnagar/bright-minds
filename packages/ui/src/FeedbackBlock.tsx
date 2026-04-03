import React from 'react';
import type { FeedbackResult } from '@study-aid/types';

interface FeedbackBlockProps {
  feedback: FeedbackResult;
}

function Section({
  color,
  title,
  children,
}: {
  color: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl p-4 ${color}`}>
      <p className="font-semibold text-sm uppercase tracking-wide mb-1 opacity-70">{title}</p>
      {children}
    </div>
  );
}

export function FeedbackBlock({ feedback }: FeedbackBlockProps) {
  return (
    <div
      aria-live="polite"
      aria-label="Feedback from your teacher"
      className="flex flex-col gap-3 w-full"
    >
      <Section color="bg-green-100 dark:bg-green-900/40 text-green-900 dark:text-green-100" title="Great job!">
        <p className="text-base">{feedback.appreciation}</p>
      </Section>

      <Section color="bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100" title="What you did well">
        <p className="text-base">{feedback.whatWasGood}</p>
      </Section>

      {feedback.suggestions.length > 0 && (
        <Section color="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-100" title="Ideas to try">
          <ul className="list-disc list-inside space-y-1">
            {feedback.suggestions.map((s, i) => (
              <li key={i} className="text-base">{s}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm italic">"{feedback.improvedExample}"</p>
        </Section>
      )}

      <Section color="bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-100" title="Word of the day">
        <p className="text-base font-semibold">{feedback.vocabularyWord.word}</p>
        <p className="text-sm mt-0.5">{feedback.vocabularyWord.definition}</p>
      </Section>
    </div>
  );
}
