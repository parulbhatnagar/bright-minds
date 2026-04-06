import { LangChainProvider } from './providers/langchain.js';
import { CachingProvider } from './cache.js';
import type { AIProvider } from './types.js';

export { type AIProvider };
export { CachingProvider } from './cache.js';
export { LangChainProvider } from './providers/langchain.js';
export { invokeStructured } from './invoke.js';

// Module prompts
export { wordWorldSystemPrompt } from './prompts/wordWorld.js';
export { emotionMirrorSystemPrompt } from './prompts/emotionMirror.js';
export { myDayJournalSystemPrompt } from './prompts/myDayJournal.js';
export { mathStoriesGeneratePrompt, mathStoriesFeedbackPrompt } from './prompts/mathStories.js';

export function createAIProvider(): AIProvider {
  return new CachingProvider(new LangChainProvider());
}
