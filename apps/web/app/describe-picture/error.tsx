'use client';

import { Button } from '@study-aid/ui';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-xl text-gray-700 dark:text-gray-300">
        Something went wrong. Let&apos;s try again!
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
