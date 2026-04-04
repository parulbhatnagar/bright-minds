'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-xl text-gray-700 dark:text-gray-300">
        Something went wrong. Let&apos;s try again!
      </p>
      <button
        onClick={() => reset()}
        className="min-h-[48px] px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
