'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, LoadingState, TextArea, CelebrationOverlay } from '@bright-minds/ui';
import type { MathFeedbackResult } from '@bright-minds/types';

const STARS_PER_SESSION = 3;

interface ProblemData {
  problem: string;
  context: string;
  answerToken: string;
}

type PageState = 'loading-problem' | 'idle' | 'submitting' | 'feedback' | 'celebrating' | 'error';

function getChildId(): string {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('childId') ?? '';
}

export default function MathStoriesPage() {
  const [pageState, setPageState] = useState<PageState>('loading-problem');
  const [problemData, setProblemData] = useState<ProblemData | null>(null);
  const [childAnswer, setChildAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [feedback, setFeedback] = useState<MathFeedbackResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const sessionIdRef = useRef<string | null>(null);

  const loadProblem = useCallback(async () => {
    setPageState('loading-problem');
    setChildAnswer('');
    setExplanation('');
    setFeedback(null);
    try {
      const res = await fetch(`/api/modules/math-stories/generate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficultyLevel: 'simple' }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setProblemData(data);
      setPageState('idle');
    } catch {
      setErrorMessage("Something went wrong loading the problem. Let's try again!");
      setPageState('error');
    }
  }, []);

  const startSession = useCallback(async () => {
    const childId = getChildId();
    if (!childId) return;
    try {
      const res = await fetch(`/api/sessions/start`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: 'math-stories', childId }),
      });
      if (res.ok) { const d = await res.json(); sessionIdRef.current = d.session?.id ?? null; }
    } catch { /* non-blocking */ }
  }, []);

  useEffect(() => { loadProblem(); startSession(); }, [loadProblem, startSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemData || childAnswer === '') return;
    setPageState('submitting');
    try {
      // Decode answer token (base64 encoded number)
      const correctAnswer = Number(atob(problemData.answerToken));
      const res = await fetch(`/api/modules/math-stories/feedback`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: problemData.problem,
          correctAnswer,
          childAnswer: Number(childAnswer),
          childExplanation: explanation || undefined,
          difficultyLevel: 'simple',
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

  const handleDontKnow = () => {
    setChildAnswer('0');
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

  const handleNext = () => { sessionIdRef.current = null; loadProblem(); startSession(); };

  return (
    <div className="w-full max-w-[680px] flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">🔢 MathStories</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Read it, solve it, show it!</p>
      </header>

      {pageState === 'celebrating' && <CelebrationOverlay starsEarned={STARS_PER_SESSION} onDismiss={handleNext} />}

      {pageState === 'loading-problem' && <div className="flex justify-center py-20"><LoadingState /></div>}

      {pageState === 'error' && (
        <div className="rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-800 p-6 text-center">
          <p className="text-lg">{errorMessage}</p>
          <Button className="mt-4" onClick={loadProblem}>Try again</Button>
        </div>
      )}

      {problemData && !['loading-problem', 'error', 'celebrating'].includes(pageState) && (
        <>
          <div className="rounded-3xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-800 p-6 flex flex-col gap-3">
            <p className="text-sm text-blue-500 dark:text-blue-400 font-medium uppercase tracking-wide">Story</p>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">{problemData.context}</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">{problemData.problem}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="answer" className="text-base font-semibold text-gray-700 dark:text-gray-200">
                My answer is:
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="answer"
                  type="number"
                  value={childAnswer}
                  onChange={(e) => setChildAnswer(e.target.value)}
                  disabled={pageState === 'submitting' || pageState === 'feedback'}
                  className="w-32 rounded-xl border-2 border-gray-300 dark:border-gray-600 px-4 py-3 text-2xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="?"
                />
                {pageState === 'idle' && (
                  <Button type="button" variant="secondary" onClick={handleDontKnow}>
                    I don&apos;t know 🤔
                  </Button>
                )}
              </div>
            </div>

            <TextArea
              id="explanation"
              label="How did you work it out? (optional)"
              placeholder="Tell me in your own words…"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              disabled={pageState === 'submitting' || pageState === 'feedback'}
              rows={3}
            />

            {pageState === 'idle' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="submit" disabled={childAnswer === ''}>Check my answer! 🎯</Button>
                <Button type="button" variant="secondary" onClick={handleNext}>New problem</Button>
              </div>
            )}
          </form>

          {pageState === 'submitting' && <LoadingState />}

          {pageState === 'feedback' && feedback && (
            <section className="flex flex-col gap-4">
              <div className={[
                'rounded-2xl border p-5 flex flex-col gap-2',
                feedback.isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
              ].join(' ')}>
                <p className="text-base text-gray-700 dark:text-gray-200">{feedback.appreciation}</p>
                {feedback.explanation && (
                  <p className="text-base text-gray-600 dark:text-gray-300">{feedback.explanation}</p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="secondary" onClick={handleNext}>New problem</Button>
                <Button onClick={handleComplete}>I&apos;m done! ⭐</Button>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
