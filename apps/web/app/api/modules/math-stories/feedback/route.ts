import { NextRequest, NextResponse } from 'next/server';
import { invokeStructured, mathStoriesFeedbackPrompt } from '@bright-minds/ai';
import { MathFeedbackRequestSchema, MathFeedbackResultSchema } from '@bright-minds/types';
import type { MathFeedbackResult } from '@bright-minds/types';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = MathFeedbackRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const { problem, correctAnswer, childAnswer, childExplanation, difficultyLevel } = parsed.data;

  try {
    const isCorrect = childAnswer === correctAnswer;
    const userPrompt = `Math problem: "${problem}"
Correct answer: ${correctAnswer}
Child's answer: ${childAnswer} (${isCorrect ? 'correct!' : 'different from expected'})
${childExplanation ? `Child's explanation: "${childExplanation}"` : ''}
${isCorrect ? 'Celebrate their correct answer enthusiastically!' : "Respond warmly — never say wrong. Walk through the solution gently step by step."}`;

    const feedback = await invokeStructured<MathFeedbackResult>(
      mathStoriesFeedbackPrompt(difficultyLevel),
      userPrompt,
      MathFeedbackResultSchema,
    );

    return NextResponse.json({ feedback: { ...feedback, isCorrect } });
  } catch {
    return NextResponse.json({ error: 'feedback_unavailable', message: 'Please try again.' }, { status: 503 });
  }
}
