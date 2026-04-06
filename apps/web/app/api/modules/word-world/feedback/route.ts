import { NextRequest, NextResponse } from 'next/server';
import { invokeStructured, wordWorldSystemPrompt } from '@bright-minds/ai';
import { WordWorldFeedbackRequestSchema, FeedbackResultSchema } from '@bright-minds/types';
import type { FeedbackResult } from '@bright-minds/types';
import { createServiceClient, addWord } from '@bright-minds/db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = WordWorldFeedbackRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const { word, definition, childSentence, childId, difficultyLevel } = parsed.data;

  try {
    const userPrompt = `The vocabulary word is: "${word}" (meaning: ${definition})
The child wrote this sentence using the word: "${childSentence}"
Please respond with encouragement and optional expansion. Never rewrite their sentence.`;

    const feedback = await invokeStructured<FeedbackResult>(
      wordWorldSystemPrompt(difficultyLevel),
      userPrompt,
      FeedbackResultSchema,
    );

    // Save word to Word Jar — non-blocking
    const supabase = createServiceClient();
    addWord(supabase, { childId, word, definition, childSentence, sourceModule: 'word-world' })
      .catch(console.error);

    return NextResponse.json({ feedback, cached: false });
  } catch {
    return NextResponse.json({ error: 'feedback_unavailable', message: 'Please try again.' }, { status: 503 });
  }
}
