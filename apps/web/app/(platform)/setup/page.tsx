'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type SetupState = 'idle' | 'submitting' | 'error';

export default function SetupPage() {
  const router = useRouter();
  const [setupState, setSetupState] = useState<SetupState>('idle');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupState('submitting');
    setErrorMessage('');

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const { error } = await supabase.from('child_profiles').insert({
      parent_id: user.id,
      name: name.trim(),
      age: Number(age),
      avatar: 'default',
      difficulty_level: 'simple',
      active_modules: ['picture-words', 'word-world', 'emotion-mirror', 'my-day-journal', 'math-stories'],
    });

    if (error) {
      setErrorMessage('Something went wrong. Please try again.');
      setSetupState('error');
      return;
    }

    router.push('/home');
    router.refresh();
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Welcome! 👋</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Let&apos;s set up your child&apos;s profile to get started.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Child&apos;s first name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
            placeholder="e.g. Arjun"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="age" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Age
          </label>
          <input
            id="age"
            type="number"
            required
            min={4}
            max={18}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
            placeholder="e.g. 13"
          />
        </div>

        {setupState === 'error' && (
          <p className="text-orange-600 dark:text-orange-400 text-sm text-center rounded-xl bg-orange-50 dark:bg-orange-900/30 p-3">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={setupState === 'submitting' || !name.trim() || !age}
          className="mt-2 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-4 text-lg transition-colors"
        >
          {setupState === 'submitting' ? 'Setting up…' : "Let's go! 🚀"}
        </button>
      </form>
    </div>
  );
}
