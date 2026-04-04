'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, FeedbackBlock, LoadingState, TextArea, WordCard, CelebrationOverlay } from '@study-aid/ui';
import type { FeedbackResult } from '@study-aid/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';
const STARS_PER_SESSION = 3;

const WORD_BANK = [
  { word: 'Vast', definition: 'Very large and wide open, like a huge field or the sky.' },
  { word: 'Glisten', definition: 'To shine with small flashes of light, like a wet leaf in the sun.' },
  { word: 'Serene', definition: 'Calm and peaceful, like a quiet lake early in the morning.' },
  { word: 'Magnificent', definition: 'Extremely beautiful or impressive — something that makes you say "wow!"' },
  { word: 'Curious', definition: 'Wanting to know or learn about something new.' },
  { word: 'Vibrant', definition: 'Full of energy and bright colour.' },
  { word: 'Ancient', definition: 'Very, very old — from a long time ago.' },
  { word: 'Gentle', definition: 'Soft and kind, not rough or harsh.' },
  { word: 'Adventure', definition: 'An exciting experience where something new and interesting happens.' },
  { word: 'Cosy', definition: 'Warm, comfortable, and safe — like being wrapped in a blanket.' },
];

function getRandomWord() {
  return WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
}

function getChildId(): string {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('childId') ?? '';
}

type PageState = 'idle' | 'submitting' | 'feedback' | 'celebrating' | 'error';

export default function WordWorldPage() {
  const [pageState, setPageState] = useState<PageState>('idle');
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [sentence, setSentence] = useState('');
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const sessionIdRef = useRef<string | null>(null);

  const startSession = useCallback(async () => {
    const childId = getChildId();
    if (!childId) return;
    try {
      const res = await fetch(`${API_URL}/api/sessions/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: 'word-world', childId }),
      });
      if (res.ok) {
        const data = await res.json();
        sessionIdRef.current = data.session?.id ?? null;
      }
    } catch { /* non-blocking */ }
  }, []);

  useEffect(() => { startSession(); }, [startSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentence.trim()) return;
    setPageState('submitting');

    try {
      const res = await fetch(`${API_URL}/api/modules/word-world/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: currentWord.word,
          definition: currentWord.definition,
          childSentence: sentence,
          childId: getChildId(),
          difficultyLevel: 'moderate',
        }),
      });
      if (!res.ok) throw new Error('Feedback failed');
      const data = await res.json();
      setFeedback(data.feedback);
      setPageState('feedback');
    } catch {
      setErrorMessage("Something went wrong. Let's try again!");
      setPageState('error');
    }
  };

  const handleComplete = async () => {
    setPageState('celebrating');
    if (sessionIdRef.current) {
      try {
        await fetch(`${API_URL}/api/sessions/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionIdRef.current, starsEarned: STARS_PER_SESSION }),
        });
      } catch { /* non-blocking */ }
    }
  };

  const handleNextWord = () => {
    setCurrentWord(getRandomWord());
    setSentence('');
    setFeedback(null);
    setPageState('idle');
    sessionIdRef.current = null;
    startSession();
  };

  return (
    <div className="w-full max-w-[680px] flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">📚 WordWorld</h1>
        <p className="text-gray-500 dark:text-gray-400 text-base mt-1">Use it, see it, own it!</p>
      </header>

      {pageState === 'celebrating' && (
        <CelebrationOverlay starsEarned={STARS_PER_SESSION} onDismiss={handleNextWord} />
      )}

      {pageState === 'error' && (
        <div className="rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 p-6 text-center">
          <p className="text-lg">{errorMessage}</p>
          <Button className="mt-4" onClick={() => setPageState('idle')}>Try again</Button>
        </div>
      )}

      {pageState !== 'error' && pageState !== 'celebrating' && (
        <>
          <WordCard word={currentWord.word} definition={currentWord.definition} />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextArea
              id="sentence"
              label={`Write a sentence using the word "${currentWord.word}"`}
              placeholder="Start typing here…"
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              disabled={pageState === 'submitting' || pageState === 'feedback'}
              rows={4}
            />

            {pageState === 'idle' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="submit" disabled={!sentence.trim()}>Tell me! ✨</Button>
                <Button type="button" variant="secondary" onClick={handleNextWord}>Different word</Button>
              </div>
            )}
          </form>

          {pageState === 'submitting' && <LoadingState />}

          {pageState === 'feedback' && feedback && (
            <section className="flex flex-col gap-4">
              <FeedbackBlock feedback={feedback} />
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="secondary" onClick={() => { setFeedback(null); setSentence(''); setPageState('idle'); }}>
                  Try another sentence
                </Button>
                <Button onClick={handleComplete}>I&apos;m done! ⭐</Button>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
