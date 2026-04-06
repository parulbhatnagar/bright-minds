import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/LogoutButton';
import { ChildSessionInit } from '@/components/ChildSessionInit';
import { getChildProfile } from '@bright-minds/db';

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const profile = await getChildProfile(supabase, user.id).catch(() => null);
  const childId = profile?.id ?? '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-indigo-100 dark:border-gray-700">
        <Link
          href="/home"
          className="text-xl font-bold text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-opacity"
          aria-label="BrightMinds home"
        >
          ✨ BrightMinds
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
          >
            Parent view
          </Link>
          <LogoutButton />
        </div>
      </header>
      <ChildSessionInit childId={childId} />
      <main className="flex flex-col items-center py-8 px-4">
        {children}
      </main>
    </div>
  );
}
