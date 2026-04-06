'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, FeedbackBlock, ImageDisplay, LoadingState, TextArea, CelebrationOverlay } from '@bright-minds/ui';
import type { FeedbackResult, Image } from '@bright-minds/types';

const STARS_PER_SESSION = 3;

type PageState = 'loading-image' | 'idle' | 'submitting' | 'feedback' | 'celebrating' | 'error';

// Child ID is passed from parent context in a real multi-profile setup.
// For Phase 1 (single child), we read it from sessionStorage after login sets it.
function getChildId(): string {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('childId') ?? '';
}

export default function PictureWordsPage() {
  const [pageState, setPageState] = useState<PageState>('loading-image');
  const [image, setImage] = useState<Image | null>(null);
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const sessionIdRef = useRef<string | null>(null);

  const startSession = useCallback(async () => {
    const childId = getChildId();
    if (!childId) return;
    try {
      const res = await fetch(`/api/sessions/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: 'picture-words', childId }),
      });
      if (res.ok) {
        const data = await res.json();
        sessionIdRef.current = data.session?.id ?? null;
      }
    } catch {
      // Non-blocking — session logging failure must not block the learning experience
    }
  }, []);

  const loadImage = useCallback(async () => {
    setPageState('loading-image');
    setDescription('');
    setFeedback(null);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/images?count=1&random=true`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Image load failed');
      const data = await res.json();
      setImage(data.images[0] ?? null);
      setPageState('idle');
    } catch {
      setErrorMessage("Something went wrong loading the image. Let's try again!");
      setPageState('error');
    }
  }, []);

  useEffect(() => {
    loadImage();
    startSession();
  }, [loadImage, startSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !description.trim()) return;
    setPageState('submitting');

    try {
      const res = await fetch(`/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageId: image.id,
          imageUrl: image.url,
          imageAltText: image.altText,
          childDescription: description,
        }),
      });
      if (!res.ok) throw new Error('Feedback request failed');
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
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionIdRef.current, starsEarned: STARS_PER_SESSION }),
        });
      } catch {
        // Non-blocking
      }
    }
  };

  const handleNextImage = () => {
    sessionIdRef.current = null;
    loadImage();
    startSession();
  };

  return (
    <div className="w-full max-w-[680px] flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">🖼️ PictureWords</h1>
        <p className="text-gray-500 dark:text-gray-400 text-base mt-1">Tell me what you see!</p>
      </header>

      {pageState === 'loading-image' && (
        <div className="flex justify-center py-20"><LoadingState /></div>
      )}

      {pageState === 'error' && (
        <div className="rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 p-6 text-center">
          <p className="text-lg">{errorMessage}</p>
          <Button className="mt-4" onClick={loadImage}>Try again</Button>
        </div>
      )}

      {pageState === 'celebrating' && (
        <CelebrationOverlay
          starsEarned={STARS_PER_SESSION}
          onDismiss={handleNextImage}
        />
      )}

      {image && pageState !== 'loading-image' && pageState !== 'error' && pageState !== 'celebrating' && (
        <>
          <ImageDisplay src={image.url} alt={image.altText} />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextArea
              id="description"
              label="What do you see in this picture?"
              placeholder="Tell me what you see!"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={pageState === 'submitting' || pageState === 'feedback'}
              rows={5}
            />

            {pageState === 'idle' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="submit" disabled={!description.trim()}>Tell me!</Button>
                <Button type="button" variant="secondary" onClick={handleNextImage}>Next image</Button>
              </div>
            )}
          </form>

          {pageState === 'submitting' && <LoadingState />}

          {pageState === 'feedback' && feedback && (
            <section className="flex flex-col gap-4">
              <FeedbackBlock feedback={feedback} />
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => { setFeedback(null); setDescription(''); setPageState('idle'); }}
                >
                  Try again with this image
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
