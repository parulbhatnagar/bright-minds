import { LangChainProvider } from './providers/langchain.js';
import { CachingProvider } from './cache.js';
import type { AIProvider } from './types.js';

export { type AIProvider };
export { CachingProvider } from './cache.js';
export { LangChainProvider } from './providers/langchain.js';

export function createAIProvider(): AIProvider {
  return new CachingProvider(new LangChainProvider());
}
