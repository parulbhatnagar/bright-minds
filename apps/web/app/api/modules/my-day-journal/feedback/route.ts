import { NextRequest, NextResponse } from 'next/server';
import { invokeStructured, myDayJournalSystemPrompt } from '@bright-minds/ai';
import { JournalFeedbackRequestSchema, JournalFeedbackResultSchema } from '@bright-minds/types';
import type { JournalFeedbackResult } from '@bright-minds/types';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = JournalFeedbackRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const { sceneLabel, childText, difficultyLevel } = parsed.data;

  try {
    const userPrompt = `The child chose a scene: "${sceneLabel}"
The child wrote: "${childText}"
Please respond warmly and ask one gentle follow-up question — like a conversation, not a test.`;

    const feedback = await invokeStructured<JournalFeedbackResult>(
      myDayJournalSystemPrompt(difficultyLevel),
      userPrompt,
      JournalFeedbackResultSchema,
    );

    return NextResponse.json({ feedback });
  } catch {
    return NextResponse.json({ error: 'feedback_unavailable', message: 'Please try again.' }, { status: 503 });
  }
}
