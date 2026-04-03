# Study Aid — Technical Specification

**Version:** 1.0  
**Date:** 2026-04-02  
**Status:** Draft

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Monorepo Structure](#2-monorepo-structure)
3. [Tech Stack](#3-tech-stack)
4. [App 1: Describe Picture](#4-app-1-describe-picture)
5. [AI Layer Design](#5-ai-layer-design)
6. [Phase Roadmap](#6-phase-roadmap)
7. [Image Sourcing Strategy](#7-image-sourcing-strategy)
8. [Development Setup](#8-development-setup)
9. [Future Apps](#9-future-apps)

---

## 1. Project Overview

Study Aid is a monorepo of educational web apps designed for autistic and neurodivergent children aged 8–16. The apps share a single Next.js frontend, a shared backend API, and a shared AI abstraction layer.

**Design principles:**
- Distraction-free, calm UI — no flashing, no clutter, tablet-friendly
- AI feedback is always encouraging; mistakes are reframed as opportunities
- Simple language throughout — no jargon, short sentences
- Built for a single child in Phase 1; multi-user architecture introduced in Phase 2

**Phase 1 scope:** One app (Describe Picture), static images, AI-powered feedback, no authentication, no database.

---

## 2. Monorepo Structure

The repo uses [Turborepo](https://turbo.build/) for task orchestration and caching across packages.

```
/
├── apps/
│   ├── web/                  # Next.js 14+ frontend (App Router)
│   └── api/                  # Fastify backend
├── packages/
│   ├── ai/                   # AI provider abstraction layer
│   ├── ui/                   # Shared React component library
│   └── types/                # Shared TypeScript types and interfaces
├── turbo.json
├── package.json              # Root workspace config
└── pnpm-workspace.yaml       # (if using pnpm)
```

### Package Descriptions

**`apps/web`**  
Next.js 14+ application using the App Router. Hosts all sub-apps as distinct routes (e.g. `/describe-picture`). Responsible for all UI rendering, routing, and client-side state. Imports from `packages/ui` and `packages/types`. Calls `apps/api` for data and AI feedback.

**`apps/api`**  
Node.js + Fastify server. Handles image retrieval and AI feedback requests. In Phase 1 this is a lightweight stateless service. Imports from `packages/ai` and `packages/types`. In Phase 2+ this will handle auth, progress tracking, and image uploads.

**`packages/ai`**  
Provider-agnostic AI abstraction. Defines the `AIProvider` interface and ships concrete implementations for Anthropic (and later OpenAI). Response caching lives here. Selected via environment variable.

**`packages/ui`**  
Shared React component library built with Tailwind CSS. Contains primitives (Button, Card, TextArea, FeedbackBlock) styled to the app's visual language. Consumed by `apps/web`.

**`packages/types`**  
Shared TypeScript types and Zod schemas. Consumed by all other packages and apps. Single source of truth for API contracts and data shapes.

---

## 3. Tech Stack

| Layer | Choice | Justification |
|---|---|---|
| Frontend framework | Next.js 14+ (App Router) | File-based routing, SSR/SSG flexibility, strong TypeScript support, easy Vercel deployment |
| Styling | Tailwind CSS | Rapid iteration, consistent design system, easy responsive/tablet layout |
| Backend framework | Fastify | Lightweight, fast, good TypeScript support, schema validation built in |
| AI provider (primary) | Anthropic Claude | Consistently warm and safe tone; multimodal (image + text in one call); `claude-haiku-4-5-20251001` for cost, `claude-sonnet-4-6` for quality |
| AI provider (future) | OpenAI | Covered by abstraction layer; no implementation cost upfront |
| Monorepo tooling | Turborepo | Task graph, remote caching, works well with pnpm workspaces |
| Package manager | pnpm | Faster than npm, good workspace support, disk-efficient |
| Language | TypeScript throughout | Type safety across the full stack via shared `packages/types` |
| Phase 1 storage | Static files in repo | Zero infrastructure for MVP; images committed under `apps/web/public/images/` |
| Phase 2+ storage | PostgreSQL + S3-compatible | Standard, well-supported; Supabase or Railway for Postgres, Cloudflare R2 or AWS S3 for images |
| Phase 1 caching | In-memory (Map) | No Redis dependency for MVP; same interface, swap later |
| Hosting | Vercel (web) + Railway (api) | Simplest path to deployment; alternatively a single VPS with Docker Compose |

---

## 4. App 1: Describe Picture

### 4.1 User Flow

```
1. Child lands on /describe-picture
2. A single image is displayed (randomly selected from the library)
3. A text area prompts: "What do you see in this picture?"
4. Child types their description and clicks Submit
5. A loading state is shown while AI processes the response
6. Structured feedback is displayed below the image:
   - Appreciation message
   - What they did well
   - 1-2 gentle suggestions
   - An example of an improved sentence
   - Vocabulary spotlight: one new word + simple definition
7. Two options are offered: "Try again with this image" or "Next image"
```

### 4.2 UI Notes

- **Layout:** Single column, centered, max-width ~680px — works on tablets in portrait mode
- **Image display:** Fixed-height container (e.g. 320px), `object-fit: contain`, white/light-grey background
- **Text area:** Large, generous padding, readable font (e.g. 18px), placeholder text is friendly ("Tell me what you see!")
- **Submit button:** High contrast, large tap target (min 48px height)
- **Feedback block:** Appears below the form after submission; soft background color per section (green for appreciation, blue for what was good, yellow for suggestions, purple for vocabulary spotlight)
- **No timer or pressure indicators** — child can take as long as needed; no countdown, no urgency cues
- **No navigation clutter:** No sidebar, no header links beyond a small logo; nothing to distract from the task
- **Loading state:** Simple animated dots or a spinner with a friendly message ("Thinking...")
- **Error state:** Friendly message if AI call fails ("Something went wrong. Let's try again!")
- **Accessibility:** `aria-live` region for feedback block; sufficient color contrast; keyboard-navigable

### 4.3 Accessibility & Design Constraints

- **WCAG 2.1 AA** compliance — sufficient color contrast, keyboard-navigable, screen reader support via ARIA labels
- **`aria-live` region** on the feedback block so screen readers announce new feedback on submission
- **Font:** Nunito or similar rounded sans-serif; OpenDyslexic available as an optional toggle
- **Tap targets:** minimum 48×48px for all interactive elements (tablet-friendly)
- **Dark mode:** supported via Tailwind `dark:` classes for sensory sensitivity
- **No red text, no scores visible to child, no "wrong" states** — error states are neutral and friendly
- **AI-generated alt text** on images (derived from `altText` in the image manifest; later enhanced by AI vision)

### 4.5 Route Structure

```
apps/web/app/
└── describe-picture/
    ├── page.tsx          # Main page component
    ├── loading.tsx       # Suspense loading UI
    └── error.tsx         # Error boundary UI
```

### 4.6 API Contract

#### `GET /api/images`

Returns a random image (or a list, depending on query params).

**Query params:**
- `count` (optional, default: 1) — number of images to return
- `random` (optional, default: true)

**Response:**
```json
{
  "images": [
    {
      "id": "img_001",
      "url": "/images/dog-in-park.jpg",
      "altText": "A dog running in a sunny park",
      "category": "animals"
    }
  ]
}
```

#### `POST /api/feedback`

Submits the child's description and receives structured AI feedback.

**Request body:**
```json
{
  "imageId": "img_001",
  "imageUrl": "/images/dog-in-park.jpg",
  "imageAltText": "A dog running in a sunny park",
  "childDescription": "There is a dog and it is running fast in the grass"
}
```

**Response (success):**
```json
{
  "feedback": {
    "appreciation": "Great job! You spotted the dog right away!",
    "whatWasGood": "You told us what the dog was doing — running — and where it was. That is really clear!",
    "suggestions": [
      "Try describing what colour the dog is.",
      "You could say if the dog looks happy or excited."
    ],
    "improvedExample": "A brown dog is running fast through the green grass in the park.",
    "vocabularyWord": {
      "word": "fluffy",
      "definition": "Something that is soft and light — like the dog's fur!"
    }
  },
  "cached": false
}
```

**Response (error):**
```json
{
  "error": "feedback_unavailable",
  "message": "We could not get feedback right now. Please try again."
}
```

**HTTP status codes:**
- `200` — success
- `400` — missing or invalid request fields
- `503` — AI provider unavailable

### 4.7 TypeScript Types

Defined in `packages/types/src/index.ts`:

```typescript
export interface Image {
  id: string;
  url: string;
  altText: string;
  category?: string;
}

export interface FeedbackResult {
  appreciation: string;
  whatWasGood: string;
  suggestions: string[];      // max 2 items
  improvedExample: string;
  vocabularyWord: {
    word: string;
    definition: string;       // simple, child-readable
  };
}

export interface FeedbackRequest {
  imageId: string;
  imageUrl: string;
  imageAltText: string;
  childDescription: string;
}

export interface FeedbackResponse {
  feedback: FeedbackResult;
  cached: boolean;
}

export interface ImageListResponse {
  images: Image[];
}
```

---

## 5. AI Layer Design

### 5.1 Provider Abstraction

Located in `packages/ai/src/`.

```typescript
// packages/ai/src/types.ts
export interface AIProvider {
  getFeedback(
    imageContext: string,
    childDescription: string
  ): Promise<FeedbackResult>;
}
```

```typescript
// packages/ai/src/index.ts
import { AnthropicProvider } from './providers/anthropic';
import { OpenAIProvider } from './providers/openai';
import { CachingProvider } from './cache';

export function createAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER === 'openai'
    ? new OpenAIProvider()
    : new AnthropicProvider();

  return new CachingProvider(provider);
}
```

**Environment variables:**
```
AI_PROVIDER=anthropic          # or "openai"
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...          # optional, only needed if AI_PROVIDER=openai
```

### 5.2 Anthropic Implementation

Uses the Claude Messages API with vision. The image is passed as a base64-encoded image block or a URL, alongside the text prompt.

**Recommended models:**
- `claude-haiku-4-5-20251001` — fast and cheap; suitable for Phase 1 when cost matters
- `claude-sonnet-4-6` — higher quality feedback; use if response quality is insufficient with Haiku

```typescript
// packages/ai/src/providers/anthropic.ts
import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider } from '../types';
import type { FeedbackResult } from '@study-aid/types';

export class AnthropicProvider implements AIProvider {
  private client = new Anthropic();

  async getFeedback(
    imageContext: string,
    childDescription: string
  ): Promise<FeedbackResult> {
    const response = await this.client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(imageContext, childDescription),
        },
      ],
    });

    const text = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    return parseResponse(text);
  }
}
```

### 5.3 System Prompt

```
You are a friendly, encouraging teacher helping a child improve their speech and expression.

Rules:
- Always start with genuine appreciation for what the child noticed or described
- Never use the word "wrong", "missing", "forgot", "incorrect", or any discouraging language
- Frame suggestions as additions, not corrections: "You could also mention..."
- Keep all sentences short and simple — the child is aged 8 to 16
- Suggest only 1 to 2 improvements at most
- Include one example of a slightly improved sentence
- Choose one vocabulary word from the image that is one level above the child's current usage; give a simple, joyful definition
- Respond only with valid JSON — no extra text, no markdown
```

### 5.4 User Prompt Template

```
Image description (for context): {imageContext}
The child wrote: "{childDescription}"

Respond in this exact JSON structure:
{
  "appreciation": "...",
  "whatWasGood": "...",
  "suggestions": ["...", "..."],
  "improvedExample": "...",
  "vocabularyWord": {
    "word": "...",
    "definition": "..."
  }
}

The "suggestions" array must contain at most 2 items. Fewer is fine.
The vocabulary word definition must be simple enough for a child aged 8-16 to understand.
```

### 5.5 Response Parsing

The provider parses the JSON response from the model and validates it against the `FeedbackResult` type. If parsing fails (malformed JSON, missing fields), the provider throws a typed error that the API route catches and converts to a `503` response.

```typescript
function parseResponse(raw: string): FeedbackResult {
  const parsed = JSON.parse(raw);

  if (
    typeof parsed.appreciation !== 'string' ||
    typeof parsed.whatWasGood !== 'string' ||
    !Array.isArray(parsed.suggestions) ||
    typeof parsed.improvedExample !== 'string' ||
    typeof parsed.vocabularyWord?.word !== 'string' ||
    typeof parsed.vocabularyWord?.definition !== 'string'
  ) {
    throw new Error('Invalid feedback structure from AI provider');
  }

  return {
    appreciation: parsed.appreciation,
    whatWasGood: parsed.whatWasGood,
    suggestions: parsed.suggestions.slice(0, 2),
    improvedExample: parsed.improvedExample,
    vocabularyWord: {
      word: parsed.vocabularyWord.word,
      definition: parsed.vocabularyWord.definition,
    },
  };
}
```

### 5.6 Response Caching

Phase 1 uses an in-memory cache. The cache key is a hash of `imageId + childDescription` (lowercased, trimmed). Cache TTL is 1 hour.

```typescript
// packages/ai/src/cache.ts
export class CachingProvider implements AIProvider {
  private cache = new Map<string, { result: FeedbackResult; expiresAt: number }>();

  constructor(private inner: AIProvider) {}

  async getFeedback(imageContext: string, childDescription: string): Promise<FeedbackResult> {
    const key = hash(imageContext + childDescription.toLowerCase().trim());
    const cached = this.cache.get(key);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.result;
    }

    const result = await this.inner.getFeedback(imageContext, childDescription);
    this.cache.set(key, { result, expiresAt: Date.now() + 3600_000 });
    return result;
  }
}
```

Phase 2+: swap `Map` for Redis (`ioredis`) by replacing `CachingProvider`'s internals — the interface stays the same.

---

## 6. Phase Roadmap

### Phase 1 — MVP (2–4 weeks)
- Monorepo scaffolding (Turborepo, pnpm workspaces)
- `apps/web`: Next.js 14+ with `/describe-picture` route
- `apps/api`: Fastify server with `GET /api/images` and `POST /api/feedback`
- `packages/ai`: Anthropic provider + in-memory cache
- `packages/types`: Shared types
- `packages/ui`: Basic component set (Button, TextArea, FeedbackBlock, ImageDisplay)
- Static image library: 10–20 curated images in `apps/web/public/images/`
- No auth, no database, no progress tracking
- Deployment: Vercel (web) + Railway (api)

### Phase 2 — Parent features
- Parent image upload (`POST /api/images/upload`) via S3-compatible storage
- Image content moderation layer before uploaded images enter the child's session
- Progress tracking: attempts, word count per session, streaks
- Session history: parent view of date / image / child response / AI feedback; export as PDF or CSV
- Word Jar: vocabulary words collected per session, browsable by parent and child
- TTS feedback readout (browser Web Speech API — free, zero infra)
- PostgreSQL database (user-free still — single child, but persisted data)
- Improved prompts tuned from real usage
- Redis response cache replacing in-memory
- PWA manifest + service worker (offline support for last 5 cached images)

### Phase 3 — Multi-user
- Authentication: parent accounts with child profiles (NextAuth.js or Clerk)
- Per-child image libraries
- Image categories (animals, nature, everyday life, people)
- App 2 introduced (see Section 9)
- Role-based UI: parent admin view vs. child play view
- COPPA compliance (US) + GDPR considerations (EU) — parental consent required for all child profiles; no identifying data in AI prompts; no advertising or third-party data sharing

### Phase 4 — Enrichment
- Voice input via Web Speech API (child speaks instead of types)
- Gamification: stars, badges, streaks displayed in a trophy area
- Therapist dashboard: read-only progress view, exportable reports
- App 3 introduced (see Section 9)

---

## 7. Image Sourcing Strategy

### Phase 1: Static Curated Set
- 10–20 images committed directly to `apps/web/public/images/`
- Format: JPEG or WebP, max ~200KB each
- Naming: `{category}-{slug}.jpg` e.g. `animals-dog-park.jpg`
- Alt text and metadata stored in `apps/web/public/images/manifest.json`:

```json
[
  {
    "id": "animals-dog-park",
    "filename": "animals-dog-park.jpg",
    "altText": "A golden retriever running through a sunny park",
    "category": "animals"
  }
]
```

- Image selection criteria: clear subjects, bright colours, positive/neutral scenes, child-appropriate content, no text overlays

### Phase 2+: External APIs

All three services have free tiers suitable for a small personal app. Use them server-side only (keys never exposed to the browser).

| Service | Free tier | Notes |
|---|---|---|
| [Unsplash API](https://unsplash.com/developers) | 50 req/hour | High quality, requires attribution |
| [Pexels API](https://www.pexels.com/api/) | 200 req/hour | No attribution required |
| [Pixabay API](https://pixabay.com/api/docs/) | 100 req/min | Large library, easy to filter by category |

Wrap API calls behind `GET /api/images?source=unsplash` — the frontend never calls external APIs directly.

### Phase 2+: Parent-uploaded Images
- Upload via `POST /api/images/upload`
- Stored in S3-compatible bucket (Cloudflare R2 recommended for free egress)
- Metadata (filename, uploader, child profile ID) stored in PostgreSQL
- Served via signed URLs or a CDN

---

## 8. Development Setup

### Prerequisites
- Node.js 20+
- pnpm 9+
- An Anthropic API key

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/your-org/study-aid.git
cd study-aid

# 2. Install dependencies (all workspaces)
pnpm install

# 3. Set up environment variables
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env — set ANTHROPIC_API_KEY and AI_PROVIDER=anthropic

# 4. Build shared packages first
pnpm turbo build --filter=./packages/*

# 5. Run all apps in development mode
pnpm turbo dev
# web: http://localhost:3000
# api: http://localhost:3001
```

### Environment Variables

**`apps/api/.env`:**
```
PORT=3001
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=              # leave blank unless switching providers

# Phase 2+
DATABASE_URL=
REDIS_URL=
S3_BUCKET=
S3_ENDPOINT=
S3_ACCESS_KEY=
S3_SECRET_KEY=
```

**`apps/web/.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Turborepo Task Pipeline

Defined in `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
```

### Scripts (root `package.json`)

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "clean": "turbo clean && rm -rf node_modules"
  }
}
```

---

## 9. Future Apps

This section is a placeholder. Apps 2 and 3 will each get a full spec section added when they enter active design.

**App 2 — (TBD, Phase 3)**  
Route: `/app-2`  
Candidate ideas: story sequencing (arrange picture cards into a story order), word-to-picture matching, or sentence building from word tiles.

**App 3 — (TBD, Phase 4)**  
Route: `/app-3`  
Candidate ideas: emotion recognition (label the feeling shown in an image), reading comprehension with AI questions, or spoken description with voice input.

Each new app will:
- Add its own route under `apps/web/app/`
- Reuse `packages/ui` components
- Add new endpoints to `apps/api` as needed
- Add new AI methods to `packages/ai` (extending `AIProvider` if needed)
- Add new shared types to `packages/types`

---

*End of specification.*
