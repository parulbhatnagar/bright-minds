import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getChildProfile, getSessions, getWordJar } from '@bright-minds/db';
import Link from 'next/link';
import type { ModuleId } from '@bright-minds/types';

const MODULE_LABELS: Record<ModuleId, { label: string; emoji: string }> = {
  'picture-words': { label: 'PictureWords', emoji: '🖼️' },
  'word-world': { label: 'WordWorld', emoji: '📚' },
  'emotion-mirror': { label: 'EmotionMirror', emoji: '😊' },
  'my-day-journal': { label: 'MyDay Journal', emoji: '📓' },
  'math-stories': { label: 'MathStories', emoji: '🔢' },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const profile = await getChildProfile(supabase, user.id);
  if (!profile) redirect('/setup');

  const [sessions, wordJar] = await Promise.all([
    getSessions(supabase, profile.id, 30),
    getWordJar(supabase, profile.id),
  ]);

  const totalStars = sessions.reduce((sum, s) => sum + s.starsEarned, 0);
  const completedSessions = sessions.filter((s) => s.completedAt);

  // Per-module stats
  const moduleStats: Record<string, { sessions: number; stars: number; lastUsed: string | null }> = {};
  for (const s of sessions) {
    const prev = moduleStats[s.module] ?? { sessions: 0, stars: 0, lastUsed: null };
    moduleStats[s.module] = {
      sessions: prev.sessions + 1,
      stars: prev.stars + s.starsEarned,
      lastUsed: prev.lastUsed ?? s.startedAt,
    };
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Parent Dashboard</h1>
        <Link
          href="/home"
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          Child view →
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-4 text-center">
          <p className="text-3xl font-black text-amber-500">{totalStars}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total stars</p>
        </div>
        <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-4 text-center">
          <p className="text-3xl font-black text-indigo-600">{completedSessions.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sessions done</p>
        </div>
        <div className="rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 p-4 text-center">
          <p className="text-3xl font-black text-purple-600">{wordJar.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Words learned</p>
        </div>
      </div>

      {/* Module breakdown */}
      <section>
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-3">Activity by module</h2>
        <div className="flex flex-col gap-2">
          {Object.entries(MODULE_LABELS).map(([id, { label, emoji }]) => {
            const stats = moduleStats[id];
            return (
              <div
                key={id}
                className="flex items-center justify-between rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-3"
              >
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {emoji} {label}
                </span>
                {stats ? (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {stats.sessions} session{stats.sessions !== 1 ? 's' : ''} · ⭐ {stats.stars}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">Not used yet</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent sessions */}
      <section>
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-3">Recent sessions</h2>
        {sessions.length === 0 ? (
          <p className="text-gray-400 text-sm">No sessions yet. Let&apos;s get started!</p>
        ) : (
          <div className="flex flex-col gap-2">
            {sessions.slice(0, 15).map((s) => {
              const mod = MODULE_LABELS[s.module];
              const date = new Date(s.startedAt).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric',
              });
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <span>{mod?.emoji}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{mod?.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>{date}</span>
                    <span>{s.completedAt ? `⭐ ${s.starsEarned}` : '⏳ incomplete'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Word Jar preview */}
      {wordJar.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-3">
            Word Jar ({wordJar.length} word{wordJar.length !== 1 ? 's' : ''})
          </h2>
          <div className="flex flex-wrap gap-2">
            {wordJar.slice(0, 20).map((w) => (
              <span
                key={w.id}
                className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-medium"
                title={w.definition}
              >
                {w.word}
              </span>
            ))}
            {wordJar.length > 20 && (
              <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 text-sm">
                +{wordJar.length - 20} more
              </span>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
