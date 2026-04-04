# BrightMinds

## AI-Powered Learning Platform for Neurodiverse Children

**Product Requirements Document — Full Platform**
Version 1.0 | April 2026 | Confidential — For Internal Use

-----

## Table of Contents

1. [Executive Summary](#1-executive-summary)
1. [Platform Overview](#2-platform-overview)
1. [Vision, Goals & Success Metrics](#3-vision-goals--success-metrics)
1. [User Personas](#4-user-personas)
1. [Platform Architecture](#5-platform-architecture)
1. [Shared Platform Layer](#6-shared-platform-layer)
- 6.1 Authentication & Profiles
- 6.2 Home Screen & Module Picker
- 6.3 Rewards & Motivation System
- 6.4 Parent Dashboard
- 6.5 Shared Media Library
- 6.6 AI Design System
1. [Module 1 — PictureWords](#7-module-1--picturewords)
1. [Module 2 — WordWorld](#8-module-2--wordworld)
1. [Module 3 — EmotionMirror](#9-module-3--emotionmirror)
1. [Module 4 — MyDay Journal](#10-module-4--myday-journal)
1. [Module 5 — MathStories](#11-module-5--mathstories)
1. [Module 6 — SymbolMath](#12-module-6--symbolmath)
1. [Module 7 — StorySequence](#13-module-7--storysequence)
1. [Feature Priority Matrix](#14-feature-priority-matrix)
1. [UX & Design System](#15-ux--design-system)
1. [Technical Architecture](#16-technical-architecture)
1. [Data, Privacy & Safety](#17-data-privacy--safety)
1. [Product Roadmap](#18-product-roadmap)
1. [Risks & Mitigations](#19-risks--mitigations)
1. [Monetisation Strategy (Phase 3)](#20-monetisation-strategy-phase-3)
1. [Open Questions & Decisions Required](#21-open-questions--decisions-required)
1. [Glossary](#22-glossary)

-----

## 1. Executive Summary

**BrightMinds** is a single, unified AI-powered learning platform designed specifically for neurodiverse children — initially for a 13-year-old autistic boy, and expanding to other families and therapists over time. The platform brings together seven purposefully designed learning modules under one familiar, warm, low-pressure environment.

Each module targets a distinct developmental skill area — descriptive language, vocabulary, emotional intelligence, daily expression, mathematical reasoning, symbolic notation, and narrative sequencing — all delivered through the same consistent AI feedback philosophy: **celebrate first, expand gently, never discourage.**

Rather than building seven separate apps, BrightMinds is one platform with one login, one reward system, one parent dashboard, and one shared media library. The child experiences it as a friendly home screen with colourful activity tiles. The parent experiences it as a single control centre for their child’s learning.

> ❤️ **Origin:** Built by a parent for their autistic son. Designed to grow into a platform that helps every family like theirs.

-----

## 2. Platform Overview

|Field               |Details                                                                                          |
|--------------------|-------------------------------------------------------------------------------------------------|
|**Platform Name**   |BrightMinds                                                                                      |
|**Product Type**    |Progressive Web App (PWA) — works on browser, tablet, mobile                                     |
|**Primary User**    |Autistic child with speech/comprehension challenges, age 6–17                                    |
|**Secondary Users** |Parents, guardians, speech-language therapists, special educators                                |
|**Modules**         |7 (PictureWords, WordWorld, EmotionMirror, MyDay Journal, MathStories, SymbolMath, StorySequence)|
|**AI Engine**       |Anthropic Claude API or OpenAI GPT-4o (vision + language)                                        |
|**Phase 1 Scope**   |Private family use — 1 parent account, 1 child profile                                           |
|**Phase 2 Scope**   |Multi-family platform with community features                                                    |
|**Phase 3 Scope**   |Freemium monetisation, therapist partnerships, mobile app                                        |
|**Document Version**|1.0 — April 2026                                                                                 |

-----

## 3. Vision, Goals & Success Metrics

### 3.1 Vision Statement

To give every neurodiverse child a safe, joyful digital space where learning feels like play — and where every attempt is met with warmth, patience, and genuine encouragement.

### 3.2 Platform Goals

- Deliver 7 skill-building modules under one consistent, familiar interface
- Ensure every child interaction ends with positive reinforcement — no exceptions
- Give parents full visibility into their child’s activity, progress, and growth
- Build a platform that a developer can extend and a therapist can trust
- Scale from one family’s tool to a community platform without architectural rework

### 3.3 Success Metrics

|Metric                                          |Target                 |
|------------------------------------------------|-----------------------|
|Sessions completed per week (per child)         |≥ 4                    |
|Average session duration                        |8–15 minutes           |
|Child returns next day after first session      |≥ 70% (Day 2 retention)|
|Parent satisfaction rating                      |≥ 4.5 / 5              |
|AI feedback rated encouraging by parent         |≥ 90% of evaluations   |
|Word count growth across language modules       |+20% over 30 days      |
|Modules used per week (per child)               |≥ 2 distinct modules   |
|Zero negative/discouraging AI feedback incidents|100% compliance        |

-----

## 4. User Personas

### 4.1 The Child — Primary User

|Field                  |Details                                                                                      |
|-----------------------|---------------------------------------------------------------------------------------------|
|**Name (example)**     |Arjun, age 13                                                                                |
|**Condition**          |Autism Spectrum Disorder — speech and comprehension challenges                               |
|**Strengths**          |Visual learning, pattern recognition, routine, focused interests                             |
|**Challenges**         |Open-ended questions, abstract concepts, verbal expression, emotional labelling              |
|**Device preference**  |Tablet (iPad) or desktop; large touch targets                                                |
|**Motivation**         |Predictable structure, visual rewards, parental approval, sense of progress                  |
|**Needs from platform**|One familiar place; no surprises; big visuals; instant positive feedback; no “wrong” messages|

### 4.2 The Parent — Secondary User

|Field                  |Details                                                                                                                      |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------|
|**Role**               |Father, mother, or primary caregiver                                                                                         |
|**Goal**               |Support child’s development; feel in control of content; see progress                                                        |
|**Frustrations**       |Generic apps not designed for neurodiverse children; no visibility into what child is learning; fear of inappropriate content|
|**Tech comfort**       |Moderate — comfortable with smartphones and basic web apps                                                                   |
|**Needs from platform**|Easy content upload; session history; progress reports; ability to switch modules on/off                                     |

### 4.3 Speech-Language Therapist *(Phase 2+)*

|Field                  |Details                                                                                       |
|-----------------------|----------------------------------------------------------------------------------------------|
|**Role**               |Certified SLP in clinic, school, or private practice                                          |
|**Goal**               |Extend therapy into home practice; monitor language output between sessions                   |
|**Needs from platform**|Assign specific content; view transcripts; add clinical notes; export reports for IEP meetings|

### 4.4 Platform Administrator *(Phase 2+)*

|Field                  |Details                                                                   |
|-----------------------|--------------------------------------------------------------------------|
|**Role**               |Internal moderator or community manager                                   |
|**Goal**               |Ensure community-shared content is safe and appropriate                   |
|**Needs from platform**|Content moderation queue; user management; flagging tools; usage analytics|

-----

## 5. Platform Architecture

BrightMinds is structured in two layers:

```
┌─────────────────────────────────────────────────────────┐
│                  SHARED PLATFORM LAYER                  │
│  Auth · Profiles · Rewards · Parent Dashboard ·         │
│  Media Library · AI Design System · Settings            │
├──────────┬──────────┬──────────┬──────────┬─────────────┤
│ Picture  │  Word    │ Emotion  │  MyDay   │  Math       │
│  Words   │  World   │  Mirror  │  Journal │  Stories    │
├──────────┴──────────┴──────────┼──────────┴─────────────┤
│       StorySequence            │      SymbolMath         │
└────────────────────────────────┴────────────────────────┘
```

The shared platform layer handles everything that is common across modules. Each module is a self-contained activity that plugs into the shared layer for auth, rewards, media, and AI calls. This means:

- New modules can be added without rebuilding the foundation
- The child’s reward progress and streaks span all modules
- The parent sees one unified dashboard, not seven separate reports
- The AI prompt system is maintained centrally, ensuring consistent tone across all modules

-----

## 6. Shared Platform Layer

### 6.1 Authentication & Profiles

**Parent Account**

- Email + password registration (Google OAuth optional)
- One parent account supports multiple child profiles
- Parent sets up and manages all child profiles
- Separate PIN or session mode for child access (child does not need to log in independently)

**Child Profile**

- Name, age, avatar (chosen from fun illustrated options)
- Difficulty level per module (Simple / Moderate / Descriptive)
- Active modules (parent toggles which modules the child can access)
- Language preference (English default; multi-language Phase 3)

**Session Handoff**

- Parent logs in → selects child profile → child is presented with the Home Screen
- No child-visible login screen — the transition is seamless
- Optional: auto-lock after inactivity, returning to parent PIN screen

-----

### 6.2 Home Screen & Module Picker

The child’s first screen after profile selection. Designed to be:

- **Visually clear** — large illustrated tiles, one per active module
- **Predictable** — same layout every time, no moving elements unless the child initiates
- **Celebratory** — shows current streak, badge count, and a warm greeting (*“Good morning, Arjun! Ready to learn?”*)
- **Non-overwhelming** — parent can hide/show modules; default Phase 1 shows only 2–3

**Module Tile Design**
Each tile shows:

- Module icon and name
- A one-line description (*“Describe a picture”*, *“Use a new word”*)
- A subtle progress indicator (stars earned this week)
- Locked state for modules not yet unlocked (greyed out with a friendly padlock)

**Module Unlock System**

- Modules unlock progressively as the child completes sessions
- Parent can override and unlock any module manually
- Prevents the home screen from feeling overwhelming on day one

-----

### 6.3 Rewards & Motivation System

A single reward system that spans all modules, giving the child one consistent sense of progress.

**Stars**

- Earned per session completion (not per correct answer — effort is rewarded)
- Bonus stars for streaks, trying a new module, or using a new vocabulary word

**Badges**

- Milestone achievements: “First Description!”, “5-Day Streak!”, “Word Wizard (50 words learned)”
- Module-specific badges: “Emotion Explorer”, “Math Hero”, “Story Builder”
- Displayed on a visible Trophy Shelf on the home screen

**Streak Counter**

- Days in a row with at least one completed session
- Visible on home screen; gentle (not guilt-inducing) reminder if streak is at risk

**Word Jar**

- Shared across all language modules
- Every new vocabulary word the AI introduces is saved here
- Child and parent can browse it as a visual dictionary — each word with its picture
- Milestone badges for 10, 25, 50, 100 words

**Celebration Animations**

- Confetti, stars, and a cheerful sound on session completion
- Unique animation per module (e.g., bubbles for WordWorld, number fireworks for MathStories)
- Can be disabled by parent for sensory-sensitive children

-----

### 6.4 Parent Dashboard

A clean, mobile-friendly dashboard giving parents full visibility and control.

**Overview Tab**

- Child’s activity summary: sessions this week, current streak, badges earned
- Quick stats per module: last used, average word count, improvement trend
- Recent session highlights (last 3 sessions at a glance)

**Sessions Tab**

- Full session log: date, module, content shown, child’s response, AI feedback
- Filter by module, date range, or keyword
- Export as PDF or CSV (for therapist sharing or personal records)

**Library Tab**

- Manage personal photo uploads (used across PictureWords, EmotionMirror, MyDay Journal)
- Browse and enable/disable stock photo categories
- Review and approve any AI-flagged content

**Progress Tab**

- Charts: word count over time, session frequency, vocabulary growth
- Per-module progress breakdown
- Monthly summary report (printable / shareable)

**Settings Tab**

- Manage child profiles (add, edit, deactivate)
- Set difficulty levels per module
- Toggle modules on/off
- Notification preferences (session reminders)
- Account and billing (Phase 2+)

-----

### 6.5 Shared Media Library

All modules that involve images draw from a single shared library, managed centrally.

**Sources**

- Parent-uploaded personal photos (family, pets, familiar places, school)
- Curated stock photos via Unsplash / Pexels API (categorised by theme)
- Therapist-assigned picture packs (Phase 2+)
- Community-shared images (Phase 2+, with moderation)

**Categories**
Animals, Family, Food, School, Outdoors, Emotions, Community Places, Daily Routines, Sports, Holidays, Abstract Concepts

**Image Management**

- Each image tagged with category, difficulty level, and suitable modules
- Parent can mark any image as Active / Inactive
- AI pre-screens all uploaded images for appropriateness before activation
- Images stored securely; never used for AI training

-----

### 6.6 AI Design System

A centralised set of prompt principles and guardrails applied to every AI call across all modules. This ensures the child always experiences the same warm, consistent voice regardless of which module they are in.

**Universal AI Principles**

- Always lead with specific, genuine appreciation of what the child did
- Never use: *wrong, incorrect, missing, forgot, should have, you need to*
- Frame all suggestions as additions, not corrections: *“You could also…”*, *“Another great thing to notice is…”*
- Keep all feedback to 4–5 sentences maximum
- Use simple, age-appropriate vocabulary in feedback unless introducing a new word intentionally
- End every response with an encouraging sign-off: *“Keep it up!”*, *“You’re doing brilliantly!”*

**Difficulty Adaptation**

- Simple: 1–2 sentence feedback, very basic vocabulary, lots of praise
- Moderate: 3–4 sentence feedback, one vocabulary expansion, gentle suggestion
- Descriptive: 4–5 sentence feedback, richer vocabulary, two suggestions

**Safety Guardrails**

- System prompt explicitly prohibits any negative, comparative, or discouraging language
- All AI responses logged for parent review
- Parent can flag any AI response as inappropriate (feeds back to prompt refinement)
- No child personal data included in AI API calls

-----

## 7. Module 1 — PictureWords

**Tagline:** *“Tell me what you see!”*
**Core Skill:** Descriptive language, observational vocabulary
**Difficulty:** Simple → Moderate → Descriptive

### User Flow

1. Child taps PictureWords tile on home screen
1. A large picture is displayed with a simple prompt below it
1. Child types (or speaks) a description of the picture
1. Child taps the submit button (*“Tell me!”*)
1. AI evaluates the description against the image and returns structured feedback
1. Feedback displayed in large, colourful text with optional read-aloud
1. Child earns stars; option to try another picture or return home

### Feature Details

**Picture Display**

- One image per screen, full-width, high quality
- Short prompt below image (e.g., *“What do you see in this picture?”*)
- Parent configures prompt style: What do you see? / Describe this place / Tell me a story about this

**Child Input**

- Large text area with placeholder text: *“Start typing here…”*
- Microphone button for speech-to-text input
- Large, friendly submit button
- No character minimum — even one word is accepted and appreciated

**AI Feedback Structure**

- **Appreciation:** Specific praise for what was described (*“Wonderful! You noticed the big red barn and the horses — great eye!”*)
- **Expansion:** 1–2 gentle additions (*“You could also mention the mountains in the background”*)
- **Vocabulary Spotlight:** One new word with definition (*“Here’s a great word: ‘vast’ — it means very large and wide open, like that field!”*)

**Parent Configuration**

- Image source: personal uploads / stock photos / both
- Active image categories
- Prompt difficulty level
- Read-aloud on/off

-----

## 8. Module 2 — WordWorld

**Tagline:** *“Use it, see it, own it!”*
**Core Skill:** Vocabulary in context, sentence construction
**Difficulty:** Simple → Moderate → Descriptive

### User Flow

1. Child is shown one word, large and clear (e.g., **Waterfall**)
1. A simple definition is shown underneath
1. Child writes a sentence using that word
1. AI appreciates the sentence and suggests a richer version
1. App searches and displays a picture matching the word
1. Child describes the picture — looping into PictureWords territory
1. Word is saved to the child’s Word Jar
1. Child earns stars

### Feature Details

**Word Selection**

- Words drawn from a curated age-appropriate word bank (organised by difficulty tier)
- Parent can add custom words (e.g., words from school, therapy, or personal interest)
- Spaced repetition: words the child has seen before are reintroduced after a gap

**Sentence Input**

- Large text area; speech-to-text option
- No grammar policing — AI responds to intent, not correctness
- Even a fragment earns appreciation

**AI Feedback on Sentence**

- Celebrates what the child wrote
- Offers one optional expansion: *“You wrote ‘The waterfall is big.’ You could also say ‘The waterfall is loud and powerful!’ — both are great!”*
- Never rewrites the child’s sentence — only adds to it

**Picture Discovery**

- After AI feedback, a picture matching the word appears (via Unsplash/Pexels API search)
- Child then has the option to describe this picture (optional — not forced)
- Picture is saved to the Word Jar entry for that word

**Word Jar Integration**

- Every completed word saved with: the word, definition, child’s sentence, picture
- Child and parent can browse Word Jar as a personal illustrated dictionary
- Milestone badges at 10, 25, 50, 100 words

-----

## 9. Module 3 — EmotionMirror

**Tagline:** *“How are they feeling?”*
**Core Skill:** Emotional vocabulary, empathy, theory of mind
**Difficulty:** Simple (name the emotion) → Moderate (why?) → Descriptive (what would you do?)

### User Flow

1. A picture is shown — a face, a scene, or a situation
1. Prompt: *“How do you think this person is feeling?”*
1. Child types or taps an emotion (from a visual emotion picker or free text)
1. Follow-up prompt (Moderate+): *“Why do you think they feel that way?”*
1. AI validates the response warmly — there is no single “correct” answer
1. AI introduces one new emotion word or expands on the chosen word
1. Optional: *“Have you ever felt this way? What happened?”* (parent-configurable)
1. Child earns stars

### Feature Details

**Image Types**

- AI-illustrated faces (avoids real-face privacy issues for personal photos)
- Scene-based photos (a child opening a gift, someone looking at rain, a playground)
- Parent can upload personal situational photos

**Emotion Picker**

- Visual grid of illustrated faces with emotion labels (for Simple difficulty)
- Free text input available at all difficulty levels
- Emotion categories: Happy, Sad, Angry, Scared, Surprised, Confused, Proud, Excited, Worried, Calm

**AI Response**

- Validates the child’s answer — *“You’re right, she does look worried!”* — even if the interpretation differs from the “expected” answer, AI validates the reasoning
- Expands: *“Another word for worried is ‘anxious’ — it means feeling nervous about something that might happen”*
- At Descriptive level: *“What do you think would make her feel better?”*

**Why This Module Matters**
Theory of mind — the ability to understand that others have feelings, thoughts, and perspectives different from one’s own — is a core area of difficulty for many autistic individuals. EmotionMirror provides structured, low-pressure daily practice in a way that generalises to real social situations.

-----

## 10. Module 4 — MyDay Journal

**Tagline:** *“Your day in words and pictures!”*
**Core Skill:** Daily expression, narrative writing, habit formation
**Difficulty:** Simple (1 sentence) → Moderate (2–3 sentences) → Descriptive (short paragraph)

### User Flow

1. Child opens MyDay Journal
1. Prompted: *“What happened today? Pick a photo or draw something!”*
1. Child selects a photo (from camera, gallery, or suggested daily prompts) OR chooses from illustrated scene tiles if no photo available
1. Child writes 1–2 sentences about it
1. AI responds warmly and asks one gentle follow-up question
1. Entry is saved to the journal with date, photo, text, and AI exchange
1. Child earns stars; optional: parent leaves a heart/star reaction on the entry

### Feature Details

**Entry Creation**

- Photo options: take photo now (camera), choose from device gallery, or pick an illustrated scene tile
- Voice-to-text option for the written entry
- Illustrated scene tiles cover: at school, at home, outside, eating, playing, with family, at a special place

**Daily Prompts (optional)**

- Parent or app can set a gentle daily prompt to guide the entry
- Examples: *“What made you smile today?”*, *“What did you eat for lunch?”*, *“Did anything surprise you today?”*
- Prompts can be disabled for children who prefer unguided expression

**AI Response**

- Warm, specific acknowledgment of what the child shared
- One gentle follow-up question (not a test — a conversation): *“That sounds like a fun afternoon! What was your favourite part of the trip?”*
- Child can choose to answer or skip — no pressure

**Journal Archive**

- Parent (and child, with parent) can browse past entries as a photo journal
- Entries displayed as a visual timeline: photo, date, child’s words
- Monthly review: *“In March, Arjun wrote about 14 different days!”*
- Printable journal book option (Phase 2+)

**Parent Interaction**

- Parent can leave a heart, star, or short written reaction on any entry
- Child sees parent’s reaction next time they open the journal
- Builds a shared ritual and reinforces the child’s sense of being heard

-----

## 11. Module 5 — MathStories

**Tagline:** *“Read it, solve it, show it!”*
**Core Skill:** Mathematical word problem comprehension and solving
**Difficulty:** Simple (single-step, small numbers) → Moderate (two-step) → Descriptive (multi-step with context)

### User Flow

1. A word problem is displayed in large, plain language with an accompanying illustration
1. Child reads the problem (read-aloud option available)
1. Child types their answer
1. Optional: Child selects or arranges a visual (object groups, number blocks) to represent the sum
1. AI evaluates the answer — celebrates if correct, explains gently if not
1. AI optionally asks: *“Can you tell me how you worked it out?”* (voice or text)
1. Child earns stars

### Feature Details

**Problem Generation**

- AI generates problems dynamically based on difficulty level and child’s age
- Problems use familiar, concrete contexts: food, animals, sports, toys, family
- Problems never use abstract or unfamiliar settings
- Parent can set topic preferences (e.g., avoid food references if dietary sensitivity)

**Problem Display**

- Large text, simple language, short sentences
- Accompanying illustration that depicts the scenario
- Read-aloud button reads the problem clearly

**Answer Input**

- Numeric keypad (large buttons)
- Optional: visual representation tool — drag groups of illustrated objects to show the sum
- “I don’t know” button — child can skip without penalty; AI gently walks through the solution

**AI Feedback**

- Correct: *“That’s exactly right! 3 + 2 = 5. You’re a maths star!”*
- Incorrect: *“Great try! Let’s think about it together. Sam had 3 apples. Then he got 2 more. If we count them all… 1, 2, 3, 4, 5! So the answer is 5. You were close!”*
- Never says “wrong” — always “let’s think about it together”

**Voice Explanation (Moderate+)**

- After answering, AI asks: *“How did you work that out? Tell me in your own words!”*
- Child speaks or types their reasoning
- AI appreciates the explanation — builds mathematical communication skills

-----

## 12. Module 6 — SymbolMath

**Tagline:** *“Turn words into numbers!”*
**Core Skill:** Mathematical notation, symbol recognition, abstract-to-concrete translation
**Difficulty:** Simple (+ and −) → Moderate (×, ÷, =, <, >) → Descriptive (mixed, missing numbers, basic algebra)

### User Flow

1. A math sentence is shown in plain words: *“Five plus three equals blank”*
1. AI wraps it in a short story for context: *“You have 5 oranges. Your friend gives you 3 more. How many do you have altogether?”*
1. Child drags symbols and numbers into the correct positions on a visual equation bar
1. Alternatively: child types the symbolic version
1. AI confirms and celebrates, or guides gently toward the correct notation
1. New symbol or concept introduced if appropriate

### Feature Details

**Symbol Drag-and-Drop Interface**

- Visual equation builder: slots for numbers and symbols
- Draggable tiles: 0–9, +, −, ×, ÷, =, <, >, ( )
- Large tiles, satisfying snap-into-place animation
- Works on touch (tablet) and mouse (desktop)

**Story Wrapper**

- Every problem comes with a 1–2 sentence story context
- Makes abstract notation feel grounded and meaningful
- Stories use familiar settings: kitchen, playground, sports, shops

**Progression**

- Phase 1 (Simple): + and − only, numbers 1–20
- Phase 2 (Moderate): ×, ÷, =, numbers 1–100
- Phase 3 (Descriptive): mixed operations, missing numbers, simple inequalities, intro to variables

**AI Feedback**

- Celebrates correct symbol placement specifically: *“Perfect! You knew that ‘plus’ means the + symbol. That’s exactly right!”*
- For errors: *“Almost! The word ‘equals’ always becomes this symbol: =. Try dragging it into the middle slot!”*
- Introduces one new symbol concept per session maximum

-----

## 13. Module 7 — StorySequence

**Tagline:** *“What happens next?”*
**Core Skill:** Narrative reasoning, sequential thinking, cause and effect
**Difficulty:** Simple (2-picture sequence, obvious order) → Moderate (3-picture, one missing) → Descriptive (4-picture, describe the full story)

### User Flow

1. A set of pictures is displayed in sequence — with one picture missing (shown as a blank with a question mark)
1. Prompt: *“What do you think is missing? What happens next?”*
1. At Simple level: child picks from 3 picture options
1. At Moderate level: child describes in words what the missing picture shows
1. At Descriptive level: child describes the entire sequence as a short story
1. AI evaluates reasoning and celebrates — there can be multiple valid answers
1. AI names the narrative concept: *“You understood that first the seed was planted, then it grew — that’s called cause and effect!”*

### Feature Details

**Sequence Sets**

- Daily routines: waking up, making breakfast, going to school, brushing teeth
- Simple stories: planting a flower, building a sandcastle, making a sandwich
- Emotional journeys: a child feeling left out, then joining a game, then smiling
- Problem and solution: toy is broken → thinking → toy is fixed
- Parent can upload personal photo sequences (e.g., a family trip told in 4 photos)

**Answer Modes by Difficulty**

- Simple: tap the correct missing picture from 3 options
- Moderate: type what you think the missing picture shows
- Descriptive: type a short story describing all pictures in order

**AI Feedback**

- Validates reasoning even if the child’s answer differs from the “intended” sequence: *“That’s a really creative idea! You thought the dog ran away first, then came back — that makes sense too!”*
- Introduces narrative vocabulary: *“first”, “then”, “next”, “finally”, “because”, “so”*
- At Descriptive level: highlights good use of sequence words: *“I love that you used ‘then’ and ‘finally’ — those are great story words!”*

**Why This Module Matters**
Sequential thinking underpins daily life skills (morning routines, following instructions), academic skills (story writing, reading comprehension), and social skills (understanding social cause and effect). This module builds all three simultaneously.

-----

## 14. Feature Priority Matrix

### Platform Layer

|Feature                                  |Priority|Phase  |
|-----------------------------------------|--------|-------|
|Child profile + parent login             |Critical|Phase 1|
|Home screen with module picker           |Critical|Phase 1|
|Shared media library (upload + stock)    |Critical|Phase 1|
|Centralised AI design system + guardrails|Critical|Phase 1|
|Star rewards per session                 |High    |Phase 1|
|Word Jar (cross-module vocabulary)       |High    |Phase 1|
|Parent dashboard (sessions, history)     |High    |Phase 1|
|Session export (PDF/CSV)                 |Medium  |Phase 1|
|Streak counter                           |Medium  |Phase 1|
|Badges and trophy shelf                  |Medium  |Phase 1|
|Progress charts                          |High    |Phase 2|
|Multi-child profiles                     |High    |Phase 2|
|Therapist role + dashboard               |Medium  |Phase 2|
|Community library + moderation           |Medium  |Phase 2|
|Printable monthly report                 |Medium  |Phase 2|
|Multi-language support                   |Low     |Phase 3|
|Native iOS / Android app                 |Low     |Phase 3|

### Modules

|Module       |Priority|Phase  |Build Order|
|-------------|--------|-------|-----------|
|PictureWords |Critical|Phase 1|1          |
|WordWorld    |High    |Phase 1|2          |
|EmotionMirror|High    |Phase 1|3          |
|MyDay Journal|High    |Phase 1|4          |
|MathStories  |High    |Phase 1|5          |
|SymbolMath   |Medium  |Phase 2|6          |
|StorySequence|Medium  |Phase 2|7          |

-----

## 15. UX & Design System

### 15.1 Core Design Principles

- **One thing at a time** — every screen has one primary action; no competing elements
- **Visual anchoring** — pictures and illustrations ground every interaction
- **Predictable structure** — same layout patterns across all modules; no surprises
- **Zero negative states** — no red error messages, no “incorrect” labels, no scores shown to the child
- **Sensory consideration** — animations and sounds are gentle and can be disabled entirely

### 15.2 Visual Design

|Element           |Specification                                                                         |
|------------------|--------------------------------------------------------------------------------------|
|**Primary font**  |Nunito or OpenDyslexic (parent-switchable)                                            |
|**Base font size**|18px minimum; 22px for prompts; 28px for key instructions                             |
|**Colour palette**|Warm, high-contrast; avoid red for feedback; use green, blue, gold for positive states|
|**Button size**   |Minimum 56px height; minimum 200px width for primary actions                          |
|**Spacing**       |Generous padding; no cramped layouts                                                  |
|**Illustrations** |Friendly, rounded, inclusive character style (diverse representation)                 |
|**Icons**         |Large, labelled — never icon-only navigation                                          |

### 15.3 Interaction Design

- Touch targets minimum 48×48px (WCAG 2.5.5 AAA)
- Primary action always bottom-centre of screen (thumb-friendly on tablet)
- Back navigation always visible and clearly labelled
- Loading states always shown — child should never see a blank screen
- Transition animations: gentle fade/slide — no sudden changes

### 15.4 Accessibility

- WCAG 2.1 AA compliance as baseline; AAA where feasible
- Full screen reader support (ARIA labels on all interactive elements)
- Adjustable font size (small / medium / large / extra large)
- High contrast mode
- Reduced motion mode (disables all animations)
- Keyboard navigation support
- Text-to-speech available on every text element the child sees

### 15.5 Dark Mode & Sensory Settings

Parent-configurable sensory profile:

- **Standard mode** — full colour, gentle animations, subtle sounds
- **Calm mode** — muted palette, no animations, no sounds
- **High contrast mode** — maximum text contrast, bold outlines
- **Night mode** — dark background, reduced blue light

-----

## 16. Technical Architecture

### 16.1 Recommended Stack

|Layer                     |Technology                                 |Notes                                                |
|--------------------------|-------------------------------------------|-----------------------------------------------------|
|**Frontend**              |Next.js (React)                            |SSR for performance; excellent PWA support           |
|**Styling**               |Tailwind CSS                               |Rapid, consistent design tokens                      |
|**Backend**               |Next.js API routes or Node.js + Express    |Keep simple in Phase 1                               |
|**Database**              |PostgreSQL (via Supabase or Railway)       |User data, session logs, word jar, journal entries   |
|**File Storage**          |Cloudinary or AWS S3                       |Image uploads; Cloudinary preferred for auto-resizing|
|**AI — Language + Vision**|Anthropic Claude API (claude-sonnet-4-6)   |Vision support; best-in-class safe output            |
|**AI — Fallback**         |OpenAI GPT-4o                              |Alternative if Claude unavailable                    |
|**Authentication**        |Supabase Auth or Auth0                     |Email/password + Google OAuth                        |
|**Stock Photos**          |Unsplash API + Pexels API                  |Free tiers; cache results to reduce API calls        |
|**TTS**                   |Web Speech API (browser-native, free)      |ElevenLabs for higher quality in Phase 2             |
|**STT**                   |Web Speech API (browser-native, free)      |Whisper API (OpenAI) for higher accuracy in Phase 2  |
|**Hosting**               |Vercel (Phase 1)                           |Zero-config Next.js; generous free tier              |
|**Image Moderation**      |AWS Rekognition or Google Vision SafeSearch|Auto-screen parent uploads                           |
|**Analytics**             |Posthog (open source, privacy-friendly)    |Session events; no personal data                     |

### 16.2 Database Schema (High Level)

```
users (parents)
  id, email, created_at, subscription_tier

child_profiles
  id, parent_id, name, age, avatar, difficulty_settings, active_modules, created_at

sessions
  id, child_id, module, started_at, completed_at, duration_seconds

session_entries
  id, session_id, image_url, child_response, ai_feedback, word_count, created_at

word_jar
  id, child_id, word, definition, child_sentence, image_url, source_module, created_at

journal_entries
  id, child_id, photo_url, child_text, ai_response, ai_followup, parent_reaction, created_at

media_library
  id, parent_id, url, category, difficulty, is_active, source (upload/stock/community), created_at

badges
  id, child_id, badge_type, earned_at
```

### 16.3 AI Integration Pattern

All modules follow the same AI call pattern:

```
1. Build prompt:
   - System prompt (universal AI principles + module-specific instructions)
   - Child's age and difficulty level
   - Module context (what the child was asked to do)
   - Child's response (text)
   - Image (if applicable, as base64 or URL)

2. Call Claude API (claude-sonnet-4-6 with vision)

3. Parse response into structured fields:
   - appreciation (string)
   - expansion (string, optional)
   - vocabulary_word (string, optional)
   - vocabulary_definition (string, optional)

4. Log full exchange to session_entries table

5. Return structured response to frontend
```

### 16.4 Performance Targets

- First contentful paint: < 2 seconds on 4G
- Module load time: < 1 second (assets pre-cached via PWA)
- AI response time: < 4 seconds (show animated “thinking” state while waiting)
- Image load: progressive, blurred placeholder until full image loads
- Offline capability: last 5 images per active module cached via Service Worker

-----

## 17. Data, Privacy & Safety

### 17.1 Regulatory Compliance

|Regulation    |Requirement                         |Implementation                                            |
|--------------|------------------------------------|----------------------------------------------------------|
|**COPPA** (US)|Parental consent for under-13 data  |Parent creates account; child profile under parent consent|
|**GDPR** (EU) |Right to deletion, data minimisation|Delete account wipes all child data within 30 days        |
|**WCAG 2.1**  |Accessibility                       |AA compliance baseline (see Section 15)                   |

### 17.2 Data Principles

- Collect only what is needed — no location, no device identifiers, no behavioural advertising data
- Child’s name used only within the app — never sent to external APIs
- All AI API calls use anonymised references (child identified by UUID, not name)
- Session transcripts stored encrypted at rest
- Images uploaded by parents stored in private, access-controlled storage buckets
- No data sold or shared with third parties — ever

### 17.3 Content Safety

- All parent-uploaded images pass through automated moderation (AWS Rekognition SafeSearch) before activation
- Community-shared images (Phase 2+) held in moderation queue — human review before publish
- AI responses logged in full; parent can flag any response
- AI system prompt explicitly prevents generation of: frightening content, adult content, violent scenarios, content that implies failure or inadequacy

### 17.4 AI Transparency

- Parents informed that AI is used to generate feedback
- Parent can review every AI response in the session log
- No AI decisions affect the child negatively — AI is advisory and always positive
- Option to export all data (GDPR data portability)

-----

## 18. Product Roadmap

### Phase 0 — Foundation (Weeks 1–3)

- [ ] Tech spike: Claude API vision call with sample image + child response
- [ ] Basic Next.js project setup, Supabase database, Cloudinary storage
- [ ] Parent auth + child profile creation
- [ ] Unsplash API integration + image display
- [ ] Home screen wireframes validated with parent

### Phase 1A — Core Module (Weeks 4–8)

- [ ] PictureWords module — full end-to-end flow
- [ ] AI feedback loop (appreciate + expand + vocabulary)
- [ ] Parent photo upload + basic media library
- [ ] Star reward on session completion
- [ ] Session logging + basic parent dashboard

### Phase 1B — Language Modules (Weeks 9–14)

- [ ] WordWorld module + Word Jar
- [ ] EmotionMirror module
- [ ] MyDay Journal module
- [ ] TTS feedback readout (Web Speech API)
- [ ] STT input option (Web Speech API)
- [ ] Streak counter + badge system

### Phase 1C — Polish & Beta (Weeks 15–18)

- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Sensory settings (calm mode, reduced motion, dark mode)
- [ ] Progress tab in parent dashboard
- [ ] Session export (PDF/CSV)
- [ ] Beta testing with 3–5 families; iterate on AI tone

### Phase 2A — Math Modules (Months 5–6)

- [ ] MathStories module
- [ ] SymbolMath module (drag-and-drop equation builder)
- [ ] StorySequence module
- [ ] Multi-child profiles under one parent account

### Phase 2B — Platform Expansion (Months 7–9)

- [ ] Multi-user accounts (full registration + onboarding)
- [ ] Community image library + moderation tools
- [ ] Therapist role + dashboard
- [ ] Progress charts + printable monthly report
- [ ] Printable journal book
- [ ] PWA installability + offline mode

### Phase 3 — Growth (Months 10+)

- [ ] Freemium model (free tier: 2 modules; paid: all modules + history)
- [ ] Therapist-published picture packs marketplace
- [ ] Multi-language support (Spanish, Hindi, Arabic, French)
- [ ] Native iOS and Android app (React Native or Capacitor)
- [ ] School / clinic licensing tier

-----

## 19. Risks & Mitigations

|Risk                                             |Severity|Mitigation                                                                                                      |
|-------------------------------------------------|--------|----------------------------------------------------------------------------------------------------------------|
|AI generates discouraging or confusing feedback  |🔴 High  |Universal AI principles in system prompt; parent review flag; iterate on prompt based on real sessions          |
|Inappropriate image appears in child’s session   |🔴 High  |Automated image moderation on all uploads; parent review before activation; no external images without curation |
|Platform feels overwhelming for the child        |🔴 High  |Module unlock system; start with 1–2 active modules; parent controls what’s visible                             |
|Privacy breach of children’s data                |🔴 High  |Minimal data collection; encrypted storage; anonymised AI calls; COPPA compliance                               |
|AI response latency frustrates child (>4 seconds)|🟡 Medium|Animated “thinking” state; optimise prompt length; use streaming API response where possible                    |
|Parent uploads stop (content library goes stale) |🟡 Medium|Stock photo API provides ongoing content; curated starter library on signup                                     |
|Low Day-2 retention                              |🟡 Medium|Streak system; parent reminder notifications; ensure first session ends on a high note                          |
|Community content moderation at scale            |🟡 Medium|Automated pre-screening + human review queue; start community library only when moderation capacity is confirmed|
|Stock photo API costs at scale                   |🟢 Low   |Aggressive caching; stay within free tier in Phase 1; negotiate API tier in Phase 2                             |
|Single developer bottleneck                      |🟡 Medium|Modular architecture allows parallel development; document all AI prompts and data models clearly               |

-----

## 20. Monetisation Strategy (Phase 3)

BrightMinds should remain free for families during Phase 1 and Phase 2 to build trust and gather feedback. Phase 3 introduces a sustainable freemium model.

### Tier Structure

|Tier       |Price    |Includes                                                                          |
|-----------|---------|----------------------------------------------------------------------------------|
|**Free**   |$0/month |2 modules (PictureWords + WordWorld), 50 uploads, basic session history           |
|**Family** |$9/month |All 7 modules, unlimited uploads, full progress reports, Word Jar, journal archive|
|**Family+**|$15/month|Everything in Family + therapist sharing, printable reports, priority AI response |
|**Clinic** |$49/month|Up to 20 child profiles, therapist dashboard, bulk reporting, white-label option  |

### Principles

- Never put core learning features behind a paywall for a child mid-session
- Free tier must be genuinely useful, not artificially crippled
- No advertising — ever
- Offer free access to families who cannot afford the subscription (application-based)

-----

## 21. Open Questions & Decisions Required

1. **Platform name:** Is “BrightMinds” the right name, or should PictureWords remain the brand with modules underneath it?
1. **AI provider:** Claude API vs GPT-4o? Evaluate on: feedback tone quality, vision accuracy, pricing per token, safety defaults
1. **Phase 1 scope:** Build all 4 language modules in Phase 1, or launch with PictureWords only and add modules one at a time?
1. **Child authentication:** Should the child have their own simple login (e.g., avatar tap + PIN), or is parent-session-handoff sufficient?
1. **Offline priority:** Is offline mode needed in Phase 1 (relevant if the child uses the app during commutes or at school)?
1. **Math module scope:** Is SymbolMath needed in Phase 1, or is MathStories sufficient for the immediate school support need?
1. **Journal privacy:** Are journal entries visible to parents by default, or does the child have a “private” option (relevant for a 13-year-old)?
1. **Analytics:** What events should be tracked in Phase 1 — session start/end and word count only, or more granular interaction data?
1. **Therapist involvement:** Should a therapist be consulted during Phase 1 design to validate the AI feedback tone and module structure?
1. **Community launch timing:** At what user count does it make sense to open Phase 2 community features? (Suggested: 50 active families minimum)

-----

## 22. Glossary

|Term                 |Definition                                                                                                                        |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------|
|**AI Feedback**      |Response generated by the LLM after the child submits their input — always structured as appreciation + expansion + vocabulary    |
|**Child Profile**    |A named configuration under a parent account representing one child’s settings, history, and rewards                              |
|**Community Library**|Shared pool of images contributed by multiple families, subject to moderation before publication                                  |
|**Difficulty Level** |Parent-set per-module configuration: Simple / Moderate / Descriptive — controls AI complexity and prompt type                     |
|**EmotionMirror**    |Module 3 — child identifies and discusses emotions shown in pictures                                                              |
|**IEP**              |Individualized Education Program — formal special education plan; BrightMinds progress reports are designed to support IEP reviews|
|**MathStories**      |Module 5 — child solves maths word problems supported by illustrations and AI explanation                                         |
|**Module**           |A self-contained learning activity within BrightMinds — one skill focus, one consistent flow                                      |
|**MyDay Journal**    |Module 4 — child creates a daily photo + sentence journal entry; AI responds conversationally                                     |
|**Picture Pack**     |A curated set of thematically linked images (e.g., Emotions Pack, Daily Routines Pack)                                            |
|**PictureWords**     |Module 1 — child describes a picture; AI evaluates and expands the description                                                    |
|**PWA**              |Progressive Web App — a web application that can be installed on a device and used offline                                        |
|**Session**          |One sitting of practice in a single module — typically 3–7 interactions                                                           |
|**SLP**              |Speech-Language Pathologist — certified therapist specialising in communication disorders                                         |
|**STT**              |Speech-to-Text — child speaks; app transcribes into text                                                                          |
|**StorySequence**    |Module 7 — child identifies missing picture in a sequence and describes the narrative                                             |
|**SymbolMath**       |Module 6 — child translates mathematical word sentences into symbolic notation                                                    |
|**TTS**              |Text-to-Speech — app reads text aloud to the child                                                                                |
|**Word Jar**         |Cross-module vocabulary collection — every word the AI introduces is saved with its definition, image, and child’s sentence       |
|**WordWorld**        |Module 2 — child uses a new word in a sentence, then sees a matching picture                                                      |

-----

*BrightMinds Platform PRD v1.0 — April 2026 — Confidential — For Internal Use Only*

-----

**Document prepared for:** Personal use and future developer handoff
**Next step:** Validate Module priority order and answer Open Questions (Section 21) before beginning Phase 0 development