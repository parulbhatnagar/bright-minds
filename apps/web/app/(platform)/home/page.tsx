import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getChildProfile } from '@study-aid/db';
import { getSessions } from '@study-aid/db';
import { ModuleTile, StarCount } from '@study-aid/ui';
import type { ModuleId } from '@study-aid/types';

interface ModuleConfig {
  id: ModuleId;
  title: string;
  description: string;
  emoji: string;
  href: string;
}

const ALL_MODULES: ModuleConfig[] = [
  { id: 'picture-words', title: 'PictureWords', description: 'Describe what you see!', emoji: '🖼️', href: '/modules/picture-words' },
  { id: 'word-world', title: 'WordWorld', description: 'Use a new word in a sentence!', emoji: '📚', href: '/modules/word-world' },
  { id: 'emotion-mirror', title: 'EmotionMirror', description: 'How are they feeling?', emoji: '😊', href: '/modules/emotion-mirror' },
  { id: 'my-day-journal', title: 'MyDay Journal', description: 'Your day in words and pictures!', emoji: '📓', href: '/modules/my-day-journal' },
  { id: 'math-stories', title: 'MathStories', description: 'Read it, solve it, show it!', emoji: '🔢', href: '/modules/math-stories' },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const profile = await getChildProfile(supabase, user.id);
  if (!profile) redirect('/setup');

  const sessions = await getSessions(supabase, profile.id, 50);

  const totalStars = sessions.reduce((sum, s) => sum + s.starsEarned, 0);

  // Simple streak: count consecutive days with at least one completed session
  const completedDates = new Set(
    sessions
      .filter((s) => s.completedAt)
      .map((s) => new Date(s.startedAt).toDateString()),
  );
  let streakDays = 0;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (completedDates.has(d.toDateString())) {
      streakDays++;
    } else {
      break;
    }
  }

  // Stars earned per module this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const starsPerModule: Record<string, number> = {};
  for (const session of sessions) {
    if (new Date(session.startedAt) >= oneWeekAgo) {
      starsPerModule[session.module] = (starsPerModule[session.module] ?? 0) + session.starsEarned;
    }
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-6">
      <StarCount
        totalStars={totalStars}
        streakDays={streakDays}
        childName={profile.name}
      />

      <div className="grid grid-cols-2 gap-4">
        {ALL_MODULES.map((mod) => (
          <ModuleTile
            key={mod.id}
            id={mod.id}
            title={mod.title}
            description={mod.description}
            emoji={mod.emoji}
            href={mod.href}
            starsThisWeek={starsPerModule[mod.id] ?? 0}
            isLocked={!profile.activeModules.includes(mod.id)}
          />
        ))}
      </div>
    </div>
  );
}
