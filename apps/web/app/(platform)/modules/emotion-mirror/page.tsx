'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, ImageDisplay, LoadingState, TextArea, EmotionPicker, CelebrationOverlay } from '@study-aid/ui';
import type { EmotionMirrorFeedbackResult, Image } from '@study-aid/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';
const STARS_PER_SESSION = 3;

type PageState = 'loading-image' | 'idle' | 'submitting' | 'feedback' | 'celebrating' | 'error';

function getChildId(): string {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('childId') ?? '';
}

export default function EmotionMirrorPage() {
  const [pageState, setPageState] = useState<PageState>('loading-image');
  const [image, setImage] = useState<Image | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [feedback, setFeedback] = useState<EmotionMirrorFeedbackResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const sessionIdRef = useRef<string | null>(null);

  const loadImage = useCallback(async () => {
    setPageState('loading-image');
    setSelectedEmotion('');
    setReasoning('');
    setFeedback(null);
    try {
      const res = await fetch(`${API_URL}/api/images?count=1&random=true`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setImage(data.images[0] ?? null);
      setPageState('idle');
    } catch {
      setErrorMessage("Something went wrong loading the image. Let's try again!");
      setPageState('error');
    }
  }, []);

  const startSession = useCallback(async () => {
    const childId = getChildId();
    if (!childId) return;
    try {
      const res = await fetch(`${API_URL}/api/sessions/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: 'emotion-mirror', childId }),
      });
      if (res.ok) { const d = await res.json(); sessionIdRef.current = d.session?.id ?? null; }
    } catch { /* non-blocking */ }
  }, []);

  useEffect(() => { loadImage(); startSession(); }, [loadImage, startSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !selectedEmotion) return;
    setPageState('submitting');
    try {
      const res = await fetch(`${API_URL}/api/modules/emotion-mirror/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: image.url,
          imageAltText: image.altText,
          selectedEmotion,
          childReasoning: reasoning || undefined,
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
        await fetch(`${API_URL}/api/sessions/complete`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionIdRef.current, starsEarned: STARS_PER_SESSION }),
        });
      } catch { /* non-blocking */ }
    }
  };

  const handleNext = () => { sessionIdRef.current = null; loadImage(); startSession(); };

  return (
    <div className="w-full max-w-[680px] flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-pink-600 dark:text-pink-400">😊 EmotionMirror</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">How are they feeling?</p>
      </header>

      {pageState === 'celebrating' && <CelebrationOverlay starsEarned={STARS_PER_SESSION} onDismiss={handleNext} />}
      {pageState === 'loading-image' && <div className="flex justify-center py-20"><LoadingState /></div>}

      {pageState === 'error' && (
        <div className="rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-800 p-6 text-center">
          <p className="text-lg">{errorMessage}</p>
          <Button className="mt-4" onClick={loadImage}>Try again</Button>
        </div>
      )}

      {image && !['loading-image', 'error', 'celebrating'].includes(pageState) && (
        <>
          <ImageDisplay src={image.url} alt={image.altText} />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <p className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-3">
                How do you think they are feeling?
              </p>
              <EmotionPicker
                selected={selectedEmotion}
                onChange={setSelectedEmotion}
                disabled={pageState === 'submitting' || pageState === 'feedback'}
              />
            </div>

            <TextArea
              id="reasoning"
              label="Why do you think that? (optional)"
              placeholder="Tell me what you noticed…"
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              disabled={pageState === 'submitting' || pageState === 'feedback'}
              rows={3}
            />

            {pageState === 'idle' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="submit" disabled={!selectedEmotion}>Share my answer! ✨</Button>
                <Button type="button" variant="secondary" onClick={handleNext}>Next image</Button>
              </div>
            )}
          </form>

          {pageState === 'submitting' && <LoadingState />}

          {pageState === 'feedback' && feedback && (
            <section className="flex flex-col gap-4">
              <div className="rounded-2xl bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800 p-5 flex flex-col gap-3">
                <p className="text-base text-gray-700 dark:text-gray-200">{feedback.appreciation}</p>
                <p className="text-base text-gray-600 dark:text-gray-300">{feedback.expansion}</p>
                {feedback.newEmotionWord && (
                  <div className="mt-1 p-3 bg-white dark:bg-gray-800 rounded-xl">
                    <span className="font-bold text-pink-600 dark:text-pink-400">{feedback.newEmotionWord}:</span>{' '}
                    <span className="text-gray-600 dark:text-gray-300">{feedback.newEmotionDefinition}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="secondary" onClick={() => { setFeedback(null); setSelectedEmotion(''); setReasoning(''); setPageState('idle'); }}>
                  Try again
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
