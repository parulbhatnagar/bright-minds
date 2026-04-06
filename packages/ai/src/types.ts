import type { FeedbackResult } from '@bright-minds/types';

export interface AIProvider {
  getFeedback(
    imageUrl: string,
    imageContext: string,
    childDescription: string
  ): Promise<FeedbackResult>;
}
