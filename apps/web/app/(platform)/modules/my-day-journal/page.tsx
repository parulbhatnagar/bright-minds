'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, LoadingState, TextArea, ScenePicker, JOURNAL_SCENES, CelebrationOverlay } from '@bright-minds/ui';
import type { JournalFeedbackResult } from '@bright-minds/types';

const STARS_PER_SESSION = 3;

type PageState = 'idle' | 'submitting' | 'feedback' | 'celebrating' | 'error';

function getChildId(): string {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('childId') ?? '';
}

export default function MyDayJournalPage() {
  const [pageState, setPageState] = useState<PageState>('idle');
  const [sceneId, setSceneId] = useState('');
  const [journalText, setJournalText] = useState('');
  const [feedback, setFeedback] = useState<JournalFeedbackResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const sessionIdRef = useRef<string | null>(null);

  const startSession = useCallback(async () => {
    const childId = getChildId();
    if (!childId) return;
    try {
      const res = await fetch(`/api/sessions/start`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: 'my-day-journal', childId }),
      });
      if (res.ok) { const d = await res.json(); sessionIdRef.current = d.session?.id ?? null; }
    } catch { /* non-blocking */ }
  }, []);

  useEffect(() => { startSession(); }, [startSession]);

  const selectedScene = JOURNAL_SCENES.find((s) => s.id === sceneId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sceneId || !journalText.trim()) return;
    setPageState('submitting');
    try {
      const res = await fetch(`/api/modules/my-day-journal/feedback`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneId,
          sceneLabel: selectedScene?.label ?? sceneId,
          childText: journalText,
          difficultyLevel: 'moderate',
        }),
      });
      if (!res.ok) throw new Error('Failed');
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
        await fetch(`/api/sessions/complete`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionIdRef.current, starsEarned: STARS_PER_SESSION }),
        });
      } catch { /* non-blocking */ }
    }
  };

  const handleNewEntry = () => {
    setSceneId('');
    setJournalText('');
    setFeedback(null);
    setPageState('idle');
    sessionIdRef.current = null;
    startSession();
  };

  return (
    <div className="w-full max-w-[680px] flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">📓 MyDay Journal</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Your day in words and pictures!</p>
      </header>

      {pageState === 'celebrating' && <CelebrationOverlay starsEarned={STARS_PER_SESSION} onDismiss={handleNewEntry} />}

      {pageState === 'error' && (
        <div className="rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-800 p-6 text-center">
          <p className="text-lg">{errorMessage}</p>
          <Button className="mt-4" onClick={() => setPageState('idle')}>Try again</Button>
        </div>
      )}

      {!['error', 'celebrating'].includes(pageState) && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <p className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-3">
              What happened today? Pick a picture!
            </p>
            <ScenePicker
              selected={sceneId}
              onChange={setSceneId}
              disabled={pageState === 'submitting' || pageState === 'feedback'}
            />
          </div>

          {sceneId && (
            <TextArea
              id="journal"
              label={`Tell me about ${selectedScene?.label ?? 'it'}…`}
              placeholder="Start typing here…"
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              disabled={pageState === 'submitting' || pageState === 'feedback'}
              rows={4}
            />
          )}

          {pageState === 'idle' && sceneId && (
            <Button type="submit" disabled={!journalText.trim()}>Share my day! 📖</Button>
          )}
        </form>
      )}

      {pageState === 'submitting' && <LoadingState />}

      {pageState === 'feedback' && feedback && (
        <section className="flex flex-col gap-4">
          <div className="rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-5 flex flex-col gap-3">
            <p className="text-base text-gray-700 dark:text-gray-200">{feedback.appreciation}</p>
            <p className="text-base font-medium text-green-700 dark:text-green-300 italic">
              💬 {feedback.followupQuestion}
            </p>
            <p className="text-sm text-gray-400">(You can answer, or just move on — up to you!)</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" onClick={handleNewEntry}>New entry</Button>
            <Button onClick={handleComplete}>I&apos;m done! ⭐</Button>
          </div>
        </section>
      )}
    </div>
  );
}
