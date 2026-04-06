import { NextRequest, NextResponse } from 'next/server';
import { createAIProvider } from '@bright-minds/ai';
import { FeedbackRequestSchema } from '@bright-minds/types';
import type { FeedbackResponse } from '@bright-minds/types';

const ai = createAIProvider();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = FeedbackRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request', message: 'Please provide imageId, imageUrl, imageAltText, and childDescription.' }, { status: 400 });
  }

  const { imageUrl, imageAltText, childDescription } = parsed.data;

  try {
    const feedback = await ai.getFeedback(imageUrl, imageAltText, childDescription);
    const response: FeedbackResponse = { feedback, cached: false };
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: 'feedback_unavailable', message: 'We could not get feedback right now. Please try again.' }, { status: 503 });
  }
}
