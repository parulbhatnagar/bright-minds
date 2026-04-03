import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Study Aid</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        A friendly place to practice describing what you see.
      </p>
      <Link
        href="/describe-picture"
        className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors"
      >
        Start Describing Pictures
      </Link>
    </main>
  );
}
