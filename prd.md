🧩 Product Requirements Document (PRD)

Product Name (Working): Describe Picture

⸻

1. 🎯 Purpose & Vision

Goal:
Help children (especially neurodivergent kids) improve speech, expression, and comprehension by describing images and receiving encouraging, structured AI feedback.

Vision:
A safe, simple, and supportive platform where kids can:
	•	See a picture
	•	Describe it in their own words
	•	Get positive reinforcement + gentle guidance

⸻

2. 👤 Target Users

Primary User
	•	Children (8–16 years)
	•	Especially children with:
	•	Autism spectrum
	•	Speech delay
	•	Language comprehension challenges

Secondary Users
	•	Parents (initial phase: YOU)
	•	Later:
	•	Therapists
	•	Special educators

⸻

3. 🧠 Core Problem Statement

Children struggle with:
	•	Describing what they see
	•	Structuring sentences
	•	Expanding vocabulary
	•	Confidence in expression

Parents struggle with:
	•	Providing consistent feedback
	•	Knowing how much correction is helpful vs discouraging

⸻

4. 🧪 Core Features (MVP)

4.1 🖼️ Image Prompt System

Functionality:
	•	Show 1 image at a time
	•	Sources:
	•	Preloaded image library
	•	Parent-uploaded images

Controls:
	•	“Next Image”
	•	Category filters (later phase)

⸻

4.2 ✍️ Text Input for Description
	•	Simple textbox
	•	Optional:
	•	Voice-to-text (VERY useful later)
	•	No complex UI (keep it distraction-free)

⸻

4.3 🤖 AI Feedback Engine (Core Differentiator)

This is where your product becomes powerful.

Input:
	•	Image + child’s description

Output (structured):
	1.	🌟 Appreciation
	•	“Great job noticing the dog in the picture!”
	2.	🧠 What was good
	•	“You described the action clearly.”
	3.	✨ Suggestions (gentle)
	•	“You could also mention where the dog is.”
	4.	🧩 Example improved sentence
	•	“A brown dog is running in the park.”

⸻

4.4 👨‍👩‍👦 Parent Upload Feature
	•	Upload personal images
	•	Tag them (optional)
	•	Use as practice set

💡 This is VERY important — kids connect better with familiar context.

⸻

4.5 📊 Basic Progress Tracking (MVP-lite)
	•	Number of attempts
	•	Word count growth
	•	Simple streaks

(No heavy analytics initially)

⸻

5. 🧠 AI Design (Critical Section)

5.1 Prompt Strategy

You don’t want generic ChatGPT responses. You want controlled, child-safe feedback.

Prompt Template (simplified):

You are a friendly teacher helping a child improve speech.

Rules:
- Always be encouraging
- Never say "wrong"
- Keep sentences simple
- Suggest 1-2 improvements only

Input:
Image context: <optional description>
Child response: <text>

Output:
1. Appreciation
2. What was good
3. Suggestions
4. Improved example


⸻

5.2 Evaluation Dimensions

AI should evaluate:
	•	Object recognition (did child identify key things?)
	•	Sentence structure
	•	Vocabulary usage
	•	Completeness

⸻

5.3 Guardrails
	•	No negative tone
	•	No over-correction
	•	No long paragraphs
	•	Always positive-first feedback

⸻

6. 🏗️ System Architecture (Practical for You)

Since you’re experienced, I’ll keep it implementation-ready:

Frontend
	•	React / Next.js
	•	Simple UI (tablet-friendly)

Backend
	•	Java (Spring Boot) OR Node.js
	•	APIs:
	•	Image fetch
	•	Submission handling
	•	AI evaluation

Storage
	•	Images → S3 / GCP Storage
	•	Metadata → DB (Postgres)

AI Layer
	•	OpenAI / Azure OpenAI API
	•	Optional:
	•	Cache responses (reduce cost)

Flow

User → selects image
      → submits description
      → backend sends prompt to AI
      → AI returns structured feedback
      → UI displays feedback


⸻

7. 🔐 Privacy & Safety

Especially important because children are involved:
	•	No public sharing by default
	•	Parent-controlled accounts
	•	Secure image storage
	•	No training on user data (if using APIs)

⸻

8. 🚀 Phase-wise Roadmap

Phase 1 (Personal Use - 2–4 weeks)
	•	Static images
	•	Text input
	•	AI feedback
	•	Basic UI

Phase 2
	•	Parent uploads
	•	Progress tracking
	•	Better prompts

Phase 3 (Public)
	•	Multi-user login
	•	Profiles
	•	Image categories

Phase 4 (Advanced)
	•	Voice input
	•	Gamification
	•	Therapist dashboards

⸻

9. 💡 Feature Suggestions (High Impact)

Here’s where I’ll push you a bit (architect to architect 🙂):

⭐ 1. Voice Input (Game changer)
	•	Kids speak → auto transcribe
	•	Helps speech practice directly

⸻

⭐ 2. Guided Prompts

Instead of blank input:
	•	“What do you see?”
	•	“What is happening?”
	•	“Where is this?”

➡️ Helps structured thinking

⸻

⭐ 3. Difficulty Levels
	•	Level 1: Single object
	•	Level 2: Actions
	•	Level 3: Story building

⸻

⭐ 4. Reinforcement System
	•	Stars ⭐
	•	Badges 🎖️
	•	“You improved today!”

⸻

⭐ 5. Compare with Past Attempts
	•	Show improvement over time
	•	Very motivating for parents

⸻

⭐ 6. Therapist Mode (Future Monetization)
	•	Assign exercises
	•	Review progress

⸻

10. ⚠️ Risks & Things to Watch
	•	AI being too verbose → keep it short
	•	Over-correction → discouraging
	•	Complex UI → kids lose focus
	•	Cost of AI calls → cache + optimize

⸻

11. 🧪 Success Metrics
	•	Daily usage (consistency)
	•	Avg words per response (growth)
	•	Parent satisfaction
	•	Child engagement (most important)

⸻

12. 💬 Final Thought

What you’re building is not just a “web app”—it’s:

A confidence-building companion for kids who need a slightly different way to express themselves.