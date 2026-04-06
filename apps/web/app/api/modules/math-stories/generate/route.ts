import { NextRequest, NextResponse } from 'next/server';
import { invokeStructured, mathStoriesGeneratePrompt } from '@bright-minds/ai';
import { DifficultyLevelSchema } from '@bright-minds/types';
import { z } from 'zod';

const GenerateRequestSchema = z.object({ difficultyLevel: DifficultyLevelSchema });

const MathProblemWithAnswerSchema = z.object({
  problem: z.string(),
  context: z.string(),
  difficultyLevel: DifficultyLevelSchema,
  correctAnswer: z.number(),
});

type MathProblemWithAnswer = z.infer<typeof MathProblemWithAnswerSchema>;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = GenerateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  try {
    const full = await invokeStructured<MathProblemWithAnswer>(
      mathStoriesGeneratePrompt(parsed.data.difficultyLevel),
      `Generate a ${parsed.data.difficultyLevel} difficulty maths word problem.`,
      MathProblemWithAnswerSchema,
    );

    const answerToken = Buffer.from(String(full.correctAnswer)).toString('base64');

    return NextResponse.json({
      problem: full.problem,
      context: full.context,
      difficultyLevel: full.difficultyLevel,
      answerToken,
    });
  } catch {
    return NextResponse.json({ error: 'generation_unavailable', message: 'Please try again.' }, { status: 503 });
  }
}
