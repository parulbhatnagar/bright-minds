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

// --- Platform types ---

export type ModuleId =
  | 'picture-words'
  | 'word-world'
  | 'emotion-mirror'
  | 'my-day-journal'
  | 'math-stories';

export type DifficultyLevel = 'simple' | 'moderate' | 'descriptive';

export interface ChildProfile {
  id: string;
  parentId: string;
  name: string;
  age: number;
  avatar: string;
  difficultyLevel: DifficultyLevel;
  activeModules: ModuleId[];
  createdAt: string;
}

export interface Session {
  id: string;
  childId: string;
  module: ModuleId;
  startedAt: string;
  completedAt: string | null;
  starsEarned: number;
}

export interface SessionEntry {
  id: string;
  sessionId: string;
  imageUrl?: string;
  childResponse: string;
  aiFeedback: FeedbackResult;
  wordCount: number;
  createdAt: string;
}

export interface WordJarEntry {
  id: string;
  childId: string;
  word: string;
  definition: string;
  childSentence?: string;
  imageUrl?: string;
  sourceModule: ModuleId;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  childId: string;
  sceneId: string;
  childText: string;
  aiResponse: string;
  aiFollowup: string | null;
  parentReaction: string | null;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  parentId: string;
  url: string;
  category: string;
  difficulty: DifficultyLevel;
  isActive: boolean;
  source: 'upload' | 'stock' | 'community';
  createdAt: string;
}

export interface StartSessionRequest {
  module: ModuleId;
  childId: string;
}

export interface CompleteSessionRequest {
  sessionId: string;
  starsEarned: number;
}

export interface SessionResponse {
  session: Session;
}

export interface WordWorldFeedbackRequest {
  word: string;
  definition: string;
  childSentence: string;
  childId: string;
  difficultyLevel: DifficultyLevel;
}

export interface EmotionMirrorFeedbackRequest {
  imageUrl: string;
  imageAltText: string;
  selectedEmotion: string;
  childReasoning?: string;
  difficultyLevel: DifficultyLevel;
}

export interface EmotionMirrorFeedbackResult {
  appreciation: string;
  expansion: string;
  newEmotionWord?: string;
  newEmotionDefinition?: string;
}

export interface JournalFeedbackRequest {
  sceneId: string;
  sceneLabel: string;
  childText: string;
  difficultyLevel: DifficultyLevel;
}

export interface JournalFeedbackResult {
  appreciation: string;
  followupQuestion: string;
}

export interface MathProblem {
  problem: string;
  context: string;
  difficultyLevel: DifficultyLevel;
}

export interface MathFeedbackRequest {
  problem: string;
  correctAnswer: number;
  childAnswer: number;
  childExplanation?: string;
  difficultyLevel: DifficultyLevel;
}

export interface MathFeedbackResult {
  appreciation: string;
  isCorrect: boolean;
  explanation?: string;
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

export const ModuleIdSchema = z.enum([
  'picture-words',
  'word-world',
  'emotion-mirror',
  'my-day-journal',
  'math-stories',
]);

export const DifficultyLevelSchema = z.enum(['simple', 'moderate', 'descriptive']);

export const ChildProfileSchema = z.object({
  id: z.string(),
  parentId: z.string(),
  name: z.string(),
  age: z.number(),
  avatar: z.string(),
  difficultyLevel: DifficultyLevelSchema,
  activeModules: z.array(ModuleIdSchema),
  createdAt: z.string(),
});

export const SessionSchema = z.object({
  id: z.string(),
  childId: z.string(),
  module: ModuleIdSchema,
  startedAt: z.string(),
  completedAt: z.string().nullable(),
  starsEarned: z.number(),
});

export const WordJarEntrySchema = z.object({
  id: z.string(),
  childId: z.string(),
  word: z.string(),
  definition: z.string(),
  childSentence: z.string().optional(),
  imageUrl: z.string().optional(),
  sourceModule: ModuleIdSchema,
  createdAt: z.string(),
});

export const StartSessionRequestSchema = z.object({
  module: ModuleIdSchema,
  childId: z.string().min(1),
});

export const CompleteSessionRequestSchema = z.object({
  sessionId: z.string().min(1),
  starsEarned: z.number().min(0),
});

export const WordWorldFeedbackRequestSchema = z.object({
  word: z.string().min(1),
  definition: z.string().min(1),
  childSentence: z.string().min(1),
  childId: z.string().min(1),
  difficultyLevel: DifficultyLevelSchema,
});

export const EmotionMirrorFeedbackRequestSchema = z.object({
  imageUrl: z.string().min(1),
  imageAltText: z.string().min(1),
  selectedEmotion: z.string().min(1),
  childReasoning: z.string().optional(),
  difficultyLevel: DifficultyLevelSchema,
});

export const EmotionMirrorFeedbackResultSchema = z.object({
  appreciation: z.string(),
  expansion: z.string(),
  newEmotionWord: z.string().optional(),
  newEmotionDefinition: z.string().optional(),
});

export const JournalFeedbackRequestSchema = z.object({
  sceneId: z.string().min(1),
  sceneLabel: z.string().min(1),
  childText: z.string().min(1),
  difficultyLevel: DifficultyLevelSchema,
});

export const JournalFeedbackResultSchema = z.object({
  appreciation: z.string(),
  followupQuestion: z.string(),
});

export const MathProblemSchema = z.object({
  problem: z.string(),
  context: z.string(),
  difficultyLevel: DifficultyLevelSchema,
});

export const MathFeedbackRequestSchema = z.object({
  problem: z.string().min(1),
  correctAnswer: z.number(),
  childAnswer: z.number(),
  childExplanation: z.string().optional(),
  difficultyLevel: DifficultyLevelSchema,
});

export const MathFeedbackResultSchema = z.object({
  appreciation: z.string(),
  isCorrect: z.boolean(),
  explanation: z.string().optional(),
});
