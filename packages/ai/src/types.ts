import type { FeedbackResult } from '@study-aid/types';

export interface AIProvider {
  getFeedback(
    imageUrl: string,
    imageContext: string,
    childDescription: string
  ): Promise<FeedbackResult>;
}
