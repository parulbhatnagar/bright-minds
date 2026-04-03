import { createHash } from 'crypto';
import type { FeedbackResult } from '@study-aid/types';
import type { AIProvider } from './types.js';

const TTL_MS = 3_600_000; // 1 hour

function hash(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

interface CacheEntry {
  result: FeedbackResult;
  expiresAt: number;
}

export class CachingProvider implements AIProvider {
  private cache = new Map<string, CacheEntry>();

  constructor(private inner: AIProvider) {}

  async getFeedback(
    imageUrl: string,
    imageContext: string,
    childDescription: string
  ): Promise<FeedbackResult> {
    const key = hash(imageUrl + childDescription.toLowerCase().trim());
    const cached = this.cache.get(key);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.result;
    }

    const result = await this.inner.getFeedback(imageUrl, imageContext, childDescription);
    this.cache.set(key, { result, expiresAt: Date.now() + TTL_MS });
    return result;
  }
}
