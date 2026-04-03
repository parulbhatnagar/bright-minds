'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, FeedbackBlock, ImageDisplay, LoadingState, TextArea } from '@study-aid/ui';
import type { FeedbackResult, Image } from '@study-aid/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type PageState = 'loading-image' | 'idle' | 'submitting' | 'feedback' | 'error';

export default function DescribePicturePage() {
  const [pageState, setPageState] = useState<PageState>('loading-image');
  const [image, setImage] = useState<Image | null>(null);
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const loadImage = useCallback(async () => {
    setPageState('loading-image');
    setDescription('');
    setFeedback(null);
    setErrorMessage('');

    try {
      const res = await fetch(`${API_URL}/api/images?count=1&random=true`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Image load failed');
      const data = await res.json();
      setImage(data.images[0] ?? null);
      setPageState('idle');
    } catch {
      setErrorMessage('Something went wrong loading the image. Let\'s try again!');
      setPageState('error');
    }
  }, []);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !description.trim()) return;

    setPageState('submitting');

    try {
      const res = await fetch(`${API_URL}/api/feedback`, {
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
      setErrorMessage('Something went wrong. Let\'s try again!');
      setPageState('error');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center py-10 px-4">
      <div className="w-full max-w-[680px] flex flex-col gap-6">

        <header className="flex items-center justify-between">
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Study Aid</span>
        </header>

        {pageState === 'loading-image' && (
          <div className="flex justify-center py-20">
            <LoadingState />
          </div>
        )}

        {pageState === 'error' && (
          <div className="rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 p-6 text-center">
            <p className="text-lg">{errorMessage}</p>
            <Button className="mt-4" onClick={loadImage}>Try again</Button>
          </div>
        )}

        {image && pageState !== 'loading-image' && pageState !== 'error' && (
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
                aria-describedby={pageState === 'feedback' ? 'feedback-section' : undefined}
              />

              {pageState === 'idle' && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" disabled={!description.trim()}>
                    Submit
                  </Button>
                  <Button type="button" variant="secondary" onClick={loadImage}>
                    Next image
                  </Button>
                </div>
              )}
            </form>

            {pageState === 'submitting' && <LoadingState />}

            {pageState === 'feedback' && feedback && (
              <section id="feedback-section" className="flex flex-col gap-4">
                <FeedbackBlock feedback={feedback} />

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setFeedback(null);
                      setDescription('');
                      setPageState('idle');
                    }}
                  >
                    Try again with this image
                  </Button>
                  <Button onClick={loadImage}>Next image</Button>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
