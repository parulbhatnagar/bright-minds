'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type LoginState = 'idle' | 'submitting' | 'error';

export default function LoginPage() {
  const router = useRouter();
  const [loginState, setLoginState] = useState<LoginState>('idle');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginState('submitting');
    setErrorMessage('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMessage("We couldn't log in — please check your email and password.");
      setLoginState('error');
      return;
    }

    router.push('/home');
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">BrightMinds</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Welcome back! Please sign in.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
            placeholder="you@example.com"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
            placeholder="••••••••"
          />
        </div>

        {loginState === 'error' && (
          <p className="text-orange-600 dark:text-orange-400 text-sm text-center rounded-xl bg-orange-50 dark:bg-orange-900/30 p-3">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={loginState === 'submitting'}
          className="mt-2 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-4 text-lg transition-colors"
        >
          {loginState === 'submitting' ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
