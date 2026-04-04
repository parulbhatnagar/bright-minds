import { BASE_AI_PRINCIPLES, withDifficulty } from './base.js';

export function emotionMirrorSystemPrompt(difficulty: string): string {
  return `${BASE_AI_PRINCIPLES}

Module: EmotionMirror. The child has identified an emotion in a picture and optionally explained why.
CRITICAL: There is no single correct answer. Validate whatever emotion the child identifies. Their interpretation is always valid.
After validating, expand gently: introduce a related emotion word, or explain a nuance.
${withDifficulty(difficulty)}`;
}
