import { z } from 'zod';

// --- TypeScript interfaces ---

export interface Image {
  id: string;
  url: string;
  altText: string;
  category?: string;
}

export interface FeedbackResult {
  appreciation: string;
  whatWasGood: string;
  suggestions: string[]; // max 2 items
  improvedExample: string;
  vocabularyWord: {
    word: string;
    definition: string; // simple, child-readable
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

// --- Zod schemas (runtime validation) ---

export const ImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  altText: z.string(),
  category: z.string().optional(),
});

export const FeedbackResultSchema = z.object({
  appreciation: z.string(),
  whatWasGood: z.string(),
  suggestions: z.array(z.string()).max(2),
  improvedExample: z.string(),
  vocabularyWord: z.object({
    word: z.string(),
    definition: z.string(),
  }),
});

export const FeedbackRequestSchema = z.object({
  imageId: z.string().min(1),
  imageUrl: z.string().min(1),
  imageAltText: z.string().min(1),
  childDescription: z.string().min(1),
});

export const FeedbackResponseSchema = z.object({
  feedback: FeedbackResultSchema,
  cached: z.boolean(),
});

export const ImageListResponseSchema = z.object({
  images: z.array(ImageSchema),
});
