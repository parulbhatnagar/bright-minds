# Plan: BrightMinds Platform — Phase 1

## Summary
Transform the current single-feature study-aid prototype (PictureWords only, no auth, no persistence) into the BrightMinds Phase 1 platform: a full-stack PWA with parent auth, one child profile, a home screen module picker, a rewards/stars system, a parent session dashboard, a shared media library, and 5 learning modules (PictureWords, WordWorld, EmotionMirror, MyDay Journal, MathStories).

## User Story
As a parent of a neurodiverse child, I want one unified platform where my child can do structured, AI-supported learning activities across multiple skill areas, so that I can track their progress and they experience consistent, encouraging interactions every session.

## Problem → Solution
**Current state:** A single page at `/describe-picture` with no auth, no persistence, no rewards, and no navigation between activities. API is a standalone Fastify server with no database.

**Desired state:** A logged-in parent launches a home screen showing module tiles. Child selects a module, completes activities, earns stars, and the parent can review sessions in a dashboard. All interactions are logged to a database.

## Metadata
- **Complexity**: XL
- **Source PRD**: `/Users/samwise/workspace/study-aid/claude-prd.md`
- **PRD Phase**: Phase 1
- **Estimated Files**: 60–80 new/modified files across all packages

---

## UX Design

### Before
```
┌─────────────────────────────────┐
│  Landing page (/)               │
│  → Link to /describe-picture    │
│                                 │
│  /describe-picture              │
│  [Image] [Textarea] [Submit]    │
│  [AI Feedback shown inline]     │
│                                 │
│  No auth. No nav. No history.   │
└─────────────────────────────────┘
```

### After
```
┌──────────────────────────────────────┐
│  /login (parent)                     │
│  Email + password → /dashboard       │
│                                      │
│  /dashboard (parent view)            │
│  Sessions list | Progress | Library  │
│  [Switch to child mode →]            │
│                                      │
│  /home (child view, after handoff)   │
│  ┌────────────┐ ┌────────────┐       │
│  │PictureWords│ │ WordWorld  │       │
│  └────────────┘ └────────────┘       │
│  ┌────────────┐ ┌────────────┐       │
│  │EmotionMirr.│ │MyDay Journ.│       │
│  └────────────┘ └────────────┘       │
│  ⭐ 12 stars  🔥 3-day streak        │
│                                      │
│  /modules/picture-words              │
│  /modules/word-world                 │
│  /modules/emotion-mirror             │
│  /modules/my-day-journal             │
│  /modules/math-stories               │
└──────────────────────────────────────┘
```

### Interaction Changes
| Touchpoint | Before | After | Notes |
|---|---|---|---|
| Entry point | `/describe-picture` directly | `/login` → `/home` → module | Auth gate on all routes |
| Navigation | None | Back arrow + home button on every module | Consistent chrome |
| Progress feedback | AI text only | Stars awarded + animation on completion | Supabase `sessions` table |
| Image source | Unsplash (hardcoded) | Shared media library (uploads + stock) | `media_library` table |
| Parent visibility | None | `/dashboard` with session log | Sessions + entries tables |

---

## Mandatory Reading

| Priority | File | Lines | Why |
|---|---|---|---|
| P0 | `apps/web/app/describe-picture/page.tsx` | all | Only complete module — mirror this pattern for all new modules |
| P0 | `packages/types/src/index.ts` | all | All shared types live here; extend this for every new entity |
| P0 | `packages/ai/src/providers/langchain.ts` | all | AI call pattern — every module re-uses this with a different system prompt |
| P0 | `apps/api/src/routes/feedback.ts` | all | Route pattern: Zod validation → service call → typed response |
| P1 | `packages/ui/src/FeedbackBlock.tsx` | all | UI component pattern — follow for all new components |
| P1 | `apps/api/src/index.ts` | all | How routes are registered; follow for new route files |
| P2 | `packages/ai/src/cache.ts` | all | Caching wrapper pattern — reuse for all AI calls |
| P2 | `turbo.json` | all | Pipeline config — update when adding new build outputs |

## External Documentation

| Topic | Source | Key Takeaway |
|---|---|---|
| Supabase Auth (Next.js) | https://supabase.com/docs/guides/auth/server-side/nextjs | Use `@supabase/ssr` package; middleware for session refresh |
| Supabase client setup | https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs | `createBrowserClient` for client components, `createServerClient` for server |
| Next.js App Router middleware | https://nextjs.org/docs/app/building-your-application/routing/middleware | `matcher` config to protect `/home` and `/modules/*` routes |
| Supabase Row-Level Security | https://supabase.com/docs/guides/database/postgres/row-level-security | Every table needs RLS: parent can only see their own child's data |
| Web Speech API (TTS) | https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis | `window.speechSynthesis.speak()` — free, no API key, works on tablet |

---

## Patterns to Mirror

### NAMING_CONVENTION
```ts
// SOURCE: packages/types/src/index.ts:1-37
// Interfaces: PascalCase, exported
export interface FeedbackResult { ... }
// Zod schemas: PascalCase + "Schema" suffix, exported
export const FeedbackResultSchema = z.object({ ... });
// Route files: camelCase noun, e.g. feedback.ts, images.ts
// Component files: PascalCase noun, e.g. FeedbackBlock.tsx
```

### ERROR_HANDLING
```ts
// SOURCE: apps/web/app/describe-picture/page.tsx:28-35, 61-65
// Frontend: try/catch → set error state → user-friendly message (never technical)
try {
  const res = await fetch(...);
  if (!res.ok) throw new Error('...');
} catch {
  setErrorMessage('Something went wrong. Let\'s try again!');
  setPageState('error');
}
// API: Fastify handles thrown errors; use reply.code(400).send({ error: '...' })
```

### ROUTE_PATTERN
```ts
// SOURCE: apps/api/src/routes/feedback.ts (full file)
import type { FastifyInstance } from 'fastify';
import { ZodSchema } from 'zod';

export async function feedbackRoute(app: FastifyInstance) {
  app.post('/api/feedback', async (request, reply) => {
    const parsed = FeedbackRequestSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Invalid request' });
    // ... call service, return typed result
  });
}
// Register in index.ts: app.register(feedbackRoute);
```

### TYPE_EXTENSION_PATTERN
```ts
// SOURCE: packages/types/src/index.ts
// Add new entities at the bottom; always export both interface AND Zod schema
export interface NewEntity { ... }
export const NewEntitySchema = z.object({ ... });
```

### UI_COMPONENT_PATTERN
```tsx
// SOURCE: packages/ui/src/Button.tsx
import React from 'react';
interface Props { ... }
export function ComponentName({ prop1, prop2 }: Props) {
  return <div className="tailwind-classes">...</div>;
}
// Export from packages/ui/src/index.ts barrel
```

### PAGE_STATE_PATTERN
```ts
// SOURCE: apps/web/app/describe-picture/page.tsx:9
// Use discriminated union for page state machine — never multiple boolean flags
type PageState = 'loading-image' | 'idle' | 'submitting' | 'feedback' | 'error';
const [pageState, setPageState] = useState<PageState>('loading-image');
```

### AI_PROVIDER_PATTERN
```ts
// SOURCE: packages/ai/src/providers/langchain.ts
// Every module gets its own system prompt; same LangChainProvider, different prompt
// System prompt must: celebrate first, never use "wrong/incorrect", 4-5 sentences max
// Structured output via Zod schema passed to .withStructuredOutput()
```

---

## Monorepo Structure Changes

### New Packages
```
packages/
  db/          ← NEW: Supabase client factory + typed query helpers
    src/
      client.ts          ← createBrowserClient / createServerClient exports
      queries/
        sessions.ts      ← getSessions, createSession, etc.
        wordJar.ts
        mediaLibrary.ts
    package.json         ← depends on @supabase/supabase-js, @supabase/ssr
    tsconfig.json
```

### Modified Apps
```
apps/web/
  app/
    (auth)/              ← Route group: public routes
      login/page.tsx
      signup/page.tsx (Phase 2)
    (platform)/          ← Route group: protected routes (middleware guards)
      home/page.tsx      ← child module picker
      dashboard/page.tsx ← parent session log
      modules/
        picture-words/page.tsx     ← refactored from /describe-picture
        word-world/page.tsx
        emotion-mirror/page.tsx
        my-day-journal/page.tsx
        math-stories/page.tsx
    middleware.ts         ← NEW: protect (platform) routes
  lib/
    supabase/
      client.ts          ← browser Supabase client
      server.ts          ← server Supabase client
      middleware.ts       ← session refresh helper

apps/api/
  src/
    routes/
      sessions.ts        ← NEW: POST /api/sessions, GET /api/sessions
      wordJar.ts         ← NEW: POST /api/word-jar, GET /api/word-jar
      modules/
        wordWorld.ts     ← NEW: AI feedback for WordWorld
        emotionMirror.ts ← NEW: AI feedback for EmotionMirror
        myDayJournal.ts  ← NEW: AI feedback for MyDay Journal
        mathStories.ts   ← NEW: AI feedback for MathStories
```

### New UI Components
```
packages/ui/src/
  ModuleTile.tsx         ← home screen tile (icon + name + stars)
  StarCount.tsx          ← star/streak display
  CelebrationOverlay.tsx ← confetti animation on session complete
  EmotionPicker.tsx      ← grid of illustrated emotion faces
  WordCard.tsx           ← large word + definition display
  JournalEntry.tsx       ← journal card (photo + text + date)
  MathProblem.tsx        ← word problem display with read-aloud
```

---

## Files to Change

### Phase 1A — Foundation (do first, everything depends on this)

| File | Action | Justification |
|---|---|---|
| `packages/types/src/index.ts` | UPDATE | Add: ChildProfile, Session, SessionEntry, WordJarEntry, JournalEntry, MediaItem, ModuleId, DifficultyLevel, AIModuleRequest |
| `packages/db/package.json` | CREATE | New package for Supabase client + query helpers |
| `packages/db/src/client.ts` | CREATE | Export `createBrowserClient`, `createServerClient` wrapping `@supabase/ssr` |
| `packages/db/src/queries/sessions.ts` | CREATE | `createSession`, `completeSession`, `getSessions` |
| `packages/db/src/queries/wordJar.ts` | CREATE | `addWord`, `getWordJar` |
| `packages/db/src/queries/mediaLibrary.ts` | CREATE | `getImages`, `uploadImage` |
| `apps/web/middleware.ts` | CREATE | Protect all `/(platform)/*` routes; redirect unauthenticated to `/login` |
| `apps/web/lib/supabase/client.ts` | CREATE | Browser Supabase client singleton |
| `apps/web/lib/supabase/server.ts` | CREATE | Server Supabase client (cookies) |

### Phase 1B — Auth UI

| File | Action | Justification |
|---|---|---|
| `apps/web/app/(auth)/login/page.tsx` | CREATE | Email/password login form → redirects to `/home` |
| `apps/web/app/(auth)/layout.tsx` | CREATE | Minimal layout (no nav chrome) for auth pages |
| `apps/web/app/(platform)/layout.tsx` | CREATE | Platform chrome: nav bar, back button, child name display |

### Phase 1C — Home Screen + Rewards

| File | Action | Justification |
|---|---|---|
| `apps/web/app/(platform)/home/page.tsx` | CREATE | Module picker grid, star count, streak counter |
| `packages/ui/src/ModuleTile.tsx` | CREATE | Module tile component |
| `packages/ui/src/StarCount.tsx` | CREATE | Stars + streak display |
| `packages/ui/src/CelebrationOverlay.tsx` | CREATE | Confetti on session complete |

### Phase 1D — Migrate PictureWords

| File | Action | Justification |
|---|---|---|
| `apps/web/app/(platform)/modules/picture-words/page.tsx` | CREATE | Move/refactor from `/describe-picture`; add session logging |
| `apps/web/app/describe-picture/` | DELETE after migration | Old route replaced |
| `apps/api/src/routes/sessions.ts` | CREATE | `POST /api/sessions/start`, `POST /api/sessions/complete` |

### Phase 1E — Four New Modules

| File | Action | Justification |
|---|---|---|
| `apps/web/app/(platform)/modules/word-world/page.tsx` | CREATE | WordWorld module page |
| `apps/web/app/(platform)/modules/emotion-mirror/page.tsx` | CREATE | EmotionMirror module page |
| `apps/web/app/(platform)/modules/my-day-journal/page.tsx` | CREATE | MyDay Journal module page |
| `apps/web/app/(platform)/modules/math-stories/page.tsx` | CREATE | MathStories module page |
| `apps/api/src/routes/modules/wordWorld.ts` | CREATE | POST `/api/modules/word-world/feedback` |
| `apps/api/src/routes/modules/emotionMirror.ts` | CREATE | POST `/api/modules/emotion-mirror/feedback` |
| `apps/api/src/routes/modules/myDayJournal.ts` | CREATE | POST `/api/modules/my-day-journal/feedback` |
| `apps/api/src/routes/modules/mathStories.ts` | CREATE | POST `/api/modules/math-stories/generate` + `/feedback` |
| `packages/ai/src/prompts/wordWorld.ts` | CREATE | Module-specific system prompt |
| `packages/ai/src/prompts/emotionMirror.ts` | CREATE | Module-specific system prompt |
| `packages/ai/src/prompts/myDayJournal.ts` | CREATE | Module-specific system prompt |
| `packages/ai/src/prompts/mathStories.ts` | CREATE | Module-specific system prompt |

### Phase 1F — Parent Dashboard

| File | Action | Justification |
|---|---|---|
| `apps/web/app/(platform)/dashboard/page.tsx` | CREATE | Session list, per-module stats, word jar count |
| `apps/web/app/(platform)/dashboard/sessions/page.tsx` | CREATE | Full session log with filter |
| `apps/api/src/routes/wordJar.ts` | CREATE | GET `/api/word-jar` |

---

## NOT Building (Phase 1 Scope Limits)

- Multiple child profiles (Phase 2) — one child profile per parent account only
- Therapist role / dashboard (Phase 2)
- Community image library / moderation (Phase 2+)
- SymbolMath module (Phase 2)
- StorySequence module (Phase 2)
- Native iOS/Android app (Phase 3)
- Printable reports / PDF export (Phase 2)
- Speech-to-text input (Phase 2 — use browser Web Speech API as progressive enhancement only)
- Streak-at-risk notifications (Phase 2)
- Offline / PWA Service Worker (Phase 2)
- Multi-language (Phase 3)
- Badges/trophy shelf (defer to Phase 1 stretch goal — stars first)

---

## Step-by-Step Tasks

### Task 1: Extend shared types
- **ACTION**: Add all new domain types to `packages/types/src/index.ts`
- **IMPLEMENT**:
  ```ts
  export type ModuleId = 'picture-words' | 'word-world' | 'emotion-mirror' | 'my-day-journal' | 'math-stories';
  export type DifficultyLevel = 'simple' | 'moderate' | 'descriptive';

  export interface ChildProfile {
    id: string;
    parentId: string;
    name: string;
    age: number;
    avatar: string;
    difficultyLevel: DifficultyLevel;
    activeModules: ModuleId[];
  }

  export interface Session {
    id: string;
    childId: string;
    module: ModuleId;
    startedAt: string;
    completedAt: string | null;
    starsEarned: number;
  }

  export interface SessionEntry {
    id: string;
    sessionId: string;
    imageUrl?: string;
    childResponse: string;
    aiFeedback: FeedbackResult;
    wordCount: number;
    createdAt: string;
  }

  export interface WordJarEntry {
    id: string;
    childId: string;
    word: string;
    definition: string;
    childSentence?: string;
    imageUrl?: string;
    sourceModule: ModuleId;
    createdAt: string;
  }

  // Add Zod schemas for each
  ```
- **MIRROR**: TYPE_EXTENSION_PATTERN
- **VALIDATE**: `pnpm --filter @study-aid/types typecheck`

### Task 2: Create `packages/db` package
- **ACTION**: Create new workspace package for Supabase client and typed queries
- **IMPLEMENT**:
  ```json
  // packages/db/package.json
  {
    "name": "@study-aid/db",
    "version": "0.0.1",
    "private": true,
    "main": "./src/index.ts",
    "types": "./src/index.ts",
    "exports": { ".": "./src/index.ts" },
    "dependencies": {
      "@study-aid/types": "workspace:*",
      "@supabase/supabase-js": "^2.39.0",
      "@supabase/ssr": "^0.1.0"
    }
  }
  ```
  ```ts
  // packages/db/src/client.ts
  import { createBrowserClient as _createBrowserClient } from '@supabase/ssr';
  import { createServerClient as _createServerClient } from '@supabase/ssr';
  // Re-export with env validation
  export function createBrowserClient() {
    return _createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  ```
- **GOTCHA**: `@supabase/ssr` requires cookies to be passed in server context — see `createServerClient` signature. Do NOT use `@supabase/auth-helpers-nextjs` (deprecated).
- **VALIDATE**: `pnpm install && pnpm --filter @study-aid/db typecheck`

### Task 3: Set up Supabase project + database schema
- **ACTION**: Create Supabase project, run schema SQL, configure environment variables
- **IMPLEMENT** (SQL to run in Supabase dashboard):
  ```sql
  -- Enable RLS on all tables
  create table child_profiles (
    id uuid primary key default gen_random_uuid(),
    parent_id uuid references auth.users(id) on delete cascade,
    name text not null,
    age int not null,
    avatar text default 'default',
    difficulty_level text default 'simple',
    active_modules text[] default array['picture-words'],
    created_at timestamptz default now()
  );
  alter table child_profiles enable row level security;
  create policy "parent_owns" on child_profiles
    using (auth.uid() = parent_id);

  create table sessions (
    id uuid primary key default gen_random_uuid(),
    child_id uuid references child_profiles(id) on delete cascade,
    module text not null,
    started_at timestamptz default now(),
    completed_at timestamptz,
    stars_earned int default 0
  );
  alter table sessions enable row level security;
  create policy "parent_owns" on sessions
    using (child_id in (select id from child_profiles where parent_id = auth.uid()));

  create table session_entries (
    id uuid primary key default gen_random_uuid(),
    session_id uuid references sessions(id) on delete cascade,
    image_url text,
    child_response text not null,
    ai_feedback jsonb not null,
    word_count int default 0,
    created_at timestamptz default now()
  );
  alter table session_entries enable row level security;
  create policy "parent_owns" on session_entries
    using (session_id in (select id from sessions where child_id in (select id from child_profiles where parent_id = auth.uid())));

  create table word_jar (
    id uuid primary key default gen_random_uuid(),
    child_id uuid references child_profiles(id) on delete cascade,
    word text not null,
    definition text not null,
    child_sentence text,
    image_url text,
    source_module text not null,
    created_at timestamptz default now()
  );
  alter table word_jar enable row level security;
  create policy "parent_owns" on word_jar
    using (child_id in (select id from child_profiles where parent_id = auth.uid()));
  ```
- **GOTCHA**: RLS must be enabled before going to production. Test with both anon key (client) and service role key (server routes that bypass RLS for session logging from the API server).
- **IMPLEMENT** (env vars needed):
  ```
  # apps/web/.env.local
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  NEXT_PUBLIC_API_URL=http://localhost:3002

  # apps/api/.env
  SUPABASE_URL=https://xxx.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=eyJ... (bypasses RLS — server only, never expose to client)
  ```
- **VALIDATE**: Connect via Supabase Studio, confirm all tables + policies exist

### Task 4: Next.js middleware for auth protection
- **ACTION**: Create `apps/web/middleware.ts` to protect platform routes
- **IMPLEMENT**:
  ```ts
  import { createServerClient } from '@supabase/ssr';
  import { NextResponse, type NextRequest } from 'next/server';

  export async function middleware(request: NextRequest) {
    let response = NextResponse.next({ request });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { /* get/set helpers */ } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && request.nextUrl.pathname.startsWith('/home')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (!user && request.nextUrl.pathname.startsWith('/modules')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return response;
  }

  export const config = {
    matcher: ['/home', '/home/:path*', '/modules/:path*', '/dashboard/:path*'],
  };
  ```
- **MIRROR**: ROUTE_PATTERN (same guard logic applies to all platform routes)
- **GOTCHA**: Always use `supabase.auth.getUser()` not `getSession()` in middleware — `getSession()` is not secure for server-side auth checks.
- **VALIDATE**: Navigate to `/home` without being logged in → should redirect to `/login`

### Task 5: Login page
- **ACTION**: Create `apps/web/app/(auth)/login/page.tsx`
- **IMPLEMENT**: Email + password form using `supabase.auth.signInWithPassword()`. On success, redirect to `/home`. On failure, show friendly message ("We couldn't log in — check your email and password").
- **MIRROR**: PAGE_STATE_PATTERN — use `type LoginState = 'idle' | 'submitting' | 'error' | 'success'`
- **GOTCHA**: Redirect after login must use Next.js `router.push('/home')` not `window.location` to avoid full page reload losing Supabase session cookies.
- **VALIDATE**: Login with valid credentials → see `/home`. Login with bad credentials → friendly error.

### Task 6: Home screen with module picker
- **ACTION**: Create `apps/web/app/(platform)/home/page.tsx` — fetches child profile + star total, renders module tiles
- **IMPLEMENT**:
  ```tsx
  // Server component — fetches profile from Supabase
  // Renders: greeting, star count, 2x2 grid of ModuleTile components
  // Each tile links to /modules/[module-id]
  // Modules not in activeModules are shown as locked (greyed, non-clickable)
  ```
- **MIRROR**: UI_COMPONENT_PATTERN for ModuleTile
- **GOTCHA**: Home screen is a Server Component; don't add `'use client'` unless interaction requires it. Module tiles that just navigate are plain `<Link>` wrappers — no client state needed.
- **VALIDATE**: After login, see home screen with at least PictureWords tile active

### Task 7: Migrate PictureWords into platform
- **ACTION**: Move `apps/web/app/describe-picture/page.tsx` to `apps/web/app/(platform)/modules/picture-words/page.tsx`; add session start/complete API calls; award 3 stars on completion
- **IMPLEMENT**: Keep all existing logic. Add:
  - On page load: `POST /api/sessions/start { module: 'picture-words', childId }`
  - On feedback received: `POST /api/sessions/complete { sessionId, starsEarned: 3 }`
  - Add `CelebrationOverlay` shown for 2 seconds on completion
- **MIRROR**: PAGE_STATE_PATTERN — add `'complete'` state
- **GOTCHA**: `childId` must come from the Supabase session (via server component or context) — never pass it as a client-side prop that could be tampered with
- **VALIDATE**: Complete a PictureWords session → session appears in Supabase `sessions` table with `completed_at` set

### Task 8: Add AI prompts package structure
- **ACTION**: Extract system prompts into `packages/ai/src/prompts/` — one file per module
- **IMPLEMENT**:
  ```ts
  // packages/ai/src/prompts/base.ts
  export const BASE_AI_PRINCIPLES = `
  You are a warm, encouraging AI tutor for a neurodiverse child aged 6-17.
  ALWAYS: Lead with specific praise for what the child did.
  NEVER USE: wrong, incorrect, missing, forgot, should have, you need to.
  Frame all suggestions as additions: "You could also...", "Another great thing to notice..."
  Keep feedback to 4-5 sentences maximum.
  End every response with an encouraging sign-off.
  `;

  // packages/ai/src/prompts/wordWorld.ts
  export const WORD_WORLD_SYSTEM_PROMPT = `${BASE_AI_PRINCIPLES}
  Module: WordWorld. The child has written a sentence using a given vocabulary word.
  Celebrate their sentence. Offer one optional expansion. Never rewrite their sentence — only add to it.
  Save the vocabulary word to their Word Jar.
  `;
  ```
- **MIRROR**: AI_PROVIDER_PATTERN
- **VALIDATE**: Each prompt file exports a string constant; `pnpm --filter @study-aid/ai typecheck` passes

### Task 9: WordWorld module
- **ACTION**: Create full WordWorld module (API route + frontend page)
- **IMPLEMENT**:
  - API: `POST /api/modules/word-world/feedback` — receives `{ word, definition, childSentence, childId }`, returns `FeedbackResult` + saves word to `word_jar` table
  - Frontend: Show word in large text + definition. Textarea for sentence. Submit → AI feedback → stars. Option to describe the matching image.
- **MIRROR**: ROUTE_PATTERN for API; PAGE_STATE_PATTERN for frontend
- **GOTCHA**: Word bank should be a static JSON file in `packages/ai/src/data/wordBank.ts` for Phase 1 (no DB needed for words themselves — only the child's entry)
- **VALIDATE**: Submit a sentence → feedback shown → word appears in Supabase `word_jar` table

### Task 10: EmotionMirror module
- **ACTION**: Create EmotionMirror module — image + emotion picker + AI feedback
- **IMPLEMENT**:
  - Emotion picker: static array of 10 emotions with emoji icons `['Happy 😊', 'Sad 😢', 'Angry 😠', 'Scared 😨', 'Surprised 😲', 'Confused 😕', 'Proud 🌟', 'Excited 🎉', 'Worried 😟', 'Calm 😌']`
  - Simple difficulty: tap emotion tile (no free text)
  - Moderate+: tap + type why
  - AI: validates reasoning warmly regardless of choice (no wrong answers)
- **MIRROR**: UI_COMPONENT_PATTERN for EmotionPicker grid
- **GOTCHA**: AI prompt must explicitly state "There is no single correct answer — validate whatever emotion the child identifies and affirm their reasoning"
- **VALIDATE**: Select emotion, optionally type reason → warm AI response that doesn't imply they were wrong

### Task 11: MyDay Journal module
- **ACTION**: Create journal entry flow — scene picker or photo, text entry, AI response, saved entry
- **IMPLEMENT**:
  - Phase 1: use illustrated scene tiles (no camera/file upload yet — Phase 2)
  - Scene tiles: 7 options (at school, at home, outside, eating, playing, with family, at special place) as coloured illustrated cards
  - Child selects scene → writes 1-2 sentences → AI responds with warm acknowledgment + 1 gentle follow-up question
  - Entry saved to `journal_entries` table (add this table — see schema below)
  - Parent can see entries in dashboard
- **IMPLEMENT** (additional SQL):
  ```sql
  create table journal_entries (
    id uuid primary key default gen_random_uuid(),
    child_id uuid references child_profiles(id) on delete cascade,
    scene_id text not null,
    child_text text not null,
    ai_response text not null,
    ai_followup text,
    parent_reaction text,
    created_at timestamptz default now()
  );
  alter table journal_entries enable row level security;
  create policy "parent_owns" on journal_entries
    using (child_id in (select id from child_profiles where parent_id = auth.uid()));
  ```
- **VALIDATE**: Create a journal entry → appears in dashboard session log

### Task 12: MathStories module
- **ACTION**: Create MathStories — AI generates word problem, child answers, AI gives feedback
- **IMPLEMENT**:
  - `POST /api/modules/math-stories/generate` — AI generates a word problem based on difficulty level, returns `{ problem: string, answer: number, context: string }`
  - `POST /api/modules/math-stories/feedback` — receives `{ problem, correctAnswer, childAnswer, childExplanation? }`, returns feedback
  - Frontend: large text problem + numeric input + "I don't know" button + optional explanation textarea
- **GOTCHA**: MathStories is the only module where there IS a correct answer — the AI prompt must still be warm for wrong answers ("Great try! Let's think about it together...") and NEVER say "wrong"
- **GOTCHA**: Generate the problem server-side (API) to hide the correct answer from the client. Only send `{ problem, context }` to frontend, never `answer`.
- **VALIDATE**: Generate problem → submit answer → correct answer gets celebration, wrong answer gets gentle walkthrough

### Task 13: Parent dashboard
- **ACTION**: Create `apps/web/app/(platform)/dashboard/page.tsx` — session overview + log
- **IMPLEMENT**:
  - Fetch last 20 sessions from Supabase for the parent's child
  - Show: module name, date, stars earned, word count (from entries)
  - Word Jar count in summary card
  - "Switch to child view" button → redirects to `/home`
- **VALIDATE**: Complete 2+ sessions → both appear in dashboard with correct module names and star counts

### Task 14: Update turbo.json + package dependencies
- **ACTION**: Add `@study-aid/db` to turbo pipeline; update `apps/web` and `apps/api` to depend on it
- **IMPLEMENT**:
  ```json
  // apps/web/package.json — add to dependencies:
  "@study-aid/db": "workspace:*"
  // apps/api/package.json — add to dependencies:
  "@study-aid/db": "workspace:*"
  ```
- **VALIDATE**: `pnpm install && pnpm build` succeeds

---

## Testing Strategy

### Unit Tests

| Test | Input | Expected Output | Edge Case? |
|---|---|---|---|
| `createSession` | valid childId + module | returns session with id | No |
| `createSession` | invalid childId (no profile) | throws / returns null | Yes |
| AI prompt guard | "wrong" in response | test should fail (guardrail check) | Yes — critical |
| `completeSession` | sessionId + stars | updates completedAt, starsEarned | No |
| `getWordJar` | childId | returns array of WordJarEntry | No |
| Login redirect | unauthenticated GET /home | redirects to /login | Yes |

### Edge Cases Checklist
- [ ] Child submits empty description (should be disabled by button state, but handle in API too)
- [ ] AI returns response exceeding 4-5 sentence limit (truncate gracefully)
- [ ] Supabase insert fails (session logging) — do NOT block the UX; log error server-side, complete session anyway
- [ ] Parent has no child profile yet — redirect to profile setup page
- [ ] Child navigates away mid-session — session stays open (no `completed_at`); dashboard shows as incomplete

---

## Validation Commands

### Static Analysis
```bash
pnpm typecheck
```
EXPECT: Zero type errors across all packages

### Build
```bash
pnpm build
```
EXPECT: All packages build; `apps/web/.next` and `packages/*/dist` produced

### Dev Server
```bash
pnpm dev
```
EXPECT: Web on http://localhost:3000, API on http://localhost:3002

### Manual Validation Flow
- [ ] Go to http://localhost:3000 — redirected to /login ✓
- [ ] Log in with parent account → see /home with module tiles ✓
- [ ] Tap PictureWords → complete a session → see celebration + stars ✓
- [ ] Return to /home → star count increased ✓
- [ ] Go to /dashboard → see completed session in log ✓
- [ ] Tap WordWorld → submit a sentence → word appears in Word Jar ✓
- [ ] Tap EmotionMirror → select emotion → get warm AI response ✓
- [ ] Tap MyDay Journal → select scene + write entry → entry saved ✓
- [ ] Tap MathStories → answer problem → correct: celebration; wrong: gentle walkthrough ✓

---

## Acceptance Criteria
- [ ] All 5 modules functional with AI feedback
- [ ] Parent can log in and see session history
- [ ] Stars awarded and persisted per session
- [ ] Word Jar populated by WordWorld entries
- [ ] All routes protected by auth middleware
- [ ] No type errors (`pnpm typecheck`)
- [ ] Build passes (`pnpm build`)
- [ ] RLS policies on all Supabase tables
- [ ] No "wrong", "incorrect", "missing" in any AI response

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Supabase RLS misconfiguration | Medium | HIGH — data leak | Test with non-owner JWT before deploy |
| AI response breaks "no wrong answer" rule | Low | HIGH — child distress | Add guardrail test suite; log all AI responses for parent review |
| Session logging failure blocks UX | Low | Medium | Log-then-continue pattern: don't await session writes on the critical path |
| pnpm workspace dependency order | Medium | Medium | Verify `packages/db` builds before `apps/web` in turbo.json |
| Supabase free tier limits (500MB, 50k MAU) | Low | Low for Phase 1 | Fine for family use; plan migration trigger for Phase 2 |

## Notes

### Key Technical Decisions

1. **Auth: Supabase Auth** — provides email/password, Google OAuth (Phase 2), and Row-Level Security out of the box. Integrates with Next.js App Router via `@supabase/ssr`. Alternative (Auth0) rejected: more complex setup, separate pricing.

2. **Database: Supabase PostgreSQL** — same service as auth; RLS ties data access to auth.uid() automatically. Eliminates a separate auth-to-DB permission layer.

3. **API: Keep Fastify for AI calls** — AI calls (Anthropic/OpenAI) involve API keys that must never be in the browser. Fastify stays as the AI proxy. Session logging can go directly from the Next.js server components to Supabase (no need to route through Fastify).

4. **Image uploads: Phase 2** — Cloudinary/S3 setup adds complexity. Phase 1 uses Unsplash stock photos only (already working) + static illustrated scene tiles for MyDay Journal.

5. **One child profile per parent in Phase 1** — simplifies the auth/data model significantly. Multi-child support is a Phase 2 architectural addition.

### Implementation Order
Complete tasks in strict order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9–12 (can parallelise) → 13 → 14

Use `/prp-implement .claude/PRPs/plans/brightminds-platform-phase1.plan.md` to execute task by task.
