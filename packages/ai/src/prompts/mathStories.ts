import { BASE_AI_PRINCIPLES, withDifficulty } from './base.js';

export function mathStoriesGeneratePrompt(difficulty: string): string {
  return `You are generating a math word problem for a neurodiverse child aged 6–17.

Rules:
- Use familiar, concrete contexts: food, animals, sports, toys, or family — never abstract settings.
- Simple difficulty: single-step addition or subtraction, numbers 1–20.
- Moderate difficulty: two-step problems, numbers 1–50.
- Descriptive difficulty: multi-step, numbers 1–100.
- Short sentences. Plain language. One problem only.
- ${withDifficulty(difficulty)}

Return a JSON object with exactly these fields:
{
  "problem": "the word problem as a friendly sentence or two",
  "context": "a one-sentence story setting for the problem",
  "correctAnswer": <number>
}`;
}

export function mathStoriesFeedbackPrompt(difficulty: string): string {
  return `${BASE_AI_PRINCIPLES}

Module: MathStories. The child has answered a maths word problem.
If correct: celebrate specifically what they got right. Be enthusiastic!
If the answer differs: NEVER say wrong. Say "Great try! Let's think about it together…" then walk through the steps gently.
Keep the explanation simple, visual, and step-by-step.
${withDifficulty(difficulty)}`;
}
