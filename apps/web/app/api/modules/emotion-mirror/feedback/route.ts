import { NextRequest, NextResponse } from 'next/server';
import { invokeStructured, emotionMirrorSystemPrompt } from '@bright-minds/ai';
import { EmotionMirrorFeedbackRequestSchema, EmotionMirrorFeedbackResultSchema } from '@bright-minds/types';
import type { EmotionMirrorFeedbackResult } from '@bright-minds/types';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = EmotionMirrorFeedbackRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const { imageAltText, selectedEmotion, childReasoning, difficultyLevel } = parsed.data;

  try {
    const userPrompt = `The image shows: "${imageAltText}"
The child identified the emotion as: "${selectedEmotion}"
${childReasoning ? `The child's reasoning: "${childReasoning}"` : ''}
Please validate their answer warmly — there is no single correct emotion. Expand on their choice.`;

    const feedback = await invokeStructured<EmotionMirrorFeedbackResult>(
      emotionMirrorSystemPrompt(difficultyLevel),
      userPrompt,
      EmotionMirrorFeedbackResultSchema,
    );

    return NextResponse.json({ feedback, cached: false });
  } catch {
    return NextResponse.json({ error: 'feedback_unavailable', message: 'Please try again.' }, { status: 503 });
  }
}
